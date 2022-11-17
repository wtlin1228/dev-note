A component render is considered "wasted" if it returns the same requested elements as before. Normally, `UI = f(props + state)`, so if props and state haven't changed, the UI output should be the same.

We can optimize performance by skipping component renders if props haven't changed. This also skips the entire subtree of that component.

Primary: wrap a component with the `React.memo()` higher-order component

- Automatically checks for props changes with "shallow equality" comparison
- Accepts a custom comparison callback as an option

One other little-known technique: **return the same element reference as the last render**, and React will skip rendering that component. Can use `useMemo` to save an element reference, or use `props.children`:

```jsx
function ComponentA({ data }) {
  // Consistent `ChildComponent` element reference
  const memoizedChild = useMemo(() => {
    return <ChildComponent data={data}>
  }, [data])

  return <div>{memoizedChild}</div>
}
```

```jsx
function Parent({ children }) {
  const [counter, setCounter] = useState(0)

  // Consistent `props.children` element reference as state changes
  return (
    <div>
      <button onClick={increment}>Increment</button>
      {children}
    </div>
  )
}

// later
return (
  <Parent>
    <SomeChild />
  </Parent>
)
```

Differences between approaches:

- `React.memo()`: controlled by the child component
- Same-element references: controlled by the parent component
