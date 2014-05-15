'use strict';

var
    h = require('../lib/rc.js');

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
            exp = {
                'c:\\work\\csslint-cli\\test\\assets\\a\\b\\c\\d': { 
                    files: [ 'c:\\work\\csslint-cli\\test\\assets\\a\\b\\c\\d\\d.css' ],
                    rules: {
                        warnings: [ 'ids', 'zero-units' ],
                        errors: [ 'include' ]
                    }
                }
            },
            res = h.sortTheRest(['test/assets/a/b/c/d/d.css']);

        test.expect(1);
        test.deepEqual(exp, res);
        test.done();  
    }
};
