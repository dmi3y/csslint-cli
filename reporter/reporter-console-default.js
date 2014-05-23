/*
 * csslint-cli
 * user/repo
 *
 * Copyright (c) 2014 Dmitry Lapshukov
 * Licensed under the MIT license.
 */

'use strict';

var
    out = [],
    lpush = out.push,
    lunshift = out.unshift,
    pr = require('../lib/printer'),
    ck = require('chalk');

function coord(l, c) {

    return ck.gray('L') + ck.bold.yellow(l) + ck.gray(':C') + ck.bold.yellow(c);
}

module.exports = function(result, file, options) {
    var
        msgLen = result.messages.length,
        msg,
        type = {},
        color,
        i;

    result.messages.sort(function(a, b){
        return a.line >= b.line && a.col >= b.col;
    });

    for(i = 0; i < msgLen; i += 1) {

        msg = result.messages[i];
        if ( !msg.rollup ) {

            lpush('|   ' + coord(msg.line, msg.col) + ck.gray(' . . . ') + ck.bold.magenta(msg.evidence.trim()));
        }
        lpush('|   ' + pr[msg.type](msg.message) + ck.gray('(' + msg.rule.id + ')'));
        lpush('|');
        type[msg.type] = i;

    }

    if ( msgLen ) {

        color = type.hasOwnProperty('error')? 'red': 'yellow';

        lunshift('|');
        lunshift('+-' + ck[color].bold(file.path + ': ') +  msgLen + ' issue(s):');
        lunshift('');
        lpush('+-' + ck[color].bold(file.path));

    } else if ( file.isEmpty ) {

        lpush('\n' + pr.warning(file.path + ' - is empty.'));
    } else if ( !options.quiet ) {

        lpush('\n' + pr.ok(file.path));
    }

    if ( out.length ) {
        pr.log(out.join('\n'));
    }
};
