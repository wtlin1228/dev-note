import React from "react"
import { hydrateRoot } from "react-dom/client"

const Home = () => {
  return <div>Home</div>
}

const root = document.getElementById("root")
if (root) {
  hydrateRoot(root, <Home />)
}
