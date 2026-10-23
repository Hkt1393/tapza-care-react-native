import type React from 'react';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { strings } from '../../constants/strings';
import { mockDataAccess } from '../../services/mock/mockDataAccess';
import type { Prescription } from '../../types/domain';
import type { PrescriptionListItem } from '../../features/prescriptions/types';
import type { RootStackScreenProps } from '../../navigation/types';
import PrescriptionsScreenView from './view';

type LoadState = 'loading' | 'ready' | 'empty' | 'error';
type Props = RootStackScreenProps<'Prescriptions'>;

const formatIssuedAt = (value: string): string => new Date(value).toLocaleDateString(undefined, {
  year: 'numeric', month: 'short', day: 'numeric',
});

const buildListItem = async (prescription: Prescription): Promise<PrescriptionListItem> => {
  const doses = await mockDataAccess.fetchDoseTakenState(prescription.id);
  const totalDoses = prescription.medicines.reduce((total, medicine) => total + medicine.timing.length, 0);
  const takenDoses = Object.values(doses).filter(Boolean).length;
  const issuedAtLabel = formatIssuedAt(prescription.issuedAt);

  return {
    id: prescription.id,
    doctorName: prescription.doctorName,
    issuedAtLabel,
    clinicName: prescription.clinicName,
    medicineCountLabel: strings.prescriptions.medicineCount(prescription.medicines.length),
    doseProgressLabel: strings.prescriptions.doseProgress(takenDoses, totalDoses),
    accessibilityLabel: strings.prescriptions.listAccessibility(prescription.doctorName, issuedAtLabel),
  };
};

const PrescriptionsScreenContainer = ({ navigation }: Props): React.ReactElement => {
  const [items, setItems] = useState<PrescriptionListItem[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');

  const load = useCallback(async (): Promise<void> => {
    setLoadState('loading');
    try {
      const prescriptions = await mockDataAccess.fetchPrescriptions();
      const nextItems = await Promise.all(prescriptions.map(buildListItem));
      setItems(nextItems);
      setLoadState(nextItems.length > 0 ? 'ready' : 'empty');
    } catch {
      setLoadState('error');
    }
  }, []);

  useFocusEffect(useCallback(() => {
    void load();
  }, [load]));

  return (
    <PrescriptionsScreenView
      items={items}
      loadState={loadState}
      onOpen={(prescriptionId) => navigation.navigate('PrescriptionDetail', { prescriptionId })}
      onRetry={() => { void load(); }}
      onBack={() => navigation.goBack()}
    />
  );
};

export default PrescriptionsScreenContainer;
