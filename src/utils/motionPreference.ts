import { AccessibilityInfo } from 'react-native';

let reducedMotion = false;
let initialized = false;
let preferencePromise: Promise<boolean> | undefined;

const initialize = (): void => {
  if (initialized) return;
  initialized = true;

  preferencePromise = AccessibilityInfo.isReduceMotionEnabled()
    .then((enabled) => { reducedMotion = enabled; })
    .catch(() => { reducedMotion = false; })
    .then(() => reducedMotion);

  AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) => {
    reducedMotion = enabled;
  });
};

export const prefersReducedMotion = (): boolean => {
  initialize();
  return reducedMotion;
};

export const getReducedMotionPreference = (): Promise<boolean> => {
  initialize();
  return (preferencePromise ?? Promise.resolve()).then(() => reducedMotion);
};
