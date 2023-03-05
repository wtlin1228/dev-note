Patterns:

- `keyof Obj` is like `Object.keys` in JS world
- `Obj[keyof Obj]` is like `Object.values` in JS world
- The Builder Pattern

Useful Types Examples:

- Catch Block
- Omit and Pick
- Readonly
- Object to Union Type
- Get All Possible Values
- Wrap External Library
- Validate Value with Opaque and Type Guard
- Function Overload
- Modify Prefix / Postfix of String
- Key Mapping and Key Re-Manning
- Tuple to Optional Object
- Array with at least one Element
- Make Function Safe
- Make useStyled Safe
- Make useSelectors Safe
- Pick
- Form Validator
- Warning for Required Type
- Get Params Keys (useful for i18n)
- Translation (useful for i18n)
- Extract from Discriminated Union
- Discriminated Union to Discriminator
- Unions in Template Literals
- Non-undefined and Non-null Constraint
- Two Union Types are Sub-union of Each Other
- Never in Key Re-mapping

Workaround:

- Infer Type with F.Narrow

## The Builder Pattern

The builder pattern uses a chain of function calls to slowly
build up a larger data structure. For example:

`new DbSeeder().addUser().addPost().addPost().transact();`

```ts
interface User {
  id: string
  name: string
}

interface Post {
  id: string
  title: string
  authorId: string
}

interface DbShape {
  users: Record<string, User>
  posts: Record<string, Post>
}

export class DbSeeder<
  TDatabase extends DbShape = {
    users: {
      joel: User
    }
    posts: {}
  }
> {
  public users: DbShape["users"] = {}
  public posts: DbShape["posts"] = {}

  addUser = <TId extends string>(
    id: TId,
    user: Omit<User, "id">
  ): DbSeeder<
    TDatabase & { users: TDatabase["users"] & Record<TId, User> }
  > => {
    this.users[id] = {
      ...user,
      id: id,
    }
    return this
  }

  addPost = <TId extends string>(
    id: TId,
    // authorId can only be the existing user's id
    post: Omit<Post, "id"> & { authorId: keyof TDatabase["users"] }
  ): DbSeeder<
    TDatabase & { posts: TDatabase["posts"] & Record<TId, Post> }
  > => {
    this.posts[id] = {
      ...post,
      id,
    }
    return this
  }

  transact = async () => {
    return {
      users: this.users,
      posts: this.posts,
    } as DbSeeder<TDatabase>
  }
}

const usage = async () => {
  const result = await new DbSeeder()
    .addUser("matt", {
      name: "Matt",
    })
    .addPost("post1", {
      authorId: "matt",
      title: "Post 2",
    })
    .addPost("post2", {
      authorId: "matt",
      title: "Post",
    })
    .transact()

  result.posts.post2
}
```

## Catch Block

The catch `e` is `unknown` type so we need to narrow it down first.

```ts
const tryCatchDemo = (state: "fail" | "succeed") => {
  try {
    if (state === "fail") {
      throw new Error("Failure!")
    }
  } catch (e) {
    if (e instanceof Error) {
      return e.message
    }
  }
}
```

## Omit and Pick

```ts
interface User {
  id: string
  firstName: string
  lastName: string
}

// type MyType = {
//   firstName: string;
//   lastName: string;
// }
type MyType = Omit<User, "id">
type MyType = Pick<User, "firstName" | "lastName">
```

## Readonly

Use `as const` to make properties of an object readonly.

You can also achieve this with `Object.freeze`, but this only
works one level deep on objects. `as const` works recursively
down the entire object.

```ts
const programModeEnumMap = {
  GROUP: "group",
  ANNOUNCEMENT: "announcement",
  ONE_ON_ONE: "1on1",
  SELF_DIRECTED: "selfDirected",
  PLANNED_ONE_ON_ONE: "planned1on1",
  PLANNED_SELF_DIRECTED: "plannedSelfDirected",
} as const
```

## Object to Union Type

`as const` is crucial to deriving types from config objects.

We can access objects via a union type to RETURN a union type.

```ts
const programModeEnumMap = {
  GROUP: "group",
  ANNOUNCEMENT: "announcement",
  ONE_ON_ONE: "1on1",
  SELF_DIRECTED: "selfDirected",
  PLANNED_ONE_ON_ONE: "planned1on1",
  PLANNED_SELF_DIRECTED: "plannedSelfDirected",
} as const

// type Program = "group" | "announcement" | "1on1" | "selfDirected" | "planned1on1" | "plannedSelfDirected"
type Program = ProgramMap[keyof typeof programModeEnumMap]

// type IndividualProgram = "1on1" | "selfDirected" | "planned1on1" | "plannedSelfDirected"
export type IndividualProgram = ProgramMap[
  | "ONE_ON_ONE"
  | "SELF_DIRECTED"
  | "PLANNED_ONE_ON_ONE"
  | "PLANNED_SELF_DIRECTED"]
```

