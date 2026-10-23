import { configFixtures } from '../../features/config/fixtures';
import { readCachedConfig, saveValidatedConfig } from '../../features/config/configCache';
import type {
  Booking,
  BookingRequest,
  Doctor,
  DoseTakenState,
  DoseTakenUpdate,
  LayoutConfig,
  MockNetworkSettings,
  MockOperation,
  MockStorage,
  Prescription,
  Slot,
} from '../../types/domain';
import { MockRequestError } from '../../types/domain';
import { doctorFixtures, prescriptionFixtures } from './fixtures';
import { createMockNetwork } from './mockNetwork';
import { createMockState } from './mockState';

export interface MockDataAccessOptions {
  storage?: MockStorage;
  now?: () => string;
}

export interface MockDataAccess {
  fetchConfig(): Promise<LayoutConfig>;
  fetchDoctors(): Promise<Doctor[]>;
  fetchSlots(doctorId: string, date: string): Promise<Slot[]>;
  createBooking(request: BookingRequest): Promise<Booking>;
  fetchPrescriptions(): Promise<Prescription[]>;
  fetchDoseTakenState(prescriptionId: string): Promise<DoseTakenState>;
  setDoseTakenState(update: DoseTakenUpdate): Promise<DoseTakenState>;
  configureNetwork(settings: Partial<MockNetworkSettings>): void;
  getNetworkSettings(): MockNetworkSettings;
  selectConfig(config: keyof typeof configFixtures): void;
  setConfigPayloadOverride(payload: unknown): void;
  reset(): void;
}

const defaultStorage: MockStorage = {
  async get<TValue>(key: string): Promise<TValue | null> {
    const { storage } = await import('../storage');
    return storage.get<TValue>(key);
  },
  async set<TValue>(key: string, value: TValue): Promise<void> {
    const { storage } = await import('../storage');
    await storage.set(key, value);
  },
};

const toList = <T>(items: readonly T[], shouldBeEmpty: boolean): T[] =>
  shouldBeEmpty ? [] : items.map((item) => ({ ...item }));

const copyDoctor = (doctor: Doctor): Doctor => ({ ...doctor, languages: [...doctor.languages] });

const copyPrescription = (prescription: Prescription): Prescription => ({
  ...prescription,
  medicines: prescription.medicines.map((medicine) => ({ ...medicine, timing: [...medicine.timing] })),
});

export const createMockDataAccess = (options: MockDataAccessOptions = {}): MockDataAccess => {
  const cacheStorage = options.storage ?? defaultStorage;
  const now = options.now ?? (() => new Date().toISOString());
  const network = createMockNetwork();
  const state = createMockState();
  let selectedConfig: keyof typeof configFixtures = 'normal';
  let configPayloadOverride: unknown;

  const request = async (operation: MockOperation): Promise<void> => network.beforeRequest(operation);

  const fetchConfig = async (): Promise<LayoutConfig> => {
    try {
      await request('config');
      const payload = configPayloadOverride ?? configFixtures[selectedConfig];
      return await saveValidatedConfig(cacheStorage, payload);
    } catch (error) {
      const cached = await readCachedConfig(cacheStorage);
      if (cached !== null) return cached;
      if (error instanceof Error) throw error;
      throw new MockRequestError('config');
    }
  };

  const fetchDoctors = async (): Promise<Doctor[]> => {
    await request('doctors');
    return network.isEmpty('doctors') ? [] : doctorFixtures.map(copyDoctor);
  };

  const fetchSlots = async (doctorId: string, date: string): Promise<Slot[]> => {
    await request('slots');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
      throw new RangeError('date must use the YYYY-MM-DD format.');
    }
    const matchingSlots = state.getSlots().filter((slot) =>
      slot.doctorId === doctorId && slot.startsAt.slice(0, 10) === date,
    );
    return toList(matchingSlots, network.isEmpty('slots'));
  };

  const createBooking = async (bookingRequest: BookingRequest): Promise<Booking> => {
    await request('bookings');
    return state.reserve(bookingRequest.doctorId, bookingRequest.slotId, now());
  };

  const fetchPrescriptions = async (): Promise<Prescription[]> => {
    await request('prescriptions');
    return network.isEmpty('prescriptions') ? [] : prescriptionFixtures.map(copyPrescription);
  };

  const fetchDoseTakenState = async (prescriptionId: string): Promise<DoseTakenState> => {
    await request('prescriptions');
    return state.getDoseTakenState(prescriptionId);
  };

  const setDoseTakenState = async (update: DoseTakenUpdate): Promise<DoseTakenState> => {
    await request('prescriptions');
    return state.setDoseTakenState(update);
  };

  const reset = (): void => {
    network.reset();
    state.reset();
    selectedConfig = 'normal';
    configPayloadOverride = undefined;
  };

  return {
    fetchConfig,
    fetchDoctors,
    fetchSlots,
    createBooking,
    fetchPrescriptions,
    fetchDoseTakenState,
    setDoseTakenState,
    configureNetwork: network.configure,
    getNetworkSettings: network.getSettings,
    selectConfig: (config) => { selectedConfig = config; },
    setConfigPayloadOverride: (payload) => { configPayloadOverride = payload; },
    reset,
  };
};

export const mockDataAccess = createMockDataAccess();
