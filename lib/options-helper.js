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
    _ = require('lodash')
    optionsManifest;

function readFile(path) {
    return fs.readFileSync(path).toString();
}
function readJson(path) {
    return JSON.parse(readFile(path));
}

optionsManifest = readJson('./options-manifest.json');


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

        within = where? optionsDic[where]: _.merge(optionsDic.cli, optionsDic.rc);

        _.forOwn(options, function(it, ix){
            if ( !_.has(within, ix) ) {
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
                    loop(objits.split(',')); // potentially dead code
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

        return isFile? fullpath: null;
    },

    externalRcOptions: function (path) {
        return this.parseRc(readFile(path));
    }
};
