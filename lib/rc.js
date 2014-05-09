/*
 * csslint-cli
 * user/repo
 *
 * Copyright (c) 2014 Dmitry Lapshukov
 * Licensed under the MIT license.
 */

'use strict';

var
    _ = require('lodash'),

    optionsHelper = require('./helper'),
    u = require('./utils'),
    printer = require('./printer');

module.exports = {

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
        var input = u.readFile(file),
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

        if ( u.existsSync(rcpath) ) {
            options = optionsHelper.parseRc(u.readFile(rcpath));

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
                    fullpath = u.resolve(digupd, it),
                    ext;

                if ( u.isFile(fullpath) ) {
                    ext = (/\.[^\.]*$/.exec(it) || ['']).pop();
                    if ( files[ext] ) {
                        files[ext].push(fullpath);
                    }

                } else if ( u.isDirectory(fullpath) ) {

                    digup(u.readdirSync(fullpath), fullpath);
                }
            });

        }(targets));

        return files;
    },

    lookupFile: function (rcname, base, stopby) {
        var
            lookupd = base || process.cwd(),
            userhome = u.userhome,
            stop = u.resolve( stopby || userhome ),
            file,
            fullpath;

        function isGoodToGoUp() {
            var
                isStop = (lookupd === stop),
                _lookupd = u.resolve(lookupd + '/../'),
                isTop = (lookupd === _lookupd),
                gtg;

            file = u.isFile(fullpath);

            gtg = (!file && !isStop && !isTop);
            lookupd = _lookupd;
            return gtg;
        }

        (function traverseUp() {

            fullpath = u.resolve(lookupd, rcname);

            if ( isGoodToGoUp() ) {
                traverseUp();
            }
        }());

        return file? fullpath: null;
    }

};
