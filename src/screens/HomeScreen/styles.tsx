import { StyleSheet } from 'react-native';

import { dimensions, spacing, typography } from '../../theme';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  headerTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  headerCopy: {
    flex: 1,
  },
  appTitle: {
    fontSize: typography.h3,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: typography.caption,
    marginTop: spacing.xxs,
  },
  festivalBadge: {
    borderRadius: dimensions.borderRadiusSmall,
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  festivalBadgeLabel: {
    fontSize: typography.caption,
    fontWeight: '700',
  },
  themeSwitch: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: dimensions.borderRadius,
    flexDirection: 'row',
    gap: spacing.xxs,
    minHeight: 48,
    padding: spacing.xxs,
  },
  themeOption: {
    alignItems: 'center',
    borderRadius: dimensions.borderRadiusSmall,
    justifyContent: 'center',
    minHeight: 40,
    minWidth: 100,
    paddingHorizontal: spacing.md,
  },
  themeOptionLabel: {
    fontSize: typography.bodySmall,
    fontWeight: '700',
  },
  switchLoading: {
    marginHorizontal: spacing.xs,
  },
  sections: {
    flexGrow: 1,
    paddingBottom: spacing.lg,
  },
  tabBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    minHeight: 56,
    paddingHorizontal: spacing.xs,
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 56,
    paddingVertical: spacing.xs,
  },
  tabGlyph: {
    fontSize: typography.title,
    lineHeight: 22,
  },
  tabLabel: {
    fontSize: typography.caption,
    marginTop: spacing.xxs,
    textAlign: 'center',
  },
  stateContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
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
