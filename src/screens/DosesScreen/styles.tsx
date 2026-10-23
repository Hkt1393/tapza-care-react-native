import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { dimensions, shadows, spacing, typography } from '../../theme';

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1 },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  title: { color: colors.text, fontSize: typography.h2, fontWeight: '700' },
  subtitle: { color: colors.textMuted, fontSize: typography.bodySmall, marginTop: spacing.xs },
  list: { gap: spacing.md, padding: spacing.lg },
  card: { borderColor: colors.border, borderRadius: dimensions.borderRadius, borderWidth: 1, flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between', padding: spacing.md, ...shadows.sm },
  copy: { flex: 1, gap: spacing.xxs },
  medicine: { color: colors.text, fontSize: typography.body, fontWeight: '700' },
  detail: { color: colors.textMuted, fontSize: typography.caption },
  status: { fontSize: typography.caption, fontWeight: '600', marginTop: spacing.xs },
  button: { alignItems: 'center', alignSelf: 'center', borderColor: colors.primary, borderRadius: dimensions.borderRadius, borderWidth: 1, justifyContent: 'center', minHeight: dimensions.minimumTouchTarget, minWidth: 92, paddingHorizontal: spacing.sm },
  buttonLabel: { color: colors.primary, fontSize: typography.caption, fontWeight: '700', textAlign: 'center' },
  skeletonName: { height: 18, width: '60%' },
  skeletonDetail: { height: 14, width: '80%' },
  state: { alignItems: 'center', flex: 1, gap: spacing.md, justifyContent: 'center', padding: spacing.xl },
  stateTitle: { color: colors.text, fontSize: typography.title, fontWeight: '700', textAlign: 'center' },
  feedback: { fontSize: typography.bodySmall, fontWeight: '600', padding: spacing.sm },
});

export default styles;
