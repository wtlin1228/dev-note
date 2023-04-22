# Scope Chain

When a function (declaration or expression) is defined, a new scope is created. The positioning of scopes nested inside one another creates a natural scope hierarchy throughout the program, called the scope chain. The scope chain controls variable access, directionally oriented upward and outward.

# Scope Shadowing

Each new scope offers a clean slate, a space to hold its own set of variables. When a variable name is repeated at different levels of the scope chain, shadowing occurs, which prevents access to the outer variable from that point inward.

# Global Scope

Only `var` and `function` declaration will be added into global scope object:

```js
var user = "Leo"
let phone = "xxx"

console.log(window.user) // 'Leo'
console.log(window.phone) // undefined
```

We can get global scope object by:

````js
const theGlobalScopeObject =
    (typeof globalThis != "undefined") ? globalThis :
    (typeof global != "undefined") ? global :
    (typeof window != "undefined") ? window :
    (typeof self != "undefined") ? self :
    (new Function("return this"))();
    ```
````
