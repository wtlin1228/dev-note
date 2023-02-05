import express, { NextFunction, Request, Response } from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { port, baseEndpoint } from "./shared/configuration"

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

var resource = {
  name: "Protected Resource",
  description: "This data has been protected by OAuth 2.0",
}

var getAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers["authorization"]
  if (!auth || auth.toLowerCase().indexOf("bearer") !== 0) {
    next()
    return
  }

  const inToken = auth.slice("bearer ".length)
  var tokenParts = inToken.split(".")
  var payload = JSON.parse(Buffer.from(tokenParts[1], "base64").toString())

  if (payload.iss == baseEndpoint.authorizationServer) {
    if (payload.aud == baseEndpoint.protectedResource) {
      var now = Math.floor(Date.now() / 1000)
      if (payload.iat <= now && payload.exp >= now) {
        // @ts-expect-error
        req.access_token = payload
      }
    }
  }

  next()
  return
}

var requireAccessToken = (req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error
  if (req.access_token) {
    next()
  } else {
    res.status(401).end()
  }
}

app.options("/resource", cors())
app.post(
  "/resource",
  cors(),
  getAccessToken,
  requireAccessToken,
  (req, res) => {
    res.json(resource)
  }
)

app.listen(port.protectedResource, "localhost", () => {
  console.log(
    `OAuth Protected Resource Server is listening at ${baseEndpoint.protectedResource}`
  )
})
