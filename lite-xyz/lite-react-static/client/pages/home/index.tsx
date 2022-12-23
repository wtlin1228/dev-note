import React from "react"
import { hydrateRoot } from "react-dom/client"
import Home from "./page"

const root = document.getElementById("root")
if (root) {
  hydrateRoot(root, <Home />)
}
