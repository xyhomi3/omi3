/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [require.resolve("@omi3/eslint/react.js")],
  parser: "@typescript-eslint/parser",
  rules: {
    'no-unused-vars': 'off',
    'no-undef': 'off',
  }
};