# GrillPad Manual QA Checklist

This document is the practical manual QA runbook for GrillPad tablet testing.
It covers both **automated gates** (must pass in CI) and **manual checks** (must be verified on a physical or emulated tablet).

> **Legend**
>
> - ✅ Automated — covered by `npm run test`, `npm run typecheck`, or `npm run lint`
> - 🧪 Manual — requires a human tester on a tablet or browser
> - 🔌 Backend-blocked — cannot be fully verified without a running `woosoo-app` backend; mark _PENDING_ when backend is not available

---

## 0. Automated Gate Commands

Run these before every merge. All must pass with zero errors.

```bash
npm run lint        # ESLint — no style or import violations
npm run typecheck   # TypeScript — no type errors
npm run test        # Vitest unit tests — all green
npm run build       # Nuxt production build — no build errors
```

> A failing automated gate blocks merge regardless of manual results.

---

## 1. Install / Open PWA

| # | Check | Expected result | Type |
|---|-------|-----------------|------|
| 1.1 | Navigate to the app URL on the tablet browser | App loads without a white screen or console errors | 🧪 Manual |
| 1.2 | Browser shows "Add to Home Screen" / install prompt | Install prompt appears and can be accepted | 🧪 Manual |
| 1.3 | Launch from home-screen icon | App opens in standalone mode (no browser chrome) | 🧪 Manual |
| 1.4 | Hard-reload the app (`Ctrl+Shift+R` / force refresh) | App reloads cleanly; no stale shell or blank screen | 🧪 Manual |
| 1.5 | Check manifest and service worker in DevTools | `manifest.json` loaded; service worker status is "activated and running" | 🧪 Manual |

---

## 2. Start Screen (`/start`)

| # | Check | Expected result | Type |
|---|-------|-----------------|------|
| 2.1 | Route guard on fresh load | App lands on `/start` when no device is registered | ✅ Automated (`session-guard.test.ts`) |
| 2.2 | Submit empty token | Form shows validation error; no API call is made | 🧪 Manual |
| 2.3 | Submit invalid/expired 6-digit token | Error message is shown; device/session state is cleared | 🔌 Backend-blocked |
| 2.4 | Submit valid 6-digit registration token | Device registers; Device ID (`device.id`), Table ID, Table Name, and API bearer token are persisted from the backend response only; device display name (`device.name`) is not stored | 🔌 Backend-blocked |
| 2.5 | Reload after successful registration | App restores device identity from local storage and verifies against the backend before navigating | 🔌 Backend-blocked |
| 2.6 | Token loss / 401 response | App clears state and redirects to `/start` | 🔌 Backend-blocked |
| 2.7 | Manual Device ID / Table ID fields absent | UI does not allow the user to type a Device ID, Table ID, or Table Name directly | 🧪 Manual |

---

## 3. Package Selection (`/package`)

| # | Check | Expected result | Type |
|---|-------|-----------------|------|
| 3.1 | Route guard — not in `package_selection` phase | Navigating to `/package` outside its phase redirects to the phase-appropriate route | ✅ Automated (`session-guard.test.ts`) |
| 3.2 | Package list loads | Available packages are displayed with names and descriptions | 🔌 Backend-blocked |
| 3.3 | Select a package | Phase transitions to `initial_order`; app navigates to `/order/initial` | 🔌 Backend-blocked |
| 3.4 | Attempt to return to `/package` after initial order | Route guard blocks access and redirects to `/order/initial` or `/order/refill` | 🧪 Manual |

---

## 4. Initial Order Flow (`/order/initial`)

