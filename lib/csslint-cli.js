/*
 * csslint-cli
 * user/repo
 *
 * Copyright (c) 2014 Dmitry Lapshukov
 * Licensed under the MIT license.
 */

'use strict';

var
    csslint = require('csslint').CSSLint,
    csslintRules = csslint.getRules(),
    optionsHelper = require('./helper'),
    printer = require('./printer'),
    rc = require('./rc'),

    parsedCliObj,
    unknownOptions,
    optionsCli,
    targets,
    workset,
    len,
    base,
    i,
    block,
    files,
    rulesets = {},
    cliversion = '<%- @VERSION %>';

parsedCliObj = optionsHelper.parseCli(process.argv.slice(2));

optionsCli = parsedCliObj.options;
targets = parsedCliObj.targets;
parsedCliObj = null;

unknownOptions = optionsHelper.filterUnknown(optionsCli);
if ( unknownOptions ) {
    printer.unknown(unknownOptions);
    process.exit(1);
}

if ( optionsCli.help ) {
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

workset = rc.lookdownFiles(targets, ['.csslintrc', '.css']);
rulesets = rc.shuffleToRulesets(workset);

for (base in rulesets) {
    if ( rulesets.hasOwnProperty(base) ) {
        block = rulesets[base];

        files = block.files;
        len = files.length;

        for (i = 0; i < len; i += 1) {
            rc.processFile(
                files[i],
                optionsHelper.optionsToExplicitRulesets(block.rules),
                csslint
            );
        }

    }
}

process.exit();
