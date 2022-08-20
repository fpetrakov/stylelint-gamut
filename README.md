# stylelint-gamut

[![npm version][npm-version-img]][npm] [![npm downloads last month][npm-downloads-img]][npm]

**stylelint-gamut** is a [Stylelint] plugin that helps you to work with different color spaces.

Right now it's working with **node version ≥ 16.0.0** and **Stylelint version ≥ 14.0.0**.

**stylelint-gamut** is already used by the creator of [PostCSS] [Andrey Sitnik].

Read more about color spaces in css:
- [LCH colors in CSS: what, why, and how?](https://lea.verou.me/2020/04/lch-colors-in-css-what-why-and-how/)
- [A Guide To Modern CSS Colors](https://www.smashingmagazine.com/2021/11/guide-modern-css-colors/)

# Installation

1. If you haven't, install [Stylelint]:

```
npm install stylelint --save-dev
```

2.  Install `stylelint-gamut`:

```
npm install stylelint-gamut --save-dev
```

## Usage

Add `stylelint-gamut` to your Stylelint config `plugins` array, then add rules you need to the rules list. All rules from `stylelint-gamut` need to be namespaced with `gamut`.

```json
{
  "plugins": [
    "stylelint-gamut"
  ],
  "rules": {
    "gamut/color-no-out-gamut-range": true,
  }
}
```

## Rules

* [`color-no-out-gamut-range`](./src/README.md): Throw warning if color goes out of sRGB color space and is not wrapped in `@media (color-gamut: p3) {}`.

[Stylelint]: https://stylelint.io/
[npm-version-img]: https://img.shields.io/npm/v/stylelint-gamut.svg
[npm-downloads-img]: https://img.shields.io/npm/dm/stylelint-gamut.svg
[npm]: https://www.npmjs.com/package/stylelint-gamut
[PostCSS]: https://github.com/postcss/postcss
[Andrey Sitnik]: https://github.com/ai
