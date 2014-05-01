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
    optionsHelper = require('./options-helper'),
    printer = require('./printer'),
    parsedCliObj,
    unknownOptions,
    csslintrcName = '.csslintrc',
    csslintrc,
    sig = 0,
    cliversion = '<%- @VERSION %>';

parsedCliObj = optionsHelper.parseCli(process.argv.slice(2));
unknownOptions = optionsHelper.filterUnknown(parsedCliObj.options);

if ( unknownOptions ) {

    printer.unknown(unknownOptions);
    sig = 1;

} else if ( parsedCliObj.options.help ) {

    printer.help();

} else if ( parsedCliObj.options.version ) {

    printer.version(csslint.version, cliversion);

} else if ( parsedCliObj.options['list-rules'] ) {

    printer.rules( csslintRules );

} else if ( !parsedCliObj.files ) {

    printer.noTarget();
    sig = 1;

} else {

    csslintrc = optionsHelper.lookup(csslintrcName);

}

    process.exit(sig);
