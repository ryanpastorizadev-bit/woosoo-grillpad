# QA_CHECKLIST.md

Use this checklist for manual GrillPad tablet validation before merge.

## Environment Setup
- [ ] `npm install` completed
- [ ] `.env` is configured from `.env.example`
- [ ] `npm run dev` starts successfully
- [ ] Regression commands pass:
  - [ ] `npm run lint`
  - [ ] `npm run test`
  - [ ] `npm run build`
- [ ] PWA build output exists after build:
  - [ ] `.output/public/sw.js`
  - [ ] `.output/public/workbox-*.js`

## Tablet Layout (Samsung Galaxy Tab A9, landscape 1340x800)
- [ ] Tap targets are comfortably touchable (no cramped controls)
- [ ] No clipped text/content at common workflow screens
- [ ] Scroll/overflow behavior is usable and does not trap interaction
- [ ] Bottom action areas remain visible and tappable
- [ ] Safe visual spacing is preserved near edges/corners

## Manual Workflow Route Flow
- [ ] `/start` works for registration/start and resume checks
- [ ] `/package` only works during `package_selection`
- [ ] `/order/initial` only works during `initial_order`
- [ ] `/order/review` only works during `review`
- [ ] `/order/refill` only works during `refill` and only shows refill-eligible items
- [ ] `/session` is reachable for active session view
- [ ] `/session/ended` appears after ending flow
- [ ] Invalid/out-of-phase route access redirects to phase-correct route

## Offline + PWA Behavior
- [ ] App shows installability basics (install prompt/path available on supported browser)
- [ ] Update banner/prompt appears when an update is available and does not force reload mid-session
- [ ] API responses are not treated as cache truth during active flow
- [ ] Refresh restores session correctly when backend/session state is still valid

## Non-Blocking Warnings (can merge with note)
- [ ] Minor visual polish issues (spacing/alignment) that do not block ordering
- [ ] Sourcemap warnings during build with successful final output
- [ ] Intermittent local dev HMR glitches fixed by refresh/restart

## Blocking Issues (must stop merge)
- [ ] Any phase-gating bypass or wrong redirect
- [ ] Refill flow exposing initial-only items
- [ ] Session loss/corruption after refresh during active session
- [ ] Forced update/reload interrupting active ordering session
- [ ] Regression command failure (`lint`, `test`, or `build`) caused by this change
