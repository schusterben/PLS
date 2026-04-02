# Human Checklist

## Purpose
- Final human-eye signoff for Ambulanzprotokoll Page 1 on real browser print preview and responsive scaling.

## Setup
- Start backend and frontend normally for local manual testing.
- Use a valid user login.
- Open the app through the normal protected flow.
- Navigate to `SituationRoomTable`.
- Open one patient in `AmbulanzprotokollPage1`.

## Tablet Check
- In browser devtools, switch to a tablet-sized viewport in portrait mode.
- Confirm the page stays as one paper sheet and scales down instead of reflowing sections.
- Switch to tablet landscape.
- Confirm the body map, GCS, measures, AMPLE area, and footer disposition remain on the same page.
- Confirm no major section changes order or moves to a different layout pattern.

## Laptop Check
- Switch to a typical laptop viewport.
- Confirm the page scales up cleanly and does not exceed the visible stage unexpectedly.
- Confirm the top status line and action bar are visible on screen.
- Confirm the back button returns to `SituationRoomTable`.

## Interaction Check
- Add body map markers on front and back.
- Draw a signature.
- Enter medication rows, including up to the row limit.
- Set a pain scale value and toggle `nicht beurteilbar`.
- Change several pupil values.
- Refresh the page.
- Confirm all entered values restore correctly.

## Offline/Finalize Check
- Disconnect the browser from the network or stop the backend temporarily.
- Press `Finalisieren`.
- Confirm the page shows local-finalized behavior instead of losing data.
- Reconnect the network or backend.
- Confirm the record syncs without manual re-entry.

## Print Preview Check
- Open browser print preview on the Ambulanzprotokoll page.
- Confirm the top action controls are hidden in print.
- Confirm the paper remains fixed to the A4-style page shell.
- Confirm section bands and vertical rails remain visible.
- Confirm checked boxes and active scale points remain visibly marked.
- Confirm the body map and signature are present in print.
- Confirm the footer disposition strip is fully visible and readable.
- Confirm nothing important is cut off at the page edges.

## Pass Criteria
- Layout matches paper order and paper-mirror intent.
- Data survives refresh and reconnect flows.
- Print preview is readable and preserves the intended page structure.
