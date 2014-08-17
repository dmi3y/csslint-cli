'use strict';

var
    csslintCli = require('../src/csslint-cli'),
    nfsu = require('nfsu');

function checkReport(data) {
    var
        report = nfsu.readFileJson('./report.json'),
        key,
        value,
        result;

    for( key in data ) {
        if ( data.hasOwnProperty(key) ) {
            value = data[key];
            result = false;

            if ( report.hasOwnProperty(key) ) {
                result = (JSON.stringify(report[key]) === JSON.stringify(data[key]));

            }

            if ( !result ) {
                break;
            }

        }
    }

    return result;

}

function comparePaths(a, b) {
    var
        an = a.replace(/[\/\\\.]/g, ''),
        bn = b.replace(/[\/\\\.]/g, '');

    console.log(an,bn);

    return an === bn;

}

exports.csslintCli_functionalTest = {
    'tearDown': function(callback) {

        nfsu.fs.unlink('./report.json', callback);
    },

    'noTargets': function(test) {

        csslintCli.init({
                reporter: '../reporter/reporter-json.js'
            },
            [],
            function(exit) {

                test.expect(1);
                test.ok(checkReport({
                    noTargets: true,
                    exit: exit
                }));
                test.done();
            }
        );

    },

    'targetDoNotExist': function(test) {
        csslintCli.init({
                reporter: '../reporter/reporter-json.js'
            },
            ['./test/assets/donotexist'],
            function(exit) {

                test.expect(1);
                test.ok(checkReport({
                    targetNotExists: './test/assets/donotexist',
                    exit: exit
                }));
                test.done();
            }
        );
    },

    'unknownOptions': function(test) {
        csslintCli.init({
                reporter: '../reporter/reporter-json.js',
                invalid: 'option'
            },
            ['./test/assets/donotexist'],
            function(exit) {

                test.expect(1);
                test.ok(checkReport({
                    unknownOptions: ["invalid"],
                    exit: exit
                }));
                test.done();
            }
        );
    },

    'help': function(test) {
        csslintCli.init({
                reporter: '../reporter/reporter-json.js',
                help: 'topic'
            },
            ['./test/assets/donotexist'],
            function(exit) {

                test.expect(1);
                test.ok(checkReport({
                    help: 'topic',
                    exit: exit
                }));
                test.done();
            }
        );
    },

    'version': function(test) {
        csslintCli.init({
                reporter: '../reporter/reporter-json.js',
                version: true
            },
            ['./test/assets/donotexist'],
            function(exit) {

                test.expect(1);
                test.ok(checkReport({
                    version: csslintCli.version,
                    exit: exit
                }));
                test.done();
            }
        );
    },

    'list-rules': function(test) {
        csslintCli.init({
                reporter: '../reporter/reporter-json.js',
                'list-rules': 'ids'
            },
            ['./test/assets/donotexist'],
            function(exit) {

                test.expect(1);
                test.ok(checkReport({
                    'list-rules': 'ids',
                    exit: exit
                }));
                test.done();
            }
        );
    },

    './test/assets/a/a.css': function(test) {
        csslintCli.init({
                reporter: '../reporter/reporter-json.js'
            },
            ['./test/assets/a/a.css'],
            function() {
                var
                    report = nfsu.readFileJson('./report.json');

                test.expect(3);
                test.ok(comparePaths(report.file.path, './test/assets/a/a.css'));
                test.ok(!report.file.isEmpty);
                test.equal(report.messages.length, 2);
                test.done();
            }
        );
    }
};
