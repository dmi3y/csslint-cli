/*
 * csslint-cli
 * user/repo
 *
 * Copyright (c) 2014 Dmitry Lapshukov
 * Licensed under the MIT license.
 */

'use strict';

function init(args) {
    var
        csslint = require('csslint').CSSLint,
        csslintRules,
        optionsHelper = require('../lib/helper'),
        printer = require('../lib/printer'),
        rc = require('../lib/rc'),
        fu = require('../lib/nfsu'),
        u = require('../lib/utils'),

        parsedCliObj,
        optionsCli,
        targets,
        workset,
        len,
        base,
        i,
        result,
        formatter,
        block,
        files,
        rulesets = {},
        options,
        input,
        rcfiles,
        cssfiles,
        optionsDefault = {},
        defaultThreshold = 1, // manifest.main.warnings.default
        cliversion = '0.0.0';

    parsedCliObj = optionsHelper.parseCli(args);

    optionsCli = rc.validateCli(parsedCliObj.options);
    targets = parsedCliObj.targets;
    parsedCliObj = null;

    if ( optionsCli.help ) {
        printer.help();
        process.exit();
    } else if ( optionsCli.version ) {
        printer.version(csslint.version, cliversion);
        process.exit();
    } else if ( optionsCli['list-rules'] ) {
        csslintRules = csslint.getRules();
        printer.rules( csslintRules );
        process.exit();
    } else if ( !targets ) {
        printer.noTargets();
        process.exit(1);
    }

    workset = fu.lookdownFiles(targets, ['.csslintrc', '.css']);

    rcfiles = rc.validateRcs(workset['.csslintrc']);
    cssfiles = workset['.css'];
    workset = '';



    rulesets = rc.shuffleToRulesets(rcfiles, cssfiles);

    if ( defaultThreshold ) {

        csslintRules = csslint.getRules();
        u.transform(csslintRules, function(res, it){
            res[it.id] = defaultThreshold;
        }, optionsDefault);
    }


    for (base in rulesets) {
        if ( rulesets.hasOwnProperty(base) ) {
            block = rulesets[base];

            files = block.files;
            options = block.rules;
            u.merge(options, optionsCli);
            options = optionsHelper.optionsToExplicitRulesets(options);

            options = u.merge(optionsDefault, options);

            len = files.length;

            for (i = 0; i < len; i += 1) {

                input = u.readFile(files[i]);
                optionsCli.file = files[i].replace(process.cwd(), '');
                optionsCli.fullPath = files[i];

                if ( input ) {
                    result = csslint.verify(input, u.clone(options));
                } else {
                    optionsCli.isEmpty = true;
                }

                formatter = csslint.getFormatter(optionsCli.format || "text");

                rc.processFile(
                    result,
                    formatter,
                    optionsCli
                );
            }

        }
    }

    process.exit();
}

module.exports = {
    init: init,
    version: '0.0.0'
};
