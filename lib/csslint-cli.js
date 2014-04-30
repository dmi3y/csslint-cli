/*
 * csslint-cli
 * user/repo
 *
 * Copyright (c) 2014 Dmitry Lapshukov
 * Licensed under the MIT license.
 */

'use strict';

var
    optionsHelper = require('./options-cli'),
    printer = require('./printer'),
    parsedCliObj,
    unknown,
    unknownLen,
    i;


parsedCliObj = optionsHelper.parseCli(process.argv.slice(2));

unknown = optionsHelper.filterUnknown(parsedCliObj.options);

if ( unknown ) {
    printer.unknown(unknown);
    process.exit(1);
}

if ( parsedCliObj.options.help ) {
    printer.help();
    process.exit(0);
} else if ( parsedCliObj.options.version ) {
    printer.version();
    process.exit(0);
}