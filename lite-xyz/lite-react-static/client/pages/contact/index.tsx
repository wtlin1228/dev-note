import React from "react"
import { hydrateRoot } from "react-dom/client"
import _ from "lodash"
import Contact from "./page"

console.log(_)

const root = document.getElementById("root")
if (root) {
  hydrateRoot(root, <Contact />)
}
