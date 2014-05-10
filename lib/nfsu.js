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
    nfsu = {

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

module.exports = nfsu;
