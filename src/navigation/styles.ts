import { StyleSheet } from 'react-native';

import { spacing, typography } from '../theme';

const styles = StyleSheet.create({
  appRoot: {
    flex: 1,
  },
  tabBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    minHeight: 64,
  },
  tabItem: {
    minHeight: 64,
    paddingVertical: spacing.xs,
  },
  tabLabel: {
    fontSize: typography.caption,
    fontWeight: '600',
    marginTop: spacing.xxs,
  },
});

export default styles;
