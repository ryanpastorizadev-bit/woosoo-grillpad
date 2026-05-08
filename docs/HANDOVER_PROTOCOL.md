# HANDOVER_PROTOCOL.md

## What was created
An MVP tablet ordering client in Nuxt 4 with:
- Device registration + token persistence
- Session start and backend restore
- Package selection, initial order, refill order
- Active order + print-event acknowledgement surface
- Session-phase route gating
- PWA safe-update behavior
- Realtime sync wiring tied to active session identity

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

## Operational checks
- Run `npm run typecheck`
- Run `npm run lint` (note: repository lint currently includes `.agents` skill docs that may contain unrelated style errors)
- Run `npm run build`
- Run `npm run test`

## Realtime notes
- Realtime connection is subscribed only when device/session identity is present.
- Realtime teardown happens when device/session is cleared.
- Relevant events trigger active-order and print-event refresh to avoid stale UI.
