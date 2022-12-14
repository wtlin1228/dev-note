import path from "path"
import fs from "fs"

import React from "react"
import ReactDOMServer from "react-dom/server"
import express from "express"

import App from "../client/App"

const PORT = process.env.PORT || 3006
const app = express()

app.use(express.static("dist"))

app.get("/", (req, res) => {
  const app = ReactDOMServer.renderToString(<App />)
  const indexFile = path.resolve("dist/app.html")

  fs.readFile(indexFile, "utf8", (err, data) => {
    if (err) {
      console.error("Something went wrong:", err)
      return res.status(500).send("Oops, better luck next time!")
    }

    return res.send(
      data.replace('<div id="root"></div>', `<div id="root">${app}</div>`)
    )
  })
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
