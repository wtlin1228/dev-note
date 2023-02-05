import { Client } from "./types"

export const port = {
  client: 9000,
  authorizationServer: 9001,
  protectedResource: 9002,
}

export const baseEndpoint = {
  client: `http://localhost:${port.client}`,
  authorizationServer: `http://localhost:${port.authorizationServer}`,
  protectedResource: `http://localhost:${port.protectedResource}`,
}

const endpoint = {
  client: {
    authorize: `/authorize`,
    callback: `/callback`,
  },
  authorizationServer: {
    authorize: `/authorize`,
    token: `/token`,
  },
  protectedResource: {},
}

export const getEndpoint = <S extends keyof typeof endpoint>(
  server: S,
  route: keyof typeof endpoint[S]
) => {
  return baseEndpoint[server] + endpoint[server][route]
}

export const client: Client = {
  clientId: "oauth-client-1",
  clientSecret: "oauth-client-secret-1",
  scope: "foo bar",
  redirectUris: [getEndpoint("client", "callback")],
}
