# Admin Dashboard Task List

Last Updated: 2026-05-01
Project: `C:\Users\oefun\ambulance-dashboard`

## Status Legend
- `[x]` Done
- `[ ]` Pending

## Phase 1 - Foundation and Visual System
- [x] Replace inconsistent theme colors with cohesive palette
- [x] Improve global typography and base styling
- [x] Align login and app shell visual language
- [x] Remove hardcoded notification badge count and use backend unread count

## Phase 2 - Dashboard Completeness
- [x] Replace placeholder recent activity block with live emergency request feed
- [x] Replace placeholder system status with live ambulance fleet status snapshot
- [x] Normalize stat cards with stable data loading states

## Phase 3 - Emergency Operations
- [x] Fix emergency requests table field mapping (patient, ambulance, created timestamp)
- [x] Add request status filtering to improve dispatch workflow
- [x] Improve status chip consistency

## Phase 4 - Hospital Operations
- [x] Fix create/edit payload mapping to backend structure
- [x] Fix update/delete ID handling
- [x] Rework hospital form for complete address + bed inputs
- [x] Add nearby hospitals finder (lat/lng + radius + specialty filter)
- [x] Show proximity results in sortable distance order

## Phase 5 - Theatre and Booking Operations
- [x] Add theatre specialty filtering
- [x] Replace raw hospital ID input with selector in theatre create flow
- [x] Improve theatre status/operational display
- [x] Rebuild booking create flow with linked selectors (theatre/hospital/patient/surgeon)
- [x] Add bookings status filtering
- [x] Fix booking table mapping to real backend fields

## Phase 6 - Ambulance and User Operations
- [x] Align ambulance status mapping with backend enum values
- [x] Improve ambulance type handling
- [x] Add hospital selector and required coordinates in ambulance create flow
- [x] Fix user page mutation typing and ID handling

## Phase 7 - Notifications and Quality
- [x] Fix notification read state mapping (`is_read`)
- [x] Standardize page headers and list presentation
- [x] Ensure responsive behavior across dashboard core pages
- [x] Run production build validation (`npm run build`)

## Follow-up Enhancements (Optional)
- [ ] Split large JS bundle with route-level lazy loading
- [ ] Add optimistic UI actions for dispatch/status updates
- [ ] Add reusable filter bar component for all list pages
- [ ] Add e2e smoke tests for login, emergency table, hospital finder, booking create
- [ ] Initialize Git in `ambulance-dashboard` and create structured commits by phase
