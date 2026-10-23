import { StyleSheet } from 'react-native';

import { colors, dimensions, spacing, typography } from '../../theme';

const styles = StyleSheet.create({
  button: {
    minHeight: dimensions.buttonHeight,
    borderRadius: dimensions.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontSize: typography.body,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryLabel: {
    color: colors.white,
  },
  secondaryLabel: {
    color: colors.text,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.9,
  },
});

export default styles;
