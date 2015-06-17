# esm-es5

Converts ES2015 module syntax to ES5 code that can be used in an AMD or CommonJS module system.

Does not support all of ES2015 syntax, like classes or fat arrows, just does some light translation work related to `import` and `export`.

Used in some [amodro-lifecycle](https://github.com/amodrojs/amodro-lifecycle) projects to validate lifecycle and module system interoperability.

## Usage

```javascript
// source is the String contents of a module, options is an object.
var esmResult = esmEs5(source, options);

// esmResult has these properties:
// Indicates if import or export use was detected and converted.
esmResult.translated = Boolean;

// The converted soure. If translated is false, this is just
// the input source.
esmResult.source = String;

// If tranlated, an array of import dependency IDs.
esmResult.ids = Array;
```

### Options

Right now there are no options, but a `simulateCycle` option is planned. It will
replace the identifier for an import with a module meta get call, to simulate the kind of cycle support possible in a true ES2015 module system. It will not be an exact simulation (for example, it cannot handle export var assignments outside the initial export statement), but will help the most common type of cycle resolution with declarative exports that only assign in the export statement.

## Transforms not supported

No `export *` support. May be added later. Instead, use named exports for clearer expression of intention, split exports into separate files for better granular consumption.

`export default ClassDeclaration` not supported because supporting `class` transpiling is not a goal of this project.

There could be some other cases not handled yet, but likely just mistakenly overlooked, feel free to file issues with examples.

See the test/source directory for source forms supported, and test/expected for the translated ES5 result.

## todo

* replace identifiers for simulateCycle option. Won't support var a; export a; a = 5;, but still useful.
* hack in support for a module meta? `import { require, normalize } from module`?
