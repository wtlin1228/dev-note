import express from "express"
import { z } from "zod"
import cons from "consolidate"
import randomstring from "randomstring"
import bodyParser from "body-parser"
import {
  port,
  baseEndpoint,
  client as preRegisteredClient,
} from "./shared/configuration"
import { buildUrl } from "./shared/buildUrl"
import { Client, User } from "./shared/types"
import { decodeClientCredentials } from "./shared/clientCredentialsHelpers"
import { db } from "./shared/db"

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.engine("html", cons.underscore)
app.set("view engine", "html")
app.set("views", "src/views/authorization-server")

const supportedResponseTypes = ["code"]
const supportedGrantTypes = ["authorization_code", "refresh_token"]

const registeredClient: Record<string, Client> = {
  [preRegisteredClient.clientId]: preRegisteredClient,
}

const getClient = (clientId: string): Client | undefined => {
  return registeredClient[clientId]
}

const isSuperSet = (set: Set<string>, subSet: Set<string>): boolean => {
  for (const elem of subSet) {
    if (!set.has(elem)) {
      return false
    }
  }
  return true
}

const verifyRequestedScopeForClient = (
  client: Client,
  requestScope: string | string[]
) => {
  return isSuperSet(
    new Set(client.scope.split(" ")),
    typeof requestScope === "string"
      ? new Set(requestScope.split(" "))
      : new Set(requestScope)
  )
}

const getScopeFromForm = (body: Record<string, string>) => {
  return Object.keys(body)
    .filter((key) => key.startsWith("scope_"))
    .map((key) => key.slice("scope_".length))
}

const AuthorizeReqQuery = z.object({
  response_type: z.string(),
  scope: z.string(),
  client_id: z.string(),
  state: z.string(),
  redirect_uri: z.string().url(),
})

const userInfo: Record<string, User> = {
  alice: {
    sub: "9XE3-JI34-00132A",
    preferredUsername: "alice",
    name: "Alice",
    email: "alice.wonderland@example.com",
    emailVerified: true,
  },
  bob: {
    sub: "1ZT5-OE63-57383B",
    preferredUsername: "bob",
    name: "Bob",
    email: "bob.loblob@example.net",
    emailVerified: false,
  },
  carol: {
    sub: "F5Q1-L6LGG-959FS",
    preferredUsername: "carol",
    name: "Carol",
    email: "carol.lewis@example.net",
    emailVerified: true,
  },
}

const getUser = (username: string) => {
  return userInfo[username]
}

const codes: Record<
  string,
  {
    request: z.infer<typeof AuthorizeReqQuery>
    scope: string[]
    user: User
  }
> = {}

const requests: Record<string, z.infer<typeof AuthorizeReqQuery>> = {}

app.get("/authorize", (req, res) => {
  let query
  try {
    query = AuthorizeReqQuery.parse(req.query)
  } catch {
    res.render("error", { error: "Invalid query" })
    return
  }

  const client = getClient(query.client_id)
  if (!client) {
    res.render("error", { error: "Unknown client" })
    return
  }

  if (!client.redirectUris.includes(query.redirect_uri)) {
    res.render("error", { error: "Invalid redirect URI" })
    return
  }

  if (!verifyRequestedScopeForClient(client, query.scope)) {
    res.render("error", { error: "Invalid scope" })
    return
  }

  const requestId = randomstring.generate(8)

  requests[requestId] = query

  res.render("approve", {
    client,
    reqid: requestId,
    scope: query.scope.split(" "),
  })
  return
})

app.post("/approve", (req, res) => {
  const reqid = req.body.reqid
  const query = requests[reqid]
  delete requests[reqid]

  if (!query) {
    res.render("error", { error: "No matching authorization request" })
    return
  }

  if (!req.body.approve) {
    const urlParsed = buildUrl(query.redirect_uri, {
      error: "access_denied",
    })
    res.redirect(urlParsed)
    return
  }

  if (!supportedResponseTypes.includes(query.response_type)) {
    const urlParsed = buildUrl(query.redirect_uri, {
      error: "unsupported_response_type",
    })
    res.redirect(urlParsed)
    return
  }

  if (query.response_type == "code") {
    const client = getClient(query.client_id)
    if (!client) {
      res.render("error", { error: "Unknown client" })
      return
    }

    const rscope = getScopeFromForm(req.body)
    if (!verifyRequestedScopeForClient(client, rscope)) {
      res.render("error", { error: "Invalid scope" })
      return
    }

    const user = getUser(req.body.user)
    if (!user) {
      res.render("error", { error: "Invalid user" })
      return
    }

    const code = randomstring.generate(8)
    codes[code] = { request: query, scope: rscope, user }

    const urlParsed = buildUrl(query.redirect_uri, {
      code,
      state: query.state,
    })
    res.redirect(urlParsed)
    return
  }

  res.render("error", { error: "Unknown error" })
  return
})

app.post("/token", (req, res) => {
  console.log("token received request body: ", req.body)
  const auth = req.headers.authorization
  if (!auth) {
    res.status(401).json({ error: "not_authorized" })
    return
  }

  const { clientId, clientSecret } = decodeClientCredentials(auth)

  const client = getClient(clientId)
  if (!client || client.clientSecret !== clientSecret) {
    res.status(401).json({ error: "invalid_client" })
  }

  if (!supportedGrantTypes.includes(req.body.grant_type)) {
    res.status(400).json({ error: "invalid_grant" })
    return
  }

  const code = codes[req.body.code]

  if (req.body.grant_type === "authorization_code") {
    if (!code || code.request.client_id !== clientId) {
      // burn the code, it's been used
      res.status(400).json({ error: "invalid_grant" })
      return
    }

    delete codes[req.body.code]

    const header = { typ: "JWT", alg: "none" }
    const payload = {
      iss: baseEndpoint.authorizationServer,
      sub: code?.user?.sub,
      aud: baseEndpoint.protectedResource,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 5 * 60,
      jti: randomstring.generate(8),
    }

    const accessToken =
      Buffer.from(JSON.stringify(header)).toString("base64") +
      "." +
      Buffer.from(JSON.stringify(payload)).toString("base64") +
      "."

    db.get("accessTokens")
      .push({
        accessToken,
        clientId,
        scope: code.scope,
        user: code.user,
      })
      .write()

    const tokenResponse = {
      access_token: accessToken,
      token_type: "Bearer",
      scope: code.scope.join(" "),
    }

    res.status(200).json(tokenResponse)
    return
  }
})

app.listen(port.authorizationServer, "localhost", () => {
  console.log(
    `OAuth Authorization Server is listening at ${baseEndpoint.authorizationServer}`
  )
})
