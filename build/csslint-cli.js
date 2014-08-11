/*
 * csslint-cli
 * user/repo
 *
 * Copyright (c) 2014 Dmitry Lapshukov
 * Licensed under the MIT license.
 */

'use strict';
var
    rc = require('../lib/rc'),
    v = require('../lib/validators'),
    fu = require('nfsu'),
    u = require('../lib/utils'),

    csslintCli;

function getRulesets(options, targets) {
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
    directOptionsFile = options.config;
    if ( !directOptionsFile ) {
        scope.push('.csslintrc');
    }

    excl = (options['exclude-list'] || '').split(',');
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
        out = {},
        targetsLen =  targets.length;

    unknownOptions = v.validateCli(options);

    if( unknownOptions ) {

        out.unknownOptions = unknownOptions;
        out.exit = 1;
    } else if ( options.help ) {

        out.help = options.help;
        out.exit = 0;
    } else if ( options.version ) {

        out.version = csslintCli.version;
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

function init(options, targets, done) {
    var
        check,
        out,
        reporter = require('../lib/reporter');

    check = checkParameters(options, targets);

    if ( check.hasOwnProperty('exit') ) {

        out = check.exit;
        reporter.makeServiceReport(check, options);
    } else {

        reporter.startReports(getRulesets(options, targets), options);
    }

    if ( typeof done === 'function' ) {

        done.call(undefined, out || 0);
    }
}


csslintCli = {
    init: init,
    version: '0.0.0'
};

module.exports = csslintCli;
