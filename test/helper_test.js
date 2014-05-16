'use strict';

var
    h = require('../lib/helper.js');

exports.helper = {
    'parseCli': function(test) {
        var
            exp1 = {"options":{"a":"b,c,d","e":"f"},"targets":["g","h"]},
            res1 = h.parseCli(['--a=b,c,d', '--e=f', 'g', 'h']),
            exp2 = {"options":{},"targets":["g\\"]},
            res2 = h.parseCli(['g\\']);

        test.expect(2);
        test.deepEqual(res1, exp1);
        test.deepEqual(res2, exp2);
        test.done();
    },

    'parseRc': function(test) {
        var
            exp = {"a":["b","c","d"],"e":["f"]},
            res0 = h.parseRc('{"a":["b"/*a*/,"c","d"], "e":["f"]}//b'),
            res1 = h.parseRc('--a=b,c,d --e=f');

        test.expect(2);
        test.deepEqual(res0, exp);
        test.deepEqual(res1, exp);
        test.done();
    },

    'filterUnknown': function(test) {
        var
            fulllist = {
                ignore: 1,
                warnings: 1,
                errors: 1,

                help: 1,
                version: 1,
                format: 1,
                quiet: 1,
                'exclude-list': 1,
                'list-rules': 1
            },
            exp1 = null,
            res1 = h.filterUnknown(fulllist),

            exp2 = ["help","version","format","quiet","exclude-list","list-rules"],
            res2 = h.filterUnknown(fulllist, 'main'),

            exp3 = ["ignore","warnings","errors"],
            res3 = h.filterUnknown(fulllist, 'cli');

        test.expect(3);
        test.equal(res1, exp1);
        test.deepEqual(res2, exp2);
        test.deepEqual(res3, exp3);

        test.done();
    },

    'cherryPick': function(test) {
        var
            fulllist = {
                ignore: 1,
                warnings: 1,
                errors: 1,

                help: 1,
                version: 1,
                format: 1,
                quiet: 1,
                'exclude-list': 1,
                'list-rules': 1
            },
            exp1 = fulllist,
            res1 = h.cherryPick(fulllist),

            exp2 = {
                ignore: 1,
                warnings: 1,
                errors: 1
            },
            res2 = h.cherryPick(fulllist, 'main'),

            exp3 = {                
                help: 1,
                version: 1,
                format: 1,
                quiet: 1,
                'exclude-list': 1,
                'list-rules': 1
            },
            res3 = h.cherryPick(fulllist, 'cli');

        test.expect(3);
        test.deepEqual(res1, exp1);
        test.deepEqual(res2, exp2);
        test.deepEqual(res3, exp3);

        test.done();
    },

    'optionsToExplicitRulesets': function(test) {
        var
            exp = {"a":0,"b":0,"c":0,"d":0,"e":1,"f":1,"g":1,"h":2,"i":2,"j":2,"k":2},
            res1 = h.optionsToExplicitRulesets({
                "ignore": ["a", "b", "c", "d"],
                "warnings": ["e", "f", "g"],
                "errors": ["h", "i", "j", "k"]
            }),
            res2 = h.optionsToExplicitRulesets({
                "a": "0",
                "b": "false",
                "c": false,
                "d": 0,
                "e": "1",
                "f": "",
                "g": 1,
                "h": "2",
                "i": "true",
                "j": true,
                "k": 2
            });

        test.expect(2);
        test.deepEqual(res1, exp);
        test.deepEqual(res2, exp);

        test.done();
    }
};
