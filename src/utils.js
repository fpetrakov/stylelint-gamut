'use strict'

/**
 * Get the index of a declaration's value
 *
 * @param {import('postcss').Declaration} decl
 * @returns {number}
 */
function declarationValueIndex (decl) {
  const raws = decl.raws

  return [
    // @ts-expect-error -- TS2571: Object is of type 'unknown'.
    raws.prop && raws.prop.prefix,
    // @ts-expect-error -- TS2571: Object is of type 'unknown'.
    (raws.prop && raws.prop.raw) || decl.prop,
    // @ts-expect-error -- TS2571: Object is of type 'unknown'.
    raws.prop && raws.prop.suffix,
    raws.between || ':',
    // @ts-expect-error -- TS2339: Property 'prefix' does not exist on type '{ value: string; raw: string; }'.
    raws.value && raws.value.prefix
  ].reduce((count, str) => {
    if (str) {
      return count + str.length
    }

    return count
  }, 0)
}

/**
 * @param {import('postcss').Declaration} decl
 * @returns {string}
 */
function getDeclarationValue (decl) {
  const raws = decl.raws

  return (raws.value && raws.value.raw) || decl.value
}

/**
 * @param {import('postcss').Declaration} decl
 * @returns {boolean | import('postcss').AtRule}
 */
function getMediaQueryAtRule (decl) {
  if (decl.parent && decl.parent.parent && isAtRule(decl.parent.parent)) {
    const parent = decl.parent.parent

    return parent.name === 'media' ? parent : false
  }

  return false
}

/**
 * @param {Node} node
 * @returns {node is import('postcss').AtRule}
 */
function isAtRule (node) {
  return node.type === 'atrule'
}

/**
 * Check whether a property is a custom one
 * @param {string} property
 * @returns {boolean}
 */
function isCustomProperty (property) {
  return property.startsWith('--')
}

/**
 * Check whether a property is standard
 *
 * @param {string} property
 * @return {boolean} If `true`, the property is standard
 */

function isStandardSyntaxProperty (property) {
  // SCSS var (e.g. $var: x), list (e.g. $list: (x)) or map (e.g. $map: (key:value))
  if (property.startsWith('$')) {
    return false
  }

  // Less var (e.g. @var: x)
  if (property.startsWith('@')) {
    return false
  }

  // SCSS or Less interpolation
  if (/#{.+?}|@{.+?}|\$\(.+?\)/.test(property)) {
    return false
  }

  return true
}

/**
 * @param {import('postcss').Declaration} decl
 * @returns {boolean}
 */
function isInColorGamutP3MediaQuery (decl) {
  const mediaQueryAtRule = getMediaQueryAtRule(decl)

  return mediaQueryAtRule && mediaQueryAtRule.params === '(color-gamut: p3)'
}

/**
 * @param {import('postcss').Declaration} decl
 * @returns {boolean}
 */
function isInColorGamutRec2020MediaQuery (decl) {
  const mediaQueryAtRule = getMediaQueryAtRule(decl)

  return mediaQueryAtRule && mediaQueryAtRule.params === '(color-gamut: rec2020)'
}

module.exports = {
  declarationValueIndex,
  getDeclarationValue,
  getMediaQueryAtRule,
  isCustomProperty,
  isStandardSyntaxProperty,
  isAtRule,
  isInColorGamutP3MediaQuery,
  isInColorGamutRec2020MediaQuery
}
