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
    csslint = require('csslint').CSSLint,
    csslintRules = csslint.getRules(),
    optionsHelper = require('./helper'),
    printer = require('./printer'),
    _ = require('lodash'),

    parsedCliObj,
    unknownOptions,
    optionsCli,
    rulesets = [],
    targets,
    slot,
    cliversion = '<%- @VERSION %>';

parsedCliObj = optionsHelper.parseCli(process.argv.slice(2));

optionsCli = parsedCliObj.options;
targets = parsedCliObj.targets;
parsedCliObj = null;

unknownOptions = optionsHelper.filterUnknown(optionsCli);
if ( unknownOptions ) {
    printer.unknown(unknownOptions);
    process.exit(1);
}

if ( optionsCli.help ) {
    printer.help();
    process.exit();
} else if ( optionsCli.version ) {
    printer.version(csslint.version, cliversion);
    process.exit();
} else if ( optionsCli['list-rules'] ) {
    printer.rules( csslintRules );
    process.exit();
} else if ( !targets ) {
    printer.noTargets();
    process.exit(1);
}

function checkupForRc(name, shallow) {
    var
        parsedRcObj = optionsHelper.checkExternalRc(name, shallow),
        _slot,
        options;

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


console.log(rulesets);

process.exit();
