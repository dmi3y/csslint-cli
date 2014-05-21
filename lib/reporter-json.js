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

fs.writeFileSync('./report.json', '');

module.exports = function(result, file, options) {
    result.file = file;
    result.options = options;
    fs.appendFileSync('./report.json', JSON.stringify(result));
};
