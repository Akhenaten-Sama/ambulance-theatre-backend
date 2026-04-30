# Ambulance Theatre Platform - Execution Board

Last Updated: 2026-04-30
Owner: Product + Engineering
Tracking Rule: Every completed task must be moved to `Done` and added to the completion log.

## Status Legend
- `Todo`: Not started
- `In Progress`: Currently being worked
- `Blocked`: Waiting on dependency/decision
- `Done`: Completed and verified

## Epic A - Foundation and Project Setup

### A-001 - Mobile architecture bootstrap
- Status: `Done`
- Scope: Setup navigation, state, data, and API architecture in mobile app.
- Acceptance Criteria:
1. React Navigation is installed and root stacks/tabs are wired.
2. React Query is configured with global provider.
3. Global auth/session state store exists.
4. API client has centralized base URL and error normalization.
- Dependencies: None

### A-002 - Environment and config strategy
- Status: `Done`
- Scope: Standardize local/dev/staging/prod API endpoint strategy.
- Acceptance Criteria:
1. `app.json`/expo config supports environment-based API base URL.
2. README includes emulator/device URL guidance (`10.0.2.2`, LAN IP).
3. Config fallback behavior is documented.
- Dependencies: A-001

### A-003 - Design system v1
- Status: `Done`
- Scope: Build shared UI primitives for cross-platform consistency.
- Acceptance Criteria:
1. Shared color/spacing/type tokens are defined.
2. Shared components exist (`Button`, `Input`, `Card`, `Screen`, `EmptyState`).
3. iOS/Android safe area and typography behavior is validated.
- Dependencies: A-001

## Epic B - Authentication and Session

### B-001 - Login screen + API integration
- Status: `Done`
- Scope: Build login UI and integrate backend auth endpoint.
- Acceptance Criteria:
1. Valid credentials log user in and persist token securely.
2. Invalid credentials show clean error states.
3. App redirects to authenticated shell after login.
- Dependencies: A-001, A-002

### B-002 - Registration screen + validation
- Status: `Todo`
- Scope: Build patient registration and validations.
- Acceptance Criteria:
1. Required form fields validated client-side.
2. API errors mapped to user-friendly messages.
3. Post-registration success path is defined.
- Dependencies: B-001

### B-003 - Session lifecycle management
- Status: `Done`
- Scope: Handle token restore, expiry, and logout cleanly.
- Acceptance Criteria:
1. App restores valid session on cold start.
2. Unauthorized API responses trigger controlled logout.
3. Logout clears storage and resets navigation state.
- Dependencies: B-001

## Epic C - Home and Core Dashboard

### C-001 - Role-aware home screen
- Status: `Done`
- Scope: Build home summary cards per user role.
- Acceptance Criteria:
1. Patient home shows emergency quick action + booking summary.
2. Staff home shows theatre/booking operational summary.
3. Empty/loading/error states are present.
- Dependencies: B-003, A-003

### C-002 - Notification badge and unread state
- Status: `Done`
- Scope: Show unread notification count in shell/tab.
- Acceptance Criteria:
1. Badge count loads from backend unread endpoint.
2. Count refreshes on app focus and notification read actions.
3. Error fallback does not break navigation.
- Dependencies: C-001

## Epic D - Emergency Flow

### D-001 - Emergency request creation flow
- Status: `Done`
- Scope: Fast, low-friction emergency submission form.
- Acceptance Criteria:
1. User can submit emergency type, severity, pickup location/address.
2. Success leads to request detail/tracking screen.
3. Duplicate submit protection is implemented.
- Dependencies: B-003

### D-002 - Emergency tracking screen (realtime + fallback)
- Status: `Done`
- Scope: Track emergency status progression in near realtime.
- Acceptance Criteria:
1. Realtime subscription updates status when events arrive.
2. Polling fallback works when socket disconnects.
3. User sees latest assigned ambulance and status timestamp.
- Dependencies: D-001

