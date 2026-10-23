import type React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      <Pressable accessibilityRole="button" accessibilityLabel={strings.prescriptions.back} onPress={onBack} style={styles.backButton}>
        <Text style={styles.backGlyph}>‹</Text>
        <Text style={styles.backLabel}>{strings.prescriptions.back}</Text>
      </Pressable>
      <Text style={styles.title}>{strings.prescriptions.detailTitle}</Text>
    </View>

    {loadState === 'loading' ? (
      <View style={styles.stateContainer} accessibilityRole="progressbar" accessibilityLabel={strings.common.loading}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    ) : loadState === 'error' ? (
      <View style={styles.stateContainer} accessibilityRole="alert">
        <Text style={styles.stateTitle}>{strings.prescriptions.loadErrorTitle}</Text>
        <Text style={styles.stateMessage}>{strings.prescriptions.loadErrorMessage}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={strings.prescriptions.retry} onPress={onRetry} style={styles.primaryButton}>
          <Text style={styles.primaryButtonLabel}>{strings.prescriptions.retry}</Text>
        </Pressable>
      </View>
    ) : loadState === 'notFound' || detail === null ? (
      <View style={styles.stateContainer} accessibilityRole="alert">
        <Text style={styles.stateTitle}>{strings.prescriptions.notFoundTitle}</Text>
        <Text style={styles.stateMessage}>{strings.prescriptions.notFoundMessage}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={strings.prescriptions.back} onPress={onBack} style={styles.primaryButton}>
          <Text style={styles.primaryButtonLabel}>{strings.prescriptions.back}</Text>
        </Pressable>
      </View>
    ) : (
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.prescriptionInfo}>
          <Text style={styles.doctor}>{strings.prescriptions.issuedBy(detail.doctorName)}</Text>
          <Text style={styles.date}>{strings.prescriptions.issuedOn(detail.issuedAtLabel)}</Text>
          <Text style={styles.clinicLabel}>{strings.prescriptions.clinic}</Text>
          <Text style={styles.clinic}>{detail.clinicName}</Text>
        </View>

        <Text style={styles.sectionTitle}>{strings.prescriptions.medicinesHeading}</Text>
        {detail.medicines.map((medicine) => (
          <View key={medicine.id} style={styles.medicineCard}>
            <Text style={styles.medicineName}>{medicine.name}</Text>
            <Text style={styles.medicineDetail}>{strings.prescriptions.doseLabel}: {medicine.dose}</Text>
            <Text style={styles.medicineDetail}>{strings.prescriptions.durationLabel}: {medicine.durationLabel}</Text>
            <Text style={styles.scheduleLabel}>{strings.prescriptions.schedule}</Text>
            {medicine.doses.map((dose) => {
              const isUpdating = updatingDoseKeys.has(dose.updateKey);
              return (
                <View key={dose.timing} style={styles.doseRow}>
                  <View style={styles.doseCopy}>
                    <Text style={styles.timing}>{dose.label}</Text>
                    <Text style={[styles.doseStatus, dose.taken ? styles.takenStatus : styles.notTakenStatus]}>
                      {dose.taken ? strings.prescriptions.taken : strings.prescriptions.notTaken}
                    </Text>
                  </View>
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityLabel={dose.accessibilityLabel}
                    accessibilityHint={dose.taken ? strings.prescriptions.undoTaken : strings.prescriptions.markTaken}
                    accessibilityState={{ checked: dose.taken, disabled: isUpdating }}
                    disabled={isUpdating}
                    onPress={() => onDoseToggle(medicine.id, dose.timing)}
                    style={[styles.doseButton, dose.taken && styles.doseButtonTaken, isUpdating && styles.disabledButton]}
                  >
                    {isUpdating ? <ActivityIndicator color={dose.taken ? colors.white : colors.primary} /> : (
                      <Text style={[styles.doseButtonLabel, dose.taken && styles.doseButtonLabelTaken]}>
                        {dose.taken ? strings.prescriptions.undoTaken : strings.prescriptions.markTaken}
                      </Text>
                    )}
                  </Pressable>
                </View>
              );
            })}
          </View>
        ))}
        {updated ? <Text accessibilityRole="alert" style={styles.updatedMessage}>{strings.prescriptions.updated}</Text> : null}
        {updateError ? <Text accessibilityRole="alert" style={styles.errorMessage}>{updateError}</Text> : null}
      </ScrollView>
    )}
  </SafeAreaView>
);

export default PrescriptionDetailScreenView;
