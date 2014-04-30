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
    csslintRules = csslint.getRules,
    optionsHelper = require('./options-cli'),
    printer = require('./printer'),
    parsedCliObj,
    unknowns;

parsedCliObj = optionsHelper.parseCli(process.argv.slice(2));

unknowns = optionsHelper.filterUnknown(parsedCliObj.options);
if ( unknowns ) {

    printer.unknown(unknowns);
    process.exit(1);
}

if ( parsedCliObj.options.help ) {

    printer.help();
    process.exit(0);
} else if ( parsedCliObj.options.version ) {

    printer.version(csslint.version);
    process.exit(0);
} else if ( parsedCliObj.options['list-rules'] ) {

    printer.rules( csslintRules );
    process.exit(0);
}


