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
    fu = require('../lib/nfsu'),
    u = require('../lib/utils'),
    legacy = require('../lib/legacy'),
    printer = require('../lib/printer'),
    csslint = require('csslint').CSSLint,

    csslintRules,
    optionsCli,
    optionsDefault = {},
    defaultThreshold = 1; // manifest.main.warnings.default

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

function setDefaultOptions() {

    if ( defaultThreshold ) {

        csslintRules = csslint.getRules();
        u.transform(csslintRules, function(res, it){
            res[it.id] = defaultThreshold;
        }, optionsDefault);
    }
}

function readySteadyGo (rulesets) {
    var
        len,
        base,
        i,
        result,
        block,
        files,
        options,
        input,
        optionsFromCli = optionsHelper.filterKnown(optionsCli, 'main');

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

                input = u.readFile(files[i]);
                optionsCli.file = files[i].replace(process.cwd(), '');
                optionsCli.fullPath = files[i];

                if ( input ) {
                    result = csslint.verify(input, u.clone(options));
                } else {
                    optionsCli.isEmpty = true;
                }

                legacy.processFile(
                    result,
                    csslint.getFormatter(optionsCli.format || "text"),
                    optionsCli
                );
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
        cssfiles;

    parsedCliObj = optionsHelper.parseCli(args);

    optionsCli = rc.validateCli(parsedCliObj.options);
    targets = parsedCliObj.targets;
    parsedCliObj = null;

    checkCli(optionsCli, targets);

    excl = optionsCli['exclude-list'] || [];
    workset = fu.lookdownFiles(targets, ['.csslintrc', '.css'], {excl: excl});

    rcfiles = rc.validateRcs(workset['.csslintrc']);
    cssfiles = workset['.css']; // pre validate css?
    workset = null;

    shuffledObj = rc.shuffleToRulesets(rcfiles, cssfiles);

    rulesets = u.merge(shuffledObj.rulesets, rc.sortTheRest(shuffledObj.files));

    setDefaultOptions();


    readySteadyGo(rulesets);

    process.exit();
}

module.exports = {
    init: init,
    version: '0.0.0'
};
