'use strict';

var
    h = require('../lib/helper.js'),
    c = require('./common')(h);

exports.helper = {
    'parseCli': function(test) {
        var
            exp = '{"options":{"a":["b","c","d"],"e":["f"]},"targets":["g","h"]}',
            res = c.footprint('parseCli', ['--a=b,c,d', '--e=f', 'g', 'h']);

        test.expect(1);
        test.equal(exp, res);
        test.done();
    },

    'parseRc': function(test) {
        var
            res0 = c.footprint('parseRc', '{"a":["b"/*a*/,"c","d"], "e":["f"]}//b'),
            res1 = c.footprint('parseRc', '--a=b,c,d --e=f');

        test.expect(1);
        test.equal(res0, res1);
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
            exp1 = 'null',
            res1 = c.footprint('filterUnknown', fulllist),

            exp2 = '["help","version","format","quiet","exclude-list","list-rules"]',
            res2 = c.footprint('filterUnknown', fulllist, 'main'),

            exp3 = '["ignore","warnings","errors"]',
            res3 = c.footprint('filterUnknown', fulllist, 'cli');

        test.expect(3);
        test.equal(exp1, res1, 'all options');
        test.equal(exp2, res2, 'main options');
        test.equal(exp3, res3, 'cli options');

        test.done();
    },

    'optionsToExplicitRulesets': function(test) {
        var
            exp = '{"a":0,"b":0,"c":0,"d":0,"e":1,"f":1,"g":1,"h":2,"i":2,"j":2,"k":2}',
            res1 = c.footprint('optionsToExplicitRulesets', {
                "ignore": ["a", "b", "c", "d"],
                "warnings": ["e", "f", "g"],
                "errors": ["h", "i", "j", "k"]
            }),
            res2 = c.footprint('optionsToExplicitRulesets', {
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
        test.equal(exp, res1);
        test.equal(exp, res2);

        test.done();
    }
};
