# React Native Base Project

A clean, reusable Expo + React Native starter designed for future application projects. The structure follows a minimal MVVM pattern and keeps screens, services, and shared UI separated for clarity and scalability.

## Purpose

This project acts as a production-ready template for building future React Native apps quickly while preserving a predictable architecture, responsive layout patterns, and central theme utilities.

## Tech Stack

- Expo SDK 57
- React Native 0.86
- React 19.2.3
- TypeScript
- Functional components and React Hooks
- Safe area handling via react-native-safe-area-context

## Folder Structure

src/
├── components/
│   ├── Button/
│   ├── TextInput/
│   ├── Loader/
│   ├── EmptyState/
│   ├── ErrorView/
│   └── ScreenContainer/
├── screens/
│   └── ExampleScreen/
├── navigation/
├── services/
│   ├── api/
│   └── storage/
├── hooks/
├── utils/
├── constants/
├── theme/
├── types/
├── config/
└── ...

## MVVM Architecture

The screen flow follows a view-to-container-to-service pattern:

View
↓
Container / ViewModel
↓
Service / API
↓
Data

### Container responsibilities

- State management
- API calls
- Loading, empty, error, and success state handling
- User interaction handling
- Derived values and data transformation
- Passing props to the View

### View responsibilities

- Rendering UI
- Receiving data and callbacks through props
- Presenting loading, empty, and error states
- Keeping business logic out of JSX

## Screen Architecture

Every screen follows the same structure:

screens/
└── ProfileScreen/
    ├── index.ts
    ├── container.tsx
    ├── view.tsx
    └── styles.ts

The screen entry point is always exported through the screen directory, not through individual internal files.

## API Flow

The ExampleScreen demonstrates the expected flow:

1. User action triggers a callback from the View.
2. The Container handles the action.
3. The Container calls the service layer.
4. The service layer handles the request and common error handling.
5. The loaded data returns to the Container.
6. The Container updates state.
7. The View re-renders the UI with the new data.

## Safe Area Strategy

The app uses SafeAreaProvider at the application root and a shared ScreenContainer component to centrally handle safe-area padding. This avoids repeating inset logic across screens and keeps the app consistent.

## Responsive Design

Responsive utilities are centralized in src/utils/responsive.ts and include:

- scale
- verticalScale
- moderateScale
- responsiveWidth
- responsiveHeight

These utilities avoid hardcoded device dimensions and help maintain consistency across phones, tablets, and different screen aspect ratios.

## Theme Approach

Theme values live in src/theme and are centralized in a single place:

- colors
- spacing
- typography
- dimensions
- shadows

This keeps styling reusable and easy to extend later for dark mode or design tokens.

## Environment Configuration

Environment values are centralized in src/config/env.ts and exposed through the config layer.

1. Copy .env.example to .env
2. Update the values for your local setup
3. Never commit secrets or production credentials

## How to create a new screen

1. Create a folder under src/screens with the screen name.
2. Add the exact structure:
   - index.ts
   - container.tsx
   - view.tsx
   - styles.ts
3. Export the screen from the folder entry file.
4. Keep all API logic inside the container.
5. Keep render logic in the view.

## How to create a reusable component

1. Create a folder under src/components with the component name.
2. Include a .tsx file, optional style file, and index.ts.
3. Keep the component presentational, typed, and reusable.
4. Do not add business logic or API calls to reusable UI components.

## Running the app

### Android

npm install
npm run android

### iOS

npm install
npm run ios

## Type checking

npm run typecheck

## Important Notes

- Keep screen architecture consistent across the project.
- Favor reusable UI and centralized theme values.
- Avoid unnecessary dependencies.
- Keep business logic in the screen container and service layer, not in the view.
