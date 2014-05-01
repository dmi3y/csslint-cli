/*
 * csslint-cli
 * user/repo
 *
 * Copyright (c) 2014 Dmitry Lapshukov
 * Licensed under the MIT license.
 */

'use strict';

var
    path = require("path"),
    fs = require("fs"),
    _ = require('lodash'),
    cliOptions = require('./clioptions'),
    optionsMap = {
        'ignore': 0,
        'warnings': 1,
        'errors': 2
    },
    valueMap = {
        'false': optionsMap.ignore, // false is ignore
        '': optionsMap.warnings,    // blank is warning
        'true': optionsMap.errors,  // true is error

        '0': optionsMap.ignore,    // explicit ignore
        '1': optionsMap.warnings,  // explicit warning
        '2': optionsMap.errors     // explicit error
    },
    defaultThreshold = optionsMap.warnings;

module.exports = {

    parseCli: function (arrg) {

        var
            options = require('minimist')(arrg),
            files = options._;

        delete options._;

        return {
            options: options,
            files: files.length? files: null
        };
    },

    filterUnknown: function (options) {
        var
            out = [];

        _.forOwn(options, function(it, ix){
            if ( !cliOptions.hasOwnProperty(ix) ) {
                out.push(ix);
            }
        });

        return out.length? out: null;
    },

    optionsToExplicitRulesets: function (obj) {
        var
            out = {},
            option,
            val,
            objix,
            objits;

        function loop (it) {
            var
                itLen,
                i;

            itLen = it.length;

            for(i=0; i<itLen; i+=1) {
                option = it[i];
                val = optionsMap[objix];
                out[option] = val;
            }
        }

        for (objix in obj) {
            if ( obj.hasOwnProperty(objix) ) {
                objits = obj[objix];

                if ( Array.isArray(objits) ) {
                    loop(objits);

                } else if ( valueMap[objits.toString()] ) {
                    option = objix;
                    val = valueMap[objits.toString()];
                    out[option] = val;
                } else/* if (typeof objits === 'string') */{
                    loop(objits.split(','));
                }
            }

        }

        return out;
    },

    lookup: function (filename) {
        var lookupd = process.cwd(),
            userhome = path.resolve(process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE),
            isFile,
            fullpath;

        function isGoodToGoUp() {
            var
            isUserhome = (lookupd === userhome),
                _lookupd = path.resolve(lookupd + "/../"),
                isTop = (lookupd === _lookupd),
                gtg;

            isFile = (fs.existsSync(fullpath) && fs.statSync(fullpath).isFile());
            gtg = (!isFile && !isUserhome && !isTop);
            lookupd = _lookupd;
            return gtg;
        }

        (function traverseUp() {

            fullpath = path.resolve(lookupd, filename);

            if (isGoodToGoUp()) {
                traverseUp();
            }
        }());

        return isFile ? fullpath : null;
    }
};
