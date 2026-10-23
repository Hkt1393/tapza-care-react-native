import { StyleSheet } from 'react-native';

import { spacing } from '../../theme';

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'flex-start',
  },
  activeIndicator: {
    borderRadius: 2,
    height: 4,
    marginTop: spacing.xxs,
    width: 4,
  },
});

export default styles;
