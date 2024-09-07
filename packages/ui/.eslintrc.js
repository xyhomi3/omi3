/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [require.resolve('@omi3/eslint/react.js')],
  parser: '@typescript-eslint/parser',
  globals: true
};
