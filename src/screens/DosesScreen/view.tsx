import type React from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppPressable, AppText, SkeletonBlock } from '../../components';
import { strings } from '../../constants/strings';
import { colors } from '../../theme/colors';
import type { RuntimeThemeTokens } from '../../theme/runtimeTheme';
import type { DoseReminderItem } from './container';
import styles from './styles';

type LoadState = 'loading' | 'ready' | 'empty' | 'error';
interface Props {
  items: DoseReminderItem[];
  theme: RuntimeThemeTokens | null;
  loadState: LoadState;
  updatingIds: ReadonlySet<string>;
  updated: boolean;
  updateError: string | null;
  onToggle: (item: DoseReminderItem) => void;
  onRetry: () => void;
}

const DosesScreenView = ({ items, theme, loadState, updatingIds, updated, updateError, onToggle, onRetry }: Props): React.ReactElement => (
  <SafeAreaView style={[styles.safeArea, { backgroundColor: theme?.background ?? colors.background }]} edges={['top']}>
    <View style={styles.header}>
      <AppText style={[styles.title, theme !== null && { color: theme.textPrimary }]}>{strings.doses.title}</AppText>
      <AppText style={[styles.subtitle, theme !== null && { color: theme.textSecondary }]}>{strings.doses.subtitle}</AppText>
    </View>
    {loadState === 'loading' ? (
      <View style={styles.list} accessibilityRole="progressbar" accessibilityLabel={strings.common.loading}>
        {[0, 1, 2].map((key) => <View key={key} style={[styles.card, { backgroundColor: theme?.surface ?? colors.surface }]}>
          <SkeletonBlock style={styles.skeletonName} /><SkeletonBlock style={styles.skeletonDetail} />
        </View>)}
      </View>
    ) : loadState === 'error' || loadState === 'empty' ? (
      <View style={styles.state} accessibilityRole="alert">
        <AppText style={[styles.stateTitle, theme !== null && { color: theme.textPrimary }]}>
          {loadState === 'empty' ? strings.doses.emptyTitle : strings.doses.loadError}
        </AppText>
        {loadState === 'empty' ? <AppText style={[styles.subtitle, theme !== null && { color: theme.textSecondary }]}>{strings.doses.emptyMessage}</AppText> : (
          <AppPressable accessibilityRole="button" accessibilityLabel={strings.doses.retry} onPress={onRetry} style={[styles.button, { backgroundColor: theme?.primary ?? colors.primary }]}>
            <AppText style={[styles.buttonLabel, { color: theme?.onPrimary ?? colors.white }]}>{strings.doses.retry}</AppText>
          </AppPressable>
        )}
      </View>
    ) : (
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListFooterComponent={<View>{updated ? <AppText accessibilityRole="alert" style={[styles.feedback, { color: theme?.successText ?? colors.successText }]}>{strings.doses.updated}</AppText> : null}{updateError ? <AppText accessibilityRole="alert" style={[styles.feedback, { color: theme?.error ?? colors.error }]}>{updateError}</AppText> : null}</View>}
        renderItem={({ item }) => {
          const busy = updatingIds.has(item.id);
          return (
            <View style={[styles.card, { backgroundColor: theme?.surface ?? colors.surface, borderColor: theme?.border ?? colors.border }]}>
              <View style={styles.copy}>
                <AppText style={[styles.medicine, { color: theme?.textPrimary ?? colors.text }]}>{item.medicineName}</AppText>
                <AppText style={[styles.detail, { color: theme?.textSecondary ?? colors.textMuted }]}>{`${item.dose} · ${item.timingLabel}`}</AppText>
                <AppText style={[styles.detail, { color: theme?.textSecondary ?? colors.textMuted }]}>{strings.doses.doctor(item.doctorName)}</AppText>
                <AppText style={[styles.status, { color: item.taken ? (theme?.successText ?? colors.successText) : (theme?.textSecondary ?? colors.textMuted) }]}>{item.taken ? strings.prescriptions.taken : strings.prescriptions.notTaken}</AppText>
              </View>
              <AppPressable accessibilityRole="checkbox" accessibilityLabel={item.accessibilityLabel} accessibilityHint={item.taken ? strings.prescriptions.undoTaken : strings.prescriptions.markTaken} accessibilityState={{ checked: item.taken, disabled: busy }} disabled={busy} onPress={() => onToggle(item)} style={[styles.button, { backgroundColor: item.taken ? (theme?.primary ?? colors.primary) : (theme?.surfaceTint ?? colors.surfaceMuted), borderColor: theme?.primary ?? colors.primary }]}>
                {busy ? <ActivityIndicator color={theme?.primary ?? colors.primary} /> : <AppText style={[styles.buttonLabel, { color: item.taken ? (theme?.onPrimary ?? colors.white) : (theme?.primary ?? colors.primary) }]}>{item.taken ? strings.prescriptions.undoTaken : strings.prescriptions.markTaken}</AppText>}
              </AppPressable>
            </View>
          );
        }}
      />
    )}
  </SafeAreaView>
);

export default DosesScreenView;
