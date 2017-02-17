const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {

  "parser": "babel-eslint",
  "extends": "airbnb",
  "env": {
    "browser": true,
    "node": true
  },

  rules: {
    'accessor-pairs': OFF,
    'brace-style': [ERROR, '1tbs'],
    'comma-dangle': [ERROR, 'always-multiline'],
    'consistent-return': OFF,
    'dot-location': [ERROR, 'property'],
    'dot-notation': ERROR,
    'eol-last': ERROR,
    'eqeqeq': [ERROR, 'allow-null'],
    'indent': [ERROR, 2, {SwitchCase: 1}],
    'jsx-quotes': [ERROR, 'prefer-double'],
    'keyword-spacing': [ERROR, {after: true, before: true}],
    'no-bitwise': OFF,
    'no-console': [ERROR, { allow: ["warn", "error"] }],
    'no-inner-declarations': [ERROR, 'functions'],
    'no-multi-spaces': ERROR,
    'multiline-ternary': [ERROR, 'never'],
    'no-restricted-syntax': [ERROR, 'WithStatement'],
    'no-shadow': ERROR,
    'no-unused-expressions': ERROR,
    'no-unused-vars': [ERROR, {args: 'none'}],
    'quotes': [ERROR, 'single', {avoidEscape: true, allowTemplateLiterals: true }],
    'space-before-blocks': ERROR,
    'space-before-function-paren': [ERROR, {anonymous: 'never', named: 'never'}],

    // React & JSX
    'react/jsx-boolean-value': [ERROR, 'always'],
    'react/jsx-no-undef': ERROR,
    'react/jsx-sort-prop-types': OFF,
    'react/jsx-uses-react': ERROR,
    'react/no-is-mounted': OFF,
    'react/react-in-jsx-scope': ERROR,
    'react/self-closing-comp': ERROR,
    'react/jsx-wrap-multilines': [ERROR, {declaration: false, assignment: false}],
    "react/forbid-prop-types": OFF,
  },

  globals: {
    expectDev: true,
  },
}
