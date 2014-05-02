/*
 * csslint-cli
 * user/repo
 *
 * Copyright (c) 2014 Dmitry Lapshukov
 * Licensed under the MIT license.
 */

'use strict';

var
    _ = require('lodash'),
    csslint = require('csslint').CSSLint,
    csslintRules = csslint.getRules(),
    optionsHelper = require('./options-helper'),
    printer = require('./printer'),

    parsedCliObj,
    unknownOptions,
    optionsCli,
    optionsRc,
    rulesets = [],
    targets,
    cliversion = '<%- @VERSION %>';

function checkExternalRc() {
    var
        csslintrcName = '.csslintrc',
        externalRc,
        out = {};

    externalRc = optionsHelper.lookup(csslintrcName);

    if ( externalRc ) {
        out = optionsHelper.externalRcOptions(externalRc);
        unknownOptions = optionsHelper.filterUnknown(out, 'cliAndRc');

        if ( unknownOptions ) {
            printer.path([externalRc], '\nConfiguration file error:\n');
            printer.unknown(unknownOptions);
            process.exit(1);
        }
    }
    return out;
}


parsedCliObj = optionsHelper.parseCli(process.argv.slice(2));

optionsCli = parsedCliObj.options;
targets = parsedCliObj.targets;

parsedCliObj = null;

unknownOptions = optionsHelper.filterUnknown(optionsCli);

if ( unknownOptions ) {

    printer.unknown(unknownOptions);
    process.exit(1);
} else if ( optionsCli.help ) {

    printer.help();
    process.exit();
} else if ( optionsCli.version ) {

    printer.version(csslint.version, cliversion);
    process.exit();
} else if ( optionsCli['list-rules'] ) {

    printer.rules( csslintRules );
    process.exit();
} else if ( !targets ) {

    printer.noTargets();
    process.exit(1);
}


optionsRc = checkExternalRc();

rulesets.push(optionsHelper.optionsToExplicitRulesets(_.assign(optionsCli, optionsRc)));

process.exit();
