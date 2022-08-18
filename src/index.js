'use strict'

const valueParser = require('postcss-value-parser')
const stylelint = require('stylelint')
const Color = require('colorjs.io').default
const isStandardSyntaxProperty = require('./utils/isStandardSyntaxProperty')
const isCustomProperty = require('./utils/isCustomProperty')
const getDeclarationValue = require('./utils/getDeclarationValue')
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

    root.walkDecls((decl) => {
      if (!isStandardSyntaxProperty(decl.prop)) return

      if (isCustomProperty(decl.prop)) return

      const parsedValue = valueParser(getDeclarationValue(decl))

      parsedValue.walk((node, _index, nodes) => {
        if (node.type !== 'function') return

        if (
          node.value !== 'lch' &&
          node.value !== 'lab' &&
          node.value !== 'oklch' &&
          node.value !== 'oklab'
        ) {
          return
        }

        const isInSrgbGamut = new Color(valueParser.stringify(nodes)).inGamut(
          'srgb'
        )

        if (isInSrgbGamut) return

        if (isInColorGamutP3MediaQuery(decl)) return

        const index = declarationValueIndex(decl) + node.sourceIndex
        const endIndex = index + decl.value.length

        stylelint.utils.report({
          message: messages.rejected(decl.value),
          node: decl,
          index,
          endIndex,
          result,
          ruleName
        })
      })
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

    return parent.name === 'media' && parent.params === '(color-gamut: p3)'
  }

  return false
}

ruleFunction.ruleName = ruleName
ruleFunction.messages = messages
ruleFunction.meta = meta

module.exports = stylelint.createPlugin(ruleName, ruleFunction)
