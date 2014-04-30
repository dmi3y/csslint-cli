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
    unknowns,
    sig = 0,
    cliversion = '<%- @VERSION %>';

parsedCliObj = optionsHelper.parseCli(process.argv.slice(2));
unknowns = optionsHelper.filterUnknown(parsedCliObj.options);

if ( unknowns ) {

    printer.unknown(unknowns);
    sig = 1;

} else if ( parsedCliObj.options.help ) {

    printer.help();

} else if ( parsedCliObj.options.version ) {

    printer.version(csslint.version, cliversion);

} else if ( parsedCliObj.options['list-rules'] ) {

    printer.rules( csslintRules );

} else if ( !parsedCliObj.files ) {

    printer.notarget();
    sig = 1;

} else {



}

    process.exit(sig);
