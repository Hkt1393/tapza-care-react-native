import { StyleSheet } from 'react-native';

import { dimensions, spacing, typography } from '../../theme';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  headerTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  brandMark: {
    alignItems: 'center',
    borderRadius: dimensions.borderRadiusXs,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  brandMarkText: {
    fontSize: typography.h3,
    fontWeight: '700',
    lineHeight: 28,
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  appTitle: {
    fontSize: typography.titleSmall,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: typography.caption,
    marginTop: spacing.xxs,
  },
  festivalBadge: {
    alignSelf: 'flex-start',
    borderRadius: dimensions.borderRadiusPill,
    marginTop: spacing.xs,
    marginLeft: spacing.xl + 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  festivalBadgeLabel: {
    fontSize: typography.caption,
    fontWeight: '700',
  },
  themeSwitch: {
    alignItems: 'center',
    borderRadius: dimensions.borderRadiusPill,
    flexDirection: 'row',
    gap: spacing.xxs,
    minHeight: 48,
    padding: spacing.xxs,
  },
  themeOption: {
    alignItems: 'center',
    borderRadius: dimensions.borderRadiusPill,
    justifyContent: 'center',
    minHeight: dimensions.minimumTouchTarget,
    minWidth: 68,
    paddingHorizontal: spacing.xs,
  },
  themeOptionLabel: {
    fontSize: typography.caption,
    fontWeight: '700',
  },
  switchLoading: {
    marginHorizontal: spacing.xs,
  },
  sections: {
    flexGrow: 1,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  greetingRow: {
    marginHorizontal: spacing.md,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  greetingText: {
    fontSize: typography.h3,
    fontWeight: '700',
  },
  stateContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  skeletonPage: {
    alignSelf: 'stretch',
    flex: 1,
    gap: spacing.lg,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  skeletonHeader: {
    gap: spacing.sm,
  },
  skeletonSections: {
    gap: spacing.md,
  },
  skeletonCardRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  skeletonCard: {
    flex: 1,
    gap: spacing.sm,
  },
  skeletonTitle: {
    height: 26,
    width: '58%',
  },
  skeletonSubtitle: {
    height: 16,
    width: '76%',
  },
  skeletonThemeOption: {
    height: 44,
    width: 104,
  },
  skeletonHero: {
    height: 148,
    width: '100%',
  },
  skeletonSectionTitle: {
    height: 22,
    width: '48%',
  },
  skeletonImage: {
    height: 82,
    width: '100%',
  },
  skeletonLine: {
    height: 16,
    width: '88%',
  },
  errorContent: {
    alignItems: 'center',
    maxWidth: 360,
  },
  errorTitle: {
    fontSize: typography.h3,
    fontWeight: '700',
    textAlign: 'center',
  },
  stateMessage: {
    fontSize: typography.body,
    lineHeight: 24,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  retryButton: {
    alignItems: 'center',
    borderRadius: dimensions.borderRadius,
    justifyContent: 'center',
    marginTop: spacing.lg,
    minHeight: 48,
    minWidth: 140,
    paddingHorizontal: spacing.lg,
  },
  retryLabel: {
    fontSize: typography.body,
    fontWeight: '700',
  },
});

export default styles;
