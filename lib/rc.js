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
    fs = require('fs'),
    _ = require('lodash'),

    optionsHelper = require('./helper'),
    printer = require('./printer');


function readFile(path) {
    return fs.readFileSync(path).toString();
}

function isFile(path) {
    return fs.existsSync(path) && fs.statSync(path).isFile();
}

function isDirectory(path) {
    return fs.existsSync(path) && fs.statSync(path).isDirectory();
}


module.exports = {

    validateRc: function(rcpath) {
        var
            parsedRcObj,
            unknownOptions,
            options;

        if ( fs.existsSync(rcpath) ) {
            parsedRcObj = optionsHelper.parseRc(readFile(rcpath));

            unknownOptions = optionsHelper.filterUnknown(parsedRcObj, 'main');
            if ( unknownOptions ) {
                printer.path([parsedRcObj.path], '\nConfiguration file error:\n');
                printer.unknown(unknownOptions);
                process.exit(1);
            }

            options = parsedRcObj;

            return optionsHelper.optionsToExplicitRulesets(options);
        }
    },

    lookdownFiles: function(targets) {
        var
            files = [],
            rcs = [];

        (function digup(trgs, base) {
            var
                digupd = base || process.cwd();


            _.forEach(trgs, function(it) {
                var
                    fullpath = path.resolve(digupd, it),
                    ext;

                if ( isFile(fullpath) ) {
                    ext = (/\.[^\.]*$/.exec(it) || ['']).pop();
                    switch ( ext ) {
                    case '.csslintrc':
                        rcs.push(fullpath);
                        break;
                    case '.css':
                        files.push(fullpath);
                        break;
                    }

                } else if ( isDirectory(fullpath) ) {

                    digup(fs.readdirSync(fullpath), fullpath);
                }
            });

        }(targets));

        return {
            files: files,
            rcs: rcs
        };
    },

    lookupRc: function (rcname, base, stopby) {
        var lookupd = base || process.cwd(),
            userhome = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
            stop = path.resolve( stopby || userhome), 
            file,
            fullpath;

        function isGoodToGoUp() {
            var
                isStop = (lookupd === stop),
                _lookupd = path.resolve(lookupd + '/../'),
                isTop = (lookupd === _lookupd),
                gtg;

            file = isFile(fullpath);

            gtg = (!file && !isStop && !isTop);
            lookupd = _lookupd;
            return gtg;
        }

        (function traverseUp() {

            fullpath = path.resolve(lookupd, rcname);

            if ( isGoodToGoUp() ) {
                traverseUp();
            }
        }());

        return file? fullpath: null;
    }

};
