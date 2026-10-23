import type React from 'react';
import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { strings } from '../../constants/strings';
import { mockDataAccess } from '../../services/mock/mockDataAccess';
import { getDoseTrackingKey, type DoseTakenState, type MedicineTiming, type Prescription } from '../../types/domain';
import type { PrescriptionDetailModel, PrescriptionMedicineItem } from '../../features/prescriptions/types';
import type { PrescriptionDetailScreenProps } from '../../navigation/types';
import { resolveRuntimeTheme } from '../../theme/runtimeTheme';
import type { RuntimeThemeTokens } from '../../theme/runtimeTheme';
import { useRuntimeThemeContext } from '../../theme/RuntimeThemeContext';
import PrescriptionDetailScreenView from './view';

type LoadState = 'loading' | 'ready' | 'error' | 'notFound';
type Props = PrescriptionDetailScreenProps;

const formatIssuedAt = (value: string): string => new Date(value).toLocaleDateString(undefined, {
  year: 'numeric', month: 'long', day: 'numeric',
});

const getTimingLabel = (timing: MedicineTiming): string => {
  switch (timing) {
    case 'morning': return strings.prescriptions.timing.morning;
    case 'afternoon': return strings.prescriptions.timing.afternoon;
    case 'night': return strings.prescriptions.timing.night;
  }
};

const buildDetail = (prescription: Prescription, doseState: DoseTakenState): PrescriptionDetailModel => ({
  id: prescription.id,
  doctorName: prescription.doctorName,
  clinicName: prescription.clinicName,
  issuedAtLabel: formatIssuedAt(prescription.issuedAt),
  medicines: prescription.medicines.map((medicine): PrescriptionMedicineItem => ({
    id: medicine.id,
    name: medicine.name,
    dose: medicine.dose,
    durationLabel: strings.prescriptions.duration(medicine.days),
    doses: medicine.timing.map((timing) => {
      const updateKey = getDoseTrackingKey({ prescriptionId: prescription.id, medicineId: medicine.id, timing });
      const taken = doseState[updateKey] === true;
      const label = getTimingLabel(timing);
      return {
        timing,
        label,
        taken,
        updateKey,
        accessibilityLabel: strings.prescriptions.doseAccessibility(medicine.name, label, taken),
      };
    }),
  })),
});

const PrescriptionDetailScreenContainer = ({ navigation, route }: Props): React.ReactElement => {
  const { setActiveTheme, setActiveTabs } = useRuntimeThemeContext();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [theme, setTheme] = useState<RuntimeThemeTokens | null>(null);
  const [doseState, setDoseState] = useState<DoseTakenState>({});
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [updatingDoseKeys, setUpdatingDoseKeys] = useState<ReadonlySet<string>>(() => new Set());
  const [updated, setUpdated] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const inFlightDoseKeys = useRef(new Set<string>());

  const load = useCallback(async (): Promise<void> => {
    setLoadState('loading');
    setUpdated(false);
    setUpdateError(null);
    try {
      const config = await mockDataAccess.fetchConfig();
      const nextTheme = resolveRuntimeTheme(config);
      setTheme(nextTheme);
      setActiveTheme(nextTheme);
      setActiveTabs(config.tabs);
      const prescriptions = await mockDataAccess.fetchPrescriptions();
      const found = prescriptions.find((item) => item.id === route.params.prescriptionId);
      if (found === undefined) {
        setPrescription(null);
        setLoadState('notFound');
        return;
      }
      const taken = await mockDataAccess.fetchDoseTakenState(found.id);
      setPrescription(found);
      setDoseState(taken);
      setLoadState('ready');
    } catch {
      setLoadState('error');
    }
  }, [route.params.prescriptionId]);

  useFocusEffect(useCallback(() => {
    void load();
  }, [load]));

  const handleDoseToggle = async (medicineId: string, timing: MedicineTiming): Promise<void> => {
    const prescriptionId = route.params.prescriptionId;
    const updateKey = getDoseTrackingKey({ prescriptionId, medicineId, timing });
    if (inFlightDoseKeys.current.has(updateKey)) return;

    inFlightDoseKeys.current.add(updateKey);
    setUpdatingDoseKeys(new Set(inFlightDoseKeys.current));
    setUpdated(false);
    setUpdateError(null);
    try {
      const nextState = await mockDataAccess.setDoseTakenState({
        prescriptionId,
        medicineId,
        timing,
        taken: doseState[updateKey] !== true,
      });
      setDoseState(nextState);
      setUpdated(true);
    } catch {
      setUpdateError(strings.prescriptions.updateError);
    } finally {
      inFlightDoseKeys.current.delete(updateKey);
      setUpdatingDoseKeys(new Set(inFlightDoseKeys.current));
    }
  };

  const detail = prescription === null ? null : buildDetail(prescription, doseState);

  return (
    <PrescriptionDetailScreenView
      detail={detail}
      theme={theme}
      loadState={loadState}
      updatingDoseKeys={updatingDoseKeys}
      updated={updated}
      updateError={updateError}
      onBack={() => navigation.goBack()}
      onRetry={() => { void load(); }}
      onDoseToggle={(medicineId, timing) => { void handleDoseToggle(medicineId, timing); }}
    />
  );
};

export default PrescriptionDetailScreenContainer;
