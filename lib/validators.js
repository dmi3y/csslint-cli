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

    checkParameters: function(options, targets) {
        var
            unknownOptions,
            out = {},
            targetsLen = targets.length;

        unknownOptions = validators.validateCli(options);

        if( unknownOptions ) {

            out.unknownOptions = unknownOptions;
            out.exit = 1;
        } else if ( options.help ) {

            out.help = options.help;
            out.exit = 0;
        } else if ( options.version ) {

            out.version = options.version;
            out.exit = 0;
        } else if ( options['list-rules'] ) {

            out['list-rules'] = options['list-rules'];
            out.exit = 0;
        } else if ( !targetsLen ) {

            out.noTargets = true;
            out.exit = 1;
        } else {

            for ( ;targetsLen--; ) {

                if ( !fu.f.existsSync(targets[targetsLen]) ) {

                    out.targetNotExists = targets[targetsLen];
                    out.exit = 1;
                    break;
                }
            }

        }

        return out;
    },

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