### D-003 - Emergency history
- Status: `Todo`
- Scope: Patient can view previous emergency requests.
- Acceptance Criteria:
1. Paginated list of prior requests.
2. Filters by status/date.
3. Detail deep-link works from list item.
- Dependencies: D-002

## Epic E - Theatre and Booking

### E-001 - Theatre list and specialty filters
- Status: `Done`
- Scope: Show theatres with status and filter controls.
- Acceptance Criteria:
1. Theatre list fetches from backend and renders status clearly.
2. Specialty filter calls API correctly.
3. Pull-to-refresh and empty states are implemented.
- Dependencies: C-001

### E-002 - Theatre details
- Status: `Done`
- Scope: Show single theatre operational details.
- Acceptance Criteria:
1. Detail includes status, specialty, availability window.
2. Utilization block and equipment block are shown (or fallback placeholders).
3. Error state is recoverable with retry.
- Dependencies: E-001

### E-003 - Booking list (upcoming/history)
- Status: `Done`
- Scope: Surface booking lists for patient/staff.
- Acceptance Criteria:
1. Upcoming/past segmented lists render from backend.
2. List supports pagination and pull refresh.
3. Selecting booking navigates to booking details.
- Dependencies: C-001

### E-004 - Booking details
- Status: `Done`
- Scope: Detailed booking timeline and fields.
- Acceptance Criteria:
1. Details include theatre, surgeon, schedule, status timeline.
2. Role-based action buttons are shown conditionally.
3. All possible booking states are rendered safely.
- Dependencies: E-003

### E-005 - Create booking flow (staff role)
- Status: `Done`
- Scope: Staff can create theatre bookings from mobile.
- Acceptance Criteria:
1. Required fields are validated and submitted.
2. Conflict error from API is shown with actionable message.
3. Success returns to booking details with fresh data.
- Dependencies: E-001, E-003

### E-006 - Reschedule/cancel flow
- Status: `Done`
- Scope: Handle booking changes with confirmation UX.
- Acceptance Criteria:
1. Cancel requires reason and confirms before submit.
2. Reschedule validates start/end and handles conflicts.
3. Success updates list/detail caches immediately.
- Dependencies: E-004

### E-007 - Theatre lifecycle operations (staff/admin)
- Status: `Todo`
- Scope: Enable status transitions in UI once backend is stable.
- Acceptance Criteria:
1. Allowed transitions are enforced in UI.
2. In-progress and completion actions reflect booking + theatre states.
3. Cleaning-to-available action exists and is auditable.
- Dependencies: E-002, E-004, backend theatre source restore

## Epic F - Notifications and Realtime

### F-001 - Notifications list and mark-as-read
- Status: `Done`
- Scope: Full notification center screen.
- Acceptance Criteria:
1. Paginated list renders with unread/read distinction.
2. Mark single/all as read works and updates badge.
3. Notification deep-links route to target screen.
- Dependencies: C-002

### F-002 - Realtime event integration layer
- Status: `Todo`
- Scope: Shared socket manager for emergency/booking/theatre events.
- Acceptance Criteria:
1. Socket auth uses JWT and reconnect policy.
2. Event handlers update query caches deterministically.
3. Disconnect states are surfaced to users only when impactful.
- Dependencies: B-003

## Epic G - Quality, Security, Performance

### G-001 - Error handling and UX polish
- Status: `Done`
- Scope: Standardize UX for API/network/form errors.
- Acceptance Criteria:
1. Global error parser maps backend errors to display-safe messages.
2. Toast/banner standards implemented across core flows.
3. Retry and recovery paths are visible on critical screens.
- Dependencies: A-001

### G-002 - Accessibility pass
- Status: `Todo`
- Scope: Cross-platform accessibility improvements.
- Acceptance Criteria:
1. Major controls have accessibility labels/hints.
2. Large text and screen-reader flow tested on iOS + Android.
3. Contrast and touch targets meet baseline requirements.
- Dependencies: A-003

### G-003 - Performance pass
- Status: `Todo`
- Scope: Optimize list rendering and startup behavior.
- Acceptance Criteria:
1. Lists use virtualization and stable keys.
2. Initial app load avoids unnecessary calls.
3. Known performance bottlenecks documented and fixed.
- Dependencies: C-001, E-003

