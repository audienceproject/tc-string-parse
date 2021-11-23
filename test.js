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

    const tcDataConsent = "CPP3iclPP3iclAHABBENB1CsAP_AAH_AAAqIIXNf_X__b3_j-_59f_t0eY1P9_7_v-0zjhfdt-8N2f_X_L8X42M7vF36pq4KuR4Eu3LBIQdlHOHcTUmw6okVrzPsbk2cr7NKJ7PEmnMbO2dYGH9_n93TuZKY7__8___z_v-v_v____f_7-3_3__5_X---_e_V399zLv9____39nN___9v-_98ELgCTDUvIAuxLHBk2jSqFECMKwkOgFABRQDC0RWEDK4KdlcBHrCFgAhNQEYEQIMQUYMAgAEAgCQiICQA8EAiAIgEAAIAVICEABGwCCwAsDAIABQDQsQIoAhAkIMjgqOUwICJFooJ7KwBKDvY0whDLLACgUf0VGAiUIIFgZCQsHMcASAlwskCyAA.f_gAD_gAAAAA";
    test.context.tcData = {
        tsp: parse(tcDataConsent),
        // TcString decoded with __tcfapi('getTCData')
        iab: require("./tcData.fixture.json")
    };
});

ava("version", (test) => {
    test.is(test.context.given.version, 2);
});

ava("created", (test) => {
    test.is(test.context.given.created, new Date("2020-01-31T22:00:00.000Z").getTime());
});

ava("last updated", (test) => {
    test.is(test.context.given.lastUpdated, new Date("2020-02-01T22:00:00.000Z").getTime());
});

ava("cmp id", (test) => {
    test.is(test.context.given.cmpId, 11);
});

ava("cmp version", (test) => {
    test.is(test.context.given.cmpVersion, 22);
});

ava("consent screen", (test) => {
    test.is(test.context.given.consentScreen, 33);
});

ava("consent language", (test) => {
    test.is(test.context.given.consentLanguage, "EN");
});

ava("vendor list version", (test) => {
    test.is(test.context.given.vendorListVersion, 31);
});

ava("tcf policy version", (test) => {
    test.is(test.context.given.tcfPolicyVersion, 2);
});

ava("is service specific", (test) => {
    test.false(test.context.given.isServiceSpecific);
});

ava("use non standard stacks", (test) => {
    test.false(test.context.given.useNonStandardStacks);
});

ava("special feature opt ins", (test) => {
    test.deepEqual(test.context.empty.specialFeatureOptins, {});
    test.deepEqual(test.context.given.specialFeatureOptins, {
        1: true
    });
});

ava("purpose consents", (test) => {
    test.deepEqual(test.context.empty.purpose.consents, {});
    test.deepEqual(test.context.given.purpose.consents, {
        2: true
    });
});

ava("purpose legitimate interests", (test) => {
    test.deepEqual(test.context.empty.purpose.legitimateInterests, {});
    test.deepEqual(test.context.given.purpose.legitimateInterests, {
        3: true
    });
});

ava("purpose one treatment", (test) => {
    test.false(test.context.given.purposeOneTreatment);
});

ava("publisher country code", (test) => {
    test.is(test.context.given.publisherCC, "UA");
});

ava("vendor consents", (test) => {
    test.deepEqual(test.context.empty.vendor.consents, {});
    test.deepEqual(test.context.given.vendor.consents, {
        8: true,
        9: true,
        11: true
    });
});

ava("vendor legitimate interests", (test) => {
    test.deepEqual(test.context.empty.vendor.legitimateInterests, {});
    test.deepEqual(test.context.given.vendor.legitimateInterests, {
        4: true
    });
});


ava("publisher restrictions", (test) => {
    test.deepEqual(test.context.empty.publisher.restrictions, {});
    test.deepEqual(Object.keys(test.context.given.publisher.restrictions), ["8", "9", "11"]);
});

ava("disclosed vendors", (test) => {
    test.is(Object.keys(test.context.example.outOfBand.disclosedVendors).length, 115);
});

ava("allowed vendors", (test) => {
    test.is(Object.keys(test.context.example.outOfBand.allowedVendors).length, 115);
});

ava("tcData structure", (test) => {
    for (const key in test.context.tcData.iab) {
        // Ignore TCData keys
        if (["cmpStatus", "eventStatus", "gdprApplies", "listenerId"].includes(key)) {
            continue;
        }

        const value = test.context.tcData.iab[key];

        switch (typeof value) {
        case "boolean":
        case "number":
        case "string":
            test.is(value, test.context.tcData.tsp[key]);
            break;
        default:
            test.like(value, test.context.tcData.tsp[key]);
            break;
        }
    }
});
