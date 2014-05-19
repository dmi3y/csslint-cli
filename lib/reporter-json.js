/*
 * csslint-cli
 * user/repo
 *
 * Copyright (c) 2014 Dmitry Lapshukov
 * Licensed under the MIT license.
 */

'use strict';

var
    fs = require('fs');

fs.writeFileSync('./reporter.json', '');

module.exports = function(result, file, options) {
    result.file = file;
    result.options = options;
    fs.appendFileSync('./reporter.json', JSON.stringify(result));
};