### G-004 - Analytics and crash reporting
- Status: `Todo`
- Scope: Add observability for production readiness.
- Acceptance Criteria:
1. Crash reporting integrated.
2. Key flow analytics instrumented (login, emergency submit, booking actions).
3. Event names and payload schema documented.
- Dependencies: B-003, D-001, E-005

## Epic H - Backend Closure for Theatre Domain

### H-001 - Restore backend source tree
- Status: `Blocked`
- Scope: Recover `src` and ensure build from source is stable.
- Acceptance Criteria:
1. `src` exists and matches intended branch state.
2. `npm run build` passes from source tree.
3. Theatre/booking modules compile without temporary hacks.
- Dependencies: Repository state fix

### H-002 - Theatre API completion
- Status: `Blocked`
- Scope: Fill omitted/partial theatre operations.
- Acceptance Criteria:
1. Status update endpoint with transition guards exists.
2. Utilization/equipment endpoints are complete and tested.
3. Controller preserves meaningful 4xx errors (no blanket 500 wrapping).
- Dependencies: H-001

### H-003 - Booking-theatre lifecycle hardening
- Status: `Blocked`
- Scope: Ensure booking completion fully reconciles theatre state.
- Acceptance Criteria:
1. Booking completion transitions theatre to cleaning.
2. Cleaning complete transition returns theatre to available.
3. Realtime events emitted for all operational transitions.
- Dependencies: H-001, H-002

## Current Sprint Proposal (Sprint 1)
- A-001, A-002, B-001, B-003, E-001, E-003, F-001

## Completion Log
- 2026-04-30: Created standalone Expo project at `C:\Users\oefun\ambulance-theatre-mobile`.
- 2026-04-30: Added initial theatre API wiring and base mobile structure (to be continued in standalone repo).
- 2026-04-30: Completed `A-001` with React Navigation, React Query provider, auth store, and normalized API client.
- 2026-04-30: Completed `A-002` with Expo `extra.apiBaseUrl` config and README endpoint guidance for Android/iOS/device.
- 2026-04-30: Completed `B-001` with backend `/auth/login` integration, credential form validation, and login error/loading UI states.
- 2026-04-30: Completed `B-003` with secure session persistence, cold-start hydration, logout clearing, and global 401-triggered session reset.
- 2026-04-30: Completed `E-001` with theatre specialty filter chips, filtered query wiring, token-aware requests, and refresh/empty states.
- 2026-04-30: Completed `E-003` with segmented upcoming/history booking lists, pull-to-refresh, and history pagination load-more behavior.
- 2026-04-30: Completed `F-001` with notifications center list, mark single read, mark all read, pagination, and refresh behavior.
- 2026-04-30: Completed `C-002` with unread badge wiring from backend count, app-active refresh, and query invalidation after read actions.
- 2026-04-30: Completed `E-002` with theatre detail screen, list-to-detail navigation, and utilization/equipment info blocks.
- 2026-04-30: Completed `E-004` with booking detail screen, list-to-detail navigation, and role-based action visibility.
- 2026-04-30: Completed `E-005` with staff-only booking creation form, validation, backend create call, and success navigation to details.
- 2026-04-30: Completed `E-006` with booking reschedule and cancel actions, cancellation confirmation, and query refresh on success.
- 2026-04-30: Completed `D-001` with emergency request form, duplicate submit protection, and success navigation to tracking screen.
- 2026-04-30: Completed `D-002` with realtime emergency tracking subscriptions, polling fallback, and connection-aware refresh behavior.
- 2026-04-30: Completed `A-003` with shared theme tokens and reusable `Screen`, `Card`, `Button`, `Input`, and `EmptyState` components.
- 2026-04-30: Completed `C-001` with role-aware home dashboard cards for patient and staff, including loading/error/empty states.
- 2026-04-30: Completed `G-001` with centralized API error mapping and consistent inline alert UX across core screens.
