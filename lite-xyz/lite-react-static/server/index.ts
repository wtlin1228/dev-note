import path from "path"
import fs from "fs"

import React from "react"
import ReactDOMServer from "react-dom/server"
import express from "express"

const PORT = process.env.PORT || 3006
const app = express()

app.use(express.static("dist"))

app.get("/pin", (req, res) => {
  return res.send("pon")
})

const staticPages = ["about", "contact", "home"]
staticPages.forEach(async (page) => {
  const component = await import(`../client/pages/${page}/page.tsx`)
  const reactString = ReactDOMServer.renderToString(component)
  console.log(reactString)

  // const pageHtml = path.resolve(`dist/client/html/${page}.html`)
  // fs.readFile(pageHtml, "utf8", (err, data) => {
  //   if (err) {
  //     console.error(`Something went wrong when building ${page} page:`, err)
  //   }

  //   data.replace('<div id="root"></div>', `<div id="root">${reactString}</div>`)
  // })
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
