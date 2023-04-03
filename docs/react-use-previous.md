```ts
export const usePreviousPersistent = (value, isEqualFunc) => {
  const [state, setState] = useState({
    value: value,
    prev: null,
  })

  const current = state.value

  if (isEqualFunc ? !isEqualFunc(value, current) : value !== current) {
    setState({
      value: value,
      prev: current,
    })
  }

  return state.prev
}
```

usage:

```ts
export const Price = (props) => {
  const prevPrice = usePrevious(
    price,
    (prev, current) => prev.price === current.price
  )
}
```

or

```ts
const prevData = usePrevious(price, (prev, current) => prev.id === current.id)
```
