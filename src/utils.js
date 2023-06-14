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
    raws.prop && raws.prop.prefix,
    (raws.prop && raws.prop.raw) || decl.prop,
    raws.prop && raws.prop.suffix,
    raws.between || ':',
    raws.value && raws.value.prefix
  ].reduce((count, str) => {
    if (str) {
      return count + str.length
    }

    return count
  }, 0)
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
  const parentMediaQuery = getMediaQueryParent(decl)

  if (parentMediaQuery && /\(color-gamut:\s*p3\)/.test(parentMediaQuery.params)) {
    return true
  }

  return false
}

/**
 * @param {import('postcss').Declaration} decl
 * @returns {boolean}
 */
function isInColorGamutRec2020MediaQuery (decl) {
  const parentMediaQuery = getMediaQueryParent(decl)

  if (parentMediaQuery && /\(color-gamut:\s*rec2020\)/.test(parentMediaQuery.params)) {
    return true
  }

  return false
}

/**
 * @param {import('postcss').Declaration} decl
 * @returns {boolean | decl}
 */
function getMediaQueryParent (decl) {
  let parent = decl.parent

  if (parent && isMediaQuery(parent)) return parent

  parent = parent.parent

  return isMediaQuery(parent) && parent
}

/**
 * @param {import('postcss').Declaration} decl
 * @returns {boolean}
 */
function isMediaQuery (decl) {
  return decl.type === 'atrule' && decl.name === 'media'
}

function startsWithNumber (str) {
  return /^\d/.test(str)
}

module.exports = {
  isStandardSyntaxProperty,
  declarationValueIndex,
  isInColorGamutP3MediaQuery,
  isInColorGamutRec2020MediaQuery,
  startsWithNumber
}
