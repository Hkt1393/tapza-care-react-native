import { StyleSheet } from 'react-native';

import { colors, spacing, typography } from '../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  label: {
    color: colors.textMuted,
    fontSize: typography.bodySmall,
    textAlign: 'center',
  },
});

export default styles;
