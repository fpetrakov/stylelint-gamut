'use strict'

const { rule: { messages, ruleName } } = require('./index.js')

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
      code: 'a { color: red; }',
      description: 'ignore not lch color declaration'
    },
    {
      code: ':root { --clr: lch(48% 82 283 / 75%) } a { color: var(--clr) }',
      description: 'ignore css variables'
    },
    {
      code: '@myVariable: lch(48% 82 283); a { color: @myVariable; }',
      description: 'ignore Less variable'
    },
    {
      code: ':root { $clr: lch(48% 82 283 / 67%) } a { color: $clr; }',
      description: 'ignore scss variables'
    }
  ],

  reject: [
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
      code: 'a { color: lch(48% 82 283 / 72%); }',
      description: 'lch with alpha',
      message: messages.rejected('lch(48% 82 283 / 72%)'),
      line: 1,
      column: 12,
      endLine: 1,
      endColumn: 33
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
