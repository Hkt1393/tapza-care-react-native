import type React from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { strings } from '../../constants/strings';
import { colors } from '../../theme/colors';
import type { PrescriptionListItem } from '../../features/prescriptions/types';
import styles from './styles';

type LoadState = 'loading' | 'ready' | 'empty' | 'error';

interface PrescriptionsScreenViewProps {
  items: PrescriptionListItem[];
  loadState: LoadState;
  onOpen: (prescriptionId: string) => void;
  onRetry: () => void;
  onBack: () => void;
}

const PrescriptionsScreenView = ({ items, loadState, onOpen, onRetry, onBack }: PrescriptionsScreenViewProps): React.ReactElement => (
  <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
    <View style={styles.header}>
      <Pressable accessibilityRole="button" accessibilityLabel={strings.prescriptions.home} onPress={onBack} style={styles.backButton}>
        <Text style={styles.backGlyph}>‹</Text>
        <Text style={styles.backLabel}>{strings.prescriptions.home}</Text>
      </Pressable>
      <Text style={styles.title}>{strings.prescriptions.title}</Text>
      <Text style={styles.subtitle}>{strings.prescriptions.subtitle}</Text>
    </View>

    {loadState === 'loading' ? (
      <View style={styles.stateContainer} accessibilityRole="progressbar" accessibilityLabel={strings.common.loading}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    ) : loadState === 'error' ? (
      <View style={styles.stateContainer} accessibilityRole="alert">
        <Text style={styles.stateTitle}>{strings.prescriptions.loadErrorTitle}</Text>
        <Text style={styles.stateMessage}>{strings.prescriptions.loadErrorMessage}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={strings.prescriptions.retry} onPress={onRetry} style={styles.primaryButton}>
          <Text style={styles.primaryButtonLabel}>{strings.prescriptions.retry}</Text>
        </Pressable>
      </View>
    ) : loadState === 'empty' ? (
      <View style={styles.stateContainer} accessibilityRole="alert">
        <Text style={styles.stateTitle}>{strings.prescriptions.emptyTitle}</Text>
        <Text style={styles.stateMessage}>{strings.prescriptions.emptyMessage}</Text>
      </View>
    ) : (
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={item.accessibilityLabel}
            accessibilityHint={strings.prescriptions.medicinesHeading}
            onPress={() => onOpen(item.id)}
            style={styles.card}
          >
            <Text style={styles.doctor}>{strings.prescriptions.issuedBy(item.doctorName)}</Text>
            <Text style={styles.date}>{strings.prescriptions.issuedOn(item.issuedAtLabel)}</Text>
            <Text style={styles.clinic}>{item.clinicName}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.medicineCount}>{item.medicineCountLabel}</Text>
              <Text style={styles.progress}>{item.doseProgressLabel}</Text>
            </View>
          </Pressable>
        )}
      />
    )}
  </SafeAreaView>
);

export default PrescriptionsScreenView;
