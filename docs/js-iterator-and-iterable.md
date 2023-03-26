The interface of `Iterator` and `Iterable` are defined in `lib.es2015.iterable.d.ts`.

```ts
interface Iterator<T, TReturn = any, TNext = undefined> {
  // NOTE: 'next' is defined using a tuple to ensure we report the correct assignability errors in all places.
  next(...args: [] | [TNext]): IteratorResult<T, TReturn>
  return?(value?: TReturn): IteratorResult<T, TReturn>
  throw?(e?: any): IteratorResult<T, TReturn>
}

interface Iterable<T> {
  [Symbol.iterator](): Iterator<T>
}
```

Create a example iterable data structure so we can use it like this:

```ts
const exampleIterable = new ExampleIterable<number>([1, 2, 3])

const exampleIterator = exampleIterable.values()
exampleIterator.next() // 1
const exampleIterator2 = exampleIterator[Symbol.iterator]()
exampleIterator.next() // 2

// spread on exampleIterable will call the exampleIterable.values() and get a new iterator
// exampleIterator2 had called next() twice, so spread on it only give us a "3"
const useWithSpread = [...exampleIterable, ...exampleIterator2] // [1, 2, 3, 3]

// 1
// 2
// 3
for (let item of exampleIterable) {
  console.log(item)
}
```

Implementation:

```ts
class ExampleIterator<T> implements IterableIterator<T> {
  private index = 0
  private readonly items: T[]

  constructor(items: T[]) {
    this.items = items
  }

  // Iterator<T> interface
  next(): IteratorResult<T> {
    if (this.index < this.items.length) {
      const result = { value: this.items[this.index], done: false }
      this.index++
      return result
    }
    return { value: undefined, done: true }
  }

  // IterableIterator<T> interface
  [Symbol.iterator](): IterableIterator<T> {
    return this
  }
}

class ExampleIterable<T> {
  private readonly data: T[]

  constructor(data: T[]) {
    this.data = data
  }

  showData(): T[] {
    return this.data
  }

  values(): ExampleIterator<T> {
    return this[Symbol.iterator]()
  }

  [Symbol.iterator](): ExampleIterator<T> {
    return new ExampleIterator<T>(this.data)
  }
}
```
