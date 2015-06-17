

## todo

* replace identifiers for simulateCycle option. But won't support var a; export a; a = 5; So maybe not even try to support it? Well, can help simple cycle case where just need to wait for first assignment.
* option around define() wrapping.
* hack in support for a module meta? `import { require, normalize } from module`?

---

No `export *` support. May be added later. Instead, use named exports for clearer expression of intention, split exports into separate files for better granular consumption.

