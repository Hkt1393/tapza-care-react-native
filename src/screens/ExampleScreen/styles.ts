import { StyleSheet } from 'react-native';

import { colors, dimensions, shadows, spacing, typography } from '../../theme';

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  searchRow: {
    marginBottom: spacing.lg,
  },
  searchInput: {
    marginBottom: 0,
  },
  primaryCard: {
    backgroundColor: colors.surface,
    borderRadius: dimensions.borderRadius,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  cardTitle: {
    color: colors.textMuted,
    fontSize: typography.bodySmall,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  itemTitle: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  itemBody: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  metaText: {
    color: colors.primary,
    fontSize: typography.bodySmall,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  noSelection: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  itemCard: {
    backgroundColor: colors.surface,
    borderRadius: dimensions.borderRadius,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  itemCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  itemCardPressed: {
    opacity: 0.9,
  },
});

export default styles;
