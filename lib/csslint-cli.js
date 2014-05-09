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
    u = require('./utils'),

    parsedCliObj,
    unknownOptions,
    optionsCli,
    targets,
    workset,
    len,
    base,
    i,
    result,
    formatter,
    block,
    files,
    rulesets = {},
    options,
    input,
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
        options = block.rules;
        u.merge(options, optionsCli);
        options = optionsHelper.optionsToExplicitRulesets(options);
        
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

            formatter = csslint.getFormatter(optionsCli.format || "text");

            rc.processFile(
                result,
                formatter,
                optionsCli
            );
        }

    }
}

process.exit();