| # | Check | Expected result | Type |
|---|-------|-----------------|------|
| 4.1 | Route guard — only accessible in `initial_order` phase | Other phases are redirected away from `/order/initial` | ✅ Automated (`session-guard.test.ts`) |
| 4.2 | Menu loads for selected package | Only package-allowed initial items are displayed | 🔌 Backend-blocked |
| 4.3 | Add item to cart | Item appears in the initial cart | 🧪 Manual |
| 4.4 | Remove item from cart | Item is removed; cart count updates | 🧪 Manual |
| 4.5 | Adjust item quantity | Quantity updates correctly in the cart | 🧪 Manual |
| 4.6 | Proceed to review with empty cart | Navigation to review is blocked | ✅ Automated (`session-guard.test.ts`) |
| 4.7 | Proceed to review with items in cart | Phase transitions to `review`; app navigates to `/order/review` | 🧪 Manual |
| 4.8 | No raw `fetch` calls in page components | Pages delegate to stores / composables only | ✅ Automated (`npm run typecheck` + code review) |

---

## 5. Review Flow (`/order/review`)

| # | Check | Expected result | Type |
|---|-------|-----------------|------|
| 5.1 | Route guard — only accessible in `review` phase with cart items | Accessing `/order/review` without items or outside `review` phase redirects back | ✅ Automated (`session-guard.test.ts`) |
| 5.2 | Review page shows full cart summary | All selected items, quantities, and modifiers are displayed accurately | 🧪 Manual |
| 5.3 | Edit order (back to initial order) | Phase reverts to `initial_order`; navigates to `/order/initial` with cart intact | 🧪 Manual |
| 5.4 | Submit initial order | Order is POSTed to backend; phase becomes `refill`; initial cart is cleared; app navigates to `/order/refill` | 🔌 Backend-blocked |
| 5.5 | Duplicate submit guard | Submitting while already submitting does not fire a second API request | 🧪 Manual |
| 5.6 | Submit failure (network/API error) | Error message is shown; phase stays in `review`; cart is preserved | 🔌 Backend-blocked |

---

## 6. Refill Flow (`/order/refill`)

| # | Check | Expected result | Type |
|---|-------|-----------------|------|
| 6.1 | Route guard — only accessible in `refill` phase | Accessing `/order/refill` outside `refill` phase redirects to the phase-appropriate route | ✅ Automated (`session-guard.test.ts`) |
| 6.2 | Refill menu loads from backend refill endpoint | Menu items shown are the backend-approved refillable set only | 🔌 Backend-blocked |
| 6.3 | Full initial menu is NOT shown | No initial-only or premium items appear in the refill UI | 🧪 Manual |
| 6.4 | Package selection is locked | No UI affordance allows changing the package during refill | 🧪 Manual |
| 6.5 | Add a refillable item | Item is added to the refill cart (not the initial cart) | ✅ Automated (`menu-cart-rules.test.ts`) |
| 6.6 | Attempt to add a non-refillable item | Cart store rejects the item; no error uncaught | ✅ Automated (`menu-cart-rules.test.ts`) |
| 6.7 | Submit refill order | Refill order is POSTed; refill cart clears; confirmation is shown | 🔌 Backend-blocked |
| 6.8 | Submit with empty refill cart | Submit is blocked or produces a user-visible error | 🧪 Manual |
| 6.9 | Multiple refill rounds | Each round clears the previous refill cart cleanly | 🔌 Backend-blocked |

---

## 7. Session Ended Flow (`/session/ended`)

| # | Check | Expected result | Type |
|---|-------|-----------------|------|
| 7.1 | Phase maps to `/session/ended` | `routeForPhase('ended')` returns `/session/ended` | ✅ Automated (`session-guard.test.ts`) |
| 7.2 | Session-ended screen is shown | A clear "Session ended" message is displayed | 🧪 Manual |
| 7.3 | Both carts are cleared | Initial cart and refill cart are empty on the ended screen | 🧪 Manual |
| 7.4 | Reset tablet action | Phase resets to `unregistered`; app navigates to `/start`; device state is cleared | 🔌 Backend-blocked |
| 7.5 | Attempt to navigate to order routes after session ended | Route guard redirects to `/session/ended` | 🧪 Manual |

