import type React from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { colors } from '../../theme';
import styles from './styles';

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Button = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  style,
  textStyle,
}: ButtonProps): React.ReactElement => {
  const isSecondary = variant === 'secondary';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isSecondary ? styles.secondaryButton : styles.primaryButton,
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={styles.contentRow}>
        {loading ? (
          <ActivityIndicator color={colors.white} size="small" />
        ) : null}
        <Text style={[styles.label, isSecondary ? styles.secondaryLabel : styles.primaryLabel, textStyle]}>
          {loading ? 'Loading...' : title}
        </Text>
      </View>
    </Pressable>
  );
};

export default Button;
