Closure is when a function remembers and continues to access variables from outside its scope, even when the function is executed in a different scope.

```js
function greeting(msg) {
  // The inner function "who" is closed over the variable "msg" from its outer scope.
  // So when outer function "greeting" finishes running, "msg" wouldn't be garbage collect.
  // Since the inner function instances (hello and howdy) are still alive.
  return function who(name) {
    console.log(`${msg}, ${name}!`)
  }
}

var hello = greeting("Hello")
var howdy = greeting("Howdy")

hello("Kyle")
// Hello, Kyle!

hello("Sarah")
// Hello, Sarah!

howdy("Grant")
// Howdy, Grant!
```

It's not necessary that the outer scope be a function.

```js
// Here the loop is using "let" declarations.
// Each iteration gets new block-scoped "idx" and "btn" variables.
for (let [idx, btn] of buttons.entries()) {
  // The inner function "onClick" is closed over the variable "idx" from the outer scope.
  // So when the btn is clicked, it can print the associated "idx" value.
  btn.addEventListener("click", function onClick() {
    console.log(`Clicked on button (${idx})!`)
  })
}
```
