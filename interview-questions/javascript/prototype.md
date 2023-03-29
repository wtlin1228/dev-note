# Prototype

## Prototype Chain

When you try to access a property of an object:
if the property can't be found in the object itself, the prototype
is searched for the property. If the property still can't be found,
then the prototype's prototype is searched, and so on until either
the property is found, or the end of the chain is reached, in which
case `undefined` is returned.

```js
const foo = {}

// Want to access the `toString` property,
// but foo itself doesn't have `toString`
// So JS will search its prototype foo.__proto__.
// And since foo's prototype is Object.prototype,
// we find Object.prototype.toString
foo.toString()
```

Note: `String.prototype.__proto__` is `Object.prototype` 😂

## Setting a Prototype

### Use `Object.create`

```js
const personPrototype = {
  greet() {
    console.log("hello!")
  },
}

const carl = Object.create(personPrototype) // carl.__proto__ = personPrototype
carl.greet()
// actually carl.__proto__.greet()
// output: hello!
```

### Use Constructor

All functions declare with `function` have a property named `prototype`.
When we use `new someFunction()`, someFunction's prototype will be set to
the newly constructed object.

Note: it's convention to capitalize the function which's going to be used as a constructor

```js
function Person(name) {
  this.name = name
}

Person.prototype.greet = () => {
  console.log(`hello ${this.name}!`)
}

const leo = new Person("leo") // leo.__proto__ = Person.prototype
leo.greet()
// actually leo.__proto__.greet()
// output: hello leo!
```
