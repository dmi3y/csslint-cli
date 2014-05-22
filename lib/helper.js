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
    fu = require('nfsu'),
    optionsMap,
    allOptions,
    manifest = fu.readFileJson(__dirname + '/manifest.json'),
    helper;

helper = {

    parseCli: function (arrg) {
        var
            options = require('minimist')(arrg),
            targets = options._;

        delete options._;

        return {
            rules: options,
            targets: targets
        };
    },

    parseRc: function(rc) {
        var
            out;

        try {
            out = JSON.parse(require('strip-json-comments')(rc));
        } catch (e) {
            out = helper.parseCli(rc.split(/[\r\n\s]/)).rules;
            out = u.mapValues(out, function(it){
                return (typeof it === 'string'? it.split(','): it);
            });
        }

        return helper.optionsToExplicitRulesets(out);
    },

    cherryPick: function (options, where) {
        var
            out = {},
            within;

        within = where? manifest[where]: helper.allOptions();

        u.forOwn(within, function(it, ix){
            if ( u.has(options, ix) ) {
                out[ix] = options[ix];
            }
        });

        return out;
    },

    filterUnknown: function (options, where) {
        var
            out = [],
            within;

        within = where? manifest[where]: helper.allOptions();

        u.forOwn(options, function(it, ix){
            if ( !u.has(within, ix) ) {
                out.push(ix);
            }
        });

        return out.length? out: null;
    },

    optionsToExplicitRulesets: function (obj) {
        var
            optionsMap = helper.optionsMap(),
            out = {},
            option,
            val,
            objix,
            itLen,
            it,
            i;

        for (objix in obj) {
            /* istanbul ignore else  */
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
        var
            out = allOptions;
        if ( !out ) {
            out = {};
            u.merge(out, manifest.cli);
            u.merge(out, manifest.main);
            allOptions = out;
        }
        return out;
    },

    optionsMap: function() {

        if ( !optionsMap ) {
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
        return optionsMap;
    },

    mixup: function( out, donor, straight ) {
        var
            inter = [],
            dnrix,
            _donor = {};

        for ( dnrix in donor ) {
            /* istanbul ignore else  */
            if ( donor.hasOwnProperty(dnrix) ) {
                inter.push(helper.optionsMap()[dnrix]);
                _donor[dnrix] = donor[dnrix].split(',');
            }
        }

        if ( !straight ) {

            out = u.omit(out, function(it) {
                return (inter.indexOf(it) !== -1);
            });

        }

        _donor = helper.optionsToExplicitRulesets(_donor);
        return u.merge(out, _donor);
    }

};

module.exports = helper;
