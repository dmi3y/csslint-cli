'use strict';

var
    h = require('../lib/rc.js'),
    c = require('./common')(h);

exports.rc = {
    'shuffleToRulesets': function(test) {
        var
            exp = c.footprint({
               "a/b/c/":{
                  "rules":{},
                  "files":[
                     "a/b/c/1.css",
                     "a/b/c/d/1.css",
                     "a/b/c/d/2.css"
                  ]
               },
               "a/":{
                  "rules":{},
                  "files":[
                     "a/1.css",
                     "a/2.css",
                     "a/b/1.css"
                  ]
               }
            }),
            datain = {
                '.rc':[
                    'a/.rc',
                    'a/b/c/.rc'
                ],
                '.css':[
                    'a/1.css',
                    'a/2.css',
                    'a/b/1.css',
                    'a/b/c/1.css',
                    'a/b/c/d/1.css',
                    'a/b/c/d/2.css'
                ]
            },
            res = c.footprint('shuffleToRulesets', datain);

        test.expect(1);
        test.equal(exp, res);
        test.done();
    }
};
