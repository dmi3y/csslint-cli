/*
 * csslint-cli
 * user/repo
 *
 * Copyright (c) 2014 Dmitry Lapshukov
 * Licensed under the MIT license.
 */

'use strict';

var
    pr = require('../lib/printer'),
    ck = require('chalk');

module.exports = function(result, file/*, options*/) {
    var
        msgLen = result.messages.length,
        msg,
        coord,
        out = [],
        type = {},
        color,
        i;

    result.messages.sort(function(a, b){
        return a.line >= b.line && a.col >= b.col;
    });


    for(i = 0; i < msgLen; i += 1) {

        msg = result.messages[i];
        coord = ck.gray('L') + ck.bold(msg.line) + ck.gray(':C') + ck.bold(msg.col);
        out.push('|   ' + pr[msg.type](msg.message));
        out.push('|   ' + coord + ck.gray(' . . . ') + ck.bold(msg.evidence.trim()));
        // out.push('|    |');
        out.push('|');
        type[msg.type] = '';

    }

    if ( msgLen ) {

        color = type.hasOwnProperty('error')? 'red': 'yellow';

        out.unshift('|');
        out.unshift('+-' + ck[color].bold(file.path + ': ') +  msgLen + ' issues:');
        out.unshift('');
        out.push('+-' + ck[color].bold(file.path));

    } else if ( file.isEmpty ) {
        out.push(pr.warning(file.path + ' - is empty.'));
    } else {
        out.push(pr.ok(file.path));
    }
    out.push('');

    pr.log(out.join('\n'));
};
