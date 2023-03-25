# CommonJS (CJS)

```js
"use strict"

const uppercase = (x) => {
  return x.toUpperCase()
}

function sayHello(name) {
  console.log(`hello ${uppercase(name)}`)
}

exports.sayHello = sayHello
```

# ES Modules (ESM)

1. The wrapping context is a file. ESMs are always file-based; one file, one module.
2. Thing stays hidden if it's not exported with `export` keyword.
3. ESMs are singletons. There's only one instance ever created, at first import in your program,
   and all other imports just receive a reference to that same single instance.

```js
const uppercase = (x) => {
  return x.toUpperCase()
}

function sayHello(name) {
  console.log(`hello ${uppercase(name)}`)
}

export { sayHello }
```

# UMD

```js
;(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? factory(exports)
    : typeof define === "function" && define.amd
    ? define(["exports"], factory)
    : ((global =
        typeof globalThis !== "undefined" ? globalThis : global || self),
      factory((global.sayHello = {})))
})(this, function (exports) {
  "use strict"

  const uppercase = (x) => {
    return x.toUpperCase()
  }

  function sayHello(name) {
    console.log(`hello ${uppercase(name)}`)
  }

  exports.sayHello = sayHello
})
```

# AMD

```js
define(["exports"], function (exports) {
  "use strict"

  const uppercase = (x) => {
    return x.toUpperCase()
  }

  function sayHello(name) {
    console.log(`hello ${uppercase(name)}`)
  }

  exports.sayHello = sayHello
})
```
