import type React from 'react';
import { View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import styles from './skeletonBlockStyles';

export interface SkeletonBlockProps {
  style: StyleProp<ViewStyle>;
}

const SkeletonBlock = ({ style }: SkeletonBlockProps): React.ReactElement => (
  <View
    accessible={false}
    accessibilityElementsHidden
    importantForAccessibility="no-hide-descendants"
    style={[styles.block, style]}
  />
);

export default SkeletonBlock;
