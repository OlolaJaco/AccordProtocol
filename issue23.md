**Frontend — Routing**

## Summary
Right now there is no way for a user to see who the multisig owners are or what the signing threshold is without reading the dashboard stat card. A dedicated Owners page gives a clear, scannable view of every authorised signer and the M-of-N requirement.

## Background
`App.tsx` drives navigation with a state variable of type `"dashboard" | "history"` and renders a tab button for each value. The `useContract` hook already fetches the owner list and threshold from the contract and returns them as `owners` (an array of `Owner` objects) and `stats` (which includes a "Threshold" entry formatted as "X of Y"). Both values are already available in `App.tsx` and are passed to `DashboardPage`. The `Owner` type in `src/types/accord.ts` has two fields: `address` (a shortened string like "GDQP2...K7X3") and `label` (e.g. "You" or "Signer 2").

## What Needs to Be Done

1. Create a new file `frontend/src/pages/OwnersPage.tsx` that accepts `owners` (Owner array) and `threshold` (number) as props and renders a titled page. The page should show the threshold prominently (e.g. "Requires 2 of 3 signers") and then list each owner with their `label` and `address` on separate rows.
2. In `App.tsx`, add `"owners"` to the `Page` type union so navigation state can represent the new page.
3. In the `<nav>` in `App.tsx`, include "owners" alongside "dashboard" and "history" so a tab button for it appears automatically (the existing map already handles capitalisation and active state).
4. In the render block where `page` is checked, add an `else if` branch for `"owners"` that renders `<OwnersPage owners={owners} threshold={threshold} />`. The threshold number can be derived from the "Threshold" entry in `stats` — parse it from the `value` string (e.g. `"2 of 3"` → `2`) or pass it from a separate state variable.
5. The page should handle the empty case: if `owners` is an empty array, show a short message such as "No owners found."

## Acceptance Criteria
- [ ] An "Owners" tab appears in the header navigation between "History" and the wallet button (or at the end of the nav group).
- [ ] Clicking the tab renders a page showing the M-of-N threshold statement and a list of all owner rows.
- [ ] Each owner row displays the label ("You", "Signer 2", etc.) and the shortened address.
- [ ] If no owners are returned, a fallback message is shown instead of an empty list.
- [ ] The project builds with no TypeScript errors.
- [ ] The Dashboard and History pages are unaffected by the change.

## Files to Look At
- `frontend/src/App.tsx` — the Page type, nav map, and render branch all need extending; owners and stats are already in scope
- `frontend/src/hooks/useContract.ts` — shows how owners and stats are fetched and shaped before being returned
- `frontend/src/types/accord.ts` — the Owner type definition used in the new page's props
- `frontend/src/pages/DashboardPage.tsx` — use as a structural reference for how a page component is written in this project

**Difficulty**: Medium
