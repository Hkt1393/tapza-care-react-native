import type React from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppPressable, AppText, SkeletonBlock } from '../../components';
import { strings } from '../../constants/strings';
import { colors } from '../../theme/colors';
import type { AppScreen, LayoutConfig } from '../../types/domain';
import type { RuntimeThemeTokens } from '../../theme/runtimeTheme';
import HomeSectionRenderer from '../../features/home/components/HomeSectionRenderer';
import type { DoctorItem, ServiceItem } from '../../features/home/sectionData';
import styles from './styles';

type ConfigVariant = 'normal' | 'diwali';

export interface HomeScreenViewProps {
  config: LayoutConfig | null;
  theme: RuntimeThemeTokens | null;
  activeVariant: ConfigVariant;
  isLoading: boolean;
  hasLoadError: boolean;
  onRetry: () => void;
  onVariantChange: (variant: ConfigVariant) => void;
  onDoctorPress: (doctor: DoctorItem) => void;
  onServicePress: (service: ServiceItem) => void;
  onTabPress: (screen: AppScreen) => void;
}

const getTabGlyph = (icon: string): string => {
  switch (icon) {
    case 'home': return '⌂';
    case 'calendar': return '▦';
    case 'clipboard': return '▤';
    case 'person': return '◉';
    default: return '•';
  }
};

const HomeScreenView = ({
  config,
  theme,
  activeVariant,
  isLoading,
  hasLoadError,
  onRetry,
  onVariantChange,
  onDoctorPress,
  onServicePress,
  onTabPress,
}: HomeScreenViewProps): React.ReactElement => {
  const backgroundColor = theme?.background;
  const baseBackground = backgroundColor ?? colors.background;
  const baseText = theme?.textPrimary ?? colors.text;
  const mutedText = theme?.textSecondary ?? colors.textMuted;
  const primary = theme?.primary ?? colors.primary;
  const onPrimary = theme?.onPrimary ?? colors.white;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: baseBackground }]} edges={['top', 'bottom']}>
      {config !== null && theme !== null ? (
        <>
          <View style={[styles.header, { backgroundColor: theme.surface }]}>
            <View style={styles.headerTitleRow}>
              <View style={styles.headerCopy}>
                <AppText style={[styles.appTitle, { color: theme.textPrimary }]}>{strings.home.title}</AppText>
                <AppText style={[styles.headerSubtitle, { color: theme.textSecondary }]}>{strings.home.subtitle}</AppText>
              </View>
              {config.theme.festival ? (
                <View style={[styles.festivalBadge, { backgroundColor: theme.accent }]}>
                  <AppText style={[styles.festivalBadgeLabel, { color: theme.onAccent }]}>{config.theme.festival.name}</AppText>
                </View>
              ) : null}
            </View>

            <View style={styles.themeSwitch} accessibilityLabel={strings.home.switchHint}>
              <AppPressable
                accessibilityRole="button"
                accessibilityLabel={strings.home.everydayTheme}
                accessibilityState={{ selected: activeVariant === 'normal', disabled: isLoading }}
                disabled={isLoading}
                onPress={() => onVariantChange('normal')}
                style={[
                  styles.themeOption,
                  activeVariant === 'normal' && { backgroundColor: theme.primary },
                ]}
              >
                <AppText style={[
                  styles.themeOptionLabel,
                  { color: activeVariant === 'normal' ? theme.onPrimary : theme.textSecondary },
                ]}>
                  {strings.home.everydayTheme}
                </AppText>
              </AppPressable>
              <AppPressable
                accessibilityRole="button"
                accessibilityLabel={strings.home.diwaliTheme}
                accessibilityState={{ selected: activeVariant === 'diwali', disabled: isLoading }}
                disabled={isLoading}
                onPress={() => onVariantChange('diwali')}
                style={[
                  styles.themeOption,
                  activeVariant === 'diwali' && { backgroundColor: theme.primary },
                ]}
              >
                <AppText style={[
                  styles.themeOptionLabel,
                  { color: activeVariant === 'diwali' ? theme.onPrimary : theme.textSecondary },
                ]}>
                  {strings.home.diwaliTheme}
                </AppText>
              </AppPressable>
              {isLoading ? (
                <ActivityIndicator
                  accessibilityLabel={strings.home.loadingTheme}
                  color={primary}
                  size="small"
                  style={styles.switchLoading}
                />
              ) : null}
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.sections}
            showsVerticalScrollIndicator={false}
          >
            {config.sections.map((section) => (
              <HomeSectionRenderer
                key={section.id}
                section={section}
                theme={theme}
                onDoctorPress={onDoctorPress}
                onServicePress={onServicePress}
              />
            ))}
          </ScrollView>

          <View style={[styles.tabBar, { backgroundColor: theme.surface, borderTopColor: theme.textSecondary }]}>
            {config.tabs.map((tab) => {
              const selected = tab.screen === 'home';
              const enabled = tab.screen === 'home' || tab.screen === 'prescriptions';
              return (
                <AppPressable
                  key={tab.id}
                  accessibilityRole="tab"
                  accessibilityLabel={tab.label}
                  accessibilityHint={enabled ? undefined : strings.home.comingSoonHint}
                  accessibilityState={{ selected, disabled: !enabled }}
                  disabled={!enabled}
                  onPress={() => onTabPress(tab.screen)}
                  style={styles.tabItem}
                >
                  <AppText style={[styles.tabGlyph, { color: selected ? theme.primary : mutedText }]}>{getTabGlyph(tab.icon)}</AppText>
                  <AppText style={[styles.tabLabel, { color: selected ? theme.primary : mutedText }]}>{tab.label}</AppText>
                </AppPressable>
              );
            })}
          </View>
        </>
      ) : (
        <View style={styles.stateContainer}>
          {isLoading ? (
            <View
              style={styles.skeletonPage}
              accessibilityRole="progressbar"
              accessibilityLabel={strings.common.loading}
            >
              <View style={styles.skeletonHeader}>
                <SkeletonBlock style={styles.skeletonTitle} />
                <SkeletonBlock style={styles.skeletonSubtitle} />
                <View style={styles.skeletonCardRow}>
                  <SkeletonBlock style={styles.skeletonThemeOption} />
                  <SkeletonBlock style={styles.skeletonThemeOption} />
                </View>
              </View>
              <SkeletonBlock style={styles.skeletonHero} />
              <View style={styles.skeletonSections}>
                <SkeletonBlock style={styles.skeletonSectionTitle} />
                <View style={styles.skeletonCardRow}>
                  {[0, 1].map((item) => (
                    <View key={item} style={styles.skeletonCard}>
                      <SkeletonBlock style={styles.skeletonImage} />
                      <SkeletonBlock style={styles.skeletonLine} />
                      <SkeletonBlock style={styles.skeletonSubtitle} />
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ) : hasLoadError ? (
            <View style={styles.errorContent} accessibilityRole="alert">
              <AppText style={[styles.errorTitle, { color: baseText }]}>{strings.home.loadErrorTitle}</AppText>
              <AppText style={[styles.stateMessage, { color: mutedText }]}>{strings.home.loadErrorMessage}</AppText>
              <AppPressable
                accessibilityRole="button"
                accessibilityLabel={strings.home.retry}
                onPress={onRetry}
                style={[styles.retryButton, { backgroundColor: primary }]}
              >
                <AppText style={[styles.retryLabel, { color: onPrimary }]}>{strings.home.retry}</AppText>
              </AppPressable>
            </View>
          ) : null}
        </View>
      )}
    </SafeAreaView>
  );
};

export default HomeScreenView;
