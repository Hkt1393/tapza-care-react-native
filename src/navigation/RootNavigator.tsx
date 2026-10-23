import type React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainTabIcon from '../components/navigation/MainTabIcon';
import HomeScreen from '../screens/HomeScreen';
import PrescriptionsScreen from '../screens/PrescriptionsScreen';
import PrescriptionDetailScreen from '../screens/PrescriptionDetailScreen';
import BookScreen from '../screens/BookScreen';
import DosesScreen from '../screens/DosesScreen';
import { strings } from '../constants/strings';
import { colors } from '../theme/colors';
import { RuntimeThemeProvider, useRuntimeThemeContext } from '../theme/RuntimeThemeContext';
import type {
  HomeStackParamList,
  BookStackParamList,
  DosesStackParamList,
  MainTabParamList,
  PrescriptionsStackParamList,
} from './types';
import styles from './styles';

const Tabs = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const PrescriptionsStack = createNativeStackNavigator<PrescriptionsStackParamList>();
const BookStack = createNativeStackNavigator<BookStackParamList>();
const DosesStack = createNativeStackNavigator<DosesStackParamList>();

const HomeStackNavigator = (): React.ReactElement => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="Home" component={HomeScreen} />
  </HomeStack.Navigator>
);

const PrescriptionsStackNavigator = (): React.ReactElement => {
  const { activeTheme } = useRuntimeThemeContext();
  return (
    <PrescriptionsStack.Navigator screenOptions={{ headerShown: false }}>
      <PrescriptionsStack.Screen name="Prescriptions" component={PrescriptionsScreen} />
      <PrescriptionsStack.Screen
        name="PrescriptionDetail"
        component={PrescriptionDetailScreen}
        options={{
          headerShown: true,
          headerTitle: strings.prescriptions.detailTitle,
          headerStyle: { backgroundColor: activeTheme?.background ?? colors.background },
          headerTintColor: activeTheme?.primary ?? colors.primary,
        }}
      />
    </PrescriptionsStack.Navigator>
  );
};

const BookStackNavigator = (): React.ReactElement => (
  <BookStack.Navigator screenOptions={{ headerShown: false }}>
    <BookStack.Screen name="Book" component={BookScreen} />
  </BookStack.Navigator>
);

const DosesStackNavigator = (): React.ReactElement => (
  <DosesStack.Navigator screenOptions={{ headerShown: false }}>
    <DosesStack.Screen name="Doses" component={DosesScreen} />
  </DosesStack.Navigator>
);

const configScreenByRoute = {
  Home: 'home',
  Book: 'bookings',
  Prescriptions: 'prescriptions',
  Doses: 'doses',
} as const;

const MainTabs = (): React.ReactElement => {
  const { activeTheme, activeTabs } = useRuntimeThemeContext();
  const primary = activeTheme?.primary ?? colors.primary;
  const secondary = activeTheme?.secondary ?? colors.secondary;
  const inactive = activeTheme?.textSecondary ?? colors.textMuted;
  const surface = activeTheme?.surface ?? colors.surface;
  const border = activeTheme?.surfaceTint ?? colors.surfaceMuted;

  return (
    <View style={[styles.appRoot, { backgroundColor: activeTheme?.background ?? colors.background }]}>
      <StatusBar style="dark" />
      <Tabs.Navigator
        initialRouteName="Home"
        backBehavior="firstRoute"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarLabel: activeTabs.find((tab) => tab.screen === configScreenByRoute[route.name])?.label
            ?? strings.navigation[route.name],
          tabBarActiveTintColor: primary,
          tabBarInactiveTintColor: inactive,
          tabBarStyle: [styles.tabBar, {
            backgroundColor: surface,
            borderTopColor: border,
          }],
          tabBarItemStyle: styles.tabItem,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ color, focused, size }) => (
            <MainTabIcon
              routeName={route.name}
              color={color}
              focused={focused}
              size={size}
              activeIndicatorColor={secondary}
            />
          ),
        })}
      >
        <Tabs.Screen name="Home" component={HomeStackNavigator} />
        <Tabs.Screen name="Book" component={BookStackNavigator} />
        <Tabs.Screen name="Prescriptions" component={PrescriptionsStackNavigator} />
        <Tabs.Screen name="Doses" component={DosesStackNavigator} />
      </Tabs.Navigator>
    </View>
  );
};

const RootNavigator = (): React.ReactElement => (
  <NavigationContainer>
    <RuntimeThemeProvider>
      <MainTabs />
    </RuntimeThemeProvider>
  </NavigationContainer>
);

export default RootNavigator;
