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
    printer = require('./printer'),
    slot = 0,
    rulesets = [],
    _rcname = '.csslintrc';


function readFile(path) {
    return fs.readFileSync(path).toString();
}

function pushSlot(options) {
        var
            _slot;

        _slot = rulesets.push({
            rules: options || {},
            files: []
        });
        slot = _slot - 1;
}

function validateRc(rcpath) {
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

        if ( options ) {
            pushSlot(optionsHelper.optionsToExplicitRulesets(options));
        }
    }
}

module.exports = {

    lookdownFiles: function(targets) {

        (function digup(trgs, base) {
            var
                _slot = slot,
                digupd = base || process.cwd(),
                folders = [];

            _.forEach(trgs, function(it) {
                var
                    fullpath = path.resolve(digupd, it);
                if ( fs.existsSync(fullpath)) {
                    if ( fs.statSync(fullpath).isFile() ) {

                        if ( !rulesets[_slot] ) {
                            pushSlot();
                        }
                        rulesets[_slot].files.push(fullpath);
                    } else if ( fs.statSync(fullpath).isDirectory() ) {
                        folders.push(fullpath);
                    }
                }
            });

            _.forEach(folders, function(fullpath) {
                
                validateRc(fullpath + '/' + _rcname);
                digup(fs.readdirSync(fullpath), fullpath);
            });

        }(targets));

        return rulesets;
    },

    lookupRc: function (rcname) {
        var lookupd = process.cwd(),
            userhome = path.resolve(process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE),
            isFile,
            fullpath;

        _rcname = rcname;

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

         fullpath = path.resolve(lookupd, rcname);

         if (isGoodToGoUp()) {
            traverseUp();
         }
        }());

        isFile && validateRc(fullpath); // jshint ignore:line
    }

};
