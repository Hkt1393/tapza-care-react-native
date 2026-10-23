import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type HomeStackParamList = {
  HomeLanding: undefined;
};

export type PrescriptionsStackParamList = {
  PrescriptionList: undefined;
  PrescriptionDetail: { prescriptionId: string };
};

export type BookStackParamList = { BookDirectory: undefined };
export type DosesStackParamList = { DoseTracker: undefined };

export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  Book: NavigatorScreenParams<BookStackParamList> | undefined;
  Prescriptions: NavigatorScreenParams<PrescriptionsStackParamList> | undefined;
  Doses: NavigatorScreenParams<DosesStackParamList> | undefined;
};

export type HomeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'HomeLanding'>,
  BottomTabScreenProps<MainTabParamList, 'Home'>
>;

export type PrescriptionsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<PrescriptionsStackParamList, 'PrescriptionList'>,
  BottomTabScreenProps<MainTabParamList, 'Prescriptions'>
>;

export type BookScreenProps = CompositeScreenProps<
  NativeStackScreenProps<BookStackParamList, 'BookDirectory'>,
  BottomTabScreenProps<MainTabParamList, 'Book'>
>;

export type DosesScreenProps = CompositeScreenProps<
  NativeStackScreenProps<DosesStackParamList, 'DoseTracker'>,
  BottomTabScreenProps<MainTabParamList, 'Doses'>
>;

export type PrescriptionDetailScreenProps = NativeStackScreenProps<
  PrescriptionsStackParamList,
  'PrescriptionDetail'
>;
