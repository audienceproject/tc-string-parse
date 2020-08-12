#!/usr/bin/env node

"use strict";

var args = process.argv.slice(2);

if (!args.length) {
    console.error("Transparency and consent string not passed.");
    process.exit(1);
}

if (args.length !== 1) {
    console.error("Too many arguments passed.");
    process.exit(1);
}

var parse = require(".");

var model = {};
try {
    model = parse(args[0]);
} catch (error) {
    console.error("Unable to parse constent string: " + error.message);
    process.exit(1);
}

var output = JSON.stringify(model, null, 2);

console.log(output);
process.exit(0);
