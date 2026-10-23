import { StyleSheet } from 'react-native';
import { dimensions, spacing, typography } from '../../theme';
import { colors } from '../../theme/colors';

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  title: { color: colors.text, fontSize: typography.h2, fontWeight: '700' },
  subtitle: { color: colors.textMuted, fontSize: typography.bodySmall, marginTop: spacing.xs },
  list: { gap: spacing.md, padding: spacing.lg },
  card: { alignItems: 'center', borderColor: colors.border, borderRadius: dimensions.borderRadius, borderWidth: 1, flexDirection: 'row', gap: spacing.md, padding: spacing.md },
  avatar: { borderRadius: 28, height: 56, width: 56 },
  avatarSkeleton: { borderRadius: 28, height: 56, width: 56 },
  copy: { flex: 1, gap: spacing.xxs },
  skeletonCopy: { flex: 1, gap: spacing.sm },
  name: { color: colors.text, fontSize: typography.body, fontWeight: '700' },
  detail: { color: colors.textMuted, fontSize: typography.caption },
  fee: { color: colors.primary, fontSize: typography.bodySmall, fontWeight: '700', marginTop: spacing.xs },
  nameSkeleton: { height: 18, width: '70%' },
  detailSkeleton: { height: 14, width: '50%' },
  button: { alignItems: 'center', borderRadius: dimensions.borderRadius, justifyContent: 'center', minHeight: dimensions.minimumTouchTarget, paddingHorizontal: spacing.md },
  buttonText: { color: colors.white, fontSize: typography.caption, fontWeight: '700' },
  state: { alignItems: 'center', flex: 1, gap: spacing.md, justifyContent: 'center', padding: spacing.xl },
  stateTitle: { color: colors.text, fontSize: typography.title, fontWeight: '700', textAlign: 'center' },
});

export default styles;
