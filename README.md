# <img src="./logo/logo.png" width="100" height="100">

[![npm version][npm-version-img]][npm] [![npm downloads last month][npm-downloads-img]][npm]

**stylelint-gamut** is a [Stylelint] plugin that helps you to work with different color spaces.

# Rules

- [`color-no-out-gamut-range`](./src/README.md): Throw warning if color goes out of sRGB color space and is not wrapped in `@media (color-gamut: p3) {}` or `@media (color-gamut: rec2020) {}`.

# Requirements

- **node version ≥ 12.0.0**
- **Stylelint version ≥ 14.0.0**.

# Installation

1. If you haven't, install [Stylelint]:

```
npm install stylelint stylelint-config-standard --save-dev
```

2.  Install `stylelint-gamut`:

```
npm install stylelint-gamut --save-dev
```

# Usage

Add `stylelint-gamut` to your Stylelint config `plugins` array, then add rules you need to the rules list. All rules from `stylelint-gamut` need to be namespaced with `gamut`.

```json
{
  "plugins": ["stylelint-gamut"],
  "rules": {
    "gamut/color-no-out-gamut-range": true
  }
}
```

# More

It is already used by the creator of [PostCSS] [Andrey Sitnik].

Read more about color spaces in css:

- [OKLCH in CSS: why we moved from RGB and HSL](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
- [LCH colors in CSS: what, why, and how?](https://lea.verou.me/2020/04/lch-colors-in-css-what-why-and-how/)
- [A Guide To Modern CSS Colors](https://www.smashingmagazine.com/2021/11/guide-modern-css-colors/)
- [Better dynamic themes in Tailwind with OKLCH color magic](https://evilmartians.com/chronicles/better-dynamic-themes-in-tailwind-with-oklch-color-magic)

[Stylelint]: https://stylelint.io/
[npm-version-img]: https://img.shields.io/npm/v/stylelint-gamut.svg
[npm-downloads-img]: https://img.shields.io/npm/dm/stylelint-gamut.svg
[npm]: https://www.npmjs.com/package/stylelint-gamut
[PostCSS]: https://github.com/postcss/postcss
[Andrey Sitnik]: https://github.com/ai
