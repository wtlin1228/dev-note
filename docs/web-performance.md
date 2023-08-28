# What happens when you're browsing the web?

- Network layer
- Parsing
- Resource discovery phase
- Resource prioritization
- Layout
- Paint

Example: www.leonerd.blog

1. DNS query - 100ms
2. TCP connection - 120ms
3. SSL Negotiation - 150ms
4. HTTP Request - uplink

   header - body

5. Server process (backend time) - 200ms to 500ms
6. HTTP Response - downlink

   header - body

7. Browsers HTML parsing
8. Resource Discovery & Priority

   Resource Discovery Queue

9. Render (layout, paint)

# Evolution of HTTP

## HTTP/1.1

- One request per TCP connection
- Limited number of parallel requests to the server
- GZIP Encoding accepted

## HTTP/2

- Performance from scratch
- Header Compression
- TCP connection reuse
- TLS-based only
- Good compatibility
- Upgrade your servers or use a CDN
- Upgrade connections

## HTTP/3

- Transport protocol over UDP
- Reduces latency and connection messages
- HTTP/2 interface with TLS

# The Browser's Cache

Resource Discovery Queue

Check the cache

Cache headers per file

- Absolute expiration date (1.0)
- Relative expiration date (1.1)
- More specs / values

Browser needs a resource, it checks the cache

    1. Cache MISS: we go the network

    2. Cache HIT:

       1. it's expired, send conditional request:

          1. Not modified (updated cache header)

          2. OK, new file

       2. it's not expired

          we use the file from the cache

## Back/Forward Cache (bfcache)

- It keeps your page navigation in memory if the user navigates away
- It's automatic
- You shouldn't use unload events or `Cache-Control: no-store` header
- Use Page Navigation API to
  - Open / Restore connections
  - Abort pending transactions

Show case:
[How Back/forward Cache Helped Yahoo! JAPAN News Increase Revenue by 9% on Mobile](https://web.dev/yahoo-japan-news-bfcache/)

## Service Workers and Cache Storage
