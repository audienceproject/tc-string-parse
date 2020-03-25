/* eslint-env es6, node */

"use strict";

const ava = require("ava");
const parse = require(".");

ava("not string", (test) => {
    const error = test.throws(() => parse());
    test.is(error.message, "Invalid transparency and consent string specified");
});

ava("invalid consent version", (test) => {
    const error = test.throws(() => parse("BOwxS1NOwxS1UAAAAAAADAAAAAAuiAAA"));
    test.is(error.message, "Unsupported transparency and consent version");
});

ava.before((test) => {
    const emptyConsent = "COwxIfeOwxIfeALAWhDAAcCAAAAAAAAAAAAAAAAAAAAA.IF0EWSQgAYWwho0QUBzBAIYAfJgSCAMgSAAQIoCkFQICERBAEKiAQHAEQJAAAGBAAkACAAQAoHCBMCQABgAARiRCEQECIDRNABIBAggAKYQFAAARmikHC3ZCY702yOmQ.YAAAAAAAAAAAAAAAAAA";
    test.context.empty = parse(emptyConsent);

    const givenConsent = "COwxNijOwxNijALAWhDAAcCIAIBAAAAAAAAADFQAQDFAAAAA.IF0EWSQgAYWwho0QUBzBAIYAfJgSCAMgSAAQIoCkFQICERBAEKiAQHAEQJAAAGBAAkACAAQAoHCBMCQABgAARiRCEQECIDRNABIBAggAKYQFAAARmikHC3ZCY702yOmQ.YAAAAAAAAAAAAAAAAAA";
    test.context.given = parse(givenConsent);
});

ava("version", (test) => {
    test.is(test.context.given.core.version, 2);
});

ava("created", (test) => {
    test.true(test.context.given.core.created instanceof Date);
});

ava("last updated", (test) => {
    test.true(test.context.given.core.lastUpdated instanceof Date);
});

ava("cmp id", (test) => {
    test.is(test.context.given.core.cmpId, 11);
});

ava("cmp version", (test) => {
    test.is(test.context.given.core.cmpVersion, 22);
});

ava("consent screen", (test) => {
    test.is(test.context.given.core.consentScreen, 33);
});

ava("consent language", (test) => {
    test.is(test.context.given.core.consentLanguage, "DA");
});

ava("vendor list version", (test) => {
    test.is(test.context.given.core.vendorListVersion, 28);
});

ava("tcf policy version", (test) => {
    test.is(test.context.given.core.policyVersion, 2);
});

ava("is service specified", (test) => {
    test.false(test.context.given.core.isServiceSpecified);
});

ava("use non standard stacks", (test) => {
    test.false(test.context.given.core.useNonStandardStacks);
});

ava("special feature opt ins", (test) => {
    test.deepEqual(test.context.empty.core.specialFeatureOptIns, {});
    test.deepEqual(test.context.given.core.specialFeatureOptIns, {
        1: true
    });
});

ava("purpose consents", (test) => {
    test.deepEqual(test.context.empty.core.purposesConsents, {});
    test.deepEqual(test.context.given.core.purposesConsents, {
        1: true,
        10: true
    });
});

ava("purpose legitimate interests", (test) => {
    test.deepEqual(test.context.empty.core.purposeLegitimateInterests, {});
    test.deepEqual(test.context.given.core.purposeLegitimateInterests, {});
});
