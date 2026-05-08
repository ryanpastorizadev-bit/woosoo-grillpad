# GrillPad - Copilot Instructions

## Build, test, and lint commands
- Install deps: `npm install`
- Dev server (localhost): `npm run dev`
- Dev server (LAN): `npm run dev:lan`
- Production build: `npm run build`
- Preview built app: `npm run preview`
- Static generate: `npm run generate`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Test suite: `npm run test`
- Single test file: `npx vitest run app/stores/session.test.ts` (replace with target `*.test.ts`)

## MCP servers (recommended priority)
1. Playwright MCP
2. Filesystem MCP
3. Git MCP
4. Docker MCP (optional later)

## MCP setup instructions
- Playwright MCP
  - Point to local URL: `http://127.0.0.1:3000`
  - Run app with `npm run dev` for active development, or `npm run build && npm run preview` for production-like validation.
  - Use deterministic workflow scripts that assert phase transitions and restrictions.
- Filesystem MCP
  - Restrict workspace scope to this repository.
  - Use it for architectural boundary checks (`stores`, `services/api`, `composables`, `middleware`, `components/ui`).
- Git MCP
  - Use for pre-merge change inspection focused on workflow/state-machine integrity.
  - Validate no boundary violations (for example, pages directly owning business logic).
- Docker MCP (optional)
  - Add once local workflow checks are stable.
  - Use with `docker-compose.frontend.yml` for deployment-like smoke verification.

## Local development assumptions
- Nuxt 4 client-rendered app (`ssr: false`) with strict phase-gated workflow.
- Runtime config comes from `NUXT_PUBLIC_*` variables in `.env`.
- PWA updates are prompt-based (`registerType: 'prompt'`, `skipWaiting: false`) to avoid interrupting active sessions.
- API responses are never cache truth (`NetworkOnly` strategy for `/api/` runtime caching).

## Example Playwright workflow commands
- Workflow smoke: `/start` -> register device/session -> `/package` -> `/order/initial` -> `/order/review` -> `/order/refill` -> `/session` -> `/session/ended`.
- Route guard checks: attempt out-of-phase route access and assert redirect to the phase-appropriate route.
- Refill checks: assert only refill-eligible items are visible and addable in refill mode.
- Session restore: reload during active flow and assert restoration via local storage + `/session/current`.
- Update behavior: when update is available during active session, assert deferred apply until session end.
- Offline/reconnect: validate offline UI signal and reconnect/session transition handling.

## Galaxy Tab A9 landscape testing profile
- Viewport: `1340x800` (landscape)
- `isMobile: true`
- `hasTouch: true`
- `deviceScaleFactor: 1` (or keep a single agreed value across all tests)
- Keep fullscreen/tablet assumptions aligned with `viewport-fit=cover`.

## High-level architecture
- Linear ordering flow:
  - `/start` -> `/package` -> `/order/initial` -> `/order/review` -> `/order/refill` -> `/session` -> `/session/ended`
- Route gating:
  - `app/middleware/session-phase.ts` delegates to `useSessionGuard()` for phase-based route validation.
- State management:
  - `session` store controls workflow phase and session identifiers.
  - `device` store controls tablet registration/auth context.
  - `menu` store loads package/menu data and exposes derived visibility.
  - `cart` store enforces separate initial/refill carts.
  - `order` store handles submit state/errors.
  - `update` store coordinates service-worker update handling.
- API/contract layer:
  - `useApi()` defines fetch client behavior (auth header, timeout/retry, 401 behavior).
  - `services/api/*` owns endpoint access and Zod response validation.
- PWA update flow:
  - `app/plugins/pwa-update.client.ts` marks updates and applies only when session is inactive.

## Expected workflow architecture
- `stores/`
  - Source of workflow/domain state and transitions.
- `services/api/`
  - HTTP contracts and parsing/validation.
- `composables/`
  - Cross-cutting orchestration (`useApi`, `useSessionGuard`) and reusable logic.
- `middleware/`
  - Route access enforcement from workflow state.
- `components/ui/`
  - Reusable presentational primitives only.

## Workflow Rules
- session.phase is the source of truth
- UI must not own business rules
- cart store decides cart destination
- pages must not call raw fetch directly
- menu visibility must be derived state
- refill mode must never expose full initial menu
- backend validation is mandatory even if frontend restricts UI

## Guidance for testing session phase transitions
- Verify each phase allows only its valid route set.
- Verify invalid route access redirects to the route derived from current `session.phase`.
- Verify transition sequence integrity (`package_selection` -> `initial_order` -> `refill` -> `ended`).
- Verify restoration and routing correctness after reload.
- Verify reconnect/update flows do not violate active-session constraints.

## Guidance for validating refill restrictions
- Refill menu must hide initial-only items.
- Refill add actions must reject non-refill items.
- Package changes must be impossible after initial order submission.
- Refill submission requires valid `sessionId` and `initialOrderId`.
- Refill flow must not expose full initial menu data paths.

## Required Validation Before Merge
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- phase route validation
- refill restriction validation
- session restoration validation
- API contract validation
- no hardcoded mock menu data in pages
- no fake order IDs
- no UI-owned workflow logic

## Issue & PR dependency workflow
- Check each issue for blockers/dependencies before starting implementation.
- Prioritize safe, unblocked issues first (for example, issues with no backend dependency).
- Do not merge while related PR checks are failing; wait until all required PR checks are green.
- Keep the local working branch updated with the latest target branch changes before final validation and merge.

## Avoiding prototype drift
- avoid giant conditional pages
- avoid duplicated styles
- avoid inline business logic in components
- avoid direct fetch calls in pages
- prefer stores/composables/services separation

## Existing repo conventions to preserve
- Keep session-phase logic centralized in Pinia stores and route middleware.
- Keep API access centralized in `useApi()`.
- Keep reusable UI primitives in `components/ui`.
- Do not duplicate business rules across pages/components.
- Never treat API cache as source of truth.
- Do not force update application during active ordering sessions.
- Deploy with unique `APP_VERSION` per build.