## Get All Possible Values

`number` is treated as a union type here like we write `0 | 1 | 2 | 3 | 4` directly.

```ts
const userAccessModel = {
  user: ["update-self", "view"],
  admin: ["create", "update-self", "update-any", "delete", "view"],
  anonymous: ["view"],
} as const

// type Role = "user" | "admin" | "anonymous"
type Role = keyof typeof userAccessModel
// type Action = "update-self" | "view" | "create" | "update-any" | "delete"
type Action = typeof userAccessModel[Role][number]
```

## Wrap External Library

<!-- prettier-ignore -->
```ts
import { fetchUser } from "external-lib"

type WrapAsyncFunction<
  T extends (...args: any) => any, 
  U = {}
> = (
  ...args: Parameters<T>
) => Promise<Awaited<ReturnType<T>> & U>

export const fetchUserWithFullName: WrapAsyncFunction<
  typeof fetchUser,
  { fullName: string; agePlus10: number }
> = async (...args) => {
  const user = await fetchUser(...args)
  return {
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
    agePlus10: user.age + 10,
  }
}
```

## Validate Value with Opaque and Type Guard

```ts
type Opaque<TValue, TOpaque> = TValue & {
  __: TOpaque
}

type ValidEmail = Opaque<string, "ValidEmail">
type ValidAge = Opaque<number, "ValidAge">
```

Use type predicates as type guard:

```ts
const isValidEmail = (email: string): email is ValidEmail => {
  return email.includes("@")
}
```

ref: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates

Use assertion functions as type guard:

```ts
function assertsValidEmail(email: string): asserts email is ValidEmail {
  throw new Error("Invalid email")
}
```

ref: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions

## Function Overload

```ts
export function nonNullQuerySelector<K extends keyof HTMLElementTagNameMap>(
  tag: K
): HTMLElementTagNameMap[K]
export function nonNullQuerySelector(tag: string) {
  const element = document.querySelector(tag)

  if (!element) {
    throw new Error(`Element not found with tag: ${tag}`)
  }

  return element
}

function onLoad() {
  const result = nonNullQuerySelector("body")
  result.addEventListener("gamepadconnected", (e) => {
    console.log(e.gamepad)
  })
}
```

## Modify Prefix / Postfix of String

```ts
type RemovePrefix<
  TPrefix extends string,
  TString
> = TString extends `${TPrefix}${infer TSuffix}` ? TSuffix : TString

// type Phone = "900555888"
type Phone = RemovePrefix<"+886", "+886900555888">
// type Longitude = "longitude"
type Longitude = RemovePrefix<"maps:", "maps:longitude">

type AddPostfix<
  TString extends string,
  TPostfix extends string
> = `${TString}${TPostfix}`

// type Address = "Address(optional)"
type Address = AddPostfix<"Address", "(optional)">
```

## Key Mapping and Key Re-Manning

Re-map the keys while still retaining the original key as a variable.

ref: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html

```ts
type MappedTypeWithNewProperties<Type> = {
  [Properties in keyof Type as NewKeyType]: Type[Properties]
}
```

## Tuple to Optional Object

`["a", "b", "c"]` to `{ a?: string, b?: string, c?: string }`

```ts
type TupleToObject<TTuple extends string[]> = Partial<
  Record<TTuple[number], string>
>
// OR
type TupleToObject<TTuple extends string[]> = {
  [Key in TTuple[number]]?: string
}
```

## Array with at least one Element

```ts
type AtLeastOneString = [string, ...string[]]

const emptyArray: AtLeastOneString = []
/**
 * ⛔️
 * Type '[]' is not assignable to type 'AtLeastOneString'.
 * Source has 0 element(s) but target requires 1.
 */
```

## Make Function Safe

```ts
const makeSafe =
  <TFunc extends (...args: any[]) => any>(func: TFunc) =>
  (
    ...args: Parameters<TFunc>
  ):
    | {
        type: "success"
        result: ReturnType<TFunc>
      }
    | {
        type: "failure"
        error: Error
      } => {
    try {
      const result = func(...args)

      return {
        type: "success",
        result,
      }
    } catch (e) {
      return {
        type: "failure",
        error: e as Error,
      }
    }
  }
```

## Make useStyled Safe

