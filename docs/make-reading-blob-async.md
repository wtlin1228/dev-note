This way to read a file is synchronous.

```js
const reader = new FileReader()
reader.onload = function () {
  const buffer = reader.result
  // ...
}
reader.onerror = function () {
  // ...
}
reader.readAsArrayBuffer(blob)
```

Turn it into asynchronous with `Request`.

```js
try {
  const buffer = await new Response(blob).arrayBuffer()
  // ...
} catch (err) {
  // ...
}
```
