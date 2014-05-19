/*
 * csslint-cli
 * user/repo
 *
 * Copyright (c) 2014 Dmitry Lapshukov
 * Licensed under the MIT license.
 */

'use strict';

var
    // printer = require('./printer'),
    fs = require('fs');

fs.writeFileSync('./reporter.json', '');

module.exports = function(result/*, file, options*/) {
    fs.appendFileSync('./reporter.json', JSON.stringify(result));
};