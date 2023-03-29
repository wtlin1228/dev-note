## React.memo vs React.useMemo

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
    <ComponentA />
  </Parent>
)
```

Differences between approaches:

- `React.memo()`: controlled by the child component
- Same-element references: controlled by the parent component

## Optimize component that manages state

If your component manages state, find parts of the render tree that don’t depend on the changed state and memoise them to minimize their re-renders.

ref: https://www.developerway.com/posts/how-to-write-performant-react-code

```tsx
export const Page = ({ countries }: { countries: Country[] }) => {
  // Page component manages two states
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0])
  const [savedCountry, setSavedCountry] = useState<Country>(countries[0])

  // CountriesList only depends on savedCountry and countries
  const list = useMemo(() => {
    return (
      <CountriesList
        countries={countries}
        onCountryChanged={(c) => setSelectedCountry(c)}
        savedCountry={savedCountry}
      />
    )
  }, [savedCountry, countries])

  // SelectedCountry only depends on selectedCountry
  const selected = useMemo(() => {
    return (
      <SelectedCountry
        country={selectedCountry}
        onCountrySaved={() => setSavedCountry(selectedCountry)}
      />
    )
  }, [selectedCountry])

  return (
    <>
      <h1>Country settings</h1>
      <div css={contentCss}>
        {list}
        {selected}
      </div>
    </>
  )
}
```

## Optimize context that provides both API and Data

We don't need to put everything inside a single context.
In the following example, we separate the API and Data.
Further more, we can separate the Data into even smaller pieces.

`useReducer` is a trick to prevent API to be re-created because dispatch
is always the same reference.

ref: https://www.developerway.com/posts/how-to-write-performant-react-apps-with-context

```tsx
import React from "react"
import { Country } from "./select-country-library"

type State = {
  name: string
  country: Country
  discount: number
}

type API = {
  onNameChange: (name: string) => void
  onCountryChange: (name: Country) => void
  onDiscountChange: (price: number) => void
  onSave: () => void
}

type Actions =
  | { type: "updateName"; name: string }
  | { type: "updateCountry"; country: Country }
  | { type: "updateDiscount"; discount: number }

const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case "updateName":
      return { ...state, name: action.name }
    case "updateCountry":
      return { ...state, country: action.country }
    case "updateDiscount":
      return { ...state, discount: action.discount }
  }
}

const FormNameContext = React.createContext<State["name"]>({} as State["name"])
const FormCountryContext = React.createContext<State["country"]>(
  {} as State["country"]
)
const FormDiscountContext = React.createContext<State["discount"]>(
  {} as State["discount"]
)
const FormAPIContext = React.createContext<API>({} as API)

export const useFormName = () => React.useContext(FormNameContext)
export const useFormCountry = () => React.useContext(FormCountryContext)
export const useFormDiscount = () => React.useContext(FormDiscountContext)
export const useFormApi = () => React.useContext(FormAPIContext)

export const FormDataProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [state, dispatch] = React.useReducer(reducer, {} as State)

  const api = React.useMemo(() => {
    const onSave = () => {
      // send the request to the backend here
    }

    const onDiscountChange = (discount: number) => {
      dispatch({ type: "updateDiscount", discount })
    }

    const onNameChange = (name: string) => {
      dispatch({ type: "updateName", name })
    }

    const onCountryChange = (country: Country) => {
      dispatch({ type: "updateCountry", country })
    }

    return {
      onSave,
      onDiscountChange,
      onNameChange,
      onCountryChange,
    }
  }, [])

  return (
    <FormAPIContext.Provider value={api}>
      <FormNameContext.Provider value={state.name}>
        <FormCountryContext.Provider value={state.country}>
          <FormDiscountContext.Provider value={state.discount}>
            {children}
          </FormDiscountContext.Provider>
        </FormCountryContext.Provider>
      </FormNameContext.Provider>
    </FormAPIContext.Provider>
  )
}
```

## Optimize context with Higher-Order Component

For example, we have a form context that provides both the data and apis.
Every time the context value change, every consumer of `useFormContext`
get rerendered.

ref: https://www.developerway.com/posts/higher-order-components-in-react-hooks-era

```ts
type Context = {
  id: string
  name: string
  setId: (val: string) => void
  setName: (val: string) => void
}

const defaultValue = {
  id: "FormId",
  name: "",
  setId: () => undefined,
  setName: () => undefined,
}

const FormContext = createContext<Context>(defaultValue)

export const useFormContext = () => useContext(FormContext)

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(defaultValue)

  const value = useMemo(() => {
    return {
      id: state.id,
      name: state.name,
      setId: (id: string) => setState({ ...state, id }),
      setName: (name: string) => setState({ ...state, name }),
    }
  }, [state])

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>
}
```

Since we memoize the Component, it only gets rerendered when props or the formId change.
When the name changes, the wrapped Component won't be rerendered.

```ts
export const withFormIdSelector = <TProps extends unknown>(
  Component: ComponentType<TProps & { formId: string }>
) => {
  const MemoisedComponent = React.memo(Component) as ComponentType<
    TProps & { formId: string }
  >

  return (props: TProps) => {
    const { id } = useFormContext()

    return <MemoisedComponent {...props} formId={id} />
  }
}
```

We can do even more, make the HOC a generic selector for form context like this:

```ts
import React, { ComponentType } from "react"
import { useFormContext, Context } from "../context"

export const withContextSelector = <
  TProps extends unknown,
  TValue extends unknown
>(
  Component: ComponentType<TProps & Record<string, TValue>>,
  selectors: Record<string, (data: Context) => TValue>
): ComponentType<Record<string, TValue>> => {
  const MemoisedComponent = React.memo(Component) as ComponentType<
    Record<string, TValue>
  >

  return (props: TProps & Record<string, TValue>) => {
    const data = useFormContext()
    const contextProps = Object.keys(selectors).reduce((acc, key) => {
      acc[key] = selectors[key](data)

      return acc
    }, {})

    return <MemoisedComponent {...props} {...contextProps} />
  }
}
```

Then use it as follows:

```ts
const ComponentWithFormIdAndCountryNameSelectors = withContextSelector(
  Component,
  {
    formId: (data) => data.id,
    countryName: (data) => data.country,
  }
)
```
