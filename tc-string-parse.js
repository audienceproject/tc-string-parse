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
    var decodeBinary = function (string) {
        var result = "";

        for (var index = 0, length = string.length; index < length; index += 1) {
            var bits = string.charCodeAt(index).toString(2);
            var pad = "00000000".slice(0, 8 - bits.length);
            result += pad + bits;
        }

        return result;
    };

    var decodeBase64 = function (string) {
        if (typeof atob === "function") {
            var stringFixed = string.
                replace(/_/g, "/").
                replace(/-/g, "+");

            try {
                return atob(stringFixed);
            } catch (error) {
                throw new Error("Unable to decode transparency and consent string");
            }
        }

        if (typeof Buffer === "function") {
            return Buffer.from(string, "base64").toString("binary");
        }

        throw new Error("Unable to detect base64 decoder");
    };

    var decodeInt = function (bits) {
        return parseInt(bits, 2) || 0;
    };

    var decodeDate = function (bits) {
        return decodeInt(bits) * 100;
    };

    var decodeString = function (bits) {
        var charOffset = "A".charCodeAt();
        var items = bits.match(/.{6}/g) || [];
        var result = "";

        for (var index = 0, length = items.length; index < length; index += 1) {
            var charCode = decodeInt(items[index]) + charOffset;
            result += String.fromCharCode(charCode);
        }

        return result;
    };

    var decodeBoolean = function (bit) {
        return Boolean(Number(bit));
    };

    var decodeFlags = function (bits) {
        var items = bits.split("");
        var result = {};

        for (var index = 0, length = items.length; index < length; index += 1) {
            if (decodeBoolean(items[index])) {
                result[index + 1] = true;
            }
        }

        return result;
    };

    var getSegments = function (string) {
        if (typeof string !== "string") {
            throw new Error("Invalid transparency and consent string specified");
        }

        var stringBlocks = string.split(".");
        var result = [];

        for (var index = 0, length = stringBlocks.length; index < length; index += 1) {
            result.push(decodeBinary(decodeBase64(stringBlocks[index])));
        }

        var version = decodeInt(result[0].slice(0, 6));
        if (version !== 2) {
            throw new Error("Unsupported transparency and consent string version “" + version + "”");
        }

        return result;
    };

    var getQueue = function (segments) {
        var queuePurposes = [{
            key: "purposeConsents",
            size: 24,
            decoder: decodeFlags
        }, {
            key: "purposeLegitimateInterests",
            size: 24,
            decoder: decodeFlags
        }];

        var queueVendors = [{
            key: "maxVendorId",
            size: 16
        }, {
            key: "isRangeEncoding",
            size: 1,
            decoder: decodeBoolean
        }];

        var queueCore = [{
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
            decoder: decodeString
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
            key: "specialFeatureOptins",
            size: 12,
            decoder: decodeFlags
        }].concat(queuePurposes).concat({
            key: "purposeOneTreatment",
            size: 1,
            decoder: decodeBoolean
        }, {
            key: "publisherCountryCode",
            size: 12,
            decoder: decodeString
        }, {
            key: "vendorConsents",
            queue: [{
                key: "maxVendorId",
                size: 16
            }, {
                key: "isRangeEncoding",
                size: 1,
                decoder: decodeBoolean
            }]
        }, {
            key: "vendorLegitimateInterests",
            queue: queueVendors
        }, {
            key: "publisherRestrictions",
            queue: [{
                key: "numPubRestrictions",
                size: 12
            }]
        });

        var queueSegment = [{
            size: 3
        }];

        var queueDisclosedVendors = [].
            concat(queueSegment).
            concat(queueVendors);

        var queueAllowedVendors = [].
            concat(queueSegment).
            concat(queueVendors);

        var queuePublisherTC = [].
            concat(queueSegment).
            concat(queuePurposes).
            concat({
                key: "numCustomPurposes",
                size: 6
            });

        var result = [{
            key: "core",
            queue: queueCore
        }];

        for (var index = 1; index < segments.length; index += 1) {
            var segment = segments[index];

            var type = decodeInt(segment.slice(0, 3));

            if (type === 1) {
                result.push({
                    key: "disclosedVendors",
                    queue: queueDisclosedVendors
                });
            } else

            if (type === 2) {
                result.push({
                    key: "allowedVendors",
                    queue: queueAllowedVendors
                });
            } else

            if (type === 3) {
                result.push({
                    key: "publisherTC",
                    queue: queuePublisherTC
                });
            }
        }

        return result;
    };

    return function (string) {
        var reduceQueue = function (queue, schema, value, result) {
            var reduceNumPubEntries = function () {
                if (result.pubRestrictionEntry && result.rangeEntry) {
                    for (var key in result.rangeEntry) {
                        if (Object.prototype.hasOwnProperty.call(result.rangeEntry, key)) {
                            result.pubRestrictionEntry[key] = (result.pubRestrictionEntry[key] || []).
                                concat(result.rangeEntry[key]);
                        }
                    }
                }

                if (result.numPubRestrictions) {
                    result.numPubRestrictions -= 1;

                    queue.push({
                        key: "purposeId",
                        size: 6
                    }, {
                        key: "restrictionType",
                        size: 2
                    }, {
                        key: "numEntries",
                        size: 12
                    });
                }
            };

            var reduceNumEntries = function () {
                if (result.numEntries) {
                    result.numEntries -= 1;

                    queue.push({
                        key: "isRange",
                        size: 1,
                        decoder: decodeBoolean
                    }, {
                        key: "startVendorId",
                        size: 16
                    });
                } else {
                    reduceNumPubEntries();
                }
            };

            var getRangeResult = function () {
                if (result.purposeId) {
                    return [{
                        purpose: result.purposeId,
                        isAllowed: result.restrictionType !== 0,
                        isConsentRequired: result.restrictionType === 1,
                        isLegitimateInterestRequired: result.restrictionType === 2
                    }];
                }

                return true;
            };

            if (schema.key === "isRangeEncoding") {
                queue.push(value ? {
                    key: "numEntries",
                    size: 12
                } : {
                    key: "bitField",
                    size: result.maxVendorId,
                    decoder: decodeFlags
                });
            } else

            if (schema.key === "numEntries") {
                result.rangeEntry = {};
                reduceNumEntries();
            } else

            if (schema.key === "isRange") {
                if (value) {
                    queue.push({
                        key: "endVendorId",
                        size: 16
                    });
                }
            } else

            if (schema.key === "startVendorId") {
                if (!result.isRange) {
                    result.rangeEntry[value] = getRangeResult();
                    reduceNumEntries();
                }
            } else

            if (schema.key === "endVendorId") {
                for (var vendorId = result.startVendorId; vendorId <= result.endVendorId; vendorId += 1) {
                    result.rangeEntry[vendorId] = getRangeResult();
                }
                reduceNumEntries();
            } else

            if (schema.key === "numCustomPurposes") {
                queue.push({
                    key: "customPurposeConsents",
                    size: result.numCustomPurposes,
                    decoder: decodeFlags
                }, {
                    key: "customPurposeLegitimateInterests",
                    size: result.numCustomPurposes,
                    decoder: decodeFlags
                });
            } else

            if (schema.key === "numPubRestrictions") {
                result.pubRestrictionEntry = {};
                reduceNumPubEntries();
            }
        };

        var reduceResult = function (result) {
            return result.pubRestrictionEntry || result.rangeEntry || result.bitField || result;
        };

        var offset = 0;

        var getSchemaResult = function (schema, bits) {
            var value = bits.slice(offset, offset + schema.size);
            offset += schema.size;
            return (schema.decoder || decodeInt)(value);
        };

        var getSectionResult = function (sectionSchema, bits) {
            if (!sectionSchema.queue) {
                return getSchemaResult(sectionSchema, bits);
            }

            var result = {};

            for (var index = 0; index < sectionSchema.queue.length; index += 1) {
                var schema = sectionSchema.queue[index];

                var value = getSchemaResult(schema, bits);
                result[schema.key] = value;

                reduceQueue(sectionSchema.queue, schema, value, result);
            }

            return reduceResult(result);
        };

        var getBlockResult = function (blockSchema, bits) {
            var result = {};

            for (var index = 0; index < blockSchema.queue.length; index += 1) {
                var schema = blockSchema.queue[index];

                var value = getSectionResult(schema, bits);
                result[schema.key] = value;

                reduceQueue(blockSchema.queue, schema, value, result);
            }

            return reduceResult(result);
        };

        var getResult = function () {
            var segments = getSegments(string);
            var queue = getQueue(segments);

            var result = {};

            for (var index = 0; index < queue.length; index += 1) {
                var schema = queue[index];
                var bits = segments[index];

                var value = getBlockResult(schema, bits);
                result[schema.key] = value;

                offset = 0;
            }

            return result;
        };

        return getResult();
    };
}));
