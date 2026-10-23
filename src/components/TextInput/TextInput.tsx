import type React from 'react';
import type { ComponentProps } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Text, TextInput as RNTextInput, View } from 'react-native';

import { colors } from '../../theme/colors';
import styles from './styles';

export interface TextInputProps extends ComponentProps<typeof RNTextInput> {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

const TextInput = ({
  label,
  containerStyle,
  inputStyle,
  ...props
}: TextInputProps): React.ReactElement => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <RNTextInput
        {...props}
        style={[styles.input, inputStyle]}
        placeholderTextColor={colors.textTertiary}
      />
    </View>
  );
};

export default TextInput;
