/*
 * csslint-cli
 * user/repo
 *
 * Copyright (c) 2014 Dmitry Lapshukov
 * Licensed under the MIT license.
 */

var
    _ = require('lodash'),
    chalk = require('chalk'),
    cliOptions = require('./clioptions');

module.exports = {
    unknown: function( unknown ) {
        var
            unknownLen = unknown.length,
            i;

        console.log(chalk.bold.red('There is ' + unknownLen + ' unknown option(s):'));
        for(i = 0; i < unknownLen; i += 1) {
            console.log(chalk.red('    ' + unknown[i] ));
        }
    },

    help: function() {

        console.log([
            '\nUsage:' + chalk.bold(' node csslint-cli.js [options]* [files|dirs]*'),
            ' ',
            'Global Options'
        ].join("\n"));

        _.forOwn(cliOptions, function(it, ix) {
            var
                pad = new Array( 40 - (ix + it.format).length ).join(' ');
            console.log(
                chalk.green.bold(' --' + ix + (it.format? '=' + it.format: ' ')),
                chalk.bold(pad + it.description)
            );
        });
    }
};
