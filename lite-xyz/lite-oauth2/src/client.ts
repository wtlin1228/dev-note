import express from "express"
import { z } from "zod"
import cons from "consolidate"
import randomstring from "randomstring"
import bodyParser from "body-parser"
import { port, baseEndpoint, getEndpoint, client } from "./shared/configuration"
import { buildUrl } from "./shared/buildUrl"
import { fetchProtectedResource, tradeToken } from "./shared/request"
import { encodeClientCredentials } from "./shared/clientCredentialsHelpers"

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.engine("html", cons.underscore)
app.set("view engine", "html")
app.set("views", "src/views/client")

let accessToken: string | null = null
let scope: string | null = null
let refreshToken: string | null = null
let state: string | null = null

app.get("/", (req, res) => {
  res.render("index", {
    accessToken,
    scope,
    refreshToken,
  })
})

app.get("/authorize", (req, res) => {
  state = randomstring.generate()

  const authorizeUrl = buildUrl(
    getEndpoint("authorizationServer", "authorize"),
    {
      response_type: "code",
      scope: client.scope,
      client_id: client.clientId,
      state,
      redirect_uri: client.redirectUris[0],
    }
  )

  res.redirect(authorizeUrl)
})

const callbackReqQuery = z.object({
  code: z.string(),
  state: z.string(),
})

app.get("/callback", (req, res) => {
  if (req.query.error) {
    res.render("error", { error: req.query.error })
    return
  }

  let query
  try {
    query = callbackReqQuery.parse(req.query)
  } catch {
    res.render("error", { error: "Invalid query" })
    return
  }

  if (query.state !== state) {
    res.render("error", { error: "State value did not match" })
    return
  }

  console.log(query)

  tradeToken({
    code: query.code,
    authorizationToken: encodeClientCredentials(client),
    onData: (data) => {
      accessToken = data.access_token
      scope = data.scope
      if (data.refresh_token) {
        refreshToken = data.refresh_token
      }
    },
    onComplete: () => {
      res.render("index", {
        accessToken,
        scope,
        refreshToken,
      })
    },
    onError: (errorMessage) => {
      console.log(`Unable to fetch access token, reason: ${errorMessage}`)
      res.render("error", {
        error: "Unable to fetch access token",
      })
    },
  })
})

app.get("/fetch_resource", function (req, res) {
  if (!accessToken) {
    res.render("error", { error: "Missing access token." })
    return
  }

  console.log("Making request with access token %s", accessToken)

  fetchProtectedResource({
    accessToken,
    onData: (data) => {
      res.render("data", { resource: data })
      return
    },
    onComplete: () => {},
    onError: (errorMessage) => {},
  })
})

app.listen(port.client, "localhost", () => {
  console.log(`OAuth Client is listening at ${baseEndpoint.client}`)
})
