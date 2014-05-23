/*
 * csslint-cli
 * user/repo
 *
 * Copyright (c) 2014 Dmitry Lapshukov
 * Licensed under the MIT license.
 */

'use strict';

var
    optionsHelper = require('../lib/helper'),
    rc = require('../lib/rc'),
    v = require('../lib/validators'),
    fu = require('nfsu'),
    u = require('../lib/utils'),
    printer = require('../lib/printer'),
    csslint = require('csslint').CSSLint,

    csslintRules,
    optionsCli;

function checkParameters(options, targets) {
    var
        unknownOptions;

    unknownOptions = v.validateCli(options);
    if( unknownOptions ) {
        printer.unknown(unknownOptions);
        process.exit(1);
    }

    if ( options.help ) {
        
        printer.help();
        process.exit();
    } else if ( options.version ) {

        printer.version(csslint.version, '0.0.0');
        process.exit();
    } else if ( options['list-rules'] ) {

        csslintRules = csslint.getRules();
        printer.rules( csslintRules );
        process.exit();
    } else if ( !targets.length ) {

        printer.noTargets();
        process.exit(1);
    }
}

function setDefaultOptions(threshold) {

    var
        out = {},
        defaultThreshold = typeof threshold !== 'undefined'? optionsHelper.optionsToExplicitRulesets({t:threshold}).t: 1;

    if ( defaultThreshold ) {

        csslintRules = csslint.getRules();
        u.transform(csslintRules, function(res, it){
            res[it.id] = defaultThreshold;
        }, out);
    }

    return out;
}

function getReporter( reporter ) {

        if ( !reporter ) {

            reporter = require('../reporter/reporter-console-default');
        } else if ( typeof reporter === 'function' ) {

            reporter = reporter;
        } else if ( typeof reporter === 'string' ) {

            reporter = require(fu.p.resolve(reporter));
        } else {
            reporter = null;
        }

    return reporter;
}

function fileReport(files, rules) {
    var
        len,
        i,
        input,
        result,
        isEmpty,
        file = {},
        reporter = getReporter(optionsCli.reporter),
        out = {};

    len = files.length;

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


        out[file.path] = reporter(result, file, optionsCli);
    }
    return out;
}

function startReports(rulesets) {
    var
        base,
        block,
        files,
        rules,
        rulesCli = optionsHelper.cherryPick(optionsCli, 'main'),
        rulesDefault = setDefaultOptions(optionsCli.threshold);

    for (base in rulesets) {
        if ( rulesets.hasOwnProperty(base) ) {
            block = rulesets[base];

            files = block.files;

            rules = block.rules;
            rules = optionsHelper.mixup(rules, rulesCli, optionsCli.squash);
            rules = u.merge(rulesDefault, rules);

            fileReport(files, rules);

        }
    }
}

function getRulesets(targets) {
    var
        directOptionsFile,
        scope,
        workset,
        excl,
        rulesets = {},
        shuffledObj,
        rcrules,
        cssfiles;

    scope = ['.css'];
    directOptionsFile = optionsCli.config;
    if ( !directOptionsFile ) {
        scope.push('.csslintrc');
    }

    excl = (optionsCli['exclude-list'] || '').split(',');
    workset = fu.lookdownFilesByExts(targets, scope, {excl: excl});

    cssfiles = workset['.css']; // pre validate css?

    if ( directOptionsFile ) {

        rulesets[process.cwd()] = {
            files: cssfiles,
            rules: v.validateRc(directOptionsFile)
        };

    } else {

        rcrules = v.validateRcs(workset['.csslintrc']);
        shuffledObj = rc.shuffleToRulesets(rcrules, cssfiles);
        rulesets = shuffledObj.files? u.merge(shuffledObj.rulesets, rc.sortTheRest(shuffledObj.files, '.csslintrc')): shuffledObj.rulesets;
    }

    return rulesets;
}
 
function init(options, targets) {


    checkParameters(options, targets);

    optionsCli = options;

    startReports(getRulesets(targets));

    process.exit();
}

module.exports = {
    init: init,
    version: '0.0.0'
};
