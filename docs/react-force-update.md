Use `useReducer` can make the code cleaner.

```js
const [, forceRender] = useReducer((c) => c + 1, 0)
```
