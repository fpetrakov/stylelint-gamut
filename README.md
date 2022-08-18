# stylelint-gamut
Stylelint plugin for working with different color spaces.
Right now it's working with node version >= 16.0.0.

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

Add `stylelint-gamut` to your Stylelint config `plugins` array, then add rules you need to the rules list. All rules from stylelint-gamut need to be namespaced with `gamut`.

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

* [`color-no-out-gamut-range`](./src/README.md): Throw warning if color goes out of sRGB color space and is not wrapped in @media (color-gamut: p3) {}.

[Stylelint]: https://stylelint.io/