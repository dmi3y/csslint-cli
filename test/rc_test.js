'use strict';

var
    h = require('../lib/rc.js'),
    fu = require('nfsu');

exports.rc = {
    'shuffleToRulesets': function(test) {
        var
            exp = {rulesets: {
                "a/b/c": {
                    "files": ["a/b/c/1.css", "a/b/c/d/1.css", "a/b/c/d/2.css"],
                    "rules": {include:2, ids:1, shortland:0, 'zero-units':0}
                },
                "a": {
                    "files": ["a/1.css", "a/2.css", "a/b/1.css"],
                    "rules": {include:2, ids:1, shortland:0, 'zero-units':0}
                }
            }, "files": []},
            rcs = [
                {
                    base: 'a',
                    rules: {include:2, ids:1, shortland:0, 'zero-units':0},
                    ord: 1
                },
                {
                    base: 'a/b/c',
                    rules: {include:2, ids:1, shortland:0, 'zero-units':0},
                    ord: 0
                }
            ],
            files = [
                'a/1.css',
                'a/2.css',
                'a/b/1.css',
                'a/b/c/1.css',
                'a/b/c/d/1.css',
                'a/b/c/d/2.css'
            ],
            res = h.shuffleToRulesets(rcs, files);

        test.expect(1);
        test.deepEqual(res, exp);
        test.done();
    },

    'sortTheRest': function(test) {
        var
            expkey = fu.p.resolve('test/assets/a/b/c/d'),
            expval1 = fu.p.resolve('test/assets/a/b/c/d/d.css'),
            expval2 = fu.p.resolve('test/assets/a/b/c/d/x.css'),
            exp1 = {},
            exp2 = {},
            res1 = h.sortTheRest(['test/assets/a/b/c/d/d.css'], '.csslintrc'),
            res2 = h.sortTheRest(['test/assets/a/b/c/d/x.css'], '.this-file-is-not-part-of-fs_@#$_forsure');

        exp1[expkey] = {
            files: [ expval1 ],
            rules: {
                'zero-units': 2
            }
        };
        exp2[expkey] = {
            files: [ expval2 ],
            rules: {}
        };

        test.expect(2);
        test.deepEqual(res1, exp1, 'lookup rc');
        test.deepEqual(res2, exp2, 'no external rc');
        test.done();
    }
};
