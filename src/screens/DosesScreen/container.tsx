import type React from 'react';
import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { strings } from '../../constants/strings';
import { mockDataAccess } from '../../services/mock/mockDataAccess';
import type { DoseTakenState, MedicineTiming, Prescription } from '../../types/domain';
import { getDoseTrackingKey } from '../../types/domain';
import { resolveRuntimeTheme } from '../../theme/runtimeTheme';
import type { RuntimeThemeTokens } from '../../theme/runtimeTheme';
import { useRuntimeThemeContext } from '../../theme/RuntimeThemeContext';
import type { DosesScreenProps } from '../../navigation/types';
import DosesScreenView from './view';

export interface DoseReminderItem {
  id: string;
  prescriptionId: string;
  medicineId: string;
  medicineName: string;
  dose: string;
  doctorName: string;
  timing: MedicineTiming;
  timingLabel: string;
  taken: boolean;
  accessibilityLabel: string;
}

type LoadState = 'loading' | 'ready' | 'empty' | 'error';

const getTimingLabel = (timing: MedicineTiming): string => {
  switch (timing) {
    case 'morning': return strings.prescriptions.timing.morning;
    case 'afternoon': return strings.prescriptions.timing.afternoon;
    case 'night': return strings.prescriptions.timing.night;
  }
};

const buildItems = (prescriptions: Prescription[], states: ReadonlyMap<string, DoseTakenState>): DoseReminderItem[] =>
  prescriptions.flatMap((prescription) => prescription.medicines.flatMap((medicine) =>
    medicine.timing.map((timing): DoseReminderItem => {
      const taken = states.get(prescription.id)?.[getDoseTrackingKey({
        prescriptionId: prescription.id,
        medicineId: medicine.id,
        timing,
      })] === true;
      const timingLabel = getTimingLabel(timing);
      return {
        id: getDoseTrackingKey({ prescriptionId: prescription.id, medicineId: medicine.id, timing }),
        prescriptionId: prescription.id,
        medicineId: medicine.id,
        medicineName: medicine.name,
        dose: medicine.dose,
        doctorName: prescription.doctorName,
        timing,
        timingLabel,
        taken,
        accessibilityLabel: strings.doses.accessibility(medicine.name, timingLabel, taken),
      };
    }),
  ));

const DosesScreenContainer = (_props: DosesScreenProps): React.ReactElement => {
  const { setActiveTheme, setActiveTabs } = useRuntimeThemeContext();
  const [items, setItems] = useState<DoseReminderItem[]>([]);
  const [theme, setTheme] = useState<RuntimeThemeTokens | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [updated, setUpdated] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<ReadonlySet<string>>(() => new Set());
  const inFlight = useRef(new Set<string>());

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
      const entries = await Promise.all(prescriptions.map(async (prescription) => [
        prescription.id,
        await mockDataAccess.fetchDoseTakenState(prescription.id),
      ] as const));
      const nextItems = buildItems(prescriptions, new Map(entries));
      setItems(nextItems);
      setLoadState(nextItems.length > 0 ? 'ready' : 'empty');
    } catch {
      setLoadState('error');
    }
  }, [setActiveTabs, setActiveTheme]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const handleToggle = async (item: DoseReminderItem): Promise<void> => {
    if (inFlight.current.has(item.id)) return;
    inFlight.current.add(item.id);
    setUpdatingIds(new Set(inFlight.current));
    setUpdated(false);
    setUpdateError(null);
    try {
      const state = await mockDataAccess.setDoseTakenState({
        prescriptionId: item.prescriptionId,
        medicineId: item.medicineId,
        timing: item.timing,
        taken: !item.taken,
      });
      const taken = state[item.id] === true;
      setItems((current) => current.map((entry) => entry.id === item.id
        ? { ...entry, taken, accessibilityLabel: strings.doses.accessibility(entry.medicineName, entry.timingLabel, taken) }
        : entry));
      setUpdated(true);
    } catch {
      setUpdateError(strings.doses.updateError);
    } finally {
      inFlight.current.delete(item.id);
      setUpdatingIds(new Set(inFlight.current));
    }
  };

  return <DosesScreenView
    items={items}
    theme={theme}
    loadState={loadState}
    updatingIds={updatingIds}
    updated={updated}
    updateError={updateError}
    onToggle={(item) => { void handleToggle(item); }}
    onRetry={() => { void load(); }}
  />;
};

export default DosesScreenContainer;
