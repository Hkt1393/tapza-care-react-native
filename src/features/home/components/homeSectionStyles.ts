import { StyleSheet } from 'react-native';

import { dimensions, spacing, typography } from '../../../theme';

const styles = StyleSheet.create({
  section: {
    overflow: 'hidden',
    position: 'relative',
  },
  heroSection: {
    minHeight: 226,
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  heroContent: {
    justifyContent: 'center',
    minHeight: 178,
    paddingVertical: spacing.md,
  },
  heroEyebrow: {
    fontSize: typography.bodySmall,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  heroTitle: {
    fontSize: typography.h1,
    fontWeight: '700',
    maxWidth: 340,
  },
  heroSubtitle: {
    fontSize: typography.body,
    lineHeight: 24,
    marginTop: spacing.sm,
    maxWidth: 330,
  },
  sectionTitle: {
    fontSize: typography.h3,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  chipRow: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 1,
  },
  categoryChip: {
    alignItems: 'center',
    borderRadius: dimensions.borderRadius,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: spacing.md,
  },
  categoryLabel: {
    fontSize: typography.bodySmall,
    fontWeight: '600',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actionTile: {
    alignItems: 'center',
    borderRadius: dimensions.borderRadius,
    flexBasis: '48%',
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: 112,
    padding: spacing.md,
  },
  actionIcon: {
    alignItems: 'center',
    borderRadius: dimensions.borderRadiusSmall,
    height: 44,
    justifyContent: 'center',
    marginBottom: spacing.sm,
    width: 44,
  },
  actionInitial: {
    fontSize: typography.title,
    fontWeight: '700',
  },
  actionLabel: {
    fontSize: typography.bodySmall,
    fontWeight: '600',
    textAlign: 'center',
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  serviceCard: {
    borderRadius: dimensions.borderRadius,
    flexBasis: '48%',
    flexGrow: 1,
    minHeight: 190,
    overflow: 'hidden',
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  serviceImage: {
    height: 82,
    marginBottom: spacing.sm,
    width: '100%',
  },
  serviceBadge: {
    alignSelf: 'flex-start',
    borderRadius: dimensions.borderRadiusSmall,
    fontSize: typography.caption,
    fontWeight: '700',
    marginBottom: spacing.sm,
    overflow: 'hidden',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
  },
  serviceName: {
    flexGrow: 1,
    fontSize: typography.body,
    fontWeight: '600',
    lineHeight: 22,
  },
  servicePrice: {
    fontSize: typography.title,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  doctorRow: {
    gap: spacing.md,
    paddingBottom: spacing.xxs,
  },
  doctorCard: {
    borderRadius: dimensions.borderRadius,
    minHeight: 224,
    padding: spacing.md,
    width: 220,
  },
  doctorImage: {
    alignSelf: 'center',
    borderRadius: 36,
    height: 72,
    marginBottom: spacing.sm,
    width: 72,
  },
  doctorName: {
    fontSize: typography.body,
    fontWeight: '700',
    textAlign: 'center',
  },
  doctorSpecialty: {
    fontSize: typography.bodySmall,
    marginTop: spacing.xxs,
    textAlign: 'center',
  },
  doctorAvailability: {
    fontSize: typography.caption,
    fontWeight: '600',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  doctorFee: {
    fontSize: typography.bodySmall,
    fontWeight: '700',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  offerContent: {
    justifyContent: 'center',
    minHeight: 52,
  },
  offerText: {
    fontSize: typography.bodySmall,
    fontWeight: '700',
    lineHeight: 22,
  },
});

export default styles;
