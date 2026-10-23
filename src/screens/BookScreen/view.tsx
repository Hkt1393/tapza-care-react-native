import type React from 'react';
import { FlatList, Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppPressable, AppText, SkeletonBlock } from '../../components';
import { strings } from '../../constants/strings';
import type { Doctor } from '../../types/domain';
import { colors } from '../../theme/colors';
import type { RuntimeThemeTokens } from '../../theme/runtimeTheme';
import styles from './styles';

type LoadState = 'loading' | 'ready' | 'empty' | 'error';
interface Props {
  doctors: Doctor[];
  theme: RuntimeThemeTokens | null;
  loadState: LoadState;
  onRetry: () => void;
  onChooseDoctor: (doctor: Doctor) => void;
}

const BookScreenView = ({ doctors, theme, loadState, onRetry, onChooseDoctor }: Props): React.ReactElement => (
  <SafeAreaView style={[styles.safeArea, { backgroundColor: theme?.background ?? colors.background }]} edges={['top']}>
    <View style={styles.header}>
      <AppText style={[styles.title, theme !== null && { color: theme.textPrimary }]}>{strings.booking.pickDoctorTitle}</AppText>
      <AppText style={[styles.subtitle, theme !== null && { color: theme.textSecondary }]}>{strings.booking.pickDoctorSubtitle}</AppText>
    </View>
    {loadState === 'loading' ? (
      <View style={styles.list} accessibilityRole="progressbar" accessibilityLabel={strings.common.loading}>
        {[0, 1, 2].map((item) => <View key={item} style={[styles.card, { backgroundColor: theme?.surface ?? colors.surface }]}>
          <SkeletonBlock style={styles.avatarSkeleton} />
          <View style={styles.skeletonCopy}><SkeletonBlock style={styles.nameSkeleton} /><SkeletonBlock style={styles.detailSkeleton} /></View>
        </View>)}
      </View>
    ) : loadState === 'error' || loadState === 'empty' ? (
      <View style={styles.state} accessibilityRole="alert">
        <AppText style={[styles.stateTitle, theme !== null && { color: theme.textPrimary }]}>
          {loadState === 'empty' ? strings.booking.noDoctorsTitle : strings.booking.doctorsLoadError}
        </AppText>
        {loadState === 'empty' ? <AppText style={[styles.subtitle, theme !== null && { color: theme.textSecondary }]}>{strings.booking.noDoctorsMessage}</AppText> : (
          <AppPressable accessibilityRole="button" accessibilityLabel={strings.booking.actions.retry} onPress={onRetry} style={[styles.button, { backgroundColor: theme?.primary ?? colors.primary }]}>
            <AppText style={[styles.buttonText, { color: theme?.onPrimary ?? colors.white }]}>{strings.booking.actions.retry}</AppText>
          </AppPressable>
        )}
      </View>
    ) : (
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme?.surface ?? colors.surface, borderColor: theme?.border ?? colors.border }]}>
            <Image source={{ uri: item.photoUrl }} style={styles.avatar} accessibilityRole="image" accessibilityLabel={item.name} />
            <View style={styles.copy}>
              <AppText style={[styles.name, theme !== null && { color: theme.textPrimary }]}>{item.name}</AppText>
              <AppText style={[styles.detail, theme !== null && { color: theme.textSecondary }]}>{item.specialty}</AppText>
              <AppText style={[styles.detail, theme !== null && { color: theme.textSecondary }]}>{item.languages.join(', ')}</AppText>
              <AppText style={[styles.fee, theme !== null && { color: theme.primary }]}>{`₹${item.feeInr.toLocaleString('en-IN')}`}</AppText>
            </View>
            <AppPressable accessibilityRole="button" accessibilityLabel={strings.booking.doctorAccessibility(item.name)} accessibilityHint={strings.booking.openBookingHint} onPress={() => onChooseDoctor(item)} style={[styles.button, { backgroundColor: theme?.primary ?? colors.primary }]}>
              <AppText style={[styles.buttonText, { color: theme?.onPrimary ?? colors.white }]}>{strings.booking.actions.bookDoctor}</AppText>
            </AppPressable>
          </View>
        )}
      />
    )}
  </SafeAreaView>
);

export default BookScreenView;
