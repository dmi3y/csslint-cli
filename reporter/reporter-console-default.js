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
    u = require('../lib/utils'),

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

function mainReporter(result, file, options) {
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
}

mainReporter.serviceReporter = function(result, options, rules, csslintversion) {
    var
        unknown,
        unknownLen,
        i;

    console.log(result);

    if ( result.noTargets ) {

        pr.log(pr.inf('No targets specified.'));
    } else if ( result.targetNotExists ) {

        pr.log(pr.error('Target not exits: `' + result.targetNotExists + '`' ));
    } else if ( result.unknownOptions ) {

        unknown = result.unknownOptions;
        unknownLen = unknown.length;

        pr.log('\n' + pr.error('There is ' + unknownLen + ' unknown option(s):'));
        for( i = 0; i < unknownLen; i += 1 ) {
            pr.log('    --' + unknown[i] + ' - is not valid option.');
        }
        pr.log(pr.magenta('\nSee --help for details.'));

    } else if ( result.help ) {
        pr.log([
            '\nUsage:' + pr.gray(' node csslint-cli.js [options]* [file|dir [file|dir]]*'),
            ' ',
            'Global Options'
        ].join("\n"));

        var allOptions = require('../lib/helper').allOptions();

        u.forOwn(allOptions, function(it, ix) {
            var
                pad = new Array( 40 - (ix + it.format).length ).join('.');
            pr.log(
                pr.green(' --' + ix + (it.format? '=' + it.format: ' ')),
                pr.gray(pad),
                it.description
            );
        });
    } else if ( result.version ) {
        pr.log('Core CSSLint version: ' + pr.magenta(csslintversion));
        pr.log('CLI version: ' + pr.magenta(result.version));

    } else if ( result['list-rules'] ) {

        u.forEach(rules, function(it, ix) {
            pr.log(pr.gray(++ix  + ' ') + pr.green.italic(it.id) + '\n\n      ' + it.desc + '\n');
        });
    }
    
};

module.exports = mainReporter;
