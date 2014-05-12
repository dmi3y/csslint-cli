'use strict';

var
    h = require('../lib/nfsu.js'),
    u = require('../lib/utils.js'),
    c = require('./common')(h);



exports.rc = {
    'lookdownFiles': function(test) {
        var
            exp1 = {
                '.css': [
                    u.resolve('test/assets/a/a.css'),
                    u.resolve('test/assets/a/b/b.css'),
                    u.resolve('test/assets/a/b/c/d/d.css'),
                    u.resolve('test/assets/x/x.css'),
                    u.resolve('test/assets/x/y/z.css')
                ],
                '.csslintrc': [
                    u.resolve('test/assets/a/.csslintrc')
                ]
            },
            res1 = h.lookdownFiles(['test/'], ['.csslintrc', '.css']),
            exp2 = {
                '.css': [
                    u.resolve('test/assets/x/x.css')
                ],
                '.csslintrc': []
            },
            res2 = h.lookdownFiles(['test/'], ['.csslintrc', '.css'], {excl:['test/assets/a', 'test/assets/x/y/z.css']}),
            exp3 = {
                '.css': [
                    u.resolve('test/assets/x/x.css'),
                    u.resolve('test/assets/x/y/z.css')
                ]
            },
            res3 = h.lookdownFiles(['x/'], ['.css'], {base:'test/assets/'});

        test.expect(3);
        test.deepEqual(exp1, res1);
        test.deepEqual(exp2, res2);
        test.deepEqual(exp3, res3);
        test.done();
    },
    'lookupFile': function(test) {
        var
            exp1 = u.resolve('test/assets/a/.csslintrc'),
            res1 = h.lookupFile('.csslintrc', u.resolve('test/assets/a/b/c/d')),
            exp2 = u.resolve('package.json'),
            res2 = h.lookupFile('package.json'),
            exp3 = null,
            res3 = h.lookupFile('_some_bizzar_filename-YOLO_HARDLY-ever-to_EXIST_');

        test.expect(3);
        test.equal(exp1, res1);
        test.equal(exp2, res2);
        test.equal(exp3, res3);
        test.done();
    }
};