```ts
const makeUseStyled = <TTheme = {}>() => {
  const useStyled = (func: (theme: TTheme) => CSSProperties) => {
    // Imagine that this function hooks into a global theme
    // and returns the CSSProperties
    return {} as CSSProperties
  }

  return useStyled
}

interface MyTheme {
  color: {
    primary: string
  }
  fontSize: {
    small: string
  }
}

const useStyled = makeUseStyled<MyTheme>()

const buttonStyle = useStyled((theme) => ({
  color: theme.color.primary,
  fontSize: theme.fontSize.small,
}))

const divStyle = useStyled((theme) => ({
  backgroundColor: theme.color.primary,
}))
```

## Make useSelectors Safe

```ts
export const makeSelectors =
  <TSource>() =>
  <TSelectors extends Record<string, (source: TSource) => any>>(
    selectors: TSelectors
  ): TSelectors => {
    return selectors
  }

interface Source {
  firstName: string
  middleName: string
  lastName: string
}

/**
 * const selectors: {
 *   getFullName: (source: Source) => string;
 *   getFirstAndLastName: (source: Source) => string;
 *   getFirstNameLength: (source: Source) => number;
 * }
 */
const selectors = makeSelectors<Source>()({
  getFullName: (source) =>
    `${source.firstName} ${source.middleName} ${source.lastName}`,
  getFirstAndLastName: (source) => `${source.firstName} ${source.lastName}`,
  getFirstNameLength: (source) => source.firstName.length,
})
```

## Pick

```ts
const pick = <TObj extends Record<string, any>, TPicked extends keyof TObj>(
  obj: TObj,
  picked: TPicked[]
) => {
  return picked.reduce((acc, key) => {
    acc[key] = obj[key]
    return acc
  }, {} as Pick<TObj, TPicked>)
}

// result = { a: number; b: string }
const result = pick(
  {
    a: 1,
    b: "2",
    c: 3,
  },
  ["a", "b"]
)
```

## Form Validator

```ts
const makeFormValidatorFactory =
  <TValidateType extends string>(
    validators: Record<TValidateType, (value: string) => string | void>
  ) =>
  <TObjKey extends string>(config: Record<TObjKey, TValidateType[]>) => {
    return <TValues extends Record<TObjKey, string>>(values: TValues) => {
      const errors = {} as Record<TObjKey, string | undefined>

      for (const key in config) {
        for (const validator of config[key]) {
          const error = validators[validator](values[key])
          if (error) {
            errors[key] = error
            break
          }
        }
      }

      return errors
    }
  }

const createFormValidator = makeFormValidatorFactory({
  required: (value) => {
    if (value === "") {
      return "Required"
    }
  },
  minLength: (value) => {
    if (value.length < 5) {
      return "Minimum length is 5"
    }
  },
  email: (value) => {
    if (!value.includes("@")) {
      return "Invalid email"
    }
  },
})

const validateUser = createFormValidator({
  id: ["required"],
  username: ["required", "minLength"],
  email: ["required", "email"],
})

// const errors: Record<"email" | "id" | "username", string | undefined>
const errors = validateUser({
  id: "1",
  username: "john",
  email: "Blah",
})
```

## Warning for Required Type

```ts
const fetchData = async <
  TResult = "You must pass a type argument to fetchData"
>(
  url: string
): Promise<TResult> => {
  const data = await fetch(url).then((response) => response.json())
  return data
}

// const data: { name: string; }
const data = await fetchData<{ name: string }>("https://swapi.dev/api/people/1")

// const data: "You must pass a type argument to fetchData"
const data = await fetchData("https://swapi.dev/api/people/1")
```

## Get Params Keys (useful for i18n)

```ts
type GetParamKeys<TTranslation extends string> = TTranslation extends ""
  ? []
  : TTranslation extends `${string}{${infer Param}}${infer Tail}`
  ? [Param, ...GetParamKeys<Tail>]
  : []

type GetParamKeysAsUnion<TTranslation extends string> =
  GetParamKeys<TTranslation>[number]

// type ParamKeys = "firstName" | "lastName"
type ParamKeys = GetParamKeysAsUnion<"Hello, {firstName} {lastName}.">
```

Split path with the same logic:

```ts
type Path = "Users/John/Documents/notes.txt"

type SplitPath<S extends string> = S extends ""
  ? []
  : S extends `${infer T}/${infer U}`
  ? [T, ...SplitPath<U>]
  : [S]

// type PathAfterSplit = ["Users", "John", "Documents", "notes.txt"]
type PathAfterSplit = SplitPath<Path>
```

## Translation (useful for i18n)

