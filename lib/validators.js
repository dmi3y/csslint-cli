/*
 * csslint-cli
 * user/repo
 *
 * Copyright (c) 2014 Dmitry Lapshukov
 * Licensed under the MIT license.
 */

'use strict';

var
    helper = require('./helper'),
    fu = require('nfsu'),
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
            options = validators.validateRc(rcpath);
            /* istanbul ignore else  */
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
            options,
            file;
        /* istanbul ignore else  */
        if ( fu.ifFile(rcpath) ) {

            rcpath = fu.p.resolve(rcpath);
            file = fu.readFileStr(rcpath);
            /* istanbul ignore else  */
            if ( file ) {
                options = helper.parseRc(file);
            }

        }
        return options;
    },

    validateCli: function(optionsCli) {
        return helper.filterUnknown(optionsCli);
    }
};

module.exports = validators;
