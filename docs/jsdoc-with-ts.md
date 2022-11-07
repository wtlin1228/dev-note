Declare a `Product` interface in type file.

```ts
// src/declarations/product.d.ts
export interface Product {
  id: string
  name: string
  imageUrl?: string
}
```

Then use it in JS file:

```js
/** @typedef {import("../declarations/product").Product} Product */

/**
 * @param {name} string product name
 * @returns {Product} a product
 */
const createProduct = (name) => {
  /* ... */
}
```
