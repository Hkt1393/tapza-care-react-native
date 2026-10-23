import { StyleSheet } from 'react-native';

import { colors, dimensions, spacing, typography } from '../../theme';

const styles = StyleSheet.create({
  scrim: {
    backgroundColor: colors.overlay,
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrimDismiss: {
    ...StyleSheet.absoluteFill,
  },
  sheet: {
    borderTopLeftRadius: dimensions.borderRadiusSheet,
    borderTopRightRadius: dimensions.borderRadiusSheet,
    maxHeight: '92%',
    minHeight: '58%',
    overflow: 'hidden',
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  dragRegion: {
    alignItems: 'center',
    minHeight: 32,
    justifyContent: 'center',
  },
  dragHandle: {
    borderRadius: dimensions.borderRadiusSmall,
    height: spacing.xs,
    opacity: 0.4,
    width: 44,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  contentScroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
  content: {
    flexGrow: 1,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: typography.h3,
    fontWeight: '700',
  },
  provider: {
    fontSize: typography.bodySmall,
    marginTop: spacing.xs,
  },
  service: {
    fontSize: typography.bodySmall,
    marginTop: spacing.xxs,
  },
  fee: {
    fontSize: typography.title,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  closeButton: {
    alignItems: 'center',
    height: dimensions.minimumTouchTarget,
    justifyContent: 'center',
    width: dimensions.minimumTouchTarget,
  },
  closeLabel: {
    fontSize: typography.h2,
    lineHeight: typography.h2,
  },
  sectionTitle: {
    fontSize: typography.title,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  dateList: {
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  dateSkeletonRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  dateSkeleton: {
    height: 44,
    width: 76,
  },
  dateButton: {
    alignItems: 'center',
    borderRadius: dimensions.borderRadiusSmall,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: dimensions.minimumTouchTarget,
    minWidth: 76,
    paddingHorizontal: spacing.sm,
  },
  dateLabel: {
    fontSize: typography.caption,
    fontWeight: '600',
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  slotSkeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  slotSkeleton: {
    height: 48,
    width: '30%',
  },
  slotButton: {
    alignItems: 'center',
    borderRadius: dimensions.borderRadiusSmall,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 48,
    minWidth: '30%',
    paddingHorizontal: spacing.md,
  },
  unavailableSlot: {
    opacity: 0.45,
  },
  slotLabel: {
    fontSize: typography.bodySmall,
    fontWeight: '600',
  },
  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 128,
    paddingHorizontal: spacing.md,
  },
  stateTitle: {
    fontSize: typography.title,
    fontWeight: '700',
    textAlign: 'center',
  },
  stateMessage: {
    fontSize: typography.bodySmall,
    lineHeight: 21,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  secondaryButton: {
    alignItems: 'center',
    borderRadius: dimensions.borderRadiusSmall,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: spacing.md,
    minHeight: dimensions.minimumTouchTarget,
    minWidth: 120,
    paddingHorizontal: spacing.md,
  },
  secondaryButtonText: {
    fontSize: typography.bodySmall,
    fontWeight: '700',
  },
  inlineError: {
    fontSize: typography.bodySmall,
    lineHeight: 21,
    marginTop: spacing.md,
  },
  primaryButton: {
    alignItems: 'center',
    borderRadius: dimensions.borderRadius,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.md,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
  },
  primaryButtonText: {
    fontSize: typography.body,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.7,
  },
  successState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  successMark: {
    alignItems: 'center',
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    marginBottom: spacing.lg,
    width: 80,
  },
  successCheck: {
    fontSize: typography.h1,
    fontWeight: '700',
  },
  successTitle: {
    fontSize: typography.h3,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default styles;
