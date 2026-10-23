import { StyleSheet } from 'react-native';

import { colors, dimensions, spacing, typography } from '../../../theme';

const styles = StyleSheet.create({
  section: {
    borderRadius: dimensions.borderRadius,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    position: 'relative',
  },
  heroSection: {
    minHeight: 216,
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFill,
  },
  imageFill: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 1,
  },
  imageTint: {
    ...StyleSheet.absoluteFill,
    opacity: 0.72,
  },
  sectionContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  heroContent: {
    justifyContent: 'center',
    minHeight: 184,
    paddingVertical: spacing.sm,
  },
  heroTitle: {
    fontSize: typography.h2,
    fontWeight: '700',
    maxWidth: 340,
  },
  heroSubtitle: {
    fontSize: typography.bodySmall,
    lineHeight: 21,
    marginTop: spacing.xs,
    maxWidth: 330,
  },
  heroAction: {
    alignItems: 'center',
    borderRadius: dimensions.borderRadiusSmall,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
    minHeight: dimensions.minimumTouchTarget,
    paddingHorizontal: spacing.md,
  },
  heroActionLabel: {
    fontSize: typography.bodySmall,
    fontWeight: '700',
  },
  heroActionArrow: {
    fontSize: typography.title,
    marginLeft: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.titleSmall,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  chipRow: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xxs,
  },
  categoryChip: {
    alignItems: 'center',
    borderColor: colors.pillBorder,
    borderRadius: dimensions.borderRadiusPill,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  categoryLabel: {
    fontSize: typography.bodySmall,
    fontWeight: '600',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  actionTile: {
    alignItems: 'flex-start',
    borderColor: colors.cardBorder,
    borderRadius: dimensions.borderRadius,
    borderWidth: StyleSheet.hairlineWidth,
    flexBasis: '48%',
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: 96,
    padding: spacing.sm,
  },
  actionIcon: {
    alignItems: 'center',
    borderRadius: dimensions.borderRadiusSmall,
    height: 40,
    justifyContent: 'center',
    marginBottom: spacing.xs,
    width: 40,
  },
  actionInitial: {
    fontSize: typography.title,
    fontWeight: '700',
  },
  actionLabel: {
    fontSize: typography.bodySmall,
    fontWeight: '600',
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  serviceCard: {
    borderColor: colors.cardBorder,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: dimensions.borderRadius,
    flexBasis: '48%',
    flexGrow: 1,
    minHeight: 240,
    overflow: 'hidden',
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  serviceImageContainer: {
    marginBottom: spacing.xs,
    position: 'relative',
  },
  serviceImage: {
    borderRadius: dimensions.borderRadiusSmall,
    height: 76,
    width: '100%',
  },
  serviceBadge: {
    left: spacing.xs,
    position: 'absolute',
    top: spacing.xs,
    borderRadius: dimensions.borderRadiusPill,
    fontSize: typography.caption,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
  },
  serviceName: {
    fontSize: typography.bodySmall,
    fontWeight: '600',
    lineHeight: 20,
  },
  serviceDescription: {
    fontSize: typography.caption,
    lineHeight: 16,
    marginTop: spacing.xxs,
  },
  servicePrice: {
    fontSize: typography.titleSmall,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  serviceBookButton: {
    alignItems: 'center',
    borderRadius: dimensions.borderRadiusSmall,
    justifyContent: 'center',
    marginTop: spacing.sm,
    minHeight: 40,
    paddingHorizontal: spacing.xs,
  },
  serviceBookLabel: {
    fontSize: typography.caption,
    fontWeight: '700',
    textAlign: 'center',
  },
  doctorRow: {
    gap: spacing.sm,
    paddingBottom: spacing.xxs,
  },
  doctorCard: {
    borderColor: colors.cardBorder,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: dimensions.borderRadius,
    minHeight: 180,
    padding: spacing.sm,
    width: 248,
  },
  doctorHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  doctorCopy: {
    flex: 1,
    minWidth: 0,
  },
  doctorImage: {
    borderRadius: 28,
    height: 56,
    width: 56,
  },
  doctorName: {
    fontSize: typography.bodySmall,
    fontWeight: '700',
  },
  doctorSpecialty: {
    fontSize: typography.caption,
    marginTop: spacing.xxs,
  },
  doctorAvailability: {
    alignSelf: 'flex-start',
    borderRadius: dimensions.borderRadiusPill,
    fontSize: typography.caption,
    fontWeight: '600',
    marginTop: spacing.sm,
    overflow: 'hidden',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  doctorFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  doctorFee: {
    fontSize: typography.titleSmall,
    fontWeight: '700',
  },
  doctorBookLabel: {
    fontSize: typography.caption,
    fontWeight: '700',
    textAlign: 'center',
  },
  doctorBookButton: {
    alignItems: 'center',
    borderRadius: dimensions.borderRadiusSmall,
    justifyContent: 'center',
    marginTop: spacing.xs,
    minHeight: dimensions.minimumTouchTarget,
    paddingHorizontal: spacing.sm,
  },
  offerContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 72,
    paddingVertical: spacing.xs,
  },
  offerMark: {
    alignItems: 'center',
    borderRadius: dimensions.borderRadiusSmall,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  offerMarkText: {
    fontSize: typography.title,
    fontWeight: '700',
  },
  offerCopy: {
    flex: 1,
  },
  offerText: {
    fontSize: typography.bodySmall,
    fontWeight: '700',
    lineHeight: 21,
  },
});

export default styles;
