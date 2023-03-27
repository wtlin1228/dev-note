`this` is best described as an execution context.
It's dynamic and depends on how it is called.

While the scope is always the same object for a function,
`this` is determined each time the function is called.

```js
function classroom(teacher) {
  // `study` is a this-aware function.
  // `study` is also closed over the `teacher` variable from its outer scope.
  return function study() {
    console.log(`${teacher} says to study ${this.topic}`)
  }
}

var assignment = classroom("Kyle")
```

Call `assignment` without providing it any execution context.
In this case, `this` is set to the global object by default.
So `global.topic` is undefined.

```js
assignment()
// Kyle says to study undefined  -- Oops :(
```

Put assignment into the `homework` object then call it with `homework.assignment()`.
The `this` for this function call will be the `homework` object.
Hence, `this.topic` resolves to `"JS"`

```js
var homework = {
  topic: "JS",
  assignment: assignment,
}

homework.assignment()
// Kyle says to study JS
```

Invoke assignment with `call(...)`. The argument will be set to `this` object.
So `this.topic` resolves to `"Math"`.

```js
var otherHomework = {
  topic: "Math",
}

assignment.call(otherHomework)
// Kyle says to study Math
```