```ts
type GetParamKeys<TTranslation extends string> = TTranslation extends ""
  ? []
  : TTranslation extends `${string}{${infer Param}}${infer Tail}`
  ? [Param, ...GetParamKeys<Tail>]
  : []

type GetParamKeysAsUnion<TTranslation extends string> =
  GetParamKeys<TTranslation>[number]

const translate = <
  TTranslations extends Record<string, string>,
  TKey extends keyof TTranslations,
  TParamKeys = GetParamKeysAsUnion<TTranslations[TKey]>
>(
  translations: TTranslations,
  key: TKey,
  params?: TParamKeys extends string ? Record<TParamKeys, string> : never
) => {
  const translation = translations[key]

  if (!params) {
    return translation
  }

  return translation.replace(
    /{(\w+)}/g,
    (_, paramKey) => params[paramKey as TParamKeys]
  )
}

const translations = {
  title: "Hello, {name}, {something}!",
  subtitle: "You have {count} unread messages.",
  button: "Click me!",
} as const

const buttonText = translate(translations, "button")
const title = translate(translations, "title", {
  name: "leo",
  something: "have a nice day",
})
```

## Extract from Discriminated Union

```ts
export type Event =
  | {
      type: "click"
      event: MouseEvent
    }
  | {
      type: "focus"
      event: FocusEvent
    }
  | {
      type: "keydown"
      event: KeyboardEvent
    }

// type ClickEvent = {
//   type: "click";
//   event: MouseEvent;
// }
type ClickEvent = Extract<Event, { type: "click" }>

// type NonKeyDownEvents =
//   | {
//       type: "click"
//       event: MouseEvent
//     }
//   | {
//       type: "focus"
//       event: FocusEvent
//     }
type NonKeyDownEvents = Exclude<Event, { type: "keydown" }>
```

## Discriminated Union to Discriminator

```ts
export type Event =
  | {
      type: "click"
      event: MouseEvent
    }
  | {
      type: "focus"
      event: FocusEvent
    }
  | {
      type: "keydown"
      event: KeyboardEvent
    }

// type EventType = "click" | "focus" | "keydown"
type EventType = Event["type"]
```

## Unions in Template Literals

```ts
type BreadType = "rye" | "brown" | "white"

type Filling = "cheese" | "ham" | "salami"

// type Sandwich =
//   | "rye sandwich with cheese"
//   | "rye sandwich with ham"
//   | "rye sandwich with salami"
//   | "brown sandwich with cheese"
//   | "brown sandwich with ham"
//   | "brown sandwich with salami"
//   | "white sandwich with cheese"
//   | "white sandwich with ham"
//   | "white sandwich with salami"
type Sandwich = `${BreadType} sandwich with ${Filling}`
```

## Non-undefined and Non-null Constraint

Only `undefined` and `null` don't extend `{}`.

ref: https://stackoverflow.com/questions/61648189/typescript-generic-type-parameters-t-vs-t-extends

```ts
export type Maybe<T extends {}> = T | null | undefined

type tests = [
  // @ts-expect-error
  Maybe<null>,
  // @ts-expect-error
  Maybe<undefined>,

  Maybe<string>,
  Maybe<false>,
  Maybe<0>,
  Maybe<"">,
  Maybe<{ a: 1 }>,
  Maybe<[]>
]
```

## Two Union Types are Sub-union of Each Other

Determine whether two union types are sub-union of each other.

```ts
type Fruit = "apple" | "banana" | "orange"

// type A = never
type A = Fruit extends "apple" | "banana"
  ? "Fruit extends (apple | banana)"
  : never

// type B = "(apple | banana) extends Fruit"
type B = "apple" | "banana" extends Fruit
  ? "(apple | banana) extends Fruit"
  : never

// type C = "(apple | banana) is the subset of Fruit"
type C = Fruit extends infer T
  ? T extends "apple" | "banana"
    ? "(apple | banana) is the subset of Fruit"
    : never
  : never
```

## Never in Key Re-mapping

```ts
interface Example {
  name: string
  age: number
  id: string
  organizationId: string
  groupId: string
}

type KeyWithId = `${string}${"id" | "Id"}${string}`

type OnlyIdKeys<T> = {
  [K in keyof T as K extends KeyWithId ? K : never]: T[K]
}

// type Result = {
//   id: string
//   organizationId: string
//   groupId: string
// }
type Result = OnlyIdKeys<Example>
```

## Infer Type with F.Narrow

In order not to ask users to add `as const` when they call the functions, we need some workaround.

See: https://millsp.github.io/ts-toolbelt/modules/function_narrow.html

TypeScript 5.0.beta approaches a new `const` Type Parameters.
Maybe we don't need F.Narrow anymore?

ref: https://devblogs.microsoft.com/typescript/announcing-typescript-5-0-beta/#const-type-parameters

# TS Reset

https://github.com/total-typescript/ts-reset

# Learning Resource

- [Total TypeScript](https://github.com/total-typescript)
  - beginners-typescript-tutorial
  - advanced-typescript-workshop
  - typescript-generics-workshop
  - type-transformations-workshop
  - zod-tutorial
  - advanced-patterns-workshop (WIP)
