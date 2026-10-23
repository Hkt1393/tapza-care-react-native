# AI Log

## Slice 1: typed configuration and mock data

- Prompt: implement the assignment's typed configuration and mock-data foundation; keep UI and navigation out of scope; preserve existing work; validate config at runtime; cache only valid config; support latency, failures, empty responses, and booking conflicts; add focused tests.
- Decision: use TypeScript domain types plus explicit runtime guards at the config boundary. Keep fixture data immutable by convention, mutable slot/booking state in a factory, and operations behind a small mock data-access interface.
- Decision: use Node's built-in test runner with a TypeScript emit config instead of adding a test framework dependency. Tests inject in-memory storage, while the production default lazily uses the existing AsyncStorage wrapper.
- Rejected: installing navigation, animation, bottom-sheet, backend, and test framework packages in this slice. They do not help implement the data foundation and would widen scope.
- Trade-off: mock network controls are currently configured through the service API; a developer-facing UI control will be added with a later resilience/UI slice.

## Slice 2: config-driven home

- Prompt: build the home screen with all six configured section types, runtime normal/Diwali switching, safe item guards, section backgrounds, validated theme tokens, and resilient loading/retry; keep booking and prescriptions out of scope.
- Decision: use `expo-linear-gradient` at the Expo SDK 57 compatible version. React Native 0.86 also exposes gradients through `experimental_backgroundImage`, but its versioned docs label the API experimental and advise against production use.
- Decision: narrow each section's `unknown[]` items into a typed section view model before rendering. Unsupported section types and sections without valid item data return no view.
- Trade-off: the configured tabs are shown, but only Home is enabled in this slice; other feature screens are out of scope.

## Slice 3: booking flow

- Prompt: implement a typed doctor/service booking journey on `feature/booking-flow`; preserve user changes and the existing mock service, prevent duplicate booking, handle 409 conflicts and failed requests, and avoid unrelated dependencies or prescription work.
- Decision: present booking as its own MVVM screen inside React Native's native `Modal`, with a `PanResponder` drag handle. Existing React Native capabilities meet the gesture-sheet requirement without another native package.
- Decision: launch booking from validated home doctor items and configured services linked to a doctor. The existing mock endpoint books a doctor slot (`doctorId` and `slotId`), so service cards resolve their configured doctor before opening the same slot flow.
- Decision: reserve optimistically in the view model, guard submissions with a synchronous ref, then reconcile availability from the mock data-access boundary. A typed 409 marks the slot unavailable; other failures restore the authoritative availability and allow retry.
- Trade-off: dates are offered for the next seven local calendar days, while deterministic mock slots currently exist only on their fixture date. Other dates intentionally exercise the empty-slots state.
- Verification limitation: TypeScript and automated tests cover the flow's data contract and conflict/failure behavior; no iOS simulator or Android device visual check was available during this slice.

## Slice 4: prescriptions and dose tracking

- Prompt: build prescription list/detail and session dose tracking using the existing mock service, with typed navigation, loading/error/empty/retry behavior, accessibility, focused tests, and no notification work; also make booking availability deliberate across dates.
- Decision: add React Navigation 7 native stack because this branch had no navigation dependency or typed route layer. `react-native-screens` was installed at the Expo SDK 57 compatible version; the existing safe-area package was reused.
- Decision: keep taken-dose state inside the mock state factory and expose typed read/update methods through `mockDataAccess`. Screen containers update from the returned service state; returning to the list reloads progress on focus.
- Decision: store a taken dose by prescription, medicine, and scheduled timing; reject updates for dose timings absent from the prescription, and remove the key to undo a dose.
- Decision: extend deterministic booking availability through October 26, 2026. Later offered dates remain explicit empty states, and confirmation is possible only for an available returned slot.
- Trade-off: dose state is session-only, as required; it resets when the mock data-access instance resets or the app process restarts.
- Verification limitation: TypeScript and automated state/navigation type checks passed; no iOS simulator or Android device visual check was available. Notifications remain intentionally out of scope.

