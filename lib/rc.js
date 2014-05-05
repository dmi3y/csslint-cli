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
    slot,
    _ = require('lodash'),
    optionsHelper = require('./helper'),
    printer = require('./printer'),
    rulesets;

function checkupForRc(name, shallow) {
    var
        parsedRcObj = optionsHelper.checkExternalRc(name, shallow),
        _slot,
        options,
        unknownOptions;

    unknownOptions = optionsHelper.filterUnknown(parsedRcObj.options, 'main');
    if ( unknownOptions ) {
        printer.path([parsedRcObj.path], '\nConfiguration file error:\n');
        printer.unknown(unknownOptions);
        process.exit(1);
    }

    options = parsedRcObj.options;

    if ( !shallow || options ) {

        _slot = rulesets.push({
            rules: optionsHelper.optionsToExplicitRulesets(_.assign(optionsCli || {}, options || {})),
            files: []
        });
        slot = _slot - 1;
    }
}

checkupForRc('.csslintrc');


module.exports = {

    lookdown: function(targets) {

        (function digup(trgs, base) {
            var
                _slot = slot,
                digupd = base || process.cwd();

            _.forEach(trgs, function(it) {
                var
                    fullIt = path.resolve(digupd, it);
                if ( fs.existsSync(fullIt)) {
                    if ( fs.statSync(fullIt).isFile() ) {

                        rulesets[_slot].files.push(fullIt);
                    } else if ( fs.statSync(fullIt).isDirectory() ) {

                        checkupForRc(fullIt + '/.csslintrc', 'no lookup');
                        digup(fs.readdirSync(fullIt), fullIt);
                    }
                }
            });
        }(targets));
    }

};