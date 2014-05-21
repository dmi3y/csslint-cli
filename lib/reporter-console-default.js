/*
 * csslint-cli
 * user/repo
 *
 * Copyright (c) 2014 Dmitry Lapshukov
 * Licensed under the MIT license.
 */

'use strict';

var
    pr = require('./printer');

module.exports = function(result, file/*, options*/) {
    var
        msgLen = result.messages.length,
        msg,
        coord,
        pad = 10,
        padding = [],
        out = [];

    result.messages.sort(function(a, b){
        return a.line <= b.line && a.col <= b.col;
    });

    out.push('');

    if ( msgLen ) {

        out.push(pr.emph(file.path + ': ') +  msgLen + ' issues:');
        out.push('|');

    } else if ( file.isEmpty ) {
        out.push(pr.warning(file.path + ' - is empty.'));
    } else {
        out.push(pr.ok(file.path));
    }

    for( ;msgLen; ) {

        msg = result.messages[--msgLen];
        coord = 'L' + msg.line + ':C' + msg.col;
        padding.length = (pad - coord.length);
        out.push(pr[msg.type](msg.message, '|--'));
        out.push('|');
        out.push('|  ' + coord + '      ' + msg.evidence);
        out.push('|');

    }

    pr.log(out.join('\n'));
};