---

## 8. Session Store (`/session`)

| # | Check | Expected result | Type |
|---|-------|-----------------|------|
| 8.1 | `session.phase` is the single source of truth | No page or component holds its own phase variable | ✅ Automated (code review / typecheck) |
| 8.2 | Session state persists on reload | `session.phase`, `sessionId`, and `initialOrderId` are restored from local storage | 🧪 Manual |
| 8.3 | Session restoration verifies against backend | On reload the frontend calls `/session/current` and uses the backend response, not local cache | 🔌 Backend-blocked |
| 8.4 | Phase transitions fire in correct order | `unregistered` → `package_selection` → `initial_order` → `review` → `refill` → `ended` | ✅ Automated (`session-store.test.ts`) |

---

## 9. Print Event Visibility

| # | Check | Expected result | Type |
|---|-------|-----------------|------|
| 9.1 | Print events store initialises without errors | Store is accessible; no console errors on load | ✅ Automated (`print-events-store.test.ts`) |
| 9.2 | Print event list loads | Print events are fetched and displayed when the backend endpoint is live | 🔌 Backend-blocked |
| 9.3 | Acknowledge a print event | Acknowledged event is removed from the active list; API call fires | 🔌 Backend-blocked |
| 9.4 | New print event via Reverb | `print_event_created` Reverb event triggers a re-fetch and displays the new event | 🔌 Backend-blocked |

---

## 10. PWA Update Behaviour

| # | Check | Expected result | Type |
|---|-------|-----------------|------|
| 10.1 | Update store registers without errors | `update` Pinia store initialises; no console errors | ✅ Automated (`update-store.test.ts`) |
| 10.2 | New version deployed during idle session | Update banner or prompt is shown to the user | 🧪 Manual |
| 10.3 | New version deployed during active ordering | Update is deferred; no automatic reload interrupts the ordering flow | 🧪 Manual |
| 10.4 | User accepts update after session ends | Service worker activates the new version and the app reloads cleanly | 🧪 Manual |
| 10.5 | `registerType` is `prompt` (not `autoUpdate`) | Confirmed in `nuxt.config.ts` PWA plugin settings | ✅ Automated (`npm run build` config check) |
| 10.6 | API routes are `NetworkOnly` | API calls during offline return a network error, not stale cache | 🧪 Manual |

---

## 11. Offline / Reconnect Behaviour

| # | Check | Expected result | Type |
|---|-------|-----------------|------|
| 11.1 | Simulate offline (DevTools → Offline) | App shows an offline indicator or disables submit actions gracefully | 🧪 Manual |
| 11.2 | Submit order while offline | Error is shown to the user; no data is silently dropped | 🧪 Manual |
| 11.3 | Reconnect after offline | App recovers; API calls resume; UI reflects current state | 🧪 Manual |
| 11.4 | Stale cached API response not used as truth | After reconnect the app re-fetches authoritative state, not the service worker cache | 🔌 Backend-blocked |
| 11.5 | `force_end_session` Reverb event while offline | On reconnect the event is processed and the session ends cleanly | 🔌 Backend-blocked |

---

## 12. Tablet Landscape Layout (Galaxy Tab A9 — 1340 × 800)

> Test profile: viewport `1340×800`, `isMobile: true`, `hasTouch: true`, `deviceScaleFactor: 1`.

