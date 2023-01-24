# Authorization code grant flow

```

 resource owner                client            authorization server     protected resource
        │                        │                        │                       │
        │    client redirects    │                        │                       │
        │      user agent to     │                        │                       │
        │ authorization endpoint │                        │                       │
        │◄───────────────────────┤                        │                       │
        │                        │                        │                       │
        │    user agent loads    │                        │                       │
        │ authorization endpoint │                        │                       │
        ├────────────────────────┼───────────────────────►│                       │
        │                        │                        │                       │
        │     resource owner     │                        │                       │
        │    authenticates to    │                        │                       │
        │  authorization server  │                        │                       │
        │◄───────────────────────┼───────────────────────►│                       │
        │                        │                        │                       │
        │     resource owner     │                        │                       │
        │   authorizes client    │                        │                       │
        │◄───────────────────────┼───────────────────────►│                       │
        │                        │                        │                       │
        │                authorization server redirects   │                       │
        │                   user agent to client with     │                       │
        │                      authorization code         │                       │
        │◄───────────────────────┬────────────────────────┤                       │
        │                        │                        │                       │
        │   user agent loads     │                        │                       │
        │    redirect URI at     │                        │                       │
        │      client with       │                        │                       │
        │   authorization code   │                        │                       │
        ├───────────────────────►│                        │                       │
        │                        │                        │                       │
        │                        │      client sends      │                       │
        │                        │   authorization code   │                       │
        │                        │and it's own credentials│                       │
        │                        │    to token endpoint   │                       │
        │                        ├───────────────────────►│                       │
        │                        │                        │                       │
        │                        │  authorization server  │                       │
        │                        │   sends access token   │                       │
        │                        │       to client        │                       │
        │                        │◄───────────────────────┤                       │
        │                        │                        │                       │
        │                        │ client sends access token                      │
        │                        │  to protected resource │                       │
        │                        ├────────────────────────┼──────────────────────►│
        │                        │                        │                       │
        │                        │                        │  protected resource   │
        │                        │                        │  returns resource to  │
        │                        │                        │       client          │
        │                        │◄───────────────────────┼───────────────────────┤
        │                        │                        │                       │
      ──┴──                    ──┴──                    ──┴──                   ──┴──

```

# Using a refresh token

```

 client                         protected resource                    authorization server
   │                                     │                                      │
   │                                     │                                      │
   │ request resource with access token  │                                      │
   ├────────────────────────────────────►│                                      │
   │                                     │                                      │
   │                    error response   │                                      │
   │◄────────────────────────────────────┤                                      │
   │                                     │                                      │
   │ refresh access token                │                                      │
   ├─────────────────────────────────────┼─────────────────────────────────────►│
   │                                     │                                      │
   │                                     │          return new access token and │
   │                                     │            refresh token to client   │
   │◄────────────────────────────────────┼──────────────────────────────────────┤
   │                                     │                                      │
   │ request resource with access token  │                                      │
   ├────────────────────────────────────►│                                      │
   │                                     │                                      │
   │            response with resource   │                                      │
   ├─────────────────────────────────────┤                                      │
   │                                     │                                      │
 ──┴──                                 ──┴──                                  ──┴──

```

# Choosing the right grant type

```

 ┌──────────────────────┐      ┌─────────────────────────────┐      ┌────────────────────────┐
 │ Is the client acting │ Yes  │   Can the resource owner    │ Yes  │  Is the client running │ Yes
 │    on behalf of a    ├──────► interact with a web browser ├──────► completely inside of a ├────────► Implicit
 │   resource owner?    │      │   while using the client?   │      │      web browser?      │
 └───────────┬──────────┘      └──────────────┬──────────────┘      └────────────┬───────────┘
        No   │                           No   │                             No   │
             │                                │                                  │
             │                   ┌────────────▼──────────────┐                   │
             │                   │   Does the user have a    │                   ▼
             │                   │ simple set of credentials │           Authorization Code
             │                   │     like a password?      │                   │
             │                   └────────────┬──────────────┘                   │
             │                           Yes  │                                  │
             │                                │                                  │
             │                                │                                  │
             │                                ▼                       ┌──────────▼─────────────┐
             │                     Resource Owner Credentials         │ Is the client a native │ Yes    Add PKCE
             │                                                        │     application?       ├──────► or DynReg
             │                                                        └────────────────────────┘
             │
             │
 ┌───────────▼──────────┐
 │ Is the client acting │
 │ on its own behalf?   ├────────────► Client Credentials
 └───────────┬──────────┘
        No   │
             │
             │
 ┌───────────▼───────────┐
 │ Is the client acting  │
 │ on the authority of a ├───────────────► Assertion
 │ trusted third party?  │
 └───────────────────────┘

```

# Common vulnerabilities

