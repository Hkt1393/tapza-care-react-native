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
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.bodySmall,
    marginTop: spacing.xs,
  },
  listContent: {
    gap: spacing.md,
    padding: spacing.lg,
    paddingTop: spacing.xs,
  },
  skeletonList: {
    flex: 1,
    gap: spacing.md,
    padding: spacing.lg,
    paddingTop: spacing.xs,
  },
  skeletonCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: dimensions.borderRadius,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  skeletonDoctor: {
    height: 22,
    width: '64%',
  },
  skeletonDate: {
    height: 16,
    width: '42%',
  },
  skeletonClinic: {
    height: 16,
    width: '82%',
  },
  skeletonFooter: {
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
  },
  skeletonFooterLine: {
    height: 16,
    width: '48%',
  },
  card: {
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
  clinic: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  cardFooter: {
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
  },
  medicineCount: {
    color: colors.text,
    fontSize: typography.bodySmall,
    fontWeight: '600',
  },
  progress: {
    color: colors.primary,
    fontSize: typography.caption,
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
