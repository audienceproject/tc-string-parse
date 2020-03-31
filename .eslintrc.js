"use strict";

module.exports = {
    ignorePatterns: [
        "!.*",
        "*.min.js"
    ],

    extends: "eslint:all",

    env: {
        node: true,
        amd: true,
        browser: true
    },

    rules: {
        "array-bracket-newline": "off",
        "array-element-newline": "off",
        "func-names": "off",
        "function-call-argument-newline": "off",
        "max-depth": "off",
        "max-len": "off",
        "max-lines-per-function": "off",
        "max-lines": "off",
        "max-params": "off",
        "max-statements": "off",
        "multiline-ternary": "off",
        "no-invalid-this": "off",
        "no-loop-func": "off",
        "no-magic-numbers": "off",
        "no-ternary": "off",
        "no-var": "off",
        "one-var": "off",
        "padded-blocks": "off",
        "prefer-arrow-callback": "off",
        "prefer-destructuring": "off",
        "quote-props": "off",
        "require-unicode-regexp": "off",
        "sort-keys": "off",
        "vars-on-top": "off"
    }
};
