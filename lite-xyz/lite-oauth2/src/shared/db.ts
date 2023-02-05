import low from "lowdb"
import FileSync from "lowdb/adapters/FileSync"
import { User } from "./types"

type Data = {
  accessTokens: {
    accessToken: string
    clientId: string
    scope: string[]
    user: User
  }[]
}

const adapter = new FileSync<Data>("localDB/db.json")
const db = low(adapter)

export { db }
