'use strict'

const { rule: { messages, ruleName } } = require('./index.js')

// eslint-disable-next-line no-undef
testRule({
  ruleName,
  config: [true],
  plugins: ['./index.js'],
  accept: [
    {
      code: '@media (color-gamut:p3) { a { color: lch(48% 82 283); } }',
      description: 'lch out of srgb gamut but wrapped in media query'
    },
    {
      code: '.root { @supports (color: oklch(0% 0 0)) { background-color: oklch(var(--oklch-primary) / var(--alpha-bg)); } }',
      description: 'ignore using vars inside'
    },
    {
      code: ':root { --my-var: oklab(85.69% 0.1007 0.1191 / .5); }; @media (color-gamut:rec2020) { a { color: var(--my-var); } }',
      description: 'oklab var out of p3 gamut but wrapped in rec2020 media query'
    },
    {
      code: '@media (color-gamut:rec2020) { a { color: oklab(85.69% 0.1007 0.1191 / .5); } }',
      description: 'oklab out of p3 gamut but wrapped in rec2020 media query'
    },
    {
      code: '@media (color-gamut:rec2020) { a { color: lab(82.2345% 40.1645 59.9971 / .5); } }',
      description: 'lab out of p3 gamut but wrapped in rec2020 media query'
    },
    {
      code: ':root { --my-var: lch(50% 0 0); }; a { color: var(--my-var); };',
      description: 'using variable in srgb gamut'
    },
    {
      code: ':root { --my-var: 20; }; a { padding: var(--my-var); };',
      description: 'ignore not color variables'
    },
    {
      code: ':root { --my-var: lch(48% 82 283); }; @media (color-gamut:p3) { a { color: var(--my-var); } }',
      description: 'using variable out of srgb gamut but wrapped in media query'
    },
    {
      code: '@media (color-gamut:p3) { :root { --my-var: lch(48% 82 283); }; }; a { color: var(--my-var); };',
      description: 'using variable out of srgb gamut but declaration wrapped in media query'
    },
    {
      code: '@media (prefers-color-scheme: dark) and (color-gamut: p3) { a { color: lch(48% 82 283); } }',
      description: 'lch out of srgb gamut but wrapped in a long media query'
    },
    {
      code: '@media (color-gamut: p3) { a { color: oklch(85% 0.1 354 / 73%); } }',
      description:
        'oklch with alpha out of srgb gamut but wrapped in media query'
    },
    {
      code: 'a { color: lch(50% 0 0); }',
      description: 'in srgb gamut'
    },
    {
      code: '.foo { border: 4px solid oklch(100% 0 0); }',
      description: 'in srgb gamut long property'
    },
    {
      code: '.foo {background-image: linear-gradient(red lch(50% 0 0 )); }',
      description: 'multicolor property in gamut range'
    },
    {
      code: 'a { color: red; }',
      description: 'ignore not lch color declaration'
    },
    {
      code: '@myVariable: lch(48% 82 283); a { color: @myVariable; }',
      description: 'ignore Less variable'
    },
    {
      code: ':root { $clr: lch(48% 82 283 / 67%) } a { color: $clr; }',
      description: 'ignore scss variables'
    },
    {
      code: 'html {--hover: oklch(58% 0.22 260 / 20%); @media (color-gamut: p3) {--hover: oklch(54% 0.27 260 / 0.2); } } ::selection { background: var(--hover); }',
      description: 'nested'
    },
    {
      code: 'a { background: var(-) }',
      description: 'should be not fired rule'
    }
  ],

  reject: [
    {
      code: ':root { --my-var: lch(48% 82 283); }; a { color: var(--my-var); };',
      description: 'using variable out of srgb gamut and neither declaration nor usage is wrapped in media query',
      message: messages.rejected('var(--my-var)'),
      line: 1,
      column: 50,
      endLine: 1,
      endColumn: 63
    },
    {
      code: ':root { --my-var: oklab(85.69% 0.1007 0.1191 / .5); }; @media (color-gamut:p3) { a { color: var(--my-var); } }',
      description: 'oklab var out of p3 gamut and wrapped in p3 media query',
      message: messages.rejected('var(--my-var)'),
      line: 1,
      column: 93,
      endLine: 1,
      endColumn: 106
    },
    {
      code: '@media (color-gamut:srgb) { a { color: oklab(85.69% 0.1007 0.1191 / .5); } }',
      description: 'oklab out of p3 gamut and wrapped in srgb media query',
      message: messages.rejected('oklab(85.69% 0.1007 0.1191 / .5)'),
      line: 1,
      column: 40,
      endLine: 1,
      endColumn: 72
    },
    {
      code: '@media (color-gamut:p3) { a { color: lab(82.2345% 40.1645 59.9971 / .5); } }',
      description: 'lab out of p3 gamut and wrapped in p3 media query',
      message: messages.rejected('lab(82.2345% 40.1645 59.9971 / .5)'),
      line: 1,
      column: 38,
      endLine: 1,
      endColumn: 72
    },
    {
      code: ':root { --my-var: lch(48% 82 283); }; a {background-image: linear-gradient(red var(--my-var));}',
      description: 'using variable out of srgb gamut in multicolor property',
      message: messages.rejected('var(--my-var)'),
      line: 1,
      column: 60,
      endLine: 1,
      endColumn: 94
    },
    {
      code: 'a { color: lch(48% 82 283); }',
      description: 'lch',
      message: messages.rejected('lch(48% 82 283)'),
      line: 1,
      column: 12,
      endLine: 1,
      endColumn: 27
    },
    {
      code: '@media (prefers-color-scheme: dark) and (color-gamut: srgb) { a { color: lch(48% 82 283); } }',
      description: 'lch out of srgb gamut and wrapped in a long and wrong media query',
      message: messages.rejected('lch(48% 82 283)'),
      line: 1,
      column: 74,
      endLine: 1,
      endColumn: 89
    },
    {
      code: '.foo { background: content-box oklch(82.6% 0.087 262.26); }',
      description: 'out of srgb gamut long property',
      message: messages.rejected('oklch(82.6% 0.087 262.26)'),
      line: 1,
      column: 20,
      endLine: 1,
      endColumn: 57
    },
    {
      code: 'a { color: lch(48% 82 283 / 72%); }',
      description: 'lch with alpha',
      message: messages.rejected('lch(48% 82 283 / 72%)'),
      line: 1,
      column: 12,
      endLine: 1,
      endColumn: 33
    },
    {
      code: '.foo {background-image: linear-gradient(red lch(48% 82 283)); }',
      description: 'multicolor property out of gamut range',
      message: messages.rejected('lch(48% 82 283)'),
      line: 1,
      column: 25,
      endLine: 1,
      endColumn: 61
    },
    {
      code: 'a { color: oklch(85% 0.1 354 / 73%); }',
      description: 'oklch',
      message: messages.rejected('oklch(85% 0.1 354 / 73%)'),
      line: 1,
      column: 12,
      endLine: 1,
      endColumn: 36
    },

    {
      code: 'a { color: lab(98% 49 129); }',
      description: 'lab',
      message: messages.rejected('lab(98% 49 129)'),
      line: 1,
      column: 12,
      endLine: 1,
      endColumn: 27
    },
    {
      code: 'a { color: oklab(98% 49 129); }',
      description: 'oklab',
      message: messages.rejected('oklab(98% 49 129)'),
      line: 1,
      column: 12,
      endLine: 1,
      endColumn: 29
    }
  ]
})
