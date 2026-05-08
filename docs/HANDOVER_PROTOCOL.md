# HANDOVER_PROTOCOL.md

## What was created
A frontend registration start flow for `woosoo-grillpad` using Nuxt 4, Pinia, Zod-validated API services, and strict backend-authenticated device/session startup.

## Current Branch Scope

Branch: `feat/register-device-start-flow`

Added or tightened:

- `/start` now accepts one 6-digit registration token instead of manual device/table fields.
- `/start` calls `registerDevice()` and persists returned device, table, and bearer token data.
- `/start` calls `startSession()` after successful device registration.
- QR scanner placeholder is visible for the later camera slice.
- device store now supports `deviceName` and maps registration responses safely.
- device registration parser is exported for unit tests.
- storage/contract tests cover legacy device storage, registration parsing, id normalization, and invalid response rejection.

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

Manual validation:

- `/start` accepts only numeric 6-digit token input.
- successful registration stores returned device/table/token values.
- successful registration starts a session and routes to `/package`.
- invalid registration token clears device/session state and shows an error.
- cached registered device restores via `/session/current`.
- failed session verification does not trust stale local storage.
- `/package` is only accessible during `package_selection`.
- `/order/initial` is only accessible during `initial_order`.
- `/order/review` is only accessible during `review` and requires initial cart items.
- `/order/refill` never exposes full initial menu.

## Next TODOs
- Add real QR scanner component using the selected camera library.
- Add UI-level component tests or Playwright flow tests for `/start` once test harness supports Nuxt page mounting.
- Add real Reverb plugin for session/order/print control events.
- Add visual components for product cards, cart drawer, package comparison, refill header, and print event banner.
- Sync endpoint constants with the finalized `woosoo-app` backend route file before production.
