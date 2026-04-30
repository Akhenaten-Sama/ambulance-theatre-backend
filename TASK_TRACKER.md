# Task Tracker

Use this file at the end of every work session.

## Active Tasks
- [ ] G-002 Accessibility pass
- [ ] G-003 Performance pass
- [ ] G-004 Analytics and crash reporting
- [ ] F-002 Realtime event integration layer
- [ ] H-001 Restore backend source tree

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
- [x] F-001 Notifications list and mark-as-read
- [x] C-002 Notification badge and unread state
- [x] E-002 Theatre details
- [x] E-004 Booking details
- [x] E-005 Create booking flow (staff role)
- [x] E-006 Reschedule/cancel flow
- [x] D-001 Emergency request creation flow
- [x] D-002 Emergency tracking screen (realtime + fallback)
- [x] A-003 Design system v1
- [x] C-001 Role-aware home screen
- [x] G-001 Error handling and UX polish

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
9. Completed `F-001` in standalone app: notification center with read actions, mark-all-read, refresh, and pagination.
10. Completed `C-002` in standalone app: tab unread badge from backend with refresh on app active and updates after read actions.
11. Completed `E-002` in standalone app: theatre details screen with list-to-detail navigation and operational info blocks.
12. Completed `E-004` in standalone app: booking details screen with list-to-detail navigation and role-based action visibility.
13. Completed `E-005` in standalone app: staff booking creation form with backend integration and success-to-details flow.
14. Completed `E-006` in standalone app: booking reschedule and cancel flows with validation, confirmation, and cache refresh.
15. Completed `D-001` in standalone app: emergency request creation with validation, duplicate-submit protection, and transition to tracking.
16. Completed `D-002` in standalone app: realtime emergency tracking with socket events, polling fallback, and manual refresh action.
17. Completed `A-003` in standalone app: shared UI tokens and reusable components for consistent iOS/Android styling.
18. Completed `C-001` in standalone app: role-aware home cards for patient and staff with operational summaries and fallback states.
19. Completed `G-001` in standalone app: unified API error mapping and reusable inline alert UI applied across major screens.

## Update Protocol
1. Move task checkbox to `Done` immediately after acceptance criteria are met.
2. Add one line in `Session Notes` explaining what was verified.
3. If blocked, move task to `Blocked Tasks` with reason.
4. Keep `Active Tasks` to max 7 items to maintain focus.
