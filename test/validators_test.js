'use strict';

var
    v = require('../lib/validators');

exports.validators = {
    'validateRcs': function(test) {
        var
            base = 'test/assets',
            exp1 = [
                {
                    base:base,
                    options:{ids:0,'zero-units':0},
                    ord:2
                },
                {
                    base:base,
                    options:{ids:0,'zero-units':0},
                    ord:1
                },
                {
                    base:base,
                    options:{ids:0,'zero-units':0},
                    ord:0
                }

            ],
            res1 = v.validateRcs(['test/assets/.csslintjson','test/assets/.csslintblock','test/assets/.csslintorig']);

        test.expect(1);
        test.deepEqual(res1, exp1);
        test.done();
    },

    'validateCli': function(test) {
        var
            exp1 =  null,
            base = {
                "ignore":1,
                "warnings":1,
                "errors":1,
                "help":1,
                "version":1,
                "list-rules":1,
                "format":1,
                "quiet":1,
                "exclude-list":1,
                "config":1,
                "squash":1,
                "threshold":1
            },
            res1 = v.validateCli(base),
            exp2 = ['dumdum'],
            res2;

        base.dumdum = 'rrrrr';
        res2 = v.validateCli(base);

        test.expect(2);
        test.deepEqual(res1, exp1);
        test.deepEqual(res2, exp2);
        test.done();
    },

    'checkParameters': function(test) {
        var
            options,
            targets,
            exp,
            res;

        test.expect(7);
    
        options =  {};
        targets = ['test/assets/'];
        exp = {};
        res = v.checkParameters(options, targets);
        test.deepEqual(res, exp);   

        options =  {'dumdum':'ahaha'};
        targets = [];
        exp = {exit:1, unknownOptions:['dumdum']};
        res = v.checkParameters(options, targets);
        test.deepEqual(res, exp);     

        options =  {help:'squash'};
        targets = [];
        exp = {exit:0, help:'squash'};
        res = v.checkParameters(options, targets);
        test.deepEqual(res, exp);   

        options =  {version:true};
        targets = [];
        exp = {exit:0, version:true};
        res = v.checkParameters(options, targets);
        test.deepEqual(res, exp);   

        options =  {'list-rules':'ids'};
        targets = [];
        exp = {exit:0, 'list-rules':'ids'};
        res = v.checkParameters(options, targets);
        test.deepEqual(res, exp);   

        options =  {};
        targets = [];
        exp = {exit:1, noTargets:true};
        res = v.checkParameters(options, targets);
        test.deepEqual(res, exp);  

        options =  {};
        targets = ['test/donotexist'];
        exp = {exit:1, targetNotExists:'test/donotexist'};
        res = v.checkParameters(options, targets);
        test.deepEqual(res, exp);

        test.done();
    }
};