## Common client vulnerabilities

Summary first:

- Use the state parameter as suggested in the specification (even if it isn't mandatory).
- Understand and carefully choose the correct grant (flow) your application needs to use.
- Native applications shouldn't use the implicit flow, as it's intended for in-browser clients.
- Native clients can't protect a client_secret unless it's configured at runtime as in the dynamic registration case.
- The registered redirect_uri must be as specific as it can be.
- Do NOT pass the access_token as a URI parameter if you can avoid it.

### CSRF attack against the client

CSRF explained on [OWASP](https://owasp.org/www-community/attacks/csrf).

```

 Attacker                        Victim                    Vulnerable Client          Authorization Server
    │                               │                              │                              │
    │                               │                              │                              │
    │     Attacker receives or      │                              │                              │
    │   forges authorization code   │                              │                              │
    │◄──────────────────────────────┼──────────────────────────────┼──────────────────────────────┤
    │                               │                              │                              │
    │                               │                              │                              │
    │  Attacker sends CSRF attack   │                              │                              │
    │    to victim, targeted at     │                              │                              │
    │   client's redirect URI and   │                              │                              │
    │     including attacker's      │                              │                              │
    │      authorization code       │                              │                              │
    ├──────────────────────────────►│                              │                              │
    │                               │                              │                              │
    │                               │                              │                              │
    │                               │    Victim's browser loads    │                              │
    │                               │  the redirect URI including  │                              │
    │                               │ the attacker's authorization │                              │
    │                               │            code              │                              │
    │                               ├─────────────────────────────►│                              │
    │                               │                              │                              │
    │                               │                              │                              │
    │                               │                              │   Client sends attacker's    │
    │                               │                              │ authorization code to server │
    │                               │                              ├─────────────────────────────►│
    │                               │                              │                              │
  ──┴──                           ──┴──                          ──┴──                          ──┴──

```

After the flow above, victim connects to the attacker's authorization context.

This kind of attack can be prevented by including an unguessable state in the URI.

### Theft of client credentials

What about native applications? Even the most arcane artifact can be decompiled and the `client_secret` is then no longer that secret. The same principle applies to mobile clients and desktop native applications. Failing to remember this simple principle might lead to disaster.

This kind of attack can be prevented by dynamic registration.

### Registration of the redirect URI

Your OAuth callback endpoint is

`https://yourouauthclient.com/oauth/oauthprovider/callback`

but you registered as

`https://yourouauthclient.com/`

An excerpt of the request originated by your OAuth client while performing the OAuth integration might look like

`https://oauthprovider.com/authorize?response_type=code&client_id=CLIENT_ID&scope=SCOPES&state=STATE&redirect_uri=https://yourouauthclient.com/oauth/oauthprovider/callback`

The attacker also needs to be able to create a page on the target site underneath the registered redirect URI, for example:

`https://yourouauthclient.com/usergeneratedcontent/attackerpage.html`

From here, it's enough for the attacker to craft a special URI of this form:

`https://oauthprovider.com/authorize?response_type=code&client_id=CLIENT_ID&scope=SCOPES&state=STATE&redirect_uri=https://yourouauthclient.com/usergeneratedcontent/attackerpage.html`

The victim will end up with

`https://yourouauthclient.com/usergeneratedcontent/attackerpage.html?code=e8e0dc1c-2258-6cca-72f3-7dbe0ca97a0b`

```

 Attacker                        Victim                    Vulnerable Client          Authorization Server
    │                               │                              │                              │
    │                               │                              │                              │
    │                               │                              │                              │
    │                               │    Victim authorizes a       │                              │
    │                               │     vulnerable client        │                              │ HTTP 302
    │                               ├──────────────────────────────┼─────────────────────────────►├──────┐
    │                               │                              │                              │      │
    │                               │                              │                              │      │
    │                               │                              │                              │      │
    │                               │◄─────────────────────────────┼──────────────────────────────┤◄─────┘
    │                               │                              │                              │
    │                               │                              │                              │
    │                               │                              │                              │
    │                               │  Victim's browser loads the  │                              │
    │                               │ redirect URI page, the HTML  │                              │
    │                               │  includes an img or script   │                              │
    │                               │  tag for a resource at the   │                              │
    │                               │      attacker's server       │                              │
    │                               ├─────────────────────────────►│                              │
    │   Victim's browser fetches    │                              │                              │
    │  the resource in the img or   │◄─────────────────────────────┤                              │
    │   script tag and sends the    │                              │                              │
    │   authorization code in the   │                              │                              │
    │        Referer header         │                              │                              │
    │◄─── ─── ─── ─── ─── ─── ─── ──┤                              │                              │
    │                               │                              │                              │
  ──┴──                           ──┴──                          ──┴──                          ──┴──

```

After the flow above, the attacker can get the victim's authorization code.

This kind of attack can be prevented by register the most specific redirect URI.

## Common protected resources vulnerabilities

Summary first:

- Sanitize all untrusted data in the protected resource response.
- Choose the appropriate Content-Type for the specific endpoint.
- Leverage browser protection and the security headers as much as you can.
- Use CORS if your protected resource's endpoint needs to support the implicit grant flow.
- Avoid having your protected resource support JSONP (if you can).
- Always use TLS in combination with HSTS.

## Common authorization server vulnerabilities

Summary first:

- Burn the authorization code once it’s been used.
- Exact matching is the ONLY safe validation method for redirect_uri that the authorization server should adopt.
- Implementing the OAuth core specification verbatim might lead us to have the authorization server acting as an open redirector. If this is a properly monitored redirector, this is fine, but it might pose some threats if implemented naively.
- Be mindful of information that can leak through fragments or Referer headers during error reporting.

### Hijacked authorization code (vulnerable authorization server)

Attackers can get the authorization code by leveraging the `Registration of the redirect URI`.

Now what an attacker can do is to present this hijacked authorization code to the OAuth callback of the victim’s OAuth client. At this point, the client will proceed and try to trade the authorization code for an access token, presenting valid client credentials to the authorization server. The authorization code is bound to the correct OAuth client.

```

 Attacker                 Victim                     Client             Authorization Server:   Authorization Server:      Protected Resource
    │                        │                         │                Authorization endpoint  Token endpoint                      │
    │                        │                         │                          │                      │                          │
    │                        │  Client redirects user  │                          │                      │                          │
    │                        │  agent to authorization │                          │                      │                          │
    │                        │        endpoint         │                          │                      │                          │
    │                        │◄─── ── ── ── ── ── ── ──┤                          │                      │                          │
    │                        │                         │                          │                      │                          │
    │                        │     User agent loads    │                          │                      │                          │
    │                        │  authorization endpoint │                          │                      │                          │
    │                        ├─────────────────────────┼─────────────────────────►│                      │                          │
    │                        │                         │                          │                      │                          │
    │                        │   Victim authenticates  │                          │                      │                          │
    │                        │ to authorization server │                          │                      │                          │
    │                        │◄────────────────────────┼─────────────────────────►│                      │                          │
    │                        │                         │                          │                      │                          │
    │                        │ Victim authorizes client│                          │                      │                          │
    │                        │◄────────────────────────┼─────────────────────────►│                      │                          │
    │                        │                         │                          │                      │                          │
    │                        │                         │   Authorization server   │                      │                          │
    │                        │                         │  redirects user agent to │                      │                          │
    │                        │                         │       attacker with      │                      │                          │
    │                        │                         │    authorization code    │                      │                          │
    │◄─── ── ── ── ── ── ── ─┤ ── ── ── ── ── ── ── ── ├── ── ── ── ── ── ── ── ──┤                      │                          │
    │                        │                         │                          │                      │                          │
    │     Attacker loads     │                         │                          │                      │                          │
    │ redirect URI at client │                         │                          │                      │                          │
    │      with victim's     │                         │                          │                      │                          │
    │   authorization code   │                         │                          │                      │                          │
    ├────────────────────────┼────────────────────────►│                          │                      │                          │
    │                        │                         │                          │                      │                          │
    │                        │                         │   Client sends hijacked  │                      │                          │
    │                        │                         │  authorization code and  │                      │                          │
    │                        │                         │   its own credential to  │                      │                          │
    │                        │                         │      token endpoint      │                      │                          │
    │                        │                         ├──────────────────────────┼─────────────────────►│                          │
    │                        │                         │                          │                      │                          │
    │                        │                         │                          │ Authorization server │                          │
    │                        │                         │                          │  sends access token  │                          │
    │                        │                         │                          │       to client      │                          │
    │                        │                         │◄─────────────────────────┼──────────────────────┤                          │
    │                        │                         │                          │                      │                          │
    │                        │                         │ Client sends access token│                      │                          │
    │                        │                         │   to protected resource  │                      │                          │
    │                        │                         ├──────────────────────────┼──────────────────────┼─────────────────────────►│
    │                        │                         │                          │                      │                          │
    │                        │                         │                          │                      │    Protected resource    │
    │                        │                         │                          │                      │ returns victim's resource│
    │                        │                         │                          │                      │   to attacker's client   │
    │◄─── ── ── ── ── ── ── ─┤ ── ── ── ── ── ── ── ── │◄─────────────────────────┼──────────────────────┼──────────────────────────┤
    │                        │                         │                          │                      │                          │
    │                        │                         │                          │                      │                          │
  ──┴──                    ──┴──                     ──┴──                      ──┴──                  ──┴──                      ──┴──

```

This kind of attack can be prevented by ensuring that the `redirect_uri` presented in the initial authorization request will match the one presented in the token request.

```js
if (code.request.redirect_uri) {
  if (code.request.redirect_uri != req.body.redirect_uri) {
    res.status(400).json({ error: "invalid_grant" })
    return
  }
}
```

### Open redirect

```
https://victim.com/authorize?response_type=code&client_id=CLIENT_ID&scope=WRONG_SCOPE&redirect_uri=https://attacker.com
```

Because the provided scope is wrong, authorization server might redirect resource owner to the `https://attacker.com`.

This kind of attack can be prevented by

- responding with an HTTP 400 (Bad Request) status code rather than to redirect back to the registered `redirect_uri`
- performing a redirect to an intermediate URI under the control of the authorization server to clear `Referer` information in the browser that may contain security token information
- appending ‘#’ to the error redirect URI (this prevents the browser from reattaching the fragment from a previous URI to the new location URI)

## Common OAuth token vulnerabilities

Summary first:

- Transmission of access tokens must be protected using secure transport layer mechanisms such as TLS.
- The client should ask for the minimum information needed (be conservative with the scope set).
- The authorization server should store hashes of the access token instead of clear text.
- The authorization server should keep access token lifetime short in order to minimize the risk associated with the leak of a single access token.
- The resource server should keep access tokens in transient memory.
- PKCE may be used to increase the safety of authorization codes.

### Proof Key for Code Exchange (PKCE)

Some sophisticated attacks can lead to the authorization code being hijacked. The authorization code isn’t useful on its own, especially if the client has its own client secret with which it can authenticate itself. However, native applications have specific problems with client secrets.

```

 Resource Owner                 Client             Authorization Server:   Authorization Server:      Protected Resource
        │                         │                Authorization endpoint  Token endpoint                      │
        │                         │                          │                      │                          │
        │  Client sends resource  │                          │                      │                          │
        │  owner to authorization │                          │                      │                          │
        │ endpoint with generated │                          │                      │                          │
        │      code challenge     │                          │                      │                          │
        │◄─── ── ── ── ── ── ── ──┤                          │                      │                          │
        │                         │                          │                      │                          │
        │     User agent loads    │                          │                      │                          │
        │  authorization endpoint │                          │                      │                          │
        ├─────────────────────────┼─────────────────────────►│                      │                          │
        │                         │                          │                      │                          │
        │      Resource owner     │                          │                      │                          │
        │     authenticates to    │                          │                      │                          │
        │   authorization server  │                          │                      │                          │
        │◄────────────────────────┼─────────────────────────►│                      │                          │
        │                         │                          │                      │                          │
        │      Resource owner     │                          │                      │                          │
        │    authorizes client    │                          │                      │                          │
        │◄────────────────────────┼─────────────────────────►│                      │                          │
        │                         │                          │                      │                          │
        │                         │   Authorization server   │                      │                          │
        │                         │   redirects user agent   │                      │                          │
        │                         │      to client with      │                      │                          │
        │                         │    authorization code    │                      │                          │
        │◄─── ── ── ── ── ── ── ──┤ ── ── ── ── ── ── ── ── ─┤                      │                          │
        │                         │                          │                      │                          │
        │     User agent loads    │                          │                      │                          │
        │  redirect URI at client │                          │                      │                          │
        │ with authorization code │                          │                      │                          │
        ├────────────────────────►│                          │                      │                          │
        │                         │                          │                      │                          │
        │                         │  Client sends verifier,  │                      │                          │
        │                         │  authorization code, and │                      │                          │
        │                         │    its own credentials   │                      │                          │
        │                         │     to token endpoint    │                      │                          │
        │                         ├──────────────────────────┼─────────────────────►│                          │
        │                         │                          │                      │                          │
        │                         │        Authorization server derives the code    ├──────┐                   │
        │                         │        challenge from the│code verifier and     │      │                   │
        │                         │        make sure that it matches the code       │      │                   │
        │                         │        challenge originally submitted           │◄─────┘                   │
        │                         │                          │                      │                          │
        │                         │                          │                      │                          │
        │                         │               Authorization server sends        │                          │
        │                         │               access token to client            │                          │
        │                         │◄─────────────────────────┬──────────────────────┤                          │
        │                         │                          │                      │                          │
        │                         │    Client sends access   │                      │                          │
        │                         │    token to protected    │                      │                          │
        │                         │          resource        │                      │                          │
        │                         ├──────────────────────────┼──────────────────────┼─────────────────────────►│
        │                         │                          │                      │                          │
        │                         │                          │                      │                          │
        │                         │                          │                      │                          │
      ──┴──                     ──┴──                      ──┴──                  ──┴──                      ──┴──

```
