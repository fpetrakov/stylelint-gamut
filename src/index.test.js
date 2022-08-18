'use strict'

const { rule: { messages, ruleName } } = require('./index.js')

testRule({
  ruleName,
  config: [true],
  plugins: ['./index.js'],
  accept: [
    {
      code: '@media (color-gamut: p3) { a { color: lch(48% 82 283); } }',
      description: 'lch out of srgb gamut but wrapped in p3 media query'
    },
    {
      code: '@media (color-gamut: rec2020) { a { color: lch(48% 82 283); } }',
      description: 'lch out of p3 gamut but wrapped in rec2020 media query'
    },
    {
      code: '@media (color-gamut: p3) { a { color: oklch(48% 82 283 / 73%); } }',
      description:
        'oklch with alpha out of srgb gamut but wrapped in p3 media query'
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
      code: '@media (color-gamut: srgb) { a { color: lch(48% 82 283); } }',
      description: 'lch is out of srgb and wrapped in srgb media query',
      message: messages.rejected('lch(48% 82 283)'),
      line: 1,
      column: 41,
      endLine: 1,
      endColumn: 56
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
      code: 'a { color: oklch(98% 49 129); }',
      description: 'oklch',
      message: messages.rejected('oklch(98% 49 129)'),
      line: 1,
      column: 12,
      endLine: 1,
      endColumn: 29
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