## Persistent bottom navigation

- Prompt: replace the screen-owned tab bar with a typed React Navigation bottom-tab architecture, keep only implemented destinations, nest prescription detail under Prescriptions, and preserve staged and unstaged work.
- Decision: use React Navigation 7 bottom tabs with a stack per supported tab. Home and Prescriptions are registered; PrescriptionDetail stays in the Prescriptions stack. The booking sheet remains a Home-launched flow, while Bookings, Doses, and Family are not registered as tabs because they do not have tab-level screens.
- Decision: share the active validated runtime theme and configured tab labels with the navigator so tab colors and labels follow normal/Diwali config changes. The native tab bar handles selected state, safe-area insets, tab presses, and Android back behavior.
- Dependency: add `@react-navigation/bottom-tabs` 7.x to match the installed React Navigation 7 packages. The package peer requirements are satisfied by the installed React Native and safe-area packages.
- Verification limitation: automated checks cover TypeScript and the existing focused suite; simulator/device interaction could not be verified in this environment.

## Supported Book and Doses tabs

- Prompt: bring the persistent bottom navigation closer to the approved five-tab design, adding Book and Doses only where existing assignment behavior supports them; preserve booking and dose state and do not invent Family functionality.
- Decision: Book is a typed tab with a doctor-selection screen that fetches the existing doctor fixtures and opens the existing BookingScreen. It reuses the current date, slot, conflict, and confirmation flow rather than duplicating booking logic.
- Decision: Doses is a typed tab that aggregates scheduled medicine doses from prescriptions and reads/writes their taken state exclusively through the existing mock data-access service. Returning to the tab reloads service state, keeping it consistent with Prescription Detail.
- Decision: Home's existing Reminders quick action routes to Doses. Family stays unavailable because the repository has no family screen, member model, or service contract; Profile was removed from fixture tabs because no supported screen exists.
- Dependency: use the already added React Navigation 7 bottom-tabs package; no further packages were needed.
- Verification limitation: automated checks validate types and service behavior; no running simulator/device was available for interaction or visual verification.

## Bottom-tab icon family

- Prompt: replace text glyphs in the supported bottom tabs with consistent filled/outline vector icons, using the navigator's selected state and runtime colors; do not add unsupported destinations.
- Decision: use the scoped `@react-native-vector-icons/ionicons` family, whose typed glyph map verifies each selected filled/outline pair: `home`/`home-outline`, `calendar`/`calendar-outline`, `document-text`/`document-text-outline`, and `bandage`/`bandage-outline`.
- Decision: use the package's dynamic Expo import. Its Expo setup guide supports dynamic loading from SDK 52 onward, so Expo SDK 57 requires no new app config plugin or generated native-project changes. Keep Family out of the icon map because no Family route is registered.
- Rejected: Unicode glyphs and emoji because platform font rendering varies; `@expo/vector-icons` because it was not an existing direct dependency.

## Premium shadows and micro-animations

- Prompt: add restrained design-system shadows and short touch, Home entrance, tab-selection, and booking-success feedback; respect reduced motion and avoid adding another animation dependency.
- Decision: reuse React Native `Animated` with the native driver for transforms and opacity. Reanimated was not installed, so no animation dependency was added.
- Decision: centralize iOS shadow recipes and Android elevation in `src/theme/shadows.ts`; apply them to existing cards, the Home hero, and the booking sheet without changing screen behavior.
- Decision: add a small shared reduced-motion preference reader and keep press scale opt-out available for the booking backdrop. Home entrances run once on initial mount with a capped stagger; tab feedback is brief and does not delay navigation.
- Rejected: category-chip state transitions because the current chips do not implement selected-category behavior; adding one would change functionality beyond visual polish.
- Verification limitation: device rendering and animation performance could not be checked on iOS or Android in this environment.
