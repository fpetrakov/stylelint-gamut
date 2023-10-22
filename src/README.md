# color-no-out-gamut-range

Disallow out of gamut range colors.

<!-- prettier-ignore -->
```css
a { color: lch(48% 82 283) } /* This color is out of sRGB gamut range */
```

Colors declared using lch, oklch, lab and oklab functions can move from sRGB to P3 or Rec2020 color spaces, which are not supported by most of screens right now. It can happen by mistake. For instance, by converting colors from one space to another.

This rule checks if the color is in sRGB, p3 or rec2020 space. If it's not in sRGB gamut you should wrap it in a proper media query:

```css
@media (color-gamut: p3) {
  a {
    color: lch(29.8% 42.5 109.485);
    /* This color is in p3 gamut range */
  }
}
```

```css
@media (color-gamut: rec2020) {
  a {
    color: lch(25.1% 42.5 109.485);
    /* This color is in rec2020 gamut range */
  }
}
```

In case of **css custom properties** you should wrap either the custom property declaration:

```css
@media (color-gamut: p3) {
  :root {
    --my-var: lch(48% 82 283);
  }
}
```

or the rule that uses the custom property:

```css
@media (color-gamut: p3) {
  a {
    color: var(--my-var);
  }
}
```

Custom properties inside color declaration are ignored:

```css
background-color: oklch(
  var(--oklch-primary) / var(--alpha-bg)
); /* not checked */
```

Please note that conditional imports are not checked, e.g.:

```html
<link href="p3-custom-props.css" rel="stylesheet" media="(color-gamut: p3)" />
```

```css
@import url("p3-custom-props.css") (color-gamut: p3);
```

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a { color: lch(48% 82 283) }
```

<!-- prettier-ignore -->
```css
a { color: oklch(57.35% 0.23 259.06) }
```

<!-- prettier-ignore -->
```css
a { color: lab(82.2345% 40.1645 59.9971 / .5) }
```

<!-- prettier-ignore -->
```css
a { color: oklab(85.69% 0.1007 0.1191 / .5) }
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media (color-gamut: p3) {
  a { color: lch(48% 82 283) }
}
```

<!-- prettier-ignore -->
```css
@media (color-gamut: p3) {
  a { color: oklch(57.35% 0.23 259.06) }
}
```

<!-- prettier-ignore -->
```css
@media (color-gamut: rec2020) {
  a { color: lab(82.2345% 40.1645 59.9971 / .5) }
}
```

<!-- prettier-ignore -->
```css
@media (color-gamut: rec2020) {
  a { color: oklab(85.69% 0.1007 0.1191 / .5) }
}
```
