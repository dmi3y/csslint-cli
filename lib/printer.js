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

    unknown: function(unknown) {
        var
            unknownLen = unknown.length,
            i;

        console.log(chalk.bold.red('There is ' + unknownLen + ' unknown option(s):'));
        for(i = 0; i < unknownLen; i += 1) {
            console.log(chalk.red('    --' + unknown[i] + ' - is not valid option, see --help for details.' ));
        }
    },

    help: function() {
        console.log([
            '\nUsage:' + chalk.bold.gray(' node csslint-cli.js [options]* [files|dirs]*'),
            ' ',
            'Global Options'
        ].join("\n"));

        var allOptions = _.merge(cliOptions.cliOnly, cliOptions.cliAndRc);

        _.forOwn(allOptions, function(it, ix) {
            var
                pad = new Array( 40 - (ix + it.format).length ).join(' ');
            console.log(
                chalk.green.bold(' --' + ix + (it.format? '=' + it.format: ' ')),
                chalk.bold.gray(pad + it.description)
            );
        });
    },

    version: function(csslintversion, cliversion) {
        console.log('Core CSSLint version: ' + chalk.bold.magenta(csslintversion));
        console.log('CLI version: ' + chalk.bold.magenta(cliversion));
    },

    noTargets: function() {
        console.log(chalk.bold.red('No targets specified.'));
    },

    rules: function(rules) {
        _.forEach(rules, function(it, ix) {
            console.log(chalk.gray(++ix  + ' ') + chalk.green.italic(it.id) + '\n\n      ' + chalk.bold.gray(it.desc) + '\n');
        });
    },

    path: function(paths, preword) {
        var
            pathLen = paths.length;
            i = 0;

        preword && console.log(preword);

        for (i; i<pathLen; i+=1) {
            console.log('   ' + chalk.magenta.bold(paths[i]));
        }
        console.log('');
    }

};
