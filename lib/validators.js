/*
 * csslint-cli
 * user/repo
 *
 * Copyright (c) 2014 Dmitry Lapshukov
 * Licensed under the MIT license.
 */

'use strict';

var
    optionsHelper = require('./helper'),
    fu = require('nfsu'),
    printer = require('./printer'),
    validators;

validators = {

    validateRcs: function(rcs) {
        var
            rcsLen = rcs.length,
            options,
            rcpath,
            out = [];

        rcs.sort();
        for (;rcsLen--;) {
            rcpath = rcs[rcsLen];
            options = this.validateRc(rcpath);
            if ( options ) {
                out.push({
                    base:fu.p.dirname(rcpath),
                    options: options,
                    ord: rcsLen
                });
            }
        }

        return out;
    },
    validateRc: function(rcpath) {
        var
            unknownOptions,
            options,
            file;

        if ( fu.ifFile(rcpath) ) {
            file = fu.readFileStr(rcpath);
            if ( file ) {
                options = optionsHelper.parseRc(file);
                unknownOptions = optionsHelper.filterUnknown(options, 'main');
                if ( unknownOptions ) {
                    printer.path(rcpath, '\nConfiguration file error:\n');
                    printer.unknown(unknownOptions);
                    process.exit(1);
                }
            }

        }
        return options;
    },
    validateCli: function(optionsCli) {
        var
            unknownOptions = optionsHelper.filterUnknown(optionsCli);

        if ( unknownOptions ) {
            printer.unknown(unknownOptions);
            process.exit(1);
        }

        return optionsCli;
    }
};

module.exports = validators;
