# PhyloGuessr Android — Feature Parity PRD

Goal: bring the Android app to full feature parity with the web app.

---

## Priority 1 — Core UX gaps (do first)

### 1.1 Persist difficulty setting
**Status:** Not implemented — difficulty resets on every app launch.
**Web behavior:** Stored in `localStorage`, survives page reloads.
**Android work:** Save `Difficulty` enum to `SharedPreferences` in `HomeScreen` and restore on launch.
**Effort:** Small (< 1 hour).

### 1.2 Share result
**Status:** Not implemented.
**Web behavior:** Result screen has a share button that encodes the round into a URL so others can replay/view it.
**Android work:** Add a share button to `ResultScreen` and `MultiResultScreen` using Android's `Intent.ACTION_SEND`. Encode the organism taxon IDs and result into a deep link URL. Optionally handle incoming deep links in `MainActivity`.
**Effort:** Medium (2–4 hours).

### 1.3 History screen
**Status:** Not implemented.
**Web behavior:** `/history` page shows past game rounds (mode, organisms, result, date) stored locally and/or in Firestore.
**Android work:**
- Store completed round results to `Room` DB or `SharedPreferences` after each game.
- Add `HistoryScreen` composable showing a scrollable list of past rounds.
- Add "History" button to `HomeScreen` row alongside Leaderboard.
- Wire into `NavGraph`.
**Effort:** Medium-large (4–8 hours).

---

## Priority 2 — Informational pages

### 2.1 About screen
**Status:** Not implemented.
**Web behavior:** `/about` explains how the game works, data sources (NCBI Taxonomy, Wikipedia), links to GitHub, FAQ.
**Android work:** Static `AboutScreen` composable with scrollable text/cards. Add nav entry from `HomeScreen` (hamburger menu or info icon).
**Effort:** Small (1–2 hours).

### 2.2 Why It Matters screen
**Status:** Not implemented.
**Web behavior:** `/why` has rich educational content on phylogenetics in medicine, gene therapy, agriculture, biotech.
**Android work:** Static `WhyScreen` composable. Can share nav entry with About (tabbed or separate button).
**Effort:** Small (1–2 hours).

### 2.3 Privacy Policy & Donate screens
**Status:** Not implemented.
**Web behavior:** `/privacy` and `/donate` (Buy Me a Coffee link).
**Android work:** Could be a single "More" screen with links. Privacy policy link can open the web URL via `Intent`. Low priority.
**Effort:** Tiny (< 1 hour each).

---

## Priority 3 — Gameplay completeness

### 3.1 Verify Multi mode end-to-end
**Status:** Multi mode button exists on HomeScreen and `GameScreen` handles the `multi` mode string, but full flow needs QA.
**Web behavior:** Loads 6 organisms, user picks 2 they think are closest, scored by pair ranking.
**Android work:** Play through several rounds and confirm: organism loading, selection of 2 from 6, `MultiResultScreen` display of pair rankings and score, score submission to Firebase leaderboard.
**Effort:** QA + bug fixes (unknown).

### 3.2 Easy mode completion state
**Status:** `EASY_COMPLETED` state exists in `GameScreen` but the actual completion UI is unknown.
**Web behavior:** After finishing all curated easy scenarios, shows a congratulations screen with option to continue with random.
**Android work:** Verify `EASY_COMPLETED` renders a proper completion screen matching the web experience.
**Effort:** Small (investigate + polish).

---

## Priority 4 — Polish and platform-native features

### 4.1 Back gesture / predictive back
Ensure Android 14+ predictive back gesture works correctly on all screens (no janky back stack behavior).

### 4.2 Offline support
The Android app loads taxonomy data from bundled assets — it can work offline unlike the web app. Verify this works and add a "No connection" graceful state for Firebase-dependent features (leaderboard, score submission).

### 4.3 App icon and splash screen
Verify the app has a proper launcher icon and optional splash screen using `androidx.core.splashscreen`.

### 4.4 Accessibility
Add `contentDescription` to all images and icon-only buttons. Ensure tap targets are ≥ 48dp.

---

## Out of scope (web-only)

- **QC page** — internal curation tool, not needed on mobile.
- **GBIF interactive map** — species distribution maps. Nice-to-have but complex; skip for now.
- **Donate page** — a link to the web donate page is sufficient.

---

## Suggested order of execution

1. Persist difficulty (1.1) — trivial, do it first
2. About + Why screens (2.1, 2.2) — static content, quick wins
3. Verify Multi mode (3.1) — catch bugs early
4. Share result (1.2) — high user value
5. History screen (1.3) — requires data model design
6. Easy mode completion (3.2) — polish
7. Polish pass (4.1–4.4)
