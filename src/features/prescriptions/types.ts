import type { MedicineTiming } from '../../types/domain';

export interface PrescriptionListItem {
  id: string;
  doctorName: string;
  issuedAtLabel: string;
  clinicName: string;
  medicineCountLabel: string;
  doseProgressLabel: string;
  accessibilityLabel: string;
}

export interface PrescriptionDoseItem {
  timing: MedicineTiming;
  label: string;
  taken: boolean;
  accessibilityLabel: string;
  updateKey: string;
}

export interface PrescriptionMedicineItem {
  id: string;
  name: string;
  dose: string;
  durationLabel: string;
  doses: PrescriptionDoseItem[];
}

export interface PrescriptionDetailModel {
  id: string;
  doctorName: string;
  clinicName: string;
  issuedAtLabel: string;
  medicines: PrescriptionMedicineItem[];
}
