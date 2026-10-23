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

const toDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getBookingDates = (): BookingDate[] => {
  const today = new Date();
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + index + 1);
    const label = date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
    return {
      key: toDateKey(date),
      label,
      accessibilityLabel: strings.booking.dateAccessibility(date.toLocaleDateString(undefined, { dateStyle: 'full' })),
    };
  });
};

const BookingScreenContainer = ({ target, theme, onClose }: BookingScreenProps): React.ReactElement => {
  const [dates] = useState(getBookingDates);
  const [selectedDate, setSelectedDate] = useState(() => dates[0]?.key ?? toDateKey(new Date()));
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

  useEffect(() => {
    void loadSlots(selectedDate);
    return () => { loadSequence.current += 1; };
  }, [loadSlots, selectedDate]);

  const handleDateSelect = (date: string): void => {
    if (!requestInFlight.current && date !== selectedDate) {
      setSelectedDate(date);
    }
  };

  const handleRetry = (): void => { void loadSlots(selectedDate); };

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
