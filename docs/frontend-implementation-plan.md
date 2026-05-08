# Frontend Implementation Plan (MVP Tablet Ordering)

## Scope
- Nuxt tablet PWA flow for device-authenticated dine-in ordering.
- API-driven state for session, package, initial order, refill, active order, and print events.

## Delivered modules
1. **API contract layer**
   - `startSession`
   - `restoreSession`
   - `submitInitialOrder`
   - `submitRefillOrder`
   - `getActiveOrder`
   - `getPrintEvents`
   - `ackPrintEvent`
2. **Stores**
   - `device`, `session`, `menu`, `cart`, `order`
   - `active-order`, `print-events`, `realtime`
3. **Pages**
   - `/start`
   - `/package`
   - `/order/initial`
   - `/order/review`
   - `/order/refill`
   - `/session`
   - `/session/ended`
4. **Realtime**
   - Session-bound websocket lifecycle
   - Duplicate-subscription guard
   - Event-triggered active-order/print-event refresh
5. **PWA**
   - Prompt-based updates
   - Active-session-safe update apply behavior
   - Network-only API cache strategy

## Validation checklist
- [x] Start session
- [x] Restore on refresh with backend verification
- [x] Submit initial order and clear initial cart
- [x] Submit refill and clear refill cart
- [x] View active order state
- [x] Acknowledge print events
- [x] Session-phase route guarding
- [x] Realtime cleanup on session/device reset
