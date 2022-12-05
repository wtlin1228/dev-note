Implementation:

```jsx
const liteStyled = {}

const getUniqueClassName = () => "unique-class-name"
const getRules = (className, styles) => `.${className} { ${styles} }`

const Insertion = ({ rules }) => {
  return <style dangerouslySetInnerHTML={{ __html: rules }} />
}

liteStyled.button = (...args) => {
  const FinalTag = "button"

  return (props) => {
    const className = getUniqueClassName()
    const rules = getRules(className, args[0][0].trim())

    return (
      <>
        <Insertion rules={rules} />
        <FinalTag {...props} className={className} />
      </>
    )
  }
}
```

Use it:

```jsx
const StyledButton = liteStyled.button`
  padding: 32px;
  background-color: hotpink;
  font-size: 24px;
  border-radius: 4px;
  color: black;
  font-weight: bold;
`

export function Example(props: TextProps) {
  return (
    <StyledButton>Button1</StyledButton>
    <StyledButton>Button2</StyledButton>
  )
}
```
