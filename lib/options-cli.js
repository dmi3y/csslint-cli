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
    cliOptions = require('./clioptions');

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
