/*
 * csslint-cli
 * user/repo
 *
 * Copyright (c) 2014 Dmitry Lapshukov
 * Licensed under the MIT license.
 */

'use strict';

var
    csslint = require('csslint').CSSLint,
    csslintRules = csslint.getRules(),
    optionsHelper = require('./helper'),
    printer = require('./printer'),
    rc = require('./rc'),

    parsedCliObj,
    unknownOptions,
    optionsCli,
    targets,
    rcfile,
    cssfile,
    workset,
    len,
    base,
    _base,
    i,
    cssIt,
    block,
    files,
    rulesets = {},
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

workset = rc.lookdownFiles(targets, ['.csslintrc', '.css']);
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
        rulesets[base].rules = rc.validateRc(rcfile);
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
        rulesets[_base].rules = rc.validateRc(rc.lookupFile('.csslintrc'));
        rulesets[_base].files = [];
    }
    
    rulesets[_base].files.push(cssfile);
}

function pluckByType(messages, type){
    return messages.filter(function(message) {
        return message.type === type;
    });
}

function processFile(file, options) {
    var input = rc.readFile(file),
        result = csslint.verify(input, options.rulesets),
        formatter = csslint.getFormatter(options.format || "text"),
        messages = result.messages || [],
        output;

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
}

for (base in rulesets) {
    if ( rulesets.hasOwnProperty(base) ) {
        block = rulesets[base];

        files = block.files;
        len = files.length;

        for (i = 0; i < len; i += 1) {
            processFile(files[i], optionsHelper.optionsToExplicitRulesets(block.rules));
        }

    }
}

// console.log(rulesets);

process.exit();
