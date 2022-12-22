import React from "react"
import { hydrateRoot } from "react-dom/client"
import _ from "lodash"

console.log(_)

const About = () => {
  return <div>About</div>
}

const root = document.getElementById("root")
if (root) {
  hydrateRoot(root, <About />)
}
