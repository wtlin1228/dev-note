import http from "node:http"

export const tradeToken = ({
  code,
  authorizationToken,
  onData,
  onComplete,
  onError,
}: {
  code: string
  authorizationToken: string
  onData: (data: Record<string, string>) => void
  onComplete: () => void
  onError: (errorMessage: string) => void
}) => {
  const postData = JSON.stringify({
    code,
    grant_type: "authorization_code",
  })

  const options = {
    hostname: "localhost",
    port: 9001,
    path: "/token",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
      Authorization: `Basic ${authorizationToken}`,
    },
  }

  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`)
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`)
    res.setEncoding("utf8")
    res.on("data", (chunk) => {
      console.log(`BODY: ${chunk}`)
      onData(JSON.parse(chunk))
    })
    res.on("end", () => {
      console.log("No more data in response.")
      onComplete()
    })
  })

  req.on("error", (e) => {
    console.error(`problem with request: ${e.message}`)
    onError(e.message)
  })

  // Write data to request body
  req.write(postData)
  req.end()
}

export const fetchProtectedResource = ({
  accessToken,
  onData,
  onComplete,
  onError,
}: {
  accessToken: string
  onData: (data: Record<string, string>) => void
  onComplete: () => void
  onError: (errorMessage: string) => void
}) => {
  const options = {
    hostname: "localhost",
    port: 9002,
    path: "/resource",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }

  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`)
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`)
    res.setEncoding("utf8")
    res.on("data", (chunk) => {
      console.log(`BODY: ${chunk}`)
      onData(JSON.parse(chunk))
    })
    res.on("end", () => {
      console.log("No more data in response.")
      onComplete()
    })
  })

  req.on("error", (e) => {
    console.error(`problem with request: ${e.message}`)
    onError(e.message)
  })

  req.write("")

  req.end()
}
