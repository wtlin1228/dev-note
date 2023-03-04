When returning the value only, it infers the literal type.

```ts
const returnsValueOnly = <T>(t: T) => {
  return t
}

// const result: "a"
const result = returnsValueOnly("a")
```

When returning an object or array, it doesn't infer the literal type

```ts
const returnsValueInAnObject = <T1>(t: T1) => {
  return {
    t,
  }
}

// const result2: {
//   t: string;
// }
const result2 = returnsValueInAnObject("abc")
```

With a constraint, it narrows it to its literal

```ts
const returnsValueInAnObjectWithConstraint = <T1 extends string>(t: T1) => {
  return {
    t,
  }
}

// const result3: {
//   t: "abc";
// }
const result3 = returnsValueInAnObjectWithConstraint("abc")
```

When inputting the value only, it infers the literal type

```ts
const acceptsValueOnly = <T>(t: T) => {
  return t
}

// const result = "a"
const result = acceptsValueOnly("a")
```

When inputting an object, it doesn't infer the literal type

```ts
const acceptsValueInAnObject = <T>(obj: { input: T }) => {
  return obj.input
}

// const result2: string
const result2 = acceptsValueInAnObject({ input: "abc" })

// const result2WithAsConst: "abc"
const result2WithAsConst = acceptsValueInAnObject({ input: "abc" } as const)
```

With a constraint, it narrows it to its literal

```ts
const acceptsValueInAnObjectFieldWithConstraint = <T extends string>(obj: {
  input: T
}) => {
  return obj.input
}

// const result3: "abc"
const result3 = acceptsValueInAnObjectFieldWithConstraint({ input: "abc" })
```

With a constraint in the object level, it doesn't narrow it to its literal

```ts
const acceptsValueWithObjectConstraint = <
  T extends {
    input: string
  }
>(
  obj: T
) => {
  return obj.input
}

// const result4: string
const result4 = acceptsValueWithObjectConstraint({ input: "abc" })

// const result4: string
const result4WithAsConst = acceptsValueWithObjectConstraint({
  input: "abc",
} as const)
```
