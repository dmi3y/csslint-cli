/*
 * csslint-cli
 * user/repo
 *
 * Copyright (c) 2014 Dmitry Lapshukov
 * Licensed under the MIT license.
 */

'use strict';

var
    helper = require('../lib/helper'),
    fu = require('nfsu'),
    u = require('../lib/utils'),

    csslint = require('csslint').CSSLint,
    rules = csslint.getRules(),

    r;


function setDefaultOptions(threshold) {

    var
        out = {},
        defaultThreshold = typeof threshold !== 'undefined'? helper.optionsToExplicitRulesets({t:threshold}).t: 1;

    if ( defaultThreshold ) {

        u.transform(rules, function(res, it){

            res[it.id] = defaultThreshold;
        }, out);
    }

    return out;
}

r = {

    setReporter: function( reporter ) {


            if ( !reporter ) {

                reporter = require('../reporter/reporter-console-default');
            } else if ( typeof reporter === 'string' ) {

                reporter = require(reporter);
            }
            return reporter;
    },

    makeServiceReport: function(check, options) {
        var
            serviceReporter,
            native,
            reporter = r.setReporter(options.reporter);

            if ( !reporter.hasOwnProperty('serviceReporter') ) {

                native = require('../reporter/reporter-console-default');
                serviceReporter = native.serviceReporter;
            } else {

                serviceReporter = reporter.serviceReporter;
            }
            serviceReporter(check, options, rules);
    },

    makeReport: function(files, rules, options) {
        var
            len,
            i,
            input,
            result,
            isEmpty,
            file = {},
            out = {},
            reporter;

        len = files.length;
        reporter = r.setReporter(options.reporter);

        for (i = 0; i < len; i += 1) {

            input = fu.readFileStr(files[i]);

            if ( input ) {
                result = csslint.verify(input, u.clone(rules));
                isEmpty = false;
            } else {
                isEmpty = true;
            }

            file.path = files[i].replace(process.cwd(), '.');
            file.fullPath = files[i];
            file.isEmpty = isEmpty;


            out[file.path] = reporter(result, file, options);
        }
        return out;
    },

    startReports: function(rulesets, options) {
        var
            base,
            block,
            files,
            rules,
            rulesCli = helper.cherryPick(options, 'main'),
            rulesDefault = setDefaultOptions(options.threshold);

        for (base in rulesets) {

            if ( rulesets.hasOwnProperty(base) ) {

                block = rulesets[base];

                files = block.files;

                rules = block.rules;
                rules = helper.mixup(rules, rulesCli, options.squash);
                rules = u.merge(rulesDefault, rules);

                r.makeReport(files, rules, options);

            }
        }
    }
};


module.exports = r;
