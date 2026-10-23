import type React from 'react';
import { Text, View } from 'react-native';

import Button from '../Button';
import styles from './styles';

export interface ErrorViewProps {
  title?: string;
  message: string;
  tryAgainLabel?: string;
  onRetry?: () => void;
}

const ErrorView = ({
  title = 'Something went wrong',
  message,
  tryAgainLabel = 'Try again',
  onRetry,
}: ErrorViewProps): React.ReactElement => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? <Button title={tryAgainLabel} onPress={onRetry} style={styles.button} /> : null}
    </View>
  );
};

export default ErrorView;
