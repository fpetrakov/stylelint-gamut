'use strict'

const stylelint = require('stylelint')
const Color = require('colorjs.io').default
const isStandardSyntaxProperty = require('./utils/isStandardSyntaxProperty')
const isAtRule = require('./utils/isAtRule')
const declarationValueIndex = require('./utils/declarationValueIndex')

const ruleName = 'gamut/color-no-out-gamut-range'

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (color) => `Unexpected color out of gamut range "${color}"`
})

const meta = {
  url: 'https://stylelint.io/user-guide/rules/list/color-no-out-gamut-range'
}

/** @type {import('stylelint').Rule} */
const ruleFunction = (primary) => {
  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: primary
    })

    if (!validOptions) {
      return
    }

    const customProperties = {}

    root.walkDecls((decl) => {
      if (!isStandardSyntaxProperty(decl.prop)) return

      const values = decl.value.match(/(oklch|oklab|lab|lch|var)\([^)]+\)/g)
      if (values) {
        for (const value of values) {
          check(value)
        }
      }

      function check (value) {
        let customPropValue
        if (value.startsWith('var(--')) {
          const varName = value.slice(4, -1)

          if (customProperties[varName] && !customProperties[varName].inQuery) {
            customPropValue = customProperties[varName].value
          } else {
            return
          }
        }

        const isInSrgbGamut = new Color(customPropValue || value).inGamut('srgb')

        if (isInSrgbGamut) return

        if (isInColorGamutP3MediaQuery(decl)) return

        if (decl.prop && decl.prop.startsWith('--')) {
          customProperties[decl.prop] = { value: decl.value.trim(), inQuery: false }
          return
        }

        const index = declarationValueIndex(decl)
        const endIndex = index + decl.value.length

        stylelint.utils.report({
          message: messages.rejected(value),
          node: decl,
          index,
          endIndex,
          result,
          ruleName
        })
      }
    })
  }
}

/**
 * @param {import('postcss').Declaration} decl
 * @returns {boolean}
 */
function isInColorGamutP3MediaQuery (decl) {
  if (decl.parent && decl.parent.parent && isAtRule(decl.parent.parent)) {
    const parent = decl.parent.parent

    return parent.name === 'media' && /\(color-gamut:\s*p3\)/.test(parent.params)
  }

  return false
}

ruleFunction.ruleName = ruleName
ruleFunction.messages = messages
ruleFunction.meta = meta

module.exports = stylelint.createPlugin(ruleName, ruleFunction)
