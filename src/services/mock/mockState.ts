import type { Booking, Slot } from '../../types/domain';
import { BookingConflictError } from '../../types/domain';
import { slotFixtures } from './fixtures';

export const createMockState = () => {
  let slots: Slot[] = slotFixtures.map((slot) => ({ ...slot }));
  let bookings: Booking[] = [];

  const getSlots = (): Slot[] => slots.map((slot) => ({ ...slot }));
  const reset = (): void => {
    slots = slotFixtures.map((slot) => ({ ...slot }));
    bookings = [];
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

  return { getSlots, reserve, reset };
};
