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
