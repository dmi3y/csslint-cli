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
    legacy = require('../lib/legacy'),
    printer = require('../lib/printer'),
    csslint = require('csslint').CSSLint,

    csslintRules,
    optionsCli,
    optionsDefault;

function checkCli(optionsCli, targets) {

    if ( optionsCli.help ) {
        printer.help();
        process.exit();
    } else if ( optionsCli.version ) {
        printer.version(csslint.version, '0.0.0');
        process.exit();
    } else if ( optionsCli['list-rules'] ) {
        csslintRules = csslint.getRules();
        printer.rules( csslintRules );
        process.exit();
    } else if ( !targets ) {
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

function readySteadyGo (rulesets) {
    var
        len,
        base,
        i,
        block,
        files,
        options,
        input,
        optionsFromCli = optionsHelper.cherryPick(optionsCli, 'main');

    for (base in rulesets) {
        if ( rulesets.hasOwnProperty(base) ) {
            block = rulesets[base];

            files = block.files;
            options = block.rules;
            u.merge(options, optionsFromCli);
            options = optionsHelper.optionsToExplicitRulesets(options);

            options = u.merge(optionsDefault, options);

            len = files.length;

            for (i = 0; i < len; i += 1) {

                input = fu.readFileStr(files[i]);
                optionsCli.file = files[i].replace(process.cwd(), '');
                optionsCli.fullPath = files[i];

                legacy.report(input, csslint, options, optionsCli);
            }

        }
    }
}

function init(args) {
    var

        parsedCliObj,
        targets,
        workset,
        excl,
        rulesets = {},
        shuffledObj,
        rcfiles,
        cssfiles,
        scope,
        directOptionsFile;

    parsedCliObj = optionsHelper.parseCli(args);

    optionsCli = v.validateCli(parsedCliObj.options);
    targets = parsedCliObj.targets;

    checkCli(optionsCli, targets);

    directOptionsFile = optionsCli.config;

    scope = ['.css'];
    if ( !directOptionsFile ) {
        scope.push('.csslintrc');
    }

    excl = optionsCli['exclude-list'] || [];
    workset = fu.lookdownFilesByExts(targets, scope, {excl: excl});

    cssfiles = workset['.css']; // pre validate css?
    
    if ( directOptionsFile ) {

        rulesets[process.cwd()] = {
            files: cssfiles,
            rules: v.validateRc(directOptionsFile)
        };

    } else {

        rcfiles = v.validateRcs(workset['.csslintrc']);
        shuffledObj = rc.shuffleToRulesets(rcfiles, cssfiles);
        rulesets = shuffledObj.files? u.merge(shuffledObj.rulesets, rc.sortTheRest(shuffledObj.files, '.csslintrc')): shuffledObj.rulesets;
    }

    optionsDefault = setDefaultOptions(optionsCli.threshold);

    readySteadyGo(rulesets);

    process.exit();
}

module.exports = {
    init: init,
    version: '0.0.0'
};
