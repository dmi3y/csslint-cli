'use strict';

var
optionsHelper = require('../lib/helper.js');

function footprint(meth /*, arguments*/ ) {
    var
        args = arguments,
        tostr;

    if (optionsHelper[meth]) {

        Array.prototype.shift.call(args);
        tostr = optionsHelper[meth].apply(optionsHelper, args);
    } else {

        tostr = meth;
    }

    return JSON.stringify(tostr);
}

exports.optionsHelper = {
    setUp: function(done) {
        done();
    },

    'parseCli': function(test) {
        var
            exp = '{"options":{"a":["b","c","d"],"e":["f"]},"targets":["g","h"]}',
            res = footprint('parseCli', ['--a=b,c,d', '--e=f', 'g', 'h']);

        test.expect(1);
        test.equal(exp, res);
        test.done();
    },

    'parseRc': function(test) {
        var
            exp = footprint('parseRc', '{"a":["b","c","d"], "e":["f"]}'),
            res = footprint('parseRc', '--a=b,c,d --e=f');

        test.expect(1);
        test.equal(exp, res);
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
            res1 = footprint('filterUnknown', fulllist),

            exp2 = '["help","version","format","quiet","exclude-list","list-rules"]',
            res2 = footprint('filterUnknown', fulllist, 'main'),

            exp3 = '["ignore","warnings","errors"]',
            res3 = footprint('filterUnknown', fulllist, 'cli');

        test.expect(3);
        test.equal(exp1, res1, 'all options');
        test.equal(exp2, res2, 'main options');
        test.equal(exp3, res3, 'cli options');

        test.done();
    },

    'optionsToExplicitRulesets': function(test) {
        var
            exp = '{"a":0,"b":0,"c":0,"d":0,"e":1,"f":1,"g":1,"h":2,"i":2,"j":2,"k":2}',
            res1 = footprint('optionsToExplicitRulesets', {
                "ignore": ["a", "b", "c", "d"],
                "warnings": ["e", "f", "g"],
                "errors": ["h", "i", "j", "k"]
            }),
            res2 = footprint('optionsToExplicitRulesets', {
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
