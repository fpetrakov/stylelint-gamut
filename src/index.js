const rules = require('./rules')
const { createPlugin } = require('stylelint')

const rulesPlugins = Object.keys(rules).map((ruleName) => {
  return createPlugin(`gamut/${ruleName}`, rules[ruleName])
})

module.exports = rulesPlugins
