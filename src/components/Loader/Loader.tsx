import type React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { colors } from '../../theme';
import styles from './styles';

export interface LoaderProps {
  message?: string;
  size?: 'small' | 'large';
}

const Loader = ({ message = 'Loading...', size = 'large' }: LoaderProps): React.ReactElement => {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} size={size} />
      <Text style={styles.label}>{message}</Text>
    </View>
  );
};

export default Loader;
