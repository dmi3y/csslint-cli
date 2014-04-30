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
    cliOptions = require('./clioptions'),
    optionsMap = {
        'ignore': 0,
        'warnings': 1,
        'errors': 2
    },
    valueMap = {
        'false': optionsMap.ignore, // false is ignore
        '': optionsMap.warnings,    // blank is warning
        'true': optionsMap.errors,  // true is error

        '0': optionsMap.ignore,    // explicit ignore
        '1': optionsMap.warnings,  // explicit warning
        '2': optionsMap.errors     // explicit error
    },
    defaultThreshold = optionsMap.warnings;

module.exports = {

	parseCli: function (arrg) {

	    var
	    options = require('minimist')(arrg),
	        files = options._;

	    delete options._;

	    return {
	        options: options,
	        files: files
	    };
	},

	filterUnknown: function (options) {
	    var
	        out = [];

	    _.forOwn(options, function(it, ix){
	        if ( !cliOptions.hasOwnProperty(ix) ) {
	            out.push(ix);
	        }
	    });

	    return out.length? out: false;
	}
};
