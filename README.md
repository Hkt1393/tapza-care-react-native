# Tapza Care

Tapza Care is an Expo and React Native patient-care assignment app for iOS and Android. It demonstrates a configuration-driven care home, doctor and service booking, prescriptions, and dose tracking using deterministic mock data.

## Implemented features

- Home sections and theme are loaded from validated normal-day or Diwali configuration fixtures. The Home screen can switch between them at runtime.
- Home supports hero, category, quick-action, service, doctor, and offer sections, including color, gradient, and image backgrounds. Unknown section types are skipped safely.
- Booking can start from a doctor or supported service. Users choose an available date and slot in a slide-up sheet. The mock service is the source of truth and returns a typed conflict for an already-booked slot; the screen prevents duplicate submissions and reconciles availability after a response.
- Prescription list and detail screens show medicine dose, duration, and schedule. Dose status is updated through the mock service and can be undone during the app session.
- Screens provide loading, empty, error, retry, and success or updated states where applicable.

## Prerequisites

- Node.js and npm (the repository does not pin a Node.js version).
- iOS Simulator on macOS for the iOS simulator command, or Android Studio with an emulator/device for Android.
- A physical device can run the project through the Expo development server and a compatible Expo client.

The project currently declares Expo SDK `~57.0.26`, React Native `0.86.3`, React `19.2.3`, and TypeScript `~6.0.3`. The lockfile is `package-lock.json`.

## Setup and run

```sh
npm ci
npm start
```

Then use the Expo CLI output to open the app in a connected development environment. Platform scripts are also available:

```sh
npm run ios       # iOS Simulator; macOS required
npm run android   # Android emulator/device
npm run web       # Expo web target
```

## Checks

```sh
npm run typecheck
npm test
```

`npm test` compiles the test TypeScript configuration and runs the Node test files in `tests/`. There is no `lint` script currently defined in `package.json`.

## Project structure

```text
src/
  components/       Shared UI, feedback, and navigation components
  constants/        Centralized user-facing strings
  features/
    booking/        Booking-specific types and feature logic
    config/         Layout validation, fixtures, and validated config cache
    home/           Config section parsing and section renderers
    prescriptions/  Prescription presentation models
  navigation/       Typed root tabs and nested stacks
  screens/           MVVM containers, views, and styles for app screens
  services/mock/     Mock endpoint behavior, fixtures, network controls, and state
  services/storage/  AsyncStorage adapter
  theme/             Runtime and semantic theme tokens, dimensions, and styles
  types/             Shared domain and mock-service contracts
  utils/             Small cross-feature utilities
tests/               Config, Home renderer, booking, and dose-tracking tests
```

Each screen separates container/view logic and presentation using the project’s MVVM convention. Containers coordinate state and services; views render typed props and callbacks. Mock fixtures and mutable mock state are kept behind `mockDataAccess`.

## Architecture notes

- **Config-driven Home:** `GET /config` is represented by the mock data-access service. `validateLayoutConfig` validates incoming data before rendering or caching it. Home section order and content come from the active config.
- **Runtime themes:** The Home switch selects the normal or Diwali fixture through `mockDataAccess.selectConfig`. The resolved theme is shared through `RuntimeThemeContext`; Home and the other screens use runtime theme tokens.
- **Navigation:** One React Navigation container owns four real bottom tabs: Home, Book, Prescriptions, and Doses. Prescriptions has a nested stack for prescription detail. Family/Profile screens are not implemented.
- **Booking:** A single mock state owns slot availability. Booking is optimistic in the UI, then reconciled against the service response; a second reservation of the same slot produces a typed 409-style conflict.
- **Dose tracking:** Dose updates go through the mock data-access boundary. Prescription and Doses screens read the same session state, including undo behavior.
- **Persistence:** The last validated layout config is stored using the existing AsyncStorage adapter. If a later config request fails, a cached config is validated before fallback use.

## Switching configurations

Use the Home screen’s normal-day/Diwali switch. The Home container selects the fixture, fetches and validates it, then updates the active theme and sections. The fixtures are in `src/features/config/fixtures.ts`.

## Mock network demonstrations

Network controls are exposed by `mockDataAccess` in `src/services/mock/mockDataAccess.ts`; there is **no in-app developer control panel**. The API can be called from a development harness or test:

```ts
import { mockDataAccess } from './src/services/mock/mockDataAccess';

mockDataAccess.configureNetwork({
  latencyMs: 1200,
  failures: { config: false, doctors: false, slots: false, bookings: false, prescriptions: false },
  emptyLists: { doctors: false, slots: false, prescriptions: false },
});
```

Set an operation’s failure flag to `true` to simulate a failed request. Set a list’s empty flag to `true` to simulate an empty response. `latencyMs` applies to requests. Call `mockDataAccess.reset()` to restore defaults and reset mock session state. A failed config request uses the last valid cached config when one is available; without a valid cache, the existing screen error/retry path handles the failure.

To exercise a booking conflict, attempt to reserve the same currently available `{ doctorId, slotId }` twice through `mockDataAccess.createBooking`. The first request succeeds and the second receives the conflict error. The UI disables duplicate submissions while its request is in flight; conflict scenarios can be set up through the service/test boundary.

## Limitations and scope cuts

- The bottom-tab destinations are registered in code. Configured tab labels may be used, but config does not control tab order or visibility. Doses is an app-supported extension; Family and Profile do not have screens.
- Family and category-chip actions currently show an informational “coming soon” message. Unsupported Home actions do not navigate to placeholder screens.
- Mock network controls are programmatic and are not exposed in an in-app demo panel. Data is mock data; there is no production backend.
- Local notifications, authentication, payments, and unsupported design-reference claims/data are not implemented.
- Device/simulator verification status for the submission build: **TODO — developer to record device, OS, and flows verified.**

## Submission artifacts

- Screenshots: **TODO — add captured screenshots under `docs/` and list their filenames here.** No screenshot artifacts are currently present in the repository.
- Demo video: **TODO — add the 2–3 minute demo video under `docs/` and record its filename here.** No demo video is currently present.
- Android APK/build: **TODO — provide a real Expo build or release link, then add download and installation instructions here.** No APK or build link is currently present; do not use this README as an install link until populated.
- Development time: **TODO — developer to enter verified hours spent.** No reliable time-spent record is available in the repository.
