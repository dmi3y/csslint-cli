/*
 * csslint-cli
 * user/repo
 *
 * Copyright (c) 2014 Dmitry Lapshukov
 * Licensed under the MIT license.
 */

'use strict';

var
    optionsHelper = require('./helper'),
    u = require('./utils'),
    printer = require('./printer');

module.exports = {

    shuffleToRulesets: function (rcs, files) {
        var
            rcfile,
            file,
            base,
            _base,
            cssIt,
            len,
            rulesets = {},
            files,
            i = 0,
            rcname,
            ext;

        workset[rcname].sort();
        len = workset[rcname].length;

        for ( ;len--; ) {
            rcfile = workset[rcname][len];
            base = rcfile.replace(rcname, '');
            rulesets[base] = {};

            files = [];

            for (i = 0; workset[ext][i]; i += 1) {
                cssIt = workset[ext][i];

                if ( cssIt.indexOf(base) === 0 ) {
                    files.push(workset[ext].splice(i, 1).pop());
                    i -= 1;
                }

            }

            if ( files.length ) {
                rulesets[base].rules = this.validateRc(rcfile);
                rulesets[base].files = files;
            }
        }

        workset[ext].sort();

        for (i = 0; workset[ext][i]; i += 1) {
            file = workset[ext][i];
            base = u.getBase(file);

            if ( base.indexOf(_base) !== 0 ) {
                _base = base;
                rulesets[_base] = {};
                rulesets[_base].rules = this.validateRc(this.lookupFile(rcname));
                rulesets[_base].files = [];
            }

            rulesets[_base].files.push(file);
        }

        return rulesets;
    },

    processFile: function(result, formatter, options) {
        var

            messages = result.messages || [],
            output;

        function pluckByType(messages, type){
            return messages.filter(function(message) {
                return message.type === type;
            });
        }

        if (options.isEmpty) {
            if (formatter.readError) {
                console.log(formatter.readError(options.file, "Could not read file data. Is the file empty?"));
            } else {
                console.log("csslint: Could not read file data in " + options.file + ". Is the file empty?");
            }
            process.exit(1);
        } else {
            output = formatter.formatResults(result, options.file, options);
            if (output){
                console.log(output);
            }

            if (messages.length > 0 && pluckByType(messages, "error").length > 0) {
                process.exit(1);
            }
        }
    },

    validateRcs: function(rcs) {
        var
            rcsLen = rcs.length,
            options,
            rcpath,
            out = [];

        for (;rcsLen--;) {
            rcpath = rcs[rcsLen];
            options = this.validateRc(rcpath);
            if ( options ) {
                out.push({
                    base: u.getBase(rcpath),
                    options: options
                });
            }
        }

    },
    validateRc: function(rcpath) {
        var
            unknownOptions,
            options,
            file;

        if ( u.existsSync(rcpath) ) {
            file = u.readFile(rcpath);
            if ( file ) {
                options = optionsHelper.parseRc();
                unknownOptions = optionsHelper.filterUnknown(options, 'main');
                if ( unknownOptions ) {
                    printer.path(rcpath, '\nConfiguration file error:\n');
                    printer.unknown(unknownOptions);
                    process.exit(1);
                }
            }

        }
        return options;
    },

    lookdownFiles: function(targets, exts, base) {
        var
            extsLen = exts.length,
            files = {};

        while( ~--extsLen ) {
            files[exts[extsLen]] = [];
        }

        (function digup(trgs, base) {
            var
                digupd = base;


            u.forEach(trgs, function(it) {
                var
                    fullpath = u.resolve(digupd + '/' + it),
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

        }(targets, base || process.cwd()));

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
