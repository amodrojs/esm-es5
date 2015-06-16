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
