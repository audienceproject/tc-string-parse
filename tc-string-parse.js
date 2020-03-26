"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory();
    } else {
        root.TCStringParse = factory();
    }
}(typeof self === "undefined" ? this : self, function () {
    var decodeBase64 = function (str) {
        if (typeof atob === "function") {
            return atob(str);
        }

        return Buffer.from(str, "base64").toString("binary");
    };

    var decodeToBinary = function (str) {
        var result = "";

        for (var index = 0; index < str.length; index += 1) {
            var bits = str.charCodeAt(index).toString(2);
            var pad = "0".repeat(8 - bits.length);
            result += pad + bits;
        }

        return result;
    };

    var decodeBinaryToInt = function (bits) {
        return parseInt(bits, 2);
    };

    var decodeDate = function (bits) {
        var date = new Date();
        var time = decodeBinaryToInt(bits) * 100;
        date.setTime(time);
        return date;
    };

    var decodeBoolean = function (bit) {
        return Boolean(Number(bit));
    };

    var decodeFlags = function (bits) {
        return bits.
            split("").
            reduce(function (result, bit, index) {
                if (decodeBoolean(bit)) {
                    result[index + 1] = true;
                }

                return result;
            }, {});
    };

    var decodeBinaryToLanguageCode = function (bits) {
        var charOffset = "A".charCodeAt();

        return bits.
            match(/.{6}/g).
            reduce(function (result, block) {
                var char = String.fromCharCode(decodeBinaryToInt(block) + charOffset);
                return result + char;
            }, "");
    };

    var stringSchema = [{
        key: "core",
        data: [{
            key: "version",
            size: 6
        }, {
            key: "created",
            size: 36,
            decoder: decodeDate
        }, {
            key: "lastUpdated",
            size: 36,
            decoder: decodeDate
        }, {
            key: "cmpId",
            size: 12
        }, {
            key: "cmpVersion",
            size: 12
        }, {
            key: "consentScreen",
            size: 6
        }, {
            key: "consentLanguage",
            size: 12,
            decoder: decodeBinaryToLanguageCode
        }, {
            key: "vendorListVersion",
            size: 12
        }, {
            key: "policyVersion",
            size: 6
        }, {
            key: "isServiceSpecified",
            size: 1,
            decoder: decodeBoolean
        }, {
            key: "useNonStandardStacks",
            size: 1,
            decoder: decodeBoolean
        }, {
            key: "specialFeatureOptIns",
            size: 12,
            decoder: decodeFlags
        }, {
            key: "purposesConsents",
            size: 24,
            decoder: decodeFlags
        }, {
            key: "purposeLegitimateInterests",
            size: 24,
            decoder: decodeFlags
        }]
    }];

    return function (str) {
        if (typeof str !== "string") {
            throw new Error("Invalid transparency and consent string specified");
        }

        var segments = str.
            split(".").
            map(function (segment) {
                return decodeToBinary(decodeBase64(segment));
            });

        if (decodeBinaryToInt(segments[0].slice(0, 6)) !== 2) {
            throw new Error("Unsupported transparency and consent version");
        }

        return stringSchema.
            reduce(function (result, block, index) {
                var segment = segments[index];
                if (segment) {
                    var bitOffset = 0;

                    result[block.key] = block.data.
                        reduce(function (blockModel, data) {
                            var bits = segment.slice(bitOffset, bitOffset + data.size);
                            blockModel[data.key] = (data.decoder || decodeBinaryToInt)(bits);
                            bitOffset += data.size;

                            return blockModel;
                        }, {});
                }

                return result;
            }, {});
    };
}));
