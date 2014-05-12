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
    u = require('./utils'),
    fu = require('./nfsu'),
    printer = require('./printer');

module.exports = {

    shuffleToRulesets: function (rcs, files) {
        var
            file,
            _files,
            base,
            len,
            rulesets = {},
            i,
            j;

        len = rcs.length;

        rcs.sort(function(a, b){
            return a.ord > b.ord;
        });

        for (i = 0; i < len; i += 1) {
            base = rcs[i].base;

            _files = [];

            for (j = 0; files[j]; j += 1) {
                file = files[j];

                if ( file.indexOf(base) === 0 ) {
                    _files.push(files.splice(j, 1).pop());
                    j -= 1;
                }

            }

            if ( _files.length ) {
                rulesets[base] = {};
                rulesets[base].files = _files;
                rulesets[base].rules = rcs[i].rules;
            }
        }

        return {
            rulesets: rulesets,
            files: files
        };
    },

    sortoutRest: function (files) {
        var
            i,
            file,
            base,
            _base,
            rulesets = {},
            rcfile;

        files.sort();

        for (i = 0; files[i]; i += 1) {
            file = files[i];
            base = u.getBase(file);

            if ( base.indexOf(_base) !== 0 ) {
                _base = base;
                rulesets[_base] = {};
                rcfile = fu.lookupFile('.csslintrc');
                rulesets[_base].files = [];
                rulesets[_base].rules = rcfile? this.validateRc(rcfile): {};
            }

            rulesets[_base].files.push(file);
        }

        return rulesets;
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
            options = this.validateRc(rcpath);
            if ( options ) {
                out.push({
                    base: u.getBase(rcpath),
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

        if ( u.existsSync(rcpath) ) {
            file = u.readFile(rcpath);
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
