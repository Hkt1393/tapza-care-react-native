import type React from 'react';
import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import type { IoniconsIconName } from '@react-native-vector-icons/ionicons';

import styles from './mainTabIconStyles';
import { getReducedMotionPreference } from '../../utils/motionPreference';

type MainTabRoute = 'Home' | 'Book' | 'Prescriptions' | 'Doses';

interface MainTabIconProps {
  routeName: MainTabRoute;
  color: string;
  focused: boolean;
  size: number;
  activeIndicatorColor: string;
}

const iconNames: Record<MainTabRoute, { active: IoniconsIconName; inactive: IoniconsIconName }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Book: { active: 'calendar', inactive: 'calendar-outline' },
  Prescriptions: { active: 'document-text', inactive: 'document-text-outline' },
  Doses: { active: 'bandage', inactive: 'bandage-outline' },
};

const MainTabIcon = ({ routeName, color, focused, size, activeIndicatorColor }: MainTabIconProps): React.ReactElement => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let cancelled = false;
    let animation: Animated.CompositeAnimation | undefined;
    if (!focused) {
      scale.setValue(1);
      return undefined;
    }
    void getReducedMotionPreference().then((reduceMotion) => {
      if (cancelled) return;
      if (reduceMotion) return;
      animation = Animated.sequence([
        Animated.spring(scale, { toValue: 1.08, useNativeDriver: true, speed: 30, bounciness: 0 }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 0 }),
      ]);
      animation.start();
    });
    return () => {
      cancelled = true;
      animation?.stop();
    };
  }, [focused, scale]);

  return (
    <View style={styles.iconContainer}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons
          name={focused ? iconNames[routeName].active : iconNames[routeName].inactive}
          color={color}
          size={size}
          accessible={false}
        />
      </Animated.View>
    </View>
  );
};

export default MainTabIcon;
