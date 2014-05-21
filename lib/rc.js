/*
 * csslint-cli
 * user/repo
 *
 * Copyright (c) 2014 Dmitry Lapshukov
 * Licensed under the MIT license.
 */

'use strict';

var
    v = require('./validators'),
    fu = require('nfsu');

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
            /* istanbul ignore else  */
            if ( _files.length ) {
                rulesets[base] = {};
                rulesets[base].files = _files;
                rulesets[base].rules = rcs[i].options;
            }
        }

        return {
            rulesets: rulesets,
            files: files
        };
    },

    sortTheRest: function (files, rcname) {
        var
            i,
            file,
            base,
            _base,
            rulesets = {},
            rcfile;

        files.sort();

        for (i = 0; files[i]; i += 1) {
            file = fu.p.resolve(files[i]);
            base = fu.p.dirname(file);
            /* istanbul ignore else  */
            if ( base.indexOf(_base) !== 0 ) {
                _base = base;
                rulesets[_base] = {};
                rcfile = fu.lookupFileByName(rcname, _base);
                rulesets[_base].files = [];
                rulesets[_base].rules = rcfile? v.validateRc(rcfile): {};
            }

            rulesets[_base].files.push(file);
        }

        return rulesets;
    }
};
