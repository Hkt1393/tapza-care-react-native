import type React from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppPressable, AppText, SkeletonBlock } from '../../components';
import { strings } from '../../constants/strings';
import { colors } from '../../theme/colors';
import type { RuntimeThemeTokens } from '../../theme/runtimeTheme';
import type { MedicineTiming } from '../../types/domain';
import type { PrescriptionDetailModel } from '../../features/prescriptions/types';
import styles from './styles';

type LoadState = 'loading' | 'ready' | 'error' | 'notFound';

interface PrescriptionDetailScreenViewProps {
  detail: PrescriptionDetailModel | null;
  theme: RuntimeThemeTokens | null;
  loadState: LoadState;
  updatingDoseKeys: ReadonlySet<string>;
  updated: boolean;
  updateError: string | null;
  onBack: () => void;
  onRetry: () => void;
  onDoseToggle: (medicineId: string, timing: MedicineTiming) => void;
}

const PrescriptionDetailScreenView = ({
  detail,
  theme,
  loadState,
  updatingDoseKeys,
  updated,
  updateError,
  onBack,
  onRetry,
  onDoseToggle,
}: PrescriptionDetailScreenViewProps): React.ReactElement => (
  <SafeAreaView style={[styles.safeArea, { backgroundColor: theme?.background ?? colors.background }]} edges={['top']}>

    {loadState === 'loading' ? (
      <ScrollView
        contentContainerStyle={styles.skeletonContent}
        accessibilityRole="progressbar"
        accessibilityLabel={strings.common.loading}
      >
        <View style={styles.skeletonInfo}>
          <SkeletonBlock style={styles.skeletonDoctor} />
          <SkeletonBlock style={styles.skeletonDate} />
          <SkeletonBlock style={styles.skeletonDate} />
          <SkeletonBlock style={styles.skeletonClinic} />
        </View>
        <SkeletonBlock style={styles.skeletonHeading} />
        {[0, 1].map((item) => (
          <View key={item} style={styles.skeletonMedicine}>
            <SkeletonBlock style={styles.skeletonMedicineName} />
            <SkeletonBlock style={styles.skeletonDose} />
            <SkeletonBlock style={styles.skeletonDose} />
            {[0, 1].map((dose) => (
              <View key={dose} style={styles.skeletonDoseRow}>
                <SkeletonBlock style={styles.skeletonDose} />
                <SkeletonBlock style={styles.skeletonDoseButton} />
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    ) : loadState === 'error' ? (
      <View style={styles.stateContainer} accessibilityRole="alert">
        <AppText style={[styles.stateTitle, theme !== null && { color: theme.textPrimary }]}>{strings.prescriptions.loadErrorTitle}</AppText>
        <AppText style={[styles.stateMessage, theme !== null && { color: theme.textSecondary }]}>{strings.prescriptions.loadErrorMessage}</AppText>
        <AppPressable accessibilityRole="button" accessibilityLabel={strings.prescriptions.retry} onPress={onRetry} style={[styles.primaryButton, theme !== null && { backgroundColor: theme.primary }]}>
          <AppText style={[styles.primaryButtonLabel, theme !== null && { color: theme.onPrimary }]}>{strings.prescriptions.retry}</AppText>
        </AppPressable>
      </View>
    ) : loadState === 'notFound' || detail === null ? (
      <View style={styles.stateContainer} accessibilityRole="alert">
        <AppText style={[styles.stateTitle, theme !== null && { color: theme.textPrimary }]}>{strings.prescriptions.notFoundTitle}</AppText>
        <AppText style={[styles.stateMessage, theme !== null && { color: theme.textSecondary }]}>{strings.prescriptions.notFoundMessage}</AppText>
        <AppPressable accessibilityRole="button" accessibilityLabel={strings.prescriptions.back} onPress={onBack} style={[styles.primaryButton, theme !== null && { backgroundColor: theme.primary }]}>
          <AppText style={[styles.primaryButtonLabel, theme !== null && { color: theme.onPrimary }]}>{strings.prescriptions.back}</AppText>
        </AppPressable>
      </View>
    ) : (
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.prescriptionInfo, theme !== null && { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <AppText style={[styles.doctor, theme !== null && { color: theme.textPrimary }]}>{strings.prescriptions.issuedBy(detail.doctorName)}</AppText>
          <AppText style={[styles.date, theme !== null && { color: theme.textSecondary }]}>{strings.prescriptions.issuedOn(detail.issuedAtLabel)}</AppText>
          <AppText style={[styles.clinicLabel, theme !== null && { color: theme.textPrimary }]}>{strings.prescriptions.clinic}</AppText>
          <AppText style={[styles.clinic, theme !== null && { color: theme.textSecondary }]}>{detail.clinicName}</AppText>
        </View>

        <AppText style={[styles.sectionTitle, theme !== null && { color: theme.textPrimary }]}>{strings.prescriptions.medicinesHeading}</AppText>
        {detail.medicines.map((medicine) => (
          <View key={medicine.id} style={[styles.medicineCard, theme !== null && { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <AppText style={[styles.medicineName, theme !== null && { color: theme.textPrimary }]}>{medicine.name}</AppText>
            <AppText style={[styles.medicineDetail, theme !== null && { color: theme.textSecondary }]}>{strings.prescriptions.doseLabel}: {medicine.dose}</AppText>
            <AppText style={[styles.medicineDetail, theme !== null && { color: theme.textSecondary }]}>{strings.prescriptions.durationLabel}: {medicine.durationLabel}</AppText>
            <AppText style={[styles.scheduleLabel, theme !== null && { color: theme.textPrimary }]}>{strings.prescriptions.schedule}</AppText>
            {medicine.doses.map((dose) => {
              const isUpdating = updatingDoseKeys.has(dose.updateKey);
              return (
                <View key={dose.timing} style={styles.doseRow}>
                  <View style={styles.doseCopy}>
                    <AppText style={[styles.timing, theme !== null && { color: theme.textPrimary }]}>{dose.label}</AppText>
                    <AppText style={[styles.doseStatus, dose.taken ? styles.takenStatus : [styles.notTakenStatus, theme !== null && { color: theme.textSecondary }]]}>
                      {dose.taken ? strings.prescriptions.taken : strings.prescriptions.notTaken}
                    </AppText>
                  </View>
                  <AppPressable
                    accessibilityRole="checkbox"
                    accessibilityLabel={dose.accessibilityLabel}
                    accessibilityHint={dose.taken ? strings.prescriptions.undoTaken : strings.prescriptions.markTaken}
                    accessibilityState={{ checked: dose.taken, disabled: isUpdating }}
                    disabled={isUpdating}
                    onPress={() => onDoseToggle(medicine.id, dose.timing)}
                    style={[styles.doseButton, theme !== null && { borderColor: theme.primary }, dose.taken && [styles.doseButtonTaken, theme !== null && { backgroundColor: theme.primary }], isUpdating && styles.disabledButton]}
                  >
                    {isUpdating ? <ActivityIndicator color={dose.taken ? colors.white : (theme?.primary ?? colors.primary)} /> : (
                      <AppText style={[styles.doseButtonLabel, theme !== null && { color: theme.primary }, dose.taken && [styles.doseButtonLabelTaken, theme !== null && { color: theme.onPrimary }]]}>
                        {dose.taken ? strings.prescriptions.undoTaken : strings.prescriptions.markTaken}
                      </AppText>
                    )}
                  </AppPressable>
                </View>
              );
            })}
          </View>
        ))}
        {updated ? <AppText accessibilityRole="alert" style={styles.updatedMessage}>{strings.prescriptions.updated}</AppText> : null}
        {updateError ? <AppText accessibilityRole="alert" style={styles.errorMessage}>{updateError}</AppText> : null}
      </ScrollView>
    )}
  </SafeAreaView>
);

export default PrescriptionDetailScreenView;
