/*
 * csslint-cli
 * user/repo
 *
 * Copyright (c) 2014 Dmitry Lapshukov
 * Licensed under the MIT license.
 */

'use strict';

var legacy = {

    processFile: function(result, formatter, options) {
        var

            messages = result.messages || [],
            output;

        function pluckByType(messages, type){
            return messages.filter(function(message) {
                return message.type === type;
            });
        }

        if (options.isEmpty) {
            if (formatter.readError) {
                console.log(formatter.readError(options.file, "Could not read file data. Is the file empty?"));
            } else {
                console.log("csslint: Could not read file data in " + options.file + ". Is the file empty?");
            }
            process.exit(1);
        } else {
            output = formatter.formatResults(result, options.file, options);
            if (output){
                console.log(output);
            }

            if (messages.length > 0 && pluckByType(messages, "error").length > 0) {
                process.exit(1);
            }
        }
    }
};

module.exports = legacy;
