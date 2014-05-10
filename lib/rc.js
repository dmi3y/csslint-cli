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
            _files,
            base,
            _base,
            len,
            rulesets = {},
            i,
            j;

        len = rcs.length;

        rcs.sort(function(a, b){
            return a.ord > b.ord;
        });

        for (i = 0; i < len; i += 1) {
            base = rcs[i].base;

            _files = [];

            for (j = 0; files[j]; j += 1) {
                file = files[j];

                if ( file.indexOf(base) === 0 ) {
                    _files.push(files.splice(j, 1).pop());
                    j -= 1;
                }

            }

            if ( _files.length ) {
                rulesets[base] = {};
                rulesets[base].files = _files;
                rulesets[base].rules = rcs[i].rules;
            }
        }

        files.sort();

        for (i = 0; files[i]; i += 1) {
            file = files[i];
            base = u.getBase(file);

            if ( base.indexOf(_base) !== 0 ) {
                _base = base;
                rulesets[_base] = {};
                rcfile = this.lookupFile('.csslintrc');
                rulesets[_base].files = [];
                rulesets[_base].rules = rcfile? this.validateRc(rcfile): {};
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

        rcs.sort();
        for (;rcsLen--;) {
            rcpath = rcs[rcsLen];
            options = this.validateRc(rcpath);
            if ( options ) {
                out.push({
                    base: u.getBase(rcpath),
                    options: options,
                    ord: rcsLen
                });
            }
        }

        return out;
    },
    validateRc: function(rcpath) {
        var
            unknownOptions,
            options,
            file;

        if ( u.existsSync(rcpath) ) {
            file = u.readFile(rcpath);
            if ( file ) {
                options = optionsHelper.parseRc(file);
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
