import type React from 'react';
import { Text, View } from 'react-native';

import Button from '../Button';
import styles from './styles';

export interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

const EmptyState = ({ title, message, actionLabel, onActionPress }: EmptyStateProps): React.ReactElement => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onActionPress ? (
        <Button title={actionLabel} onPress={onActionPress} style={styles.button} />
      ) : null}
    </View>
  );
};

export default EmptyState;
