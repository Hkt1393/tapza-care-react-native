import type React from 'react';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppPressable, AppText, SkeletonBlock } from '../../components';
import { strings } from '../../constants/strings';
import type { PrescriptionListItem } from '../../features/prescriptions/types';
import { colors } from '../../theme/colors';
import type { RuntimeThemeTokens } from '../../theme/runtimeTheme';
import styles from './styles';

type LoadState = 'loading' | 'ready' | 'empty' | 'error';

interface PrescriptionsScreenViewProps {
  items: PrescriptionListItem[];
  theme: RuntimeThemeTokens | null;
  loadState: LoadState;
  onOpen: (prescriptionId: string) => void;
  onRetry: () => void;
  onBack: () => void;
}

const PrescriptionsScreenView = ({
  items,
  theme,
  loadState,
  onOpen,
  onRetry,
  onBack,
}: PrescriptionsScreenViewProps): React.ReactElement => (
  <SafeAreaView style={[styles.safeArea, { backgroundColor: theme?.background ?? colors.background }]} edges={['top']}>
    <View style={styles.header}>
      <AppText style={[styles.title, theme !== null && { color: theme.textPrimary }]}>{strings.prescriptions.title}</AppText>
      <AppText style={[styles.subtitle, theme !== null && { color: theme.textSecondary }]}>{strings.prescriptions.subtitle}</AppText>
    </View>

    {loadState === 'loading' ? (
      <View style={styles.skeletonList} accessibilityRole="progressbar" accessibilityLabel={strings.common.loading}>
        {[0, 1, 2].map((item) => (
          <View key={item} style={styles.skeletonCard}>
            <SkeletonBlock style={styles.skeletonDoctor} />
            <SkeletonBlock style={styles.skeletonDate} />
            <SkeletonBlock style={styles.skeletonClinic} />
            <View style={styles.skeletonFooter}>
              <SkeletonBlock style={styles.skeletonFooterLine} />
              <SkeletonBlock style={styles.skeletonDate} />
            </View>
          </View>
        ))}
      </View>
    ) : loadState === 'error' ? (
      <View style={styles.stateContainer} accessibilityRole="alert">
        <AppText style={[styles.stateTitle, theme !== null && { color: theme.textPrimary }]}>{strings.prescriptions.loadErrorTitle}</AppText>
        <AppText style={[styles.stateMessage, theme !== null && { color: theme.textSecondary }]}>{strings.prescriptions.loadErrorMessage}</AppText>
        <AppPressable accessibilityRole="button" accessibilityLabel={strings.prescriptions.retry} onPress={onRetry} style={[styles.primaryButton, theme !== null && { backgroundColor: theme.primary }]}>
          <AppText style={[styles.primaryButtonLabel, theme !== null && { color: theme.onPrimary }]}>{strings.prescriptions.retry}</AppText>
        </AppPressable>
      </View>
    ) : loadState === 'empty' ? (
      <View style={styles.stateContainer} accessibilityRole="alert">
        <AppText style={[styles.stateTitle, theme !== null && { color: theme.textPrimary }]}>{strings.prescriptions.emptyTitle}</AppText>
        <AppText style={[styles.stateMessage, theme !== null && { color: theme.textSecondary }]}>{strings.prescriptions.emptyMessage}</AppText>
      </View>
    ) : (
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <AppPressable
            accessibilityRole="button"
            accessibilityLabel={item.accessibilityLabel}
            accessibilityHint={strings.prescriptions.medicinesHeading}
            onPress={() => onOpen(item.id)}
            style={[styles.card, theme !== null && { backgroundColor: theme.surface, borderColor: theme.border }]}
          >
            <AppText style={[styles.doctor, theme !== null && { color: theme.textPrimary }]}>{strings.prescriptions.issuedBy(item.doctorName)}</AppText>
            <AppText style={[styles.date, theme !== null && { color: theme.textSecondary }]}>{strings.prescriptions.issuedOn(item.issuedAtLabel)}</AppText>
            <AppText style={[styles.clinic, theme !== null && { color: theme.textSecondary }]}>{item.clinicName}</AppText>
            <View style={styles.cardFooter}>
              <AppText style={[styles.medicineCount, theme !== null && { color: theme.textPrimary }]}>{item.medicineCountLabel}</AppText>
              <AppText style={[styles.progress, theme !== null && { color: theme.primary }]}>{item.doseProgressLabel}</AppText>
            </View>
          </AppPressable>
        )}
      />
    )}
  </SafeAreaView>
);

export default PrescriptionsScreenView;
