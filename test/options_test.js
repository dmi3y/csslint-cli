'use strict';

var optionsHelper = require('../lib/options-helper.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

function footprint(meth, arg) {
  return JSON.stringify(optionsHelper[meth](arg));
}

exports.optionsHelper = {
  setUp: function(done) {
    // setup here
    done();
  },
  'parseRc': function(test) {
    var
      rcstr1 = footprint('parseRc','{"a":["b","c","d"], "e":["f"]}'),
      rcstr2 = footprint('parseRc','--a=b,c,d --e=f');

    test.equal(rcstr1, rcstr2);
    test.done();
  },
  'parseCli': function(test) {
    var
      rcstr1 = '{"options":{"a":["b","c","d"],"e":["f"]},"targets":["g","h"]}',
      rcstr2 = footprint('parseCli',['--a=b,c,d', '--e=f', 'g', 'h']);

    test.equal(rcstr1, rcstr2);
    test.done();
  }
};
