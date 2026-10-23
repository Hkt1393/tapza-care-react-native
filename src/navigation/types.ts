import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type HomeStackParamList = {
  Home: undefined;
};

export type PrescriptionsStackParamList = {
  Prescriptions: undefined;
  PrescriptionDetail: { prescriptionId: string };
};

export type BookStackParamList = { Book: undefined };
export type DosesStackParamList = { Doses: undefined };

export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  Book: NavigatorScreenParams<BookStackParamList> | undefined;
  Prescriptions: NavigatorScreenParams<PrescriptionsStackParamList> | undefined;
  Doses: NavigatorScreenParams<DosesStackParamList> | undefined;
};

export type HomeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'Home'>,
  BottomTabScreenProps<MainTabParamList, 'Home'>
>;

export type PrescriptionsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<PrescriptionsStackParamList, 'Prescriptions'>,
  BottomTabScreenProps<MainTabParamList, 'Prescriptions'>
>;

export type BookScreenProps = CompositeScreenProps<
  NativeStackScreenProps<BookStackParamList, 'Book'>,
  BottomTabScreenProps<MainTabParamList, 'Book'>
>;

export type DosesScreenProps = CompositeScreenProps<
  NativeStackScreenProps<DosesStackParamList, 'Doses'>,
  BottomTabScreenProps<MainTabParamList, 'Doses'>
>;

export type PrescriptionDetailScreenProps = NativeStackScreenProps<
  PrescriptionsStackParamList,
  'PrescriptionDetail'
>;
