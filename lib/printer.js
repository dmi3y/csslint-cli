/*
 * csslint-cli
 * user/repo
 *
 * Copyright (c) 2014 Dmitry Lapshukov
 * Licensed under the MIT license.
 */

var
    chalk = require('chalk'),
    red = chalk.red,
    green = chalk.green,
    yellow = chalk.yellow,
    // blue = chalk.blue,
    magenta = chalk.magenta,
    gray = chalk.gray,
    log = console.log,
    printer;


printer = {
    log: log,

    gray: gray,
    green: green,
    magenta: magenta,

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
        return chalk.white.bold.bgBlue('INF:') + ' ' + magenta(str);
    }

};

module.exports = printer;
