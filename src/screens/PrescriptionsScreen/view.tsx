import type React from 'react';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppPressable, AppText, SkeletonBlock } from '../../components';
import { strings } from '../../constants/strings';
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
      <AppPressable accessibilityRole="button" accessibilityLabel={strings.prescriptions.home} onPress={onBack} style={styles.backButton}>
        <AppText style={styles.backGlyph}>‹</AppText>
        <AppText style={styles.backLabel}>{strings.prescriptions.home}</AppText>
      </AppPressable>
      <AppText style={styles.title}>{strings.prescriptions.title}</AppText>
      <AppText style={styles.subtitle}>{strings.prescriptions.subtitle}</AppText>
    </View>

    {loadState === 'loading' ? (
      <View style={styles.skeletonList} accessibilityRole="progressbar" accessibilityLabel={strings.common.loading}>
        {[0, 1, 2].map((item) => (
          <View key={item} style={styles.skeletonCard}>
            <SkeletonBlock style={styles.skeletonDoctor} />
            <SkeletonBlock style={styles.skeletonDate} />
            <SkeletonBlock style={styles.skeletonClinic} />
            <View style={styles.skeletonFooter}>
              <SkeletonBlock style={styles.skeletonFooterLine} />
              <SkeletonBlock style={styles.skeletonDate} />
            </View>
          </View>
        ))}
      </View>
    ) : loadState === 'error' ? (
      <View style={styles.stateContainer} accessibilityRole="alert">
        <AppText style={styles.stateTitle}>{strings.prescriptions.loadErrorTitle}</AppText>
        <AppText style={styles.stateMessage}>{strings.prescriptions.loadErrorMessage}</AppText>
        <AppPressable accessibilityRole="button" accessibilityLabel={strings.prescriptions.retry} onPress={onRetry} style={styles.primaryButton}>
          <AppText style={styles.primaryButtonLabel}>{strings.prescriptions.retry}</AppText>
        </AppPressable>
      </View>
    ) : loadState === 'empty' ? (
      <View style={styles.stateContainer} accessibilityRole="alert">
        <AppText style={styles.stateTitle}>{strings.prescriptions.emptyTitle}</AppText>
        <AppText style={styles.stateMessage}>{strings.prescriptions.emptyMessage}</AppText>
      </View>
    ) : (
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <AppPressable
            accessibilityRole="button"
            accessibilityLabel={item.accessibilityLabel}
            accessibilityHint={strings.prescriptions.medicinesHeading}
            onPress={() => onOpen(item.id)}
            style={styles.card}
          >
            <AppText style={styles.doctor}>{strings.prescriptions.issuedBy(item.doctorName)}</AppText>
            <AppText style={styles.date}>{strings.prescriptions.issuedOn(item.issuedAtLabel)}</AppText>
            <AppText style={styles.clinic}>{item.clinicName}</AppText>
            <View style={styles.cardFooter}>
              <AppText style={styles.medicineCount}>{item.medicineCountLabel}</AppText>
              <AppText style={styles.progress}>{item.doseProgressLabel}</AppText>
            </View>
          </AppPressable>
        )}
      />
    )}
  </SafeAreaView>
);

export default PrescriptionsScreenView;
