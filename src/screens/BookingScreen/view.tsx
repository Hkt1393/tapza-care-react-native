import type React from 'react';
import { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Modal,
  PanResponder,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppPressable, AppText, SkeletonBlock } from '../../components';
import { strings } from '../../constants/strings';
import { spacing } from '../../theme';
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
        <AppPressable accessibilityRole="button" accessibilityLabel={strings.booking.actions.close} onPress={onClose} style={styles.scrimDismiss} />
        <SafeAreaView style={[styles.sheet, { backgroundColor: resolvedTheme.surface }]} edges={['bottom']}>
          <View style={styles.dragRegion} {...panResponder.panHandlers} accessibilityHint={strings.booking.dragHint}>
            <View style={[styles.dragHandle, { backgroundColor: resolvedTheme.border }]} />
          </View>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <AppText style={[styles.title, { color: resolvedTheme.textPrimary }]}>{strings.booking.title}</AppText>
              <AppText style={[styles.provider, { color: resolvedTheme.textSecondary }]}>{target.providerName} · {target.specialty}</AppText>
              {target.serviceName ? <AppText style={[styles.service, { color: resolvedTheme.textSecondary }]}>{strings.booking.serviceLabel}: {target.serviceName}</AppText> : null}
              <AppText style={[styles.fee, { color: resolvedTheme.primary }]}>{target.serviceName ? strings.booking.servicePriceLabel : strings.booking.feeLabel}: ₹{target.feeInr.toLocaleString('en-IN')}</AppText>
            </View>
            <AppPressable
              accessibilityRole="button"
              accessibilityLabel={strings.booking.actions.close}
              onPress={onClose}
              hitSlop={spacing.xs}
              style={styles.closeButton}
            >
              <AppText style={[styles.closeLabel, { color: resolvedTheme.textPrimary }]}>×</AppText>
            </AppPressable>
          </View>

          <ScrollView style={styles.contentScroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {bookingState === 'success' ? (
            <View style={styles.successState} accessibilityRole="alert">
              <Animated.View style={[styles.successMark, { backgroundColor: resolvedTheme.success, transform: [{ scale: successScale }] }]}>
                <AppText style={[styles.successCheck, { color: resolvedTheme.onPrimary }]}>✓</AppText>
              </Animated.View>
              <AppText style={[styles.successTitle, { color: resolvedTheme.textPrimary }]}>{strings.booking.successTitle}</AppText>
              <AppText style={[styles.stateMessage, { color: resolvedTheme.textSecondary }]}>{strings.booking.successMessage}</AppText>
              <AppPressable accessibilityRole="button" accessibilityLabel={strings.booking.actions.close} onPress={onClose} style={[styles.primaryButton, { backgroundColor: resolvedTheme.primary }]}>
                <AppText style={[styles.primaryButtonText, { color: resolvedTheme.onPrimary }]}>{strings.common.done}</AppText>
              </AppPressable>
            </View>
          ) : (
            <>
              <AppText style={[styles.sectionTitle, { color: resolvedTheme.textPrimary }]}>{strings.booking.dateHeading}</AppText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateList} accessibilityLabel={strings.booking.actions.chooseDate}>
                {loadState === 'loading' && dates.length === 0 ? (
                  <View style={styles.dateSkeletonRow} accessibilityElementsHidden>
                    {[0, 1, 2, 3].map((item) => <SkeletonBlock key={item} style={styles.dateSkeleton} />)}
                  </View>
                ) : dates.map((date) => {
                  const selected = date.key === selectedDate;
                  return (
                    <AppPressable
                      key={date.key}
                      accessibilityRole="button"
                      accessibilityLabel={date.accessibilityLabel}
                      accessibilityState={{ selected }}
                      disabled={isSubmitting}
                      onPress={() => onDateSelect(date.key)}
                      style={[styles.dateButton, { borderColor: selected ? resolvedTheme.primary : resolvedTheme.border, backgroundColor: selected ? resolvedTheme.primary : resolvedTheme.surface }]}
                    >
                      <AppText style={[styles.dateLabel, { color: selected ? resolvedTheme.onPrimary : resolvedTheme.textPrimary }]}>{date.label}</AppText>
                    </AppPressable>
                  );
                })}
              </ScrollView>

              <AppText style={[styles.sectionTitle, { color: resolvedTheme.textPrimary }]}>{strings.booking.actions.chooseSlot}</AppText>
              {loadState === 'loading' ? (
                <View
                  style={styles.slotSkeletonGrid}
                  accessibilityRole="progressbar"
                  accessibilityLabel={strings.common.loading}
                >
                  {[0, 1, 2, 3, 4, 5].map((item) => (
                    <SkeletonBlock key={item} style={styles.slotSkeleton} />
                  ))}
                </View>
              ) : loadState === 'error' ? (
                <View style={styles.stateContainer} accessibilityRole="alert">
                  <AppText style={[styles.stateTitle, { color: resolvedTheme.textPrimary }]}>{strings.booking.loadErrorTitle}</AppText>
                  <AppText style={[styles.stateMessage, { color: resolvedTheme.textSecondary }]}>{strings.booking.loadErrorMessage}</AppText>
                  <AppPressable accessibilityRole="button" accessibilityLabel={strings.booking.actions.retry} onPress={onRetry} style={[styles.secondaryButton, { borderColor: resolvedTheme.primary }]}>
                    <AppText style={[styles.secondaryButtonText, { color: resolvedTheme.primary }]}>{strings.booking.actions.retry}</AppText>
                  </AppPressable>
                </View>
              ) : loadState === 'empty' ? (
                <View style={styles.stateContainer} accessibilityRole="alert">
                  <AppText style={[styles.stateTitle, { color: resolvedTheme.textPrimary }]}>{strings.booking.emptyTitle}</AppText>
                  <AppText style={[styles.stateMessage, { color: resolvedTheme.textSecondary }]}>{strings.booking.emptyMessage}</AppText>
                </View>
              ) : (
                <View style={styles.slotGrid}>
                  {slots.map((slot) => {
                    const selected = slot.id === selectedSlotId;
                    const time = formatSlotTime(slot.startsAt);
                    return (
                      <AppPressable
                        key={slot.id}
                        accessibilityRole="button"
                        accessibilityLabel={strings.booking.slotAccessibility(time, slot.available)}
                        accessibilityState={{ selected, disabled: !slot.available || isSubmitting }}
                        disabled={!slot.available || isSubmitting}
                        onPress={() => onSlotSelect(slot.id)}
                        style={[styles.slotButton, { borderColor: selected ? resolvedTheme.primary : resolvedTheme.border, backgroundColor: selected ? resolvedTheme.primary : resolvedTheme.surface }, !slot.available && styles.unavailableSlot]}
                      >
                        <AppText style={[styles.slotLabel, { color: selected ? resolvedTheme.onPrimary : resolvedTheme.textPrimary }]}>{time}</AppText>
                      </AppPressable>
                    );
                  })}
                </View>
              )}

              {bookingState === 'conflict' ? <AppText accessibilityRole="alert" style={[styles.inlineError, { color: resolvedTheme.error }]}>{strings.booking.conflict}</AppText> : null}
              {bookingState === 'error' ? <AppText accessibilityRole="alert" style={[styles.inlineError, { color: resolvedTheme.error }]}>{strings.booking.bookingError}</AppText> : null}
              {canConfirm ? (
                <AppPressable
                  accessibilityRole="button"
                  accessibilityLabel={strings.booking.actions.confirm}
                  accessibilityState={{ disabled: isSubmitting }}
                  disabled={isSubmitting}
                  onPress={onConfirm}
                  style={[styles.primaryButton, { backgroundColor: resolvedTheme.primary }, isSubmitting && styles.disabledButton]}
                >
                  {isSubmitting ? <ActivityIndicator color={resolvedTheme.onPrimary} /> : null}
                  <AppText style={[styles.primaryButtonText, { color: resolvedTheme.onPrimary }]}>{strings.booking.actions.confirm}</AppText>
                </AppPressable>
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
