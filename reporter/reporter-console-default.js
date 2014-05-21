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

module.exports = function(result, file, options) {
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


    // out.push('');

    for(i = 0; i < msgLen; i += 1) {

        msg = result.messages[i];
        if ( !msg.rollup ) {

            coord = ck.gray('L') + ck.bold.yellow(msg.line) + ck.gray(':C') + ck.bold.yellow(msg.col);
            out.push('|   ' + coord + ck.gray(' . . . ') + ck.bold.magenta(msg.evidence.trim()));
        }
        out.push('|   ' + pr[msg.type](msg.message) + ck.gray('(' + msg.rule.id + ')'));
        // out.push('|    |');
        out.push('|');
        type[msg.type] = '';

    }

    if ( msgLen ) {

        color = type.hasOwnProperty('error')? 'red': 'yellow';

        out.unshift('|');
        out.unshift('+-' + ck[color].bold(file.path + ': ') +  msgLen + ' issue(s):');
        out.push('+-' + ck[color].bold(file.path));
        out.push('');

    } else if ( file.isEmpty ) {
        out.push(pr.warning(file.path + ' - is empty.\n'));
    } else if ( !options.quiet ) {
        out.push(pr.ok(file.path) + '\n');
    }

    if ( out.length ) {
        pr.log(out.join('\n'));
    }
};
