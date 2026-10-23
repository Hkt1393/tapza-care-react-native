import type { Booking, DoseTakenState, DoseTakenUpdate, Slot } from '../../types/domain';
import { BookingConflictError, DoseTrackingError, getDoseTrackingKey } from '../../types/domain';
import { prescriptionFixtures, slotFixtures } from './fixtures';

export const createMockState = () => {
  let slots: Slot[] = slotFixtures.map((slot) => ({ ...slot }));
  let bookings: Booking[] = [];
  let takenDoses: DoseTakenState = {};

  const getSlots = (): Slot[] => slots.map((slot) => ({ ...slot }));
  const reset = (): void => {
    slots = slotFixtures.map((slot) => ({ ...slot }));
    bookings = [];
    takenDoses = {};
  };

  const getDoseTakenState = (prescriptionId: string): DoseTakenState => {
    const prefix = `${prescriptionId}::`;
    return Object.fromEntries(
      Object.entries(takenDoses).filter(([key, taken]) => key.startsWith(prefix) && taken),
    );
  };

  const setDoseTakenState = (update: DoseTakenUpdate): DoseTakenState => {
    const prescription = prescriptionFixtures.find((item) => item.id === update.prescriptionId);
    const medicine = prescription?.medicines.find((item) => item.id === update.medicineId);
    if (medicine === undefined || !medicine.timing.includes(update.timing)) throw new DoseTrackingError();

    const key = getDoseTrackingKey(update);
    if (update.taken) takenDoses = { ...takenDoses, [key]: true };
    else {
      const remaining = { ...takenDoses };
      delete remaining[key];
      takenDoses = remaining;
    }
    return getDoseTakenState(update.prescriptionId);
  };

  const reserve = (doctorId: string, slotId: string, now: string): Booking => {
    const slot = slots.find((candidate) => candidate.id === slotId);
    if (slot === undefined || slot.doctorId !== doctorId || !slot.available) {
      throw new BookingConflictError();
    }

    const booking: Booking = {
      id: `booking-${slot.id}`,
      doctorId,
      slotId,
      status: 'confirmed',
      createdAt: now,
    };
    slots = slots.map((candidate) => candidate.id === slotId ? { ...candidate, available: false } : candidate);
    bookings = [...bookings, booking];
    return { ...booking };
  };

  return { getSlots, reserve, getDoseTakenState, setDoseTakenState, reset };
};
