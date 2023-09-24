# Holotypes

Each holotype application is accompanied by a rough category name, additional real-world examples, as well as the characteristics & constraints that define its architecture. Ideal implementation and delivery techniques are also provided, based on the architectural context.

## 🎪 Social Networking Destinations

Holotype: Facebook
Examples: LinkedIn, Reddit, Google+
Characteristics: multifaceted, sub-applications, infinite scrolling content, user contribution, realtime updates, notifications
Constraints: extended session depth, large scale, realtime updates, resource contention from embedded content, nested applications, SEO
Ideal Implementation: Single-Page Application with prerendering of shell and landing pages.
Ideal Delivery: PWA in standalone display mode. TWA.

## 🤳 Social Media Applications

Holotype: Instagram
Examples: Youtube, Twitter
Characteristics: rich media, infinite scrolling content, user contribution, realtime updates, notifications, embeddability, embedded content
Constraints: extended session depth, realtime updates, resource contention from embedded content, uninterruptible media playback, SEO
Ideal Implementation: Single-Page Application with app shell prerendering & caching.
Ideal Delivery: PWA in standalone display mode.

## 🛍 Storefronts

Holotype: Amazon
Examples: Bestbuy, Newegg, Shopify(-based stores)
Characteristics: search, payments, discoverability, filtering & sorting
Constraints: shallow to medium session depth, small interactions, high cart/checkout dropoff, SEO
Ideal Implementation: Server-rendered site with CSR/SPA takeover or turbolinks-style transitions.
Ideal Delivery: PWA in default display mode.

## 📰 Content Websites

Holotype: CNN
Examples: FT, BBC, BuzzFeed, Engadget, Salon, Smashing Magazine, The Onion
Characteristics: discoverability, rich media, embedded content
Constraints: shallow session depth (~1), resource contention from ads & multivariate testing, SEO
Ideal Implementation: Server-rendered site with turbolinks-style transitions.
Ideal Delivery: PWA in default display mode.

## 📨 PIM Applications

Holotype: Gmail
Examples: Google Calendar, Outlook.com, Fastmail
Characteristics: thick-client, infinite lists, embedded content, rich text editing, sanitization, MDI, storage, offline & sync, notifications
Constraints: extended session length, sensitive & largely uncacheable data, high security risk, often offline
Ideal Implementation: Single Page App with app shell caching.
Ideal Delivery: PWA in standalone display mode.

## 📝 Productivity Applications

Holotype: Google Docs
Examples: Office.com, Zoho, Dropbox, Box
Characteristics: thick-client, rich text editing, offline & sync, filesystem, clipboard, storage, image manipulation, embedded content
Constraints: extended session length and multiple concurrent sessions favor client-side implementation.
Ideal Implementation: Single Page App. Consider app shell caching. Unload page between apps.
Ideal Delivery: PWA in standalone display mode.

## 🎧 Media Players

Holotype: Spotify
Examples: Youtube Music, Google Play Music, Tidal, Soundcloud, Pandora, Deezer
Characteristics: rich media, thick-client, infinite scrolling content, filtering & sorting, notifications, OS integration, offline, embeddability
Constraints: extended session length, playback must continue as the user navigates.
Ideal Implementation: Single Page App with app shell prerendering & caching. Server-render <head> for discovery.
Ideal Delivery: PWA in standalone display mode.

## 🎨 Graphical Editors

Holotype: Figma
Examples: AutoCAD, Tinkercad, Photopea, Polarr
Characteristics: 3D rendering & GPU, image manipulation, fullscreen & pointer capture, MDI, storage, offline, filesystem, threads, wasm
Constraints: long session length, sensitivity to input & rendering latency, large objects/files
Ideal Implementation: Single Page App. Separate lighter browsing UI from editor.
Ideal Delivery: PWA in standalone display mode.

## 👨‍🎤 Media Editors

Holotype: Soundtrap
Examples: Looplabs
Characteristics: Audio processing, device integration (midi,usb), storage, offline, filesystem, threads, wasm
Constraints: long session length, low-latency DSP, low-latency media recording & playback, large file sizes/IO
Ideal Implementation: Single Page App. Separate lighter browsing UI from editor.
Ideal Delivery: PWA in standalone display mode.

## 👩‍💻 Engineering Tools

Holotype: Codesandbox
Examples: Codepen, Jupyter Notebook, RStudio, StackBlitz
Characteristics: thick-client, MDI, storage, offline, filesystem, threads, embedded content
Constraints: extremely long session length, low-latency text input, large memory footprint, custom input handling and text rendering, security of preview content
Ideal Implementation: Single Page App. Consider separating browsing UI from editor.
Ideal Delivery: PWA in standalone display mode.

## 🎮 Immersive / AAA Games

Holotype: Stadia
Examples: Heraclos, Duelyst, OUIGO
Characteristics: 3D rendering & GPU, P2P, audio processing, fullscreen & pointer capture, storage, offline, filesystem, threads, device integration (gamepad), wasm
Constraints: long session length (highly interactive), immersion, extremely sensitive to input and rendering latency, requires consistent or stepped FPS, extreme asset sizes
Ideal Implementation: Single Page App
Ideal Delivery: PWA in fullscreen display mode.

## 👾 Casual Games

Holotype: Robostorm
Examples: Tank Off, War Brokers, GoreScript, Air Wars, ".io games"
Characteristics: 2D & 3D rendering & GPU, P2P, audio processing, storage, offline, embeddability
Constraints: long session length, sensitive to input and rendering latency, needs consistent/stepped FPS
Ideal Implementation: Single Page App
Ideal Delivery: embedded in another site, or PWA in fullscreen display mode.

# Reference

[Application Holotypes: A Guide to Architecture Decisions](https://jasonformat.com/application-holotypes/) - Jason Miller, Feb 2019
