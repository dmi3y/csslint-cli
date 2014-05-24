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
    ck = require('chalk'),

    type = {},
    msgLen,

    out = [],
    opush = out.push.bind(out),
    ounshift = out.unshift.bind(out);


function coord(l, c) {

    return ck.gray('L') + ck.bold.yellow(l) + ck.gray(':C') + ck.bold.yellow(c);
}

function prepareMessages(result) {
    var
        msg,
        i;

    out.length = 0;

    msgLen = result.messages.length;
    result.messages.sort(function(a, b){
        return a.line >= b.line && a.col >= b.col;
    });

    for(i = 0; i < msgLen; i += 1) {

        msg = result.messages[i];
        if ( !msg.rollup ) {

            opush('|   ' + coord(msg.line, msg.col) + ck.gray(' . . . ') + ck.bold.magenta(msg.evidence.trim()));
        }
        opush('|   ' + pr[msg.type](msg.message) + ck.gray('(' + msg.rule.id + ')'));
        opush('|');
        type[msg.type] = i;

    }
}

module.exports = function(result, file, options) {
    var
        color;

    prepareMessages(result);

    if ( msgLen ) {

        color = type.hasOwnProperty('error')? 'red': 'yellow';

        ounshift('|');
        ounshift('+-' + ck[color].bold(file.path + ': ') +  msgLen + ' issue(s):');
        ounshift('');
        opush('+-' + ck[color].bold(file.path));

    } else if ( file.isEmpty ) {

        opush('\n' + pr.warning(file.path + ' - is empty.'));
    } else if ( !options.quiet ) {

        opush('\n' + pr.ok(file.path));
    }

    if ( out.length ) {
        pr.log(out.join('\n'));
    }
};
