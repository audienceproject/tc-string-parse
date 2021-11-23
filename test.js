/* eslint-env es6 */

"use strict";

const ava = require("ava");
const parse = require(".");

ava("empty string", (test) => {
    const error = test.throws(() => parse());
    test.is(error.message, "Invalid transparency and consent string specified");
});

ava("invalid string", (test) => {
    const error = test.throws(() => parse("!!!"));
    test.is(error.message, "Unable to decode transparency and consent string");
});

ava("unsupported version", (test) => {
    const error = test.throws(() => parse("BOwxS1NOwxS1UAAAAAAADAAAAAAuiAAA"));
    test.is(error.message, "Unsupported transparency and consent string version “1”");
});

ava.before((test) => {
    const emptyConsent = "COwxIfeOwxIfeALAWhDAAcCAAAAAAAAAAAAAAAAAAAAA.IF0EWSQgAYWwho0QUBzBAIYAfJgSCAMgSAAQIoCkFQICERBAEKiAQHAEQJAAAGBAAkACAAQAoHCBMCQABgAARiRCEQECIDRNABIBAggAKYQFAAARmikHC3ZCY702yOmQ.YAAAAAAAAAAAAAAAAAA";
    test.context.empty = parse(emptyConsent);

    const givenConsent = "COuDmHAOuG5DAALAWhENAfCIAEAAACAAACgAAFgGgAIEAMEABAAQEgAgAJDgAQAFgA.IF1kXyQoGY2lho0QUBzBAIYQfJwSCgMgSAAQIsSkNQIWEBBAGPiAQHAGYJAQAGBAEkACBAQAoHGBMCQABgAgRiRCMQEGIDzNIBIBAggkaI0FACCVmmkHC3ZCY70-6u_-";
    test.context.given = parse(givenConsent);

    const exampleConsent = "COw4XqLOw4XqLAAAAAENAXCAAAAAAAAAAAAAAAAAAAAA.IFukWSQgAIQwgI0QEByFAAAAeIAACAIgSAAQAIAgEQACEABAAAgAQFAEAIAAAGBAAgAAAAQAIFAAMCQAAgAAQiRAEQAAAAANAAIAAggAIYQFAAARmggBC3ZCYzU2yIA.QFukWSQgAIQwgI0QEByFAAAAeIAACAIgSAAQAIAgEQACEABAAAgAQFAEAIAAAGBAAgAAAAQAIFAAMCQAAgAAQiRAEQAAAAANAAIAAggAIYQFAAARmggBC3ZCYzU2yIA.YAAAAAAAAAAAAAAAAAA";
    test.context.example = parse(exampleConsent);
});

ava("core version", (test) => {
    test.is(test.context.given.core.version, 2);
});

ava("core created", (test) => {
    test.is(test.context.given.core.created, new Date("2020-01-31T22:00:00.000Z").getTime());
});

ava("core last updated", (test) => {
    test.is(test.context.given.core.lastUpdated, new Date("2020-02-01T22:00:00.000Z").getTime());
});

ava("core cmp id", (test) => {
    test.is(test.context.given.core.cmpId, 11);
});

ava("core cmp version", (test) => {
    test.is(test.context.given.core.cmpVersion, 22);
});

ava("core consent screen", (test) => {
    test.is(test.context.given.core.consentScreen, 33);
});

ava("core consent language", (test) => {
    test.is(test.context.given.core.consentLanguage, "EN");
});

ava("core vendor list version", (test) => {
    test.is(test.context.given.core.vendorListVersion, 31);
});

ava("core policy version", (test) => {
    test.is(test.context.given.core.policyVersion, 2);
});

ava("core is service specified", (test) => {
    test.false(test.context.given.core.isServiceSpecified);
});

ava("core use non standard stacks", (test) => {
    test.false(test.context.given.core.useNonStandardStacks);
});

ava("core special feature opt ins", (test) => {
    test.deepEqual(test.context.empty.core.specialFeatureOptins, {});
    test.deepEqual(test.context.given.core.specialFeatureOptins, {
        1: true
    });
});

ava("core purpose consents", (test) => {
    test.deepEqual(test.context.empty.core.purposeConsents, {});
    test.deepEqual(test.context.given.core.purposeConsents, {
        2: true
    });
});

ava("core purpose legitimate interests", (test) => {
    test.deepEqual(test.context.empty.core.purposeLegitimateInterests, {});
    test.deepEqual(test.context.given.core.purposeLegitimateInterests, {
        3: true
    });
});

ava("core purpose one treatment", (test) => {
    test.false(test.context.given.core.purposeOneTreatment);
});

ava("core publisher country code", (test) => {
    test.is(test.context.given.core.publisherCountryCode, "UA");
});

ava("core vendor consents", (test) => {
    test.deepEqual(test.context.empty.core.vendorConsents, {});
    test.deepEqual(test.context.given.core.vendorConsents, {
        8: true,
        9: true,
        11: true
    });
});

ava("core vendor legitimate interests", (test) => {
    test.deepEqual(test.context.empty.core.vendorLegitimateInterests, {});
    test.deepEqual(test.context.given.core.vendorLegitimateInterests, {
        4: true
    });
});


ava("core publisher restrictions", (test) => {
    test.deepEqual(test.context.empty.core.publisherRestrictions, {});
    test.deepEqual(Object.keys(test.context.given.core.publisherRestrictions), ["8", "9", "11"]);
});

ava("disclosed vendors", (test) => {
    test.is(Object.keys(test.context.example.disclosedVendors).length, 115);
});

ava("allowed vendors", (test) => {
    test.is(Object.keys(test.context.example.allowedVendors).length, 115);
});
