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
