---
status: draft
author: clark
app: sme-mart
severity: high
subscribers:
  - clark
zb-task: null
resolution: null
resolved-date: null
promoted-to: null
---

# ZB client SDK requires Node.js polyfills in browser

## What I was trying to do

Import and use `@auditmation/zb-client-lib-js` in a Next.js 15 browser application.

## What happened

Build fails because the SDK imports Node.js built-in modules (`node:buffer`, `node:url`) that don't exist in the browser. This affects any framework that bundles for the browser (Next.js, Angular, Vite, etc.).

Error messages reference missing modules `buffer`, `url`, `fs`, `path`, `os`, `crypto`, `stream`, `util`.

## What I expected

The SDK to either:
1. Ship a browser-compatible bundle that doesn't require Node.js polyfills, or
2. Document the required webpack/bundler configuration in the SDK README

## Workaround (if any)

Custom webpack config in `next.config.ts`:

```typescript
webpack: (config, { isServer }) => {
  if (!isServer) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'node:buffer': require.resolve('buffer/'),
      'node:url': require.resolve('url/'),
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false, path: false, os: false,
      crypto: false, stream: false, util: false,
    };
  }
  return config;
}
```

Plus additional npm dependencies: `buffer`, `url` (browser polyfill packages).

Every new app that uses the SDK will hit this same wall.
