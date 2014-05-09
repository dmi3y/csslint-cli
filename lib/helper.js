/*
 * csslint-cli
 * user/repo
 *
 * Copyright (c) 2014 Dmitry Lapshukov
 * Licensed under the MIT license.
 */

'use strict';


var
    u = require('./utils'),
    optionsMap,
    allOptions,
    manifest = u.readJson(__dirname + '/manifest.json');

module.exports = {

    parseCli: function (arrg) {
        var
            options = require('minimist')(arrg),
            targets = options._;

        delete options._;

        options = u.mapValues(options, function(it){
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

        within = where? manifest[where]: this.allOptions();

        u.forOwn(options, function(it, ix){
            if ( !u.has(within, ix) ) {
                out.push(ix);
            }
        });

        return out.length? out: null;
    },

    optionsToExplicitRulesets: function (obj) {
        var
            optionsMap = this.optionsMap(),
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
                        val = manifest.main[objix].default;
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

    allOptions: function() {
        var out = allOptions;
        if ( !out ) {
            out = {};
            u.merge(out, manifest.cli);
            u.merge(out, manifest.main);
            allOptions = out;
        }
        return out;
    },

    optionsMap: function() {
        var out = optionsMap;
        if ( !out ) {
            optionsMap = u.transform(manifest.main, function(acc, its, ix){
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

            });
        }
        return out;
    }

};
