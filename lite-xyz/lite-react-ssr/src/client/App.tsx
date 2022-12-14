import React from "react"

export const App = () => {
  const [count, setCount] = React.useState(0)
  return (
    <div>
      <hi>Hello SSR!</hi>
      <h2>{count}</h2>
      <button onClick={() => setCount((count) => count - 1)}>-</button>
      <button onClick={() => setCount((count) => count + 1)}>+</button>
    </div>
  )
}

export default App
