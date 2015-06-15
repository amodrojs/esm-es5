'use strict';

var esprima = require('esprima');

var hasOwn = Object.prototype.hasOwnProperty;
function hasProp(obj, prop) {
  return hasOwn.call(obj, prop);
}

//From an esprima example for traversing its ast.
function traverse(object, visitor) {
  var key, child;

  if (!object) {
    return;
  }

  if (visitor.call(null, object) === false) {
    return false;
  }
  for (key in object) {
    if (object.hasOwnProperty(key)) {
      child = object[key];
      if (typeof child === 'object' && child !== null) {
        if (traverse(child, visitor) === false) {
          return false;
        }
      }
    }
  }
}

function translateImport(node, simulateCycle) {
  var translation = {
    range: node.range,
    ids: {},
    result: ''
  };

  translation.range[1] = node.source.range[1];

  var ids = translation.ids;
  var hasIds = !!node.specifiers.length;
  var result = '';

  var depId = translation.depId = node.source.value;

  node.specifiers.forEach(function(specifier) {
    var imported,
        local = specifier.local.name;

    if (specifier.type === 'ImportDefaultSpecifier') {
      imported = 'default';
    } else if (specifier.imported) {
      imported = specifier.imported.name;
    }

    if (simulateCycle) {
      ids[local] = imported;
    } else {
      result += 'var ' + local + ' = require(\'' + depId + '\')';
      if (imported) {
        result += '.' + imported;
      }
    }
  });

  if (!hasIds) {
    // Just a bare import 'something', no local identifiers, so just write out
    // a require call.
    result = 'require(\'' + depId + '\')';
  }

  translation.result = result;

  return translation;
}


module.exports = function(source, options) {
  options = options || {};

  var translations = [];

  var ast = esprima.parse(source, {
    range: true,
    tolerant: true
  });

  // console.log(source);
  // console.log(JSON.stringify(ast, null, '  '));

  var ids = {};

  traverse(ast, function(node) {
    var translation;

    if (node.type === 'ImportDeclaration') {
      translation = translateImport(node);

      if (options.simulateCycle) {
        Object.keys(translation.ids).forEach(function(key) {
          ids[key] = translation.ids[key];
        });
      }

      translations.push(translation);
    }

  });

  // No ES module syntax found? Then no translation needed, just return the
  // original source.
  if (!translations.length) {
    return {
      translated: false,
      source: source
    };
  }

  // Reverse the matches, need to start from the bottom of the file to modify
  // it, so that the ranges are still true further up.
  translations.reverse();

  translations.forEach(function(translation) {
    source = source.substring(0, translation.range[0]) +
             translation.result +
             source.substring(translation.range[1]);
  });

  return {
    translated: true,
    source: source
  };
};
