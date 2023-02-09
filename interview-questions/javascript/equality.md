# What's the differences between `==`, `===` and `Object.is` in JavaScript?

## `==` Loose Equality

Loose equality is uncommon in modern codebases.

Loose equality will implicitly convert the two values to the same types before doing the comparison.

## `===` Strict Equality

Strict equality won't implicitly convert the values before doing the comparison.
If the values have different types, the values are considered unequal.
If the values have the same type, are not numbers, and have the same value, they are considered equal.
Finally, if both values are numbers, they're considered equal if they're both not `NaN` and the same value, or if one if `+0` and one is `-0`.

## `Object.is` Same-value equality

In almost all cases, `Object.is` works the same as strict equality.
The differences are `NaN` and positive zero and negative zero.

```js
console.log(-0 === 0) // true
console.log(+0 === 0) // true
console.log(-0 === +0) // true
console.log(NaN === NaN) // false

Object.is(-0, 0) // false
Object.is(+0, 0) // true
Object.is(-0, +0) // false
Object.is(NaN, NaN) // true
```
