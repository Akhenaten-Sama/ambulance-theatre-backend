# Theatre Feature Completion Checklist

## 1. Restore Backend Source
- Recover `src/` in working tree before writing backend fixes.
- Confirm `npm run build` executes against source, not only `dist`.

## 2. Stabilize Types and Enums
- Ensure `src/common/enums/index.ts` exports all theatre, booking, emergency enums.
- Align enum values used by seed scripts and DTOs with entity definitions.
- Fix naming mismatches (`is_email_verified` style fields, relation object vs id fields).

## 3. Complete Theatre API Surface
- Add theatre endpoints for:
  - `PATCH /theatres/:id/status`
  - `POST /theatres/:id/current-surgery`
  - `GET /theatres/:id/utilization`
  - `POST /theatres/:id/equipment/check`
- Keep controller errors specific; avoid converting `NotFoundException` and `BadRequestException` to generic 500s.

## 4. Finish Theatre-Booking Workflow
- Enforce state transitions:
  - `AVAILABLE -> RESERVED -> IN_USE -> CLEANING -> AVAILABLE`
- On booking completion:
  - increment surgery metrics
  - clear current surgery references
  - emit realtime status updates
- Add a clear "cleaning complete" action to return theatre to `AVAILABLE`.

## 5. Reliability and Observability
- Add validation for booking and theatre lifecycle payloads.
- Add structured logs for transitions and booking conflicts.
- Add test coverage for:
  - time-slot conflict detection
  - emergency booking path
  - status transition guards
  - metrics updates

## 6. Mobile Integration Readiness
- Keep `/theatres` response shape stable for mobile clients.
- Add a dedicated lightweight endpoint for mobile dashboard cards if needed:
  - `/theatres/summary`
- Add pagination and filter params for theatre search by specialty/status/hospital.
