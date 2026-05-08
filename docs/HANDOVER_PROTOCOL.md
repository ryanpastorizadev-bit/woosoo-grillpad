# HANDOVER_PROTOCOL.md

## What was created
A frontend foundation for `tablet-ordering-pwa/` using Nuxt 4, Pinia, Tailwind CSS, PWA support, and strict session phase routing.

## Install
```bash
npm install
cp .env.example .env
npm run dev
```

## Production Build
```bash
APP_VERSION=$(git rev-parse --short HEAD) docker compose -f docker-compose.frontend.yml build --no-cache
APP_VERSION=$(git rev-parse --short HEAD) docker compose -f docker-compose.frontend.yml up -d
```

## UI Update Reliability Rules
- HTML and service worker are no-cache.
- Hashed Nuxt assets are immutable.
- API routes are NetworkOnly in the service worker.
- `registerType: prompt` prevents surprise reloads during active sessions.
- `NUXT_PUBLIC_APP_VERSION` should be set to the commit hash during deployment.

## Next TODOs
- Replace mock menu/package arrays with API-backed composables.
- Add `/api/orders/initial` and `/api/orders/refill` Zod schemas.
- Add real Reverb plugin for session control events.
- Add visual components for product cards, cart drawer, package comparison, and refill header.
- Add Vitest coverage for store transition rules.
