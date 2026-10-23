import type React from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppPressable, AppText, SkeletonBlock } from '../../components';
import { strings } from '../../constants/strings';
import { colors } from '../../theme/colors';
import type { MedicineTiming } from '../../types/domain';
import type { PrescriptionDetailModel } from '../../features/prescriptions/types';
import styles from './styles';

type LoadState = 'loading' | 'ready' | 'error' | 'notFound';

interface PrescriptionDetailScreenViewProps {
  detail: PrescriptionDetailModel | null;
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
  loadState,
  updatingDoseKeys,
  updated,
  updateError,
  onBack,
  onRetry,
  onDoseToggle,
}: PrescriptionDetailScreenViewProps): React.ReactElement => (
  <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
    <View style={styles.header}>
      <AppPressable accessibilityRole="button" accessibilityLabel={strings.prescriptions.back} onPress={onBack} style={styles.backButton}>
        <AppText style={styles.backGlyph}>‹</AppText>
        <AppText style={styles.backLabel}>{strings.prescriptions.back}</AppText>
      </AppPressable>
      <AppText style={styles.title}>{strings.prescriptions.detailTitle}</AppText>
    </View>

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
        <AppText style={styles.stateTitle}>{strings.prescriptions.loadErrorTitle}</AppText>
        <AppText style={styles.stateMessage}>{strings.prescriptions.loadErrorMessage}</AppText>
        <AppPressable accessibilityRole="button" accessibilityLabel={strings.prescriptions.retry} onPress={onRetry} style={styles.primaryButton}>
          <AppText style={styles.primaryButtonLabel}>{strings.prescriptions.retry}</AppText>
        </AppPressable>
      </View>
    ) : loadState === 'notFound' || detail === null ? (
      <View style={styles.stateContainer} accessibilityRole="alert">
        <AppText style={styles.stateTitle}>{strings.prescriptions.notFoundTitle}</AppText>
        <AppText style={styles.stateMessage}>{strings.prescriptions.notFoundMessage}</AppText>
        <AppPressable accessibilityRole="button" accessibilityLabel={strings.prescriptions.back} onPress={onBack} style={styles.primaryButton}>
          <AppText style={styles.primaryButtonLabel}>{strings.prescriptions.back}</AppText>
        </AppPressable>
      </View>
    ) : (
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.prescriptionInfo}>
          <AppText style={styles.doctor}>{strings.prescriptions.issuedBy(detail.doctorName)}</AppText>
          <AppText style={styles.date}>{strings.prescriptions.issuedOn(detail.issuedAtLabel)}</AppText>
          <AppText style={styles.clinicLabel}>{strings.prescriptions.clinic}</AppText>
          <AppText style={styles.clinic}>{detail.clinicName}</AppText>
        </View>

        <AppText style={styles.sectionTitle}>{strings.prescriptions.medicinesHeading}</AppText>
        {detail.medicines.map((medicine) => (
          <View key={medicine.id} style={styles.medicineCard}>
            <AppText style={styles.medicineName}>{medicine.name}</AppText>
            <AppText style={styles.medicineDetail}>{strings.prescriptions.doseLabel}: {medicine.dose}</AppText>
            <AppText style={styles.medicineDetail}>{strings.prescriptions.durationLabel}: {medicine.durationLabel}</AppText>
            <AppText style={styles.scheduleLabel}>{strings.prescriptions.schedule}</AppText>
            {medicine.doses.map((dose) => {
              const isUpdating = updatingDoseKeys.has(dose.updateKey);
              return (
                <View key={dose.timing} style={styles.doseRow}>
                  <View style={styles.doseCopy}>
                    <AppText style={styles.timing}>{dose.label}</AppText>
                    <AppText style={[styles.doseStatus, dose.taken ? styles.takenStatus : styles.notTakenStatus]}>
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
                    style={[styles.doseButton, dose.taken && styles.doseButtonTaken, isUpdating && styles.disabledButton]}
                  >
                    {isUpdating ? <ActivityIndicator color={dose.taken ? colors.white : colors.primary} /> : (
                      <AppText style={[styles.doseButtonLabel, dose.taken && styles.doseButtonLabelTaken]}>
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
