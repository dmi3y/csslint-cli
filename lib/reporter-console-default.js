/*
 * csslint-cli
 * user/repo
 *
 * Copyright (c) 2014 Dmitry Lapshukov
 * Licensed under the MIT license.
 */

'use strict';

var
    printer = require('./printer');

module.exports = function(result, file, options) {
    var
        msgLen = result.messages.length,
        msg;

    result.messages.sort(function(a, b){
        return a.line <= b.line && a.col <= b.col;
    });

    if ( msgLen ) {

        printer.emph(file.path, msgLen + ' issues:');

    } else {
        printer.ok(file.path);
    }

    for( ;msgLen; ) {

        msg = result.messages[--msgLen];
        printer[msg.type](msg.message, msg.line, msg.col);

    }
    printer.log('');
};
