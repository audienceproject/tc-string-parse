"use strict";

module.exports = {
    ignorePatterns: "!.*",

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
        "max-len": "off",
        "max-lines-per-function": "off",
        "multiline-ternary": "off",
        "no-invalid-this": "off",
        "no-magic-numbers": "off",
        "no-ternary": "off",
        "no-var": "off",
        "one-var": "off",
        "padded-blocks": "off",
        "prefer-arrow-callback": "off",
        "quote-props": "off",
        "require-unicode-regexp": "off",
        "sort-keys": "off",
        "vars-on-top": "off"
    }
};
