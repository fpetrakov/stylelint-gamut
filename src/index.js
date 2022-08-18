'use strict'

const valueParser = require('postcss-value-parser')
const stylelint = require('stylelint')
const Color = require('colorjs.io').default

const {
  isStandardSyntaxProperty,
  isCustomProperty,
  getDeclarationValue,
  declarationValueIndex,
  isInColorGamutP3MediaQuery,
  isInColorGamutRec2020MediaQuery
} = require('./utils')

const ruleName = 'gamut/color-no-out-gamut-range'

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (color) => `Unexpected color out of gamut range "${color}"`
})

const meta = {
  url: 'https://stylelint.io/user-guide/rules/list/color-no-out-gamut-range'
}

const COLOR_FUNCTIONS = new Set(['lch', 'lab', 'oklch', 'oklab'])

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

        if (!COLOR_FUNCTIONS.has(node.value)) {
          return
        }

        const color = new Color(valueParser.stringify(nodes))

        const isInSrgbGamut = color.inGamut('srgb')
        const isInP3Query = isInColorGamutP3MediaQuery(decl)
        if (isInSrgbGamut || isInP3Query) return

        const isInP3Gamut = color.inGamut('p3')
        if (isInP3Gamut && isInP3Query) return

        const isInRec2020Gamut = color.inGamut('rec2020')
        if (isInRec2020Gamut && isInColorGamutRec2020MediaQuery(decl)) return

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

ruleFunction.ruleName = ruleName
ruleFunction.messages = messages
ruleFunction.meta = meta

module.exports = stylelint.createPlugin(ruleName, ruleFunction)
