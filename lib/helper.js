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
    allOptions,
    optionsManifest;

function readFile(path) {
    return fs.readFileSync(path).toString();
}
function readJson(path) {
    return JSON.parse(readFile(path));
}

optionsManifest = readJson(__dirname + '/manifest.json');


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

        within = where? optionsManifest[where]: this.allOptions();

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
            itLen,
            it,
            i;

        for (objix in obj) {
            if ( obj.hasOwnProperty(objix) ) {
                it = obj[objix];

                if ( Array.isArray(it) ) {

                    itLen = it.length;

                    for ( i = 0; i < itLen; i += 1 ) {
                        option = it[i];
                        val = optionsManifest.main[objix].default;
                        out[option] = val;
                    }

                } else {
                    option = objix;
                    val = optionsMap[it.toString()];
                    out[option] = val;
                }
            }

        }

        return out;
    },

    checkExternalRc: function(filename, shallow) {
        var
            rcpath,
            out = {},
            options;


            if ( shallow ) {
                if ( fs.existsSync(filename) ) {
                    rcpath = fs.statSync(filename).isFile()? path.resolve(filename): null;
                }
            } else {
                rcpath = this.lookup(filename);
            }


            if ( rcpath ) {
                options = this.externalRcOptions(rcpath);
                out = {
                    options: options,
                    path: rcpath
                };
            }

        return out;
    },

    externalRcOptions: function (path) {
        return this.parseRc(readFile(path));
    },

    allOptions: function() {
        var out = allOptions;
        if ( !out ) {
            out = {};
            _.merge(out, optionsManifest.cli);
            _.merge(out, optionsManifest.main);
            allOptions = out;
        }
        return out;
    }
};
