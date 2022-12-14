'use strict'

const stylelint = require('stylelint')
const Color = require('colorjs.io').default
const { isInColorGamutP3MediaQuery, isStandardSyntaxProperty, declarationValueIndex, isInColorGamutRec2020MediaQuery } = require('./utils')

const ruleName = 'gamut/color-no-out-gamut-range'

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (color) => `Unexpected color out of gamut range "${color}"`
})

const meta = {
  url: 'https://github.com/fpetrakov/stylelint-gamut/blob/master/src/README.md'
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
        if (!value.startsWith('var(--') && value.includes('var(--')) return

        let customPropValue
        if (value.startsWith('var(--')) {
          const varName = value.slice(4, -1)

          if (customProperties[varName] && !customProperties[varName].inQuery) {
            customPropValue = customProperties[varName].value
          } else {
            return
          }
        }

        const color = new Color(customPropValue || value)

        if (color.inGamut('srgb')) return

        if (color.inGamut('p3') && isInColorGamutP3MediaQuery(decl)) return

        if (color.inGamut('rec2020') && isInColorGamutRec2020MediaQuery(decl)) return

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

ruleFunction.ruleName = ruleName
ruleFunction.messages = messages
ruleFunction.meta = meta

module.exports = stylelint.createPlugin(ruleName, ruleFunction)
