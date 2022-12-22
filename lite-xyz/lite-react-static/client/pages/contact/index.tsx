import React from "react"
import { hydrateRoot } from "react-dom/client"
import _ from "lodash"

console.log(_)

const Contact = () => {
  return <div>Contact</div>
}

const root = document.getElementById("root")
if (root) {
  hydrateRoot(root, <Contact />)
}
