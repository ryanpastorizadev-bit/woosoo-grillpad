# HANDOVER_PROTOCOL.md

## What was created
A frontend contract spine for `woosoo-grillpad` using Nuxt 4, Pinia, Tailwind CSS, PWA support, Zod-validated API services, and strict session phase routing.

## Current Branch Scope

Branch: `feat/mvp-contract-spine`

Added or tightened:

- `docs/woosoo_final_spec.md`
- `app/services/api/endpoints.ts`
- `app/services/api/device.ts`
- `app/services/api/print-events.ts`
- centralized endpoint usage in session/menu/order services
- active order API contract
- print event API contract/store
- explicit `review` session phase
- updated route guard mapping for `/order/review`
- updated `CASE_FILE.md`

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

- `/start` registers/restores device.
- `/package` is only accessible during `package_selection`.
- `/order/initial` is only accessible during `initial_order`.
- `/order/review` is only accessible during `review` and requires initial cart items.
- successful initial submission enters `refill` and clears initial cart.
- `/order/refill` never exposes full initial menu.
- print events can be listed and acknowledged once backend endpoints exist.
- token loss or 401 returns to `/start`.

## Next TODOs
- Wire `registerDevice()` into `/start` instead of manual token/device/table fields.
- Add QR scanner component and manual 6-digit fallback UI.
- Add real Reverb plugin for session/order/print control events.
- Add Vitest coverage for `useSessionGuard`, session store transitions, cart rules, endpoint constants, and print event store.
- Add visual components for product cards, cart drawer, package comparison, refill header, and print event banner.
- Sync endpoint constants with the finalized `woosoo-app` backend route file before production.
