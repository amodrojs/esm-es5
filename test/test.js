/*jshint node: true */
/*global describe, beforeEach, it */
'use strict';

var assert = require('assert'),
    fs = require('fs'),
    path = require('path'),
    esmEs5 = require('../esm-es5'),
    sourceDir = path.join(__dirname, 'source'),
    expectedDir = path.join(__dirname, 'expected');

var files = fs.readdirSync(sourceDir);

files.forEach(function(fileName) {
  var source = fs.readFileSync(path.join(sourceDir, fileName), 'utf8'),
      expected = fs.readFileSync(path.join(expectedDir, fileName), 'utf8');

  it(fileName, function() {
    console.log(esmEs5(source).source);
    assert.equal(expected, esmEs5(source).source);
  });

});

// Test depIds field
it('depIds found', function() {
  var source = fs.readFileSync(path.join(sourceDir, 'one.js'), 'utf8'),
      result = esmEs5(source);

  assert.equal(1, result.depIds.length);
  assert.equal('module-name', result.depIds[0]);
});

