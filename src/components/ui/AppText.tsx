import type React from 'react';
import { Text as NativeText } from 'react-native';
import type { TextProps } from 'react-native';

/** Shared typed Text boundary; visual styles and runtime colors stay with callers. */
const AppText = (props: TextProps): React.ReactElement => <NativeText {...props} />;

export default AppText;
