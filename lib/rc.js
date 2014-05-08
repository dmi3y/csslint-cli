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

    readFile: readFile,

    validateRc: function(rcpath) {
        var
            unknownOptions,
            options = {};

        if ( fs.existsSync(rcpath) ) {
            options = optionsHelper.parseRc(readFile(rcpath));

            unknownOptions = optionsHelper.filterUnknown(options, 'main');
            if ( unknownOptions ) {
                printer.path(rcpath, '\nConfiguration file error:\n');
                printer.unknown(unknownOptions);
                process.exit(1);
            }

        }
        return options;
    },

    lookdownFiles: function(targets, exts) {
        var
            extsLen = exts.length,
            files = {};

        while( ~--extsLen ) {
            files[exts[extsLen]] = [];
        }

        (function digup(trgs, base) {
            var
                digupd = base || process.cwd();


            _.forEach(trgs, function(it) {
                var
                    fullpath = path.resolve(digupd, it),
                    ext;

                if ( isFile(fullpath) ) {
                    ext = (/\.[^\.]*$/.exec(it) || ['']).pop();
                    if ( files[ext] ) {
                        files[ext].push(fullpath);
                    }

                } else if ( isDirectory(fullpath) ) {

                    digup(fs.readdirSync(fullpath), fullpath);
                }
            });

        }(targets));

        return files;
    },

    lookupFile: function (rcname, base, stopby) {
        var lookupd = base || process.cwd(),
            userhome = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
            stop = path.resolve( stopby || userhome ),
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
