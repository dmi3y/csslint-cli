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
    fs = require('fs');

function pluckByType(messages, type){
    return messages.filter(function(message) {
        return message.type === type;
    });
}

function log(str) {
    fs.writeSync(1, str);
}

module.exports = function(result, file, options) {
    var
        formatter = csslint.getFormatter(options.format || 'text'),
        messages = result.messages || [],
        output,
        sig = 0;


    if (file.isEmpty) {

        if (formatter.readError) {
            log(formatter.readError(file.path, "Could not read file data. Is the file empty?"));
        } else {
            log("csslint: Could not read file data in " + file.path + ". Is the file empty?");
        }
        sig = 1;

    } else {

        output = formatter.formatResults(result, file.path, options);
        if (output){
            log(output + '\n');
        }
        if (messages.length > 0 && pluckByType(messages, "error").length > 0) {
            sig = 1;
        }
    }

    return sig;
};
