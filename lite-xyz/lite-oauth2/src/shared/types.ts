export interface Client {
  clientId: string
  clientSecret: string
  scope: string
  redirectUris: string[]
}

export interface User {
  sub: string
  preferredUsername: string
  name: string
  email: string
  emailVerified: boolean
}
