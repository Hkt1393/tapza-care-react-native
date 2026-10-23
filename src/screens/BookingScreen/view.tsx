import type React from 'react';
import { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { strings } from '../../constants/strings';
import { colors, spacing } from '../../theme';
import type { Slot } from '../../types/domain';
import type { RuntimeThemeTokens } from '../../theme/runtimeTheme';
import type { BookingTarget } from '../../features/booking/types';
import styles from './styles';

type LoadState = 'loading' | 'ready' | 'empty' | 'error';
type BookingState = 'idle' | 'submitting' | 'success' | 'error' | 'conflict';

interface BookingDate {
  key: string;
  label: string;
  accessibilityLabel: string;
}

interface BookingScreenViewProps {
  target: BookingTarget;
  theme: RuntimeThemeTokens;
  dates: BookingDate[];
  selectedDate: string;
  slots: Slot[];
  selectedSlotId: string | null;
  loadState: LoadState;
  bookingState: BookingState;
  canConfirm: boolean;
  onDateSelect: (date: string) => void;
  onSlotSelect: (slotId: string) => void;
  onRetry: () => void;
  onConfirm: () => void;
  onClose: () => void;
}

const formatSlotTime = (value: string): string => new Date(value).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

const BookingScreenView = ({
  target,
  theme,
  dates,
  selectedDate,
  slots,
  selectedSlotId,
  loadState,
  bookingState,
  canConfirm,
  onDateSelect,
  onSlotSelect,
  onRetry,
  onConfirm,
  onClose,
}: BookingScreenViewProps): React.ReactElement => {
  const resolvedTheme = theme;
  const successScale = useRef(new Animated.Value(0.6)).current;
  const panResponder = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: (_event, gesture) => gesture.dy > 8 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
    onPanResponderRelease: (_event, gesture) => { if (gesture.dy > 64) onClose(); },
  })).current;

  useEffect(() => {
    if (bookingState === 'success') {
      Animated.spring(successScale, { toValue: 1, useNativeDriver: true, speed: 18, bounciness: 7 }).start();
    } else {
      successScale.setValue(0.6);
    }
  }, [bookingState, successScale]);

  const isSubmitting = bookingState === 'submitting';
  return (
    <Modal animationType="slide" transparent visible onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.scrim}>
        <Pressable accessibilityRole="button" accessibilityLabel={strings.booking.actions.close} onPress={onClose} style={styles.scrimDismiss} />
        <SafeAreaView style={[styles.sheet, { backgroundColor: resolvedTheme.surface }]} edges={['bottom']}>
          <View style={styles.dragRegion} {...panResponder.panHandlers} accessibilityHint={strings.booking.dragHint}>
            <View style={[styles.dragHandle, { backgroundColor: resolvedTheme.textSecondary }]} />
          </View>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={[styles.title, { color: resolvedTheme.textPrimary }]}>{strings.booking.title}</Text>
              <Text style={[styles.provider, { color: resolvedTheme.textSecondary }]}>{target.providerName} · {target.specialty}</Text>
              {target.serviceName ? <Text style={[styles.service, { color: resolvedTheme.textSecondary }]}>{strings.booking.serviceLabel}: {target.serviceName}</Text> : null}
              <Text style={[styles.fee, { color: resolvedTheme.primary }]}>{target.serviceName ? strings.booking.servicePriceLabel : strings.booking.feeLabel}: ₹{target.feeInr.toLocaleString('en-IN')}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={strings.booking.actions.close}
              onPress={onClose}
              hitSlop={spacing.xs}
              style={styles.closeButton}
            >
              <Text style={[styles.closeLabel, { color: resolvedTheme.textPrimary }]}>×</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.contentScroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {bookingState === 'success' ? (
            <View style={styles.successState} accessibilityRole="alert">
              <Animated.View style={[styles.successMark, { backgroundColor: resolvedTheme.primary, transform: [{ scale: successScale }] }]}>
                <Text style={[styles.successCheck, { color: resolvedTheme.onPrimary }]}>✓</Text>
              </Animated.View>
              <Text style={[styles.successTitle, { color: resolvedTheme.textPrimary }]}>{strings.booking.successTitle}</Text>
              <Text style={[styles.stateMessage, { color: resolvedTheme.textSecondary }]}>{strings.booking.successMessage}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel={strings.booking.actions.close} onPress={onClose} style={[styles.primaryButton, { backgroundColor: resolvedTheme.primary }]}>
                <Text style={[styles.primaryButtonText, { color: resolvedTheme.onPrimary }]}>{strings.common.done}</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <Text style={[styles.sectionTitle, { color: resolvedTheme.textPrimary }]}>{strings.booking.dateHeading}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateList} accessibilityLabel={strings.booking.actions.chooseDate}>
                {dates.map((date) => {
                  const selected = date.key === selectedDate;
                  return (
                    <Pressable
                      key={date.key}
                      accessibilityRole="button"
                      accessibilityLabel={date.accessibilityLabel}
                      accessibilityState={{ selected }}
                      disabled={isSubmitting}
                      onPress={() => onDateSelect(date.key)}
                      style={[styles.dateButton, { borderColor: selected ? resolvedTheme.primary : colors.border, backgroundColor: selected ? resolvedTheme.primary : resolvedTheme.surface }]}
                    >
                      <Text style={[styles.dateLabel, { color: selected ? resolvedTheme.onPrimary : resolvedTheme.textPrimary }]}>{date.label}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <Text style={[styles.sectionTitle, { color: resolvedTheme.textPrimary }]}>{strings.booking.actions.chooseSlot}</Text>
              {loadState === 'loading' ? (
                <View style={styles.stateContainer} accessibilityRole="progressbar">
                  <ActivityIndicator color={resolvedTheme.primary} />
                  <Text style={[styles.stateMessage, { color: resolvedTheme.textSecondary }]}>{strings.booking.loadingSlots}</Text>
                </View>
              ) : loadState === 'error' ? (
                <View style={styles.stateContainer} accessibilityRole="alert">
                  <Text style={[styles.stateTitle, { color: resolvedTheme.textPrimary }]}>{strings.booking.loadErrorTitle}</Text>
                  <Text style={[styles.stateMessage, { color: resolvedTheme.textSecondary }]}>{strings.booking.loadErrorMessage}</Text>
                  <Pressable accessibilityRole="button" accessibilityLabel={strings.booking.actions.retry} onPress={onRetry} style={[styles.secondaryButton, { borderColor: resolvedTheme.primary }]}>
                    <Text style={[styles.secondaryButtonText, { color: resolvedTheme.primary }]}>{strings.booking.actions.retry}</Text>
                  </Pressable>
                </View>
              ) : loadState === 'empty' ? (
                <View style={styles.stateContainer} accessibilityRole="alert">
                  <Text style={[styles.stateTitle, { color: resolvedTheme.textPrimary }]}>{strings.booking.emptyTitle}</Text>
                  <Text style={[styles.stateMessage, { color: resolvedTheme.textSecondary }]}>{strings.booking.emptyMessage}</Text>
                </View>
              ) : (
                <View style={styles.slotGrid}>
                  {slots.map((slot) => {
                    const selected = slot.id === selectedSlotId;
                    const time = formatSlotTime(slot.startsAt);
                    return (
                      <Pressable
                        key={slot.id}
                        accessibilityRole="button"
                        accessibilityLabel={strings.booking.slotAccessibility(time, slot.available)}
                        accessibilityState={{ selected, disabled: !slot.available || isSubmitting }}
                        disabled={!slot.available || isSubmitting}
                        onPress={() => onSlotSelect(slot.id)}
                        style={[styles.slotButton, { borderColor: selected ? resolvedTheme.primary : colors.border, backgroundColor: selected ? resolvedTheme.primary : resolvedTheme.surface }, !slot.available && styles.unavailableSlot]}
                      >
                        <Text style={[styles.slotLabel, { color: selected ? resolvedTheme.onPrimary : resolvedTheme.textPrimary }]}>{time}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}

              {bookingState === 'conflict' ? <Text accessibilityRole="alert" style={[styles.inlineError, { color: colors.error }]}>{strings.booking.conflict}</Text> : null}
              {bookingState === 'error' ? <Text accessibilityRole="alert" style={[styles.inlineError, { color: colors.error }]}>{strings.booking.bookingError}</Text> : null}
              {canConfirm ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={strings.booking.actions.confirm}
                  accessibilityState={{ disabled: isSubmitting }}
                  disabled={isSubmitting}
                  onPress={onConfirm}
                  style={[styles.primaryButton, { backgroundColor: resolvedTheme.primary }, isSubmitting && styles.disabledButton]}
                >
                  {isSubmitting ? <ActivityIndicator color={resolvedTheme.onPrimary} /> : null}
                  <Text style={[styles.primaryButtonText, { color: resolvedTheme.onPrimary }]}>{strings.booking.actions.confirm}</Text>
                </Pressable>
              ) : null}
            </>
          )}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default BookingScreenView;
