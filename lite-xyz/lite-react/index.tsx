const React = {
  createElement: (tag, props, ...children) => {
    if (typeof tag === "function") {
      try {
        return tag(props)
      } catch ({ promise, key }) {
        promise.then((data) => {
          promiseCache.set(key, data)
          rerender()
        })
        return { tag: "div", props: { children: ["I AM LOADING"] } }
      }
    }
    const element = { tag, props: { ...props, children } }
    return element
  },
}

const states = []
let stateCursor = 0

const useState = (initialState) => {
  const FROZEN_CURSOR = stateCursor
  states[FROZEN_CURSOR] = states[FROZEN_CURSOR] || initialState

  let setState = (newState) => {
    states[FROZEN_CURSOR] = newState
    rerender()
  }

  stateCursor++

  return [states[FROZEN_CURSOR], setState]
}

const createRoot = (rootContainer) => {
  const _render = (reactElementOrStringOrNumber, container) => {
    if (["string", "number"].includes(typeof reactElementOrStringOrNumber)) {
      container.appendChild(
        document.createTextNode(reactElementOrStringOrNumber)
      )
      return
    }

    const actualDomElement = document.createElement(
      reactElementOrStringOrNumber.tag
    )

    if (reactElementOrStringOrNumber.props) {
      Object.keys(reactElementOrStringOrNumber.props)
        .filter((prop) => prop !== "children")
        .forEach((prop) => {
          actualDomElement[prop] = reactElementOrStringOrNumber.props[prop]
        })
    }

    if (reactElementOrStringOrNumber.props.children) {
      reactElementOrStringOrNumber.props.children.forEach((child) =>
        _render(child, actualDomElement)
      )
    }

    container.appendChild(actualDomElement)
  }

  return {
    render: (reactElementOrStringOrNumber) => {
      stateCursor = 0
      rootContainer.firstChild?.remove()
      _render(reactElementOrStringOrNumber, rootContainer)
    },
  }
}

const promiseCache = new Map()
const createResource = (fetchResource, key) => {
  if (promiseCache.has(key)) {
    return promiseCache.get(key)
  }

  throw { promise: fetchResource(), key }
}

const App = () => {
  const [name, setName] = useState("person")
  const [count, setCount] = useState(0)
  const dogImageUrl = createResource(
    () =>
      fetch("https://dog.ceo/api/breeds/image/random")
        .then((r) => r.json())
        .then((payload) => payload.message),
    "dogPhoto"
  )

  return (
    <div className="lite-react">
      <h1>Hello, {name}!</h1>
      <input
        type="text"
        value={name}
        onchange={(e) => {
          setName(e.target.value)
        }}
        placeholder="una is so cute"
      />
      <div style="margin-top: 10px">
        <img alt="GOOD BOYEEEEE" src={dogImageUrl} />
      </div>
      <h2>The count is: {count}</h2>
      <button onclick={() => setCount(count - 1)}>decrement</button>
      <button onclick={() => setCount(count + 1)}>increment</button>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sequi maxime
        beatae ad odio minus optio possimus, nam labore architecto molestiae,
        neque eligendi modi eveniet quod delectus vero quas aspernatur repellat!
      </p>
    </div>
  )
}

const rerender = () => root.render(<App />)

const root = createRoot(document.getElementById("root"))
root.render(<App />)
