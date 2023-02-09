# How many data types does JavaScript have? How to determine the data type of a variable?

## Primitive Values

They are a permanent part of our JavaScript universe.
We can point to them, but we can’t create, destroy, or change them.
We can’t change primitive values because they are immutable.

1. Undefined (undefined), used for unintentionally missing values.
2. Null (null), used for intentionally missing values.
3. Booleans (true and false), used for logical operations.
4. Numbers (-100, 3.14, and others), used for math calculations.
5. BigInts (uncommon and new), used for math on big numbers.
6. Strings ("hello", "abracadabra", and others), used for text.
7. Symbols (uncommon), used to perform rituals and hide secrets.

## Objects and Functions

Objects and functions are also values but, unlike primitive values, I can manipulate them from my code.

## Checking a Type

```js
typeof undefined // "undefined"
typeof null // "object" 🥵 it's a JavaScript bug
typeof true // "boolean"
typeof 2 // "number"
typeof BigInt(1) // "bigint"
typeof "hello" // "string"
typeof Symbol("leo") // "symbol"

typeof {} // "object"
typeof [] // "object"
typeof ((x) => x * 2) // "function"
```
