import { StyleSheet } from 'react-native';

import { colors, dimensions, spacing, typography } from '../../theme';

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  backButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    minHeight: 44,
    paddingRight: spacing.sm,
  },
  backGlyph: {
    color: colors.primary,
    fontSize: typography.h2,
    marginRight: spacing.xs,
  },
  backLabel: {
    color: colors.primary,
    fontSize: typography.bodySmall,
    fontWeight: '600',
  },
  title: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  content: {
    gap: spacing.md,
    padding: spacing.lg,
    paddingTop: spacing.xs,
  },
  prescriptionInfo: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: dimensions.borderRadius,
    borderWidth: 1,
    padding: spacing.md,
  },
  doctor: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '700',
  },
  date: {
    color: colors.textMuted,
    fontSize: typography.bodySmall,
    marginTop: spacing.xs,
  },
  clinicLabel: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700',
    marginTop: spacing.md,
  },
  clinic: {
    color: colors.textMuted,
    fontSize: typography.bodySmall,
    lineHeight: 21,
    marginTop: spacing.xxs,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  medicineCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: dimensions.borderRadius,
    borderWidth: 1,
    padding: spacing.md,
  },
  medicineName: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '700',
  },
  medicineDetail: {
    color: colors.textMuted,
    fontSize: typography.bodySmall,
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  scheduleLabel: {
    color: colors.text,
    fontSize: typography.bodySmall,
    fontWeight: '700',
    marginTop: spacing.md,
  },
  doseRow: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    minHeight: 60,
    paddingTop: spacing.xs,
  },
  doseCopy: {
    flex: 1,
  },
  timing: {
    color: colors.text,
    fontSize: typography.bodySmall,
    fontWeight: '600',
  },
  doseStatus: {
    fontSize: typography.caption,
    fontWeight: '700',
    marginTop: spacing.xxs,
  },
  takenStatus: {
    color: colors.success,
  },
  notTakenStatus: {
    color: colors.textMuted,
  },
  doseButton: {
    alignItems: 'center',
    borderColor: colors.primary,
    borderRadius: dimensions.borderRadiusSmall,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 118,
    paddingHorizontal: spacing.sm,
  },
  doseButtonTaken: {
    backgroundColor: colors.primary,
  },
  doseButtonLabel: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: '700',
    textAlign: 'center',
  },
  doseButtonLabelTaken: {
    color: colors.white,
  },
  disabledButton: {
    opacity: 0.65,
  },
  updatedMessage: {
    color: colors.success,
    fontSize: typography.bodySmall,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorMessage: {
    color: colors.error,
    fontSize: typography.bodySmall,
    lineHeight: 21,
    textAlign: 'center',
  },
  stateContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  stateTitle: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: '700',
    textAlign: 'center',
  },
  stateMessage: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 24,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: dimensions.borderRadius,
    justifyContent: 'center',
    marginTop: spacing.lg,
    minHeight: dimensions.buttonHeight,
    minWidth: 140,
    paddingHorizontal: spacing.lg,
  },
  primaryButtonLabel: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: '700',
  },
});

export default styles;
