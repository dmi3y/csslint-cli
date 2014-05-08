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

    shuffleToRulesets: function (workset) {
        var
            rcfile,
            cssfile,
            base,
            _base,
            cssIt,
            len,
            rulesets,
            files,
            i;

        workset['.csslintrc'].sort();
        len = workset['.csslintrc'].length;

        while ( ~--len ) {
            rcfile = workset['.csslintrc'][len];
            base = rcfile.replace('.csslintrc', '');
            rulesets[base] = {};

            files = [];

            for (i = 0; workset['.css'][i]; i += 1) {
                cssIt = workset['.css'][i];

                if ( cssIt.indexOf(base) === 0 ) {
                    files.push(workset['.css'].splice(i, 1).pop());
                    i -= 1;
                }

            }

            if ( files.length ) {
                rulesets[base].rules = this.validateRc(rcfile);
                rulesets[base].files = files;
            }
        }

        workset['.css'].sort();

        for (i = 0; workset['.css'][i]; i += 1) {
            cssfile = workset['.css'][i];
            base = /(.*)[\/\\][^\/\\]*$/.exec(cssfile).pop();

            if ( base.indexOf(_base) !== 0 ) {
                _base = base;
                rulesets[_base] = {};
                rulesets[_base].rules = this.validateRc(this.lookupFile('.csslintrc'));
                rulesets[_base].files = [];
            }

            rulesets[_base].files.push(cssfile);
        }

        return rulesets;
    },

    processFile: function(file, options, csslint) {
        var input = this.readFile(file),
            result = csslint.verify(input, options.rulesets),
            formatter = csslint.getFormatter(options.format || "text"),
            messages = result.messages || [],
            output;

        function pluckByType(messages, type){
            return messages.filter(function(message) {
                return message.type === type;
            });
        }

        if (!input) {
            if (formatter.readError) {
                console.log(formatter.readError(file, "Could not read file data. Is the file empty?"));
            } else {
                console.log("csslint: Could not read file data in " + file + ". Is the file empty?");
            }
            process.exit(1);
        } else {
            options.fullPath = file;
            output = formatter.formatResults(result, file, options);
            if (output){
                console.log(output);
            }

            if (messages.length > 0 && pluckByType(messages, "error").length > 0) {
                process.exit(1);
            }
        }
    },

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
