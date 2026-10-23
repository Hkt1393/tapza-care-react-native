import type React from 'react';
import { Pressable as NativePressable } from 'react-native';
import type { PressableProps } from 'react-native';

/** Shared typed Pressable boundary that preserves native state/style behavior. */
const AppPressable = (props: PressableProps): React.ReactElement => <NativePressable {...props} />;

export default AppPressable;
