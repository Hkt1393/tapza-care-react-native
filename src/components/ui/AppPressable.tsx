import type React from 'react';
import { useRef } from 'react';
import { Animated, Pressable as NativePressable } from 'react-native';
import type { PressableProps } from 'react-native';

import { prefersReducedMotion } from '../../utils/motionPreference';

interface AppPressableProps extends PressableProps {
  /** Applies a short native-driven scale response to interactive controls. */
  pressScale?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(NativePressable);

/** Shared typed Pressable boundary with native accessibility and touch feedback. */
const AppPressable = ({ pressScale = true, ...props }: AppPressableProps): React.ReactElement => {
  const scale = useRef(new Animated.Value(1)).current;
  const { disabled, onPressIn, onPressOut, style } = props;
  const animateScale = (toValue: number): void => {
    if (!pressScale || disabled || prefersReducedMotion()) {
      scale.setValue(1);
      return;
    }
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: 34,
      bounciness: 0,
    }).start();
  };

  const animatedStyle = { transform: [{ scale }] };
  const combinedStyle: PressableProps['style'] = typeof style === 'function'
    ? (state) => [style(state), animatedStyle]
    : [style, animatedStyle];

  return (
    <AnimatedPressable
      {...props}
      style={combinedStyle}
      onPressIn={(event) => {
        animateScale(0.98);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        animateScale(1);
        onPressOut?.(event);
      }}
    />
  );
};

export default AppPressable;
