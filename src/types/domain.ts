export type MedicineTiming = 'morning' | 'afternoon' | 'night';
export type DoseSchedule = MedicineTiming[];

export type AppScreen = 'home' | 'bookings' | 'prescriptions' | 'profile';

export interface LayoutTheme {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  festival?: {
    name: string;
    greeting: string;
    bannerImageUrl: string;
  };
}

export interface LayoutTab {
  id: string;
  label: string;
  icon: string;
  screen: AppScreen;
}

export type SectionBackground =
  | { kind: 'color'; value: string }
  | { kind: 'gradient'; value: string }
  | { kind: 'image'; value: string };

/** The string type intentionally preserves future section types for safe renderer skipping. */
export interface LayoutSection {
  id: string;
  type: string;
  background: SectionBackground;
  title?: string;
  items: unknown[];
}

export interface LayoutConfig {
  version: number;
  theme: LayoutTheme;
  tabs: LayoutTab[];
  sections: LayoutSection[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  photoUrl: string;
  feeInr: number;
  languages: string[];
}

export interface Slot {
  id: string;
  doctorId: string;
  startsAt: string;
  endsAt: string;
  available: boolean;
}

export interface BookingRequest {
  doctorId: string;
  slotId: string;
}

export interface Booking extends BookingRequest {
  id: string;
  status: 'confirmed';
  createdAt: string;
}

export interface Medicine {
  id: string;
  name: string;
  dose: string;
  days: number;
  timing: DoseSchedule;
}

export interface Prescription {
  id: string;
  issuedAt: string;
  doctorName: string;
  clinicName: string;
  medicines: Medicine[];
}

export type DoseTakenState = Record<string, boolean>;

export interface DoseTakenUpdate {
  prescriptionId: string;
  medicineId: string;
  timing: MedicineTiming;
  taken: boolean;
}

export const getDoseTrackingKey = (
  dose: Pick<DoseTakenUpdate, 'prescriptionId' | 'medicineId' | 'timing'>,
): string => `${dose.prescriptionId}::${dose.medicineId}::${dose.timing}`;

export class DoseTrackingError extends Error {
  constructor() {
    super('The requested dose is not part of this prescription.');
    this.name = 'DoseTrackingError';
  }
}

export type MockOperation =
  | 'config'
  | 'doctors'
  | 'slots'
  | 'bookings'
  | 'prescriptions';

export interface MockNetworkSettings {
  latencyMs: number;
  failures: Partial<Record<MockOperation, boolean>>;
  emptyLists: Partial<Record<'doctors' | 'slots' | 'prescriptions', boolean>>;
}

export interface MockStorage {
  get<TValue>(key: string): Promise<TValue | null>;
  set<TValue>(key: string, value: TValue): Promise<void>;
}

export class BookingConflictError extends Error {
  readonly statusCode = 409;

  constructor(message = 'The selected slot is no longer available.') {
    super(message);
    this.name = 'BookingConflictError';
  }
}

export class MockRequestError extends Error {
  constructor(readonly operation: MockOperation) {
    super(`The mock ${operation} request failed.`);
    this.name = 'MockRequestError';
  }
}
