# Benefit

Strict mode changes some previously-accepted mistakes into errors.

For example, assigning to undeclared variables will throw error in strict mode.

```js
"use strict"

x = 17 // Uncaught ReferenceError: x is not defined
```

# How to use

Strict mode can be applied to entire scripts or to individual functions.

```js
"use strict"
```

```js
function foo() {
  "use strict"
}
```