| # | Check | Expected result | Type |
|---|-------|-----------------|------|
| 12.1 | `/start` in landscape | Registration form is fully visible and usable without horizontal scroll | 🧪 Manual |
| 12.2 | `/package` in landscape | Package cards are laid out side-by-side and readable | 🧪 Manual |
| 12.3 | `/order/initial` in landscape | Menu items and cart panel fit within the viewport | 🧪 Manual |
| 12.4 | `/order/review` in landscape | Cart summary is readable; action buttons are reachable | 🧪 Manual |
| 12.5 | `/order/refill` in landscape | Refill menu and cart are visible; no overflow clipping | 🧪 Manual |
| 12.6 | `/session/ended` in landscape | Ended screen fills the viewport; reset button is tappable | 🧪 Manual |
| 12.7 | Touch targets ≥ 44 × 44 px | All buttons and interactive elements meet minimum tap-target size | 🧪 Manual |
| 12.8 | No horizontal scroll on any page | All pages render within the 1340 px width | 🧪 Manual |
| 12.9 | `viewport-fit=cover` respected | Content reaches screen edges correctly; no white bars | 🧪 Manual |

---

## 13. Route Guard Matrix

This table summarises the expected redirect for each phase/route combination.
All cells in the **Automated** column are covered by `tests/session-guard.test.ts`.

| Phase | `/start` | `/package` | `/order/initial` | `/order/review` | `/order/refill` | `/session/ended` |
|-------|----------|------------|------------------|-----------------|-----------------|-----------------|
| `unregistered` | ✅ allowed | ↩ `/start` | ↩ `/start` | ↩ `/start` | ↩ `/start` | ↩ `/start` |
| `package_selection` | ↩ `/package` | ✅ allowed | ↩ `/package` | ↩ `/package` | ↩ `/package` | ↩ `/package` |
| `initial_order` | ↩ `/order/initial` | ↩ `/order/initial` | ✅ allowed | ↩ `/order/initial` | ↩ `/order/initial` | ↩ `/order/initial` |
| `review` | ↩ `/order/review` | ↩ `/order/review` | ✅ allowed (edit) | ✅ allowed (with items) | ↩ `/order/review` | ↩ `/order/review` |
| `refill` | ↩ `/order/refill` | ↩ `/order/refill` | ↩ `/order/refill` | ↩ `/order/refill` | ✅ allowed | ↩ `/order/refill` |
| `ended` | ↩ `/session/ended` | ↩ `/session/ended` | ↩ `/session/ended` | ↩ `/session/ended` | ↩ `/session/ended` | ✅ allowed |

---

## 14. Pre-Merge Checklist

Run all automated gates first, then complete the relevant manual checks for the slice being merged.

### Automated gates (must be green)

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

- [ ] `npm run lint` — zero ESLint errors
- [ ] `npm run typecheck` — zero TypeScript errors
- [ ] `npm run test` — all Vitest tests pass
- [ ] `npm run build` — production build succeeds with no warnings treated as errors

### Manual gates (check those applicable to the slice)

- [ ] `/start` registration and restore flow verified (Section 2)
- [ ] Package selection and phase lock verified (Section 3)
- [ ] Initial order — add, remove, proceed to review (Section 4)
- [ ] Review — edit order, submit order, error handling (Section 5)
- [ ] Refill — menu restrictions, cart destination, submit (Section 6)
- [ ] Session ended — display, reset, route guard (Section 7)
- [ ] Print events — store, list, acknowledge (Section 9) *(skip if backend-blocked)*
- [ ] PWA update prompt — defer during active session (Section 10)
- [ ] Offline / reconnect — graceful error, recovery (Section 11)
- [ ] Tablet landscape layout — Galaxy Tab A9 profile (Section 12)

### Backend-blocked checks (label as PENDING when backend unavailable)

- [ ] Device registration with real backend token — Section 2.3–2.6
- [ ] Package list from API — Section 3.2–3.3
- [ ] Initial menu from API — Section 4.2
- [ ] Initial order submit — Section 5.4, 5.6
- [ ] Refill menu from backend — Section 6.2
- [ ] Refill order submit — Section 6.7–6.9
- [ ] Session restore via `/session/current` — Section 8.3
- [ ] Print event API and Reverb — Section 9.2–9.4
- [ ] Session end via `force_end_session` Reverb — Section 11.5
- [ ] Stale cache guard after reconnect — Section 11.4
