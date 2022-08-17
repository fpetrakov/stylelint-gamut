module.exports = {
  preset: 'jest-preset-stylelint',
  clearMocks: true,
  setupFiles: ['./jest.setup.js'],
  testEnvironment: 'node',
  roots: ['src'],
  testRegex: '.*\\.test\\.js$|src/.*/__tests__/.*\\.js$'
}
