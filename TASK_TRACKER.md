# Task Tracker

Use this file at the end of every work session.

## Active Tasks
- [ ] F-001 Notifications list and mark-as-read
- [ ] A-003 Design system v1
- [ ] C-001 Role-aware home screen
- [ ] C-002 Notification badge and unread state
- [ ] E-002 Theatre details
- [ ] E-004 Booking details

## Blocked Tasks
- [ ] H-001 Restore backend source tree
- [ ] H-002 Theatre API completion
- [ ] H-003 Booking-theatre lifecycle hardening

## Done Tasks
- [x] Project planning and execution board creation
- [x] Standalone Expo project scaffolded outside backend repo
- [x] A-001 Mobile architecture bootstrap
- [x] A-002 Environment and config strategy
- [x] B-001 Login screen + API integration
- [x] B-003 Session lifecycle management
- [x] E-001 Theatre list and specialty filters
- [x] E-003 Booking list (upcoming/history)

## Session Notes
- 2026-04-30:
1. Created ticketed execution board with acceptance criteria (`EXECUTION_BOARD.md`).
2. Established tracker workflow for active/blocked/done tasks.
3. Noted backend theatre completion tasks are blocked by missing/restoration-needed source tree.
4. Completed Sprint 1 setup (`A-001`, `A-002`) in standalone app with navigation, query provider, auth store, API layer, and config docs.
5. Completed `B-001` in standalone app: real backend login flow, submit states, and auth error handling.
6. Completed `B-003` in standalone app: secure token persistence, session restore on boot, logout clearing, and 401 auto-reset handling.
7. Completed `E-001` in standalone app: theatre list filters by specialty with token-aware API calls and refresh/empty handling.
8. Completed `E-003` in standalone app: bookings upcoming/history segmented lists with paginated history loading.

## Update Protocol
1. Move task checkbox to `Done` immediately after acceptance criteria are met.
2. Add one line in `Session Notes` explaining what was verified.
3. If blocked, move task to `Blocked Tasks` with reason.
4. Keep `Active Tasks` to max 7 items to maintain focus.
