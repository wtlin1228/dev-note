[Largest Contentful Paint (LCP)](https://web.dev/lcp/)

- [A guide for optimizing LCP step by step](https://web.dev/i18n/en/optimize-lcp/)

[Cumulative Layout Shift (CLS)](https://web.dev/cls/)

- [Optimize Cumulative Layout Shift](https://web.dev/optimize-cls/)

# CSS

1. Split the critical CSS and non-critical CSS.
2. Inline the critical CSS.
3. Defer the non-critical CSS.

# JavaScript

1. Defer all non-critical scripts.

# LCP

1. Set the `fetchpriority` for the LCP images.
2. SSR (but it could slow down the TTFB).

# CLS

1. Set the width and height to `<img>` so the browser can preserve the spacing for it and get its aspect ratio.
2. Style the `<img>` with `width: 100%; height: auto;` so the browser resize this image based on the aspect ratio.
