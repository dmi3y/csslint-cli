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
                    "rules": {}
                },
                "a": {
                    "files": ["a/1.css", "a/2.css", "a/b/1.css"],
                    "rules": {}
                }
            }, "files": []},
            rcs = [
                {
                    base: 'a',
                    rules: {},
                    ord: 1
                },
                {
                    base: 'a/b/c',
                    rules: {},
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
        test.deepEqual(exp, res);
        test.done();
    },

    'sortTheRest': function(test) {
        var
            expkey = fu.p.resolve('test/assets/a/b/c/d'),
            expval1 = fu.p.resolve('test/assets/a/b/c/d/d.css'),
            exp = {},
            res = h.sortTheRest(['test/assets/a/b/c/d/d.css'], '.csslintrc');

        exp[expkey] = { 
            files: [ expval1 ],
            rules: {
                errors: ['include']
            }
        };

        test.expect(1);
        test.deepEqual(exp, res);
        test.done();  
    }
};
