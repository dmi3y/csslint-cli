/*
 * csslint-cli
 * user/repo
 *
 * Copyright (c) 2014 Dmitry Lapshukov
 * Licensed under the MIT license.
 */

'use strict';

var
    _ = require('lodash'),
    chalk = require('chalk'),
    cliOptions = {
        'help'        : { 'format' : '',                       'description' : 'Displays this information.'},
        'format'      : { 'format' : '<format>',               'description' : 'Indicate which format to use for output.'},
        'list-rules'  : { 'format' : '',                       'description' : 'Outputs all of the rules available.'},
        'quiet'       : { 'format' : '',                       'description' : 'Only output when errors are present.'},
        'errors'      : { 'format' : '<rule[,rule]+>',         'description' : 'Indicate which rules to include as errors.'},
        'warnings'    : { 'format' : '<rule[,rule]+>',         'description' : 'Indicate which rules to include as warnings.'},
        'ignore'      : { 'format' : '<rule[,rule]+>',         'description' : 'Indicate which rules to ignore completely.'},
        'exclude-list': { 'format' : '<file|dir[,file|dir]+>', 'description' : 'Indicate which files/directories to exclude from being linted.'},
        'version'     : { 'format' : '',                       'description' : 'Outputs the current version number.'}
    },
    parsedCliObj,
    unknown,
    unknownLen,
    i;

function parseCli(arrg) {

    var
    options = require('minimist')(arrg),
        files = options._;

    delete options._;

    return {
        options: options,
        files: files
    };
}

function filterUnknown(options) {
    var
        out = [];

    _.forOwn(options, function(it, ix){
        if ( !cliOptions.hasOwnProperty(ix) ) {
            out.push(ix);
        }
    });

    return out.length? out: false;
}


parsedCliObj = parseCli(process.argv.slice(2));
unknown = filterUnknown(parsedCliObj.options);

if ( unknown ) {
    unknownLen = unknown.length;
    console.log(chalk.bold.red(unknownLen + ' unknown options:'));
    for(i = 0; i < unknownLen; i += 1) {
        console.log(chalk.red('    ' + unknown[i] ));
    }
}

