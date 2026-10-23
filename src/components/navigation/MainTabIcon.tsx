import type React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import type { IoniconsIconName } from '@react-native-vector-icons/ionicons';

import styles from './mainTabIconStyles';

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

const MainTabIcon = ({ routeName, color, focused, size, activeIndicatorColor }: MainTabIconProps): React.ReactElement => (
  <View style={styles.iconContainer}>
    <Ionicons
      name={focused ? iconNames[routeName].active : iconNames[routeName].inactive}
      color={color}
      size={size}
      accessible={false}
    />
    {/* <View style={[styles.activeIndicator, { backgroundColor: focused ? activeIndicatorColor : 'transparent' }]} /> */}
  </View>
);

export default MainTabIcon;
