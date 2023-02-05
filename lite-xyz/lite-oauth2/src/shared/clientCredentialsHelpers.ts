import querystring from "querystring"
import { Client } from "./types"

export const encodeClientCredentials = (client: Client) => {
  const { clientId, clientSecret } = client
  return Buffer.from(
    `${querystring.escape(clientId)}:${querystring.escape(clientSecret)}`
  ).toString("base64")
}

export const decodeClientCredentials = (authorization: string) => {
  const clientCredentials = Buffer.from(
    authorization.slice("basic ".length),
    "base64"
  )
    .toString()
    .split(":")

  return {
    clientId: querystring.unescape(clientCredentials[0]),
    clientSecret: querystring.unescape(clientCredentials[1]),
  }
}
