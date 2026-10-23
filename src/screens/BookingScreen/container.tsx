import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { strings } from '../../constants/strings';
import { BookingConflictError, type Slot } from '../../types/domain';
import { mockDataAccess } from '../../services/mock/mockDataAccess';
import type { RuntimeThemeTokens } from '../../theme/runtimeTheme';
import type { BookingTarget } from '../../features/booking/types';
import BookingScreenView from './view';

type LoadState = 'loading' | 'ready' | 'empty' | 'error';
type BookingState = 'idle' | 'submitting' | 'success' | 'error' | 'conflict';

interface BookingDate {
  key: string;
  label: string;
  accessibilityLabel: string;
}

interface BookingScreenProps {
  target: BookingTarget;
  theme: RuntimeThemeTokens;
  onClose: () => void;
}

const toBookingDate = (key: string): BookingDate => {
  const date = new Date(`${key}T12:00:00+05:30`);
  return {
    key,
    label: date.toLocaleDateString(undefined, {
      weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata',
    }),
    accessibilityLabel: strings.booking.dateAccessibility(date.toLocaleDateString(undefined, {
      dateStyle: 'full', timeZone: 'Asia/Kolkata',
    })),
  };
};

const BookingScreenContainer = ({ target, theme, onClose }: BookingScreenProps): React.ReactElement => {
  const [dates, setDates] = useState<BookingDate[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [bookingState, setBookingState] = useState<BookingState>('idle');
  const requestInFlight = useRef(false);
  const loadSequence = useRef(0);

  const loadSlots = useCallback(async (date: string): Promise<void> => {
    const sequence = ++loadSequence.current;
    setLoadState('loading');
    setBookingState('idle');
    setSelectedSlotId(null);
    try {
      const result = await mockDataAccess.fetchSlots(target.doctorId, date);
      if (sequence !== loadSequence.current) return;
      setSlots(result);
      setLoadState(result.some((slot) => slot.available) ? 'ready' : 'empty');
    } catch {
      if (sequence !== loadSequence.current) return;
      setLoadState('error');
    }
  }, [target.doctorId]);

  const loadAvailableDates = useCallback(async (): Promise<void> => {
    const sequence = ++loadSequence.current;
    setLoadState('loading');
    setBookingState('idle');
    setSelectedSlotId(null);
    try {
      const availableDateKeys = await mockDataAccess.fetchAvailableDates(target.doctorId);
      if (sequence !== loadSequence.current) return;

      const nextDates = availableDateKeys.map(toBookingDate);
      setDates(nextDates);
      const firstDate = nextDates[0]?.key;
      if (firstDate === undefined) {
        setSelectedDate('');
        setSlots([]);
        setLoadState('empty');
        return;
      }

      setSelectedDate(firstDate);
      await loadSlots(firstDate);
    } catch {
      if (sequence !== loadSequence.current) return;
      setDates([]);
      setSelectedDate('');
      setSlots([]);
      setLoadState('error');
    }
  }, [loadSlots, target.doctorId]);

  useEffect(() => {
    void loadAvailableDates();
    return () => { loadSequence.current += 1; };
  }, [loadAvailableDates]);

  const handleDateSelect = (date: string): void => {
    if (!requestInFlight.current && date !== selectedDate) {
      setSelectedDate(date);
      void loadSlots(date);
    }
  };

  const handleRetry = (): void => { void loadAvailableDates(); };

  const handleConfirm = async (): Promise<void> => {
    if (requestInFlight.current || selectedSlotId === null) return;
    const chosenSlot = slots.find((slot) => slot.id === selectedSlotId && slot.available);
    if (chosenSlot === undefined) {
      setBookingState('conflict');
      setSelectedSlotId(null);
      return;
    }

    requestInFlight.current = true;
    setBookingState('submitting');
    setSlots((current) => current.map((slot) => slot.id === chosenSlot.id ? { ...slot, available: false } : slot));

    try {
      await mockDataAccess.createBooking({ doctorId: target.doctorId, slotId: chosenSlot.id });
      setBookingState('success');
      try {
        const confirmedSlots = await mockDataAccess.fetchSlots(target.doctorId, selectedDate);
        setSlots(confirmedSlots);
      } catch {
        // The successful booking response is authoritative; optimistic availability remains reconciled.
      }
    } catch (error) {
      try {
        const currentSlots = await mockDataAccess.fetchSlots(target.doctorId, selectedDate);
        setSlots(currentSlots);
      } catch {
        if (error instanceof BookingConflictError) {
          setSlots((current) => current.map((slot) => slot.id === chosenSlot.id ? { ...slot, available: false } : slot));
        } else {
          setSlots((current) => current.map((slot) => slot.id === chosenSlot.id ? { ...slot, available: true } : slot));
        }
      }
      setSelectedSlotId(null);
      setBookingState(error instanceof BookingConflictError ? 'conflict' : 'error');
    } finally {
      requestInFlight.current = false;
    }
  };

  const canConfirm = loadState === 'ready'
    && selectedSlotId !== null
    && (bookingState === 'submitting' || slots.some((slot) => slot.id === selectedSlotId && slot.available));

  return (
    <BookingScreenView
      target={target}
      theme={theme}
      dates={dates}
      selectedDate={selectedDate}
      slots={slots}
      selectedSlotId={selectedSlotId}
      loadState={loadState}
      bookingState={bookingState}
      canConfirm={canConfirm}
      onDateSelect={handleDateSelect}
      onSlotSelect={setSelectedSlotId}
      onRetry={handleRetry}
      onConfirm={() => { void handleConfirm(); }}
      onClose={onClose}
    />
  );
};

export default BookingScreenContainer;
