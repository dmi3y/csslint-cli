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

 function reporterJson(result, file, options) {
    result.file = file;
    result.options = options;
    fs.appendFileSync('./report.json', JSON.stringify(result));
}

reporterJson.serviceReporter = reporterJson;

module.exports = reporterJson;
