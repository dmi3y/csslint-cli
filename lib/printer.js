/*
 * csslint-cli
 * user/repo
 *
 * Copyright (c) 2014 Dmitry Lapshukov
 * Licensed under the MIT license.
 */

var
    chalk = require('chalk'),
    u = require('./utils'),
    optionsHelper = require('./helper'),
    red = chalk.red,
    green = chalk.green,
    yellow = chalk.yellow,
    blue = chalk.blue,
    magenta = chalk.magenta,
    gray = chalk.gray,
    log = console.log,
    printer;


printer = {
    log: log,

    error: function(str) {
        return chalk.white.bold.bgRed('ERR:') + ' ' + red(str);
    },

    warning: function(str) {
        return chalk.white.bold.bgYellow('WARN:') + ' ' + yellow(str);
    },

    ok: function(str) {
        return chalk.white.bold.bgGreen('OK:') + ' ' + green(str);
    },

    inf: function(str) {
        return chalk.white.bold.bgBlue('INF:') + ' ' + blue(str);
    },


    unknown: function(unknown) {
        var
            unknownLen = unknown.length,
            i;

        printer.err('There is ' + unknownLen + ' unknown option(s):');
        for(i = 0; i < unknownLen; i += 1) {
            log('    --' + unknown[i] + ' - is not valid option.');
        }
        log(magenta('\nSee --help for details.\n'));
    },

    help: function() {
        log([
            '\nUsage:' + gray(' node csslint-cli.js [options]* [file|dir [file|dir]]*'),
            ' ',
            'Global Options'
        ].join("\n"));

        var allOptions = optionsHelper.allOptions();

        u.forOwn(allOptions, function(it, ix) {
            var
                pad = new Array( 40 - (ix + it.format).length ).join('.');
            log(
                green(' --' + ix + (it.format? '=' + it.format: ' ')),
                gray(pad),
                it.description
            );
        });
    },

    version: function(csslintversion, cliversion) {
        log('Core CSSLint version: ' + magenta(csslintversion));
        log('CLI version: ' + magenta(cliversion));
    },

    noTargets: function() {
        log(printer.errror('No targets specified.'));
    },

    rules: function(rules) {
        u.forEach(rules, function(it, ix) {
            log(gray(++ix  + ' ') + green.italic(it.id) + '\n\n      ' + it.desc + '\n');
        });
    },

    path: function(paths, preword) {
        var
            pathLen = paths.length,
            i = 0;

        if ( preword ) {
            log(preword);
        }

        for (i; i < pathLen; i += 1) {
            log('   ' + magenta.bold(paths[i]));
        }
        log('');
    }

};

module.exports = printer;
