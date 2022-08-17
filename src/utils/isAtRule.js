/**
 * @param {Node} node
 * @returns {node is import('postcss').AtRule}
 */
module.exports = function isAtRule (node) {
  return node.type === 'atrule'
}
