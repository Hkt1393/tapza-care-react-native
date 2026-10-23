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
