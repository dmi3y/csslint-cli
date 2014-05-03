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
    optionsManifest;

function readFile(path) {
    return fs.readFileSync(path).toString();
}
function readJson(path) {
    return JSON.parse(readFile(path));
}

optionsManifest = readJson(__dirname + '/options-manifest.json');


module.exports = {

    parseCli: function (arrg) {

        var
            options = require('minimist')(arrg),
            targets = options._;

        delete options._;

        options = _.mapValues(options, function(it){
            return (typeof it === 'string'? it.split(','): it);
        });

        return {
            options: options,
            targets: targets.length? targets: null
        };
    },

    parseRc: function(rc) {
        var out;
        try {
            out = JSON.parse(rc);
        } catch (e) {
            out = this.parseCli(rc.split(/[\r\n\s]/)).options;
        }

        return out;
    },

    filterUnknown: function (options, where) {
        var
            out = [],
            within;

        within = where? optionsManifest[where]: this.allOptions;

        _.forOwn(options, function(it, ix){
            if ( !_.has(within, ix) ) {
                out.push(ix);
            }
        });

        return out.length? out: null;
    },

    optionsToExplicitRulesets: function (obj) {
        var
            optionsMap = _.transform(optionsManifest.main, function(acc, its, ix){
                var
                    aliasArr = its.alias,
                    alias,
                    def = its.default,
                    aliasLen = aliasArr.length,
                    i;

                acc[ix] = def;

                for (i = 0; i < aliasLen; i += 1) {
                    alias = aliasArr[i];
                    acc[alias] = def;
                }

            }),
            out = {},
            option,
            val,
            objix,
            objits,
            itLen,
            it,
            i;

        for (objix in obj) {
            if ( obj.hasOwnProperty(objix) ) {
                objits = obj[objix];

                if ( Array.isArray(objits) ) {

                    itLen = it.length;

                    for ( i = 0; i < itLen; i += 1 ) {
                        option = it[i];
                        val = optionsManifest.main[objix].default;
                        out[option] = val;
                    }

                } else {
                    option = objix;
                    val = optionsMap[objits];
                    out[option] = val;
                }
            }

        }

        return out;
    },

    checkExternalRc: function() {
        var
            csslintrcName = '.csslintrc',
            externalRc,
            out = {};

        externalRc = this.lookup(csslintrcName);

        if ( externalRc ) {
            out = this.externalRcOptions(externalRc);
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
                _lookupd = path.resolve(lookupd + '/../'),
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

        return isFile? fullpath: null;
    },

    externalRcOptions: function (path) {
        return this.parseRc(readFile(path));
    },

    allOptions: _.merge(optionsManifest.cli, optionsManifest.main)
};
