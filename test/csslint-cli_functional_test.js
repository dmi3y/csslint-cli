'use strict';

var
    csslintCli = require('../build/csslint-cli'),
    nfsu = require('nfsu');

function checkReport(data) {
    var
        report = nfsu.readFileJson('./report.json'),
        key,
        value,
        result = false;

    for( key in data ) {
        if ( data.hasOwnProperty(key) ) {
            value = data[key];

            if ( report.hasOwnProperty(key) ) {

                result = report[key] === data[key];

                if ( !result ) {
                    break;
                }
            }

        }
    }

    return result;

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

    './test/assets/a/a.css': function(test) {
        csslintCli.init({
                reporter: '../reporter/reporter-json.js'
            },
            ['./test/assets/a/a.css'],
            function() {
                var
                    report = nfsu.readFileJson('./report.json');

                test.expect(3);
                test.equal(nfsu.path.normalize(report.file.path), nfsu.path.normalize('.\\test\\assets\\a\\a.css'));
                test.ok(!report.file.isEmpty);
                test.equal(report.messages.length, 2);
                test.done();
            }
        );
    }
};
