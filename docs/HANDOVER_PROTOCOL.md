# HANDOVER_PROTOCOL.md

## What was created
A frontend contract spine for `woosoo-grillpad` using Nuxt 4, Pinia, Tailwind CSS, PWA support, Zod-validated API services, and strict session phase routing.

## Current Branch Scope

Branch: `feat/register-device-start-flow-v2`

This branch builds on the merged contract spine and wires `/start` into backend-issued device registration.

Added or tightened:

- `/start` now calls `registerDevice()` before starting a session.
- The tablet no longer accepts manual Device ID, Table ID, or Table Name from the user.
- Device ID, table ID, table name, and API token are persisted only from the backend registration response.
- Registration form is reduced to a 6-digit manual token fallback.
- Duplicate submit guard remains in place through `submitting`.
- Existing cached sessions are still verified against the backend before navigation.
- `tests/session-guard.test.ts` now matches the explicit `review` phase contract.

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

## Required Validation Before Merge
```bash
npm run typecheck
npm run lint
npm run build
npm run test
```

Manual QA checklist:
- `docs/QA_CHECKLIST.md`

Manual validation:

- `/start` restores an already-registered device only after backend verification succeeds.
- `/start` rejects empty registration token submissions.
- `/start` persists only backend-issued device/table/token fields after registration.
- `/start` clears device/session state after registration or start-session failure.
- `/package` is only accessible during `package_selection`.
- `/order/initial` is only accessible during `initial_order`.
- `/order/review` is only accessible during `review` and requires initial cart items.
- successful initial submission enters `refill` and clears initial cart.
- `/order/refill` never exposes full initial menu.
- print events can be listed and acknowledged once backend endpoints exist.
- token loss or 401 returns to `/start`.

## Next TODOs
- Add QR scanner component and keep the manual 6-digit fallback UI.
- Add component-level tests around `/start` once the test harness supports Nuxt page mounting.
- Add real Reverb plugin for session/order/print control events.
- Add visual components for product cards, cart drawer, package comparison, refill header, and print event banner.
- Sync endpoint constants with the finalized `woosoo-app` backend route file before production.
