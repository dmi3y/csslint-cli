'use strict';

var
    optionsHelper = require('../lib/helper.js'),
    // _ = require('lodash'),
    cwd_backup;

function footprint(meth/*, arguments*/) {
  var
    args = arguments,
    tostr;

  if ( optionsHelper[meth] ) {

    Array.prototype.shift.call(args);
    tostr = optionsHelper[meth].apply(optionsHelper, args);
  } else {

    tostr = meth;
  }

  return JSON.stringify(tostr);
}

exports.optionsHelper = {
  setUp: function(done) {
    cwd_backup = process.cwd();
    done();
  },
  tearDown: function(done) {
    process.chdir(cwd_backup);
    done();
  },
  'parseRc': function(test) {
    var
      rcstr1 = footprint('parseRc','{"a":["b","c","d"], "e":["f"]}'),
      rcstr2 = footprint('parseRc','--a=b,c,d --e=f');

    test.expect(1);
    test.equal(rcstr1, rcstr2);
    test.done();
  },

  'parseCli': function(test) {
    var
      rcstr1 = '{"options":{"a":["b","c","d"],"e":["f"]},"targets":["g","h"]}',
      rcstr2 = footprint('parseCli',['--a=b,c,d', '--e=f', 'g', 'h']);

    test.expect(1);
    test.equal(rcstr1, rcstr2);
    test.done();
  },

  'filterUnknown': function(test) {
    var
      fulllist = {
        ignore:1,
        warnings:1,
        errors:1,

        help:1,
        version:1,
        format:1,
        quiet:1,
        'exclude-list':1,
        'list-rules':1
      },
      rcstr1 = 'null',
      rcstr2 = footprint('filterUnknown', fulllist),

      rcstr3 = '["help","version","format","quiet","exclude-list","list-rules"]',
      rcstr4 = footprint('filterUnknown', fulllist, 'main'),

      rcstr5 = '["ignore","warnings","errors"]',
      rcstr6 = footprint('filterUnknown', fulllist, 'cli');

    test.expect(3);
    test.equal(rcstr1, rcstr2, 'all options');
    test.equal(rcstr3, rcstr4, 'main options');
    test.equal(rcstr5, rcstr6, 'cli options');

    test.done();
  },

  'optionsToExplicitRulesets': function(test) {
    var
      rcstr1 = '{"a":0,"b":0,"c":0,"d":0,"e":1,"f":1,"g":1,"h":2,"i":2,"j":2,"k":2}',
      rcstr2 = footprint('optionsToExplicitRulesets',{
        "ignore":["a","b","c","d"],
        "warnings":["e","f","g"],
        "errors":["h","i","j","k"]
      }),
      rcstr3 = footprint('optionsToExplicitRulesets',{
        "a":"0","b":"false","c":false,"d":0,
        "e":"1","f":"","g":1,
        "h":"2","i":"true","j":true,"k":2
      });
    test.expect(2);
    test.equal(rcstr1, rcstr2);
    test.equal(rcstr1, rcstr3);

    test.done();
  },

  'checkExternalRc': function(test) {
    var
      externalRc,
      expPath = 'csslint-cli\\test\\assets\\.csslintrc',
      expOpt = '{"warnings":["id","zero-units"],"errors":["include"]}',
      resOpt;

    process.chdir('./test/assets/1/2/');
    externalRc = optionsHelper.checkExternalRc();
    resOpt = footprint(externalRc.options);

    test.expect(2);
    test.equal(expOpt, resOpt);
    test.ok(externalRc.path.indexOf(expPath) > 0);

    test.done();
  }
};
