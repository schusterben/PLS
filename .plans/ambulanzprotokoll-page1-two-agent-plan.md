# Two-Agent Completion Plan

## Summary
- The route, A4 paper shell, RHF/Zod workflow, local draft recovery, debounced autosave, page-1 table, and `GET`/`PUT` endpoints are already implemented.
- The remaining repo-work is concentrated in frontend paper-form completion and backend/spec hardening.
- Deferred items stay out of this execution split: legacy cutover, load/failure protocols, and runbooks.

## Shared Contract Freeze
- `assessment_secondary.bodymap` = array of marker objects `{ view: 'front'|'back', marker: string, x: number, y: number }`
- `signatures.entlass_san_na` = PNG data URL string or `null`
- `medications_administered` = ordered array of up to 8 items `{ medikament: string, dosis: string, art: string, uhrzeit: string | null }`
- `vitals.schmerz` = integer `0..10` or `null`
- `vitals.schmerz_nicht_beurteilbar` = bound NA toggle from the canonical spec
- `vitals.pupillen` = `{ R: string[]; L: string[] }` with rows `eng`, `mittel`, `weit`, `entrundet`, `prompte Lichtreflexe`, `verlangsamte Lichtreflexe`, `lichtstarr`
- Do not redesign the page. Patch the current implementation in place.

## Agent 1: Frontend Paper-Form Completion
- Ownership: `client-app/src/pages/AmbulanzprotokollPage1.tsx`, `client-app/src/styles/ambulanzprotokoll-page1.css`, `client-app/src/features/ambulanzprotokoll-page1`
- Replace the body-map placeholder with interactive front/back placement using the frozen marker contract and existing legend labels.
- Replace the signature text input with a pointer/touch canvas that stores a PNG data URL and supports clear/re-sign.
- Convert the medication block to RHF-bound repeating rows with the exact paper columns and an 8-item cap.
- Make the pain scale clickable and bind `nicht beurteilbar` to `vitals.schmerz_nicht_beurteilbar`.
- Make `Pupillen` interactive using the canonical row list instead of the current display-only matrix.
- Add a visible back action that returns to `SituationRoomTable` using the preserved `operationSceneId`.
- Keep current autosave/recovery behavior, but add reconnect-aware retry plus explicit `online`/`offline`/`error` state.
- Expand print CSS until A4 preview preserves rails, section bands, footer strip, body map, and footer disposition readability.

## Agent 2: Spec, Backend, and Hardening
- Ownership: `docs/specs/ambulanzprotokoll_page1.json`, `src/PLS.Api/Models/AmbulanzprotokollPage1Defaults.cs`, `tests/PLS.Api.Tests`, `src/PLS.Api`
- Normalize the canonical spec file into one valid JSON document without changing intended labels, order, or paper semantics.
- Make the frozen body-map, signature, and pain-scale metadata explicit in the canonical spec.
- Add contract tests that verify:
- every `bind` path exists in the canonical `stateSchema`
- backend defaults match the canonical `stateSchema`
- persisted values survive `PUT`/`GET` round-trip unchanged
- Extend page-1 API tests for missing-patient `404`, invalid `status`, and response-shape stability.
- Add missing indexes on `qr_code_logins.qr_login`, `qr_code_patients.qr_login`, and `RefreshTokens.Token`.
- Restore concurrency safety to the v2 QR scan path so it matches v1 locking guarantees.

## Coordination
- Agent 2 publishes the normalized spec and frozen payload contract first, or keeps the contract above unchanged.
- Agent 1 does not edit backend files or the canonical spec.
- Agent 2 does not edit page rendering or page CSS.

## Merge Gate
- Run `npm run lint`
- Run `npm run test`
- Run `npm run build`
- Run full `dotnet test`
- Run one manual print-preview check on tablet and laptop sizes
