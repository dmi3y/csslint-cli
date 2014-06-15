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
    rc = require('../lib/rc'),
    v = require('../lib/validators'),
    fu = require('nfsu'),
    u = require('../lib/utils'),

    csslint = require('csslint').CSSLint,

    optionsCli,
    csslintCli,
    reporter;

function setDefaultOptions(threshold) {

    var
        out = {},
        defaultThreshold = typeof threshold !== 'undefined'? helper.optionsToExplicitRulesets({t:threshold}).t: 1;

    if ( defaultThreshold ) {

        u.transform(csslint.getRules(), function(res, it){

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

            reporter = require(reporter);
        } else {
            reporter = null;
        }

    return reporter;
}

function makeReport(files, rules) {
    var
        len,
        i,
        input,
        result,
        isEmpty,
        file = {},
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
        rulesCli = helper.cherryPick(optionsCli, 'main'),
        rulesDefault = setDefaultOptions(optionsCli.threshold);

    for (base in rulesets) {
        if ( rulesets.hasOwnProperty(base) ) {
            block = rulesets[base];

            files = block.files;

            rules = block.rules;
            rules = helper.mixup(rules, rulesCli, optionsCli.squash);
            rules = u.merge(rulesDefault, rules);

            makeReport(files, rules);

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

function checkParameters(options, targets) {
    var
        unknownOptions,
        out = {
            ancillary: {}
        },
        targetsLen = targets.length;

    unknownOptions = v.validateCli(options);

    if( unknownOptions ) {

        out.unknownOptions = unknownOptions;
        out.exit = 1;
    } else if ( options.help ) {

        out.help = options.help;
        out.exit = 0;
    } else if ( options.version ) {

        out.version = options.version;
        out.exit = 0;
    } else if ( options['list-rules'] ) {

        out['list-rules'] = options['list-rules'];
        out.exit = 0;
    } else if ( !targetsLen ) {

        out.noTargets = true;
        out.exit = 1;
    } else {

        for ( ;targetsLen--; ) {

            if ( !fu.f.existsSync(targets[targetsLen]) ) {

                out.targetNotExists = targets[targetsLen];
                out.exit = 1;
                break;
            }
        }

    }

    return out;
}

function init(options, targets) {
    var
        preflight,
        out;

    preflight = checkParameters(options, targets);
    optionsCli = options;
    reporter = getReporter(options.reporter);

    if ( preflight.hasOwnProperty('exit') ) {

        out = preflight.exit;
        delete preflight.exit;
        reporter(preflight);
    } else {

        startReports(getRulesets(targets));
    }

    process.exit(out || 0);
}


csslintCli = {
    init: init,
    version: '<%- @VERSION %>'
};

module.exports = csslintCli;
