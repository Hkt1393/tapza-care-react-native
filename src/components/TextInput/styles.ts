import { StyleSheet } from 'react-native';

import { colors, dimensions, spacing, typography } from '../../theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: spacing.xs,
    color: colors.text,
    fontSize: typography.bodySmall,
    fontWeight: '600',
  },
  input: {
    minHeight: dimensions.inputHeight,
    borderRadius: dimensions.borderRadiusSmall,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    fontSize: typography.body,
    color: colors.text,
  },
});

export default styles;
