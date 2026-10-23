import type React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
                <Text style={[styles.appTitle, { color: theme.textPrimary }]}>{strings.home.title}</Text>
                <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>{strings.home.subtitle}</Text>
              </View>
              {config.theme.festival ? (
                <View style={[styles.festivalBadge, { backgroundColor: theme.accent }]}>
                  <Text style={[styles.festivalBadgeLabel, { color: theme.onAccent }]}>{config.theme.festival.name}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.themeSwitch} accessibilityLabel={strings.home.switchHint}>
              <Pressable
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
                <Text style={[
                  styles.themeOptionLabel,
                  { color: activeVariant === 'normal' ? theme.onPrimary : theme.textSecondary },
                ]}>
                  {strings.home.everydayTheme}
                </Text>
              </Pressable>
              <Pressable
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
                <Text style={[
                  styles.themeOptionLabel,
                  { color: activeVariant === 'diwali' ? theme.onPrimary : theme.textSecondary },
                ]}>
                  {strings.home.diwaliTheme}
                </Text>
              </Pressable>
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
                <Pressable
                  key={tab.id}
                  accessibilityRole="tab"
                  accessibilityLabel={tab.label}
                  accessibilityHint={enabled ? undefined : strings.home.comingSoonHint}
                  accessibilityState={{ selected, disabled: !enabled }}
                  disabled={!enabled}
                  onPress={() => onTabPress(tab.screen)}
                  style={styles.tabItem}
                >
                  <Text style={[styles.tabGlyph, { color: selected ? theme.primary : mutedText }]}>{getTabGlyph(tab.icon)}</Text>
                  <Text style={[styles.tabLabel, { color: selected ? theme.primary : mutedText }]}>{tab.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </>
      ) : (
        <View style={styles.stateContainer}>
          {isLoading ? (
            <>
              <ActivityIndicator color={primary} size="large" />
              <Text style={[styles.stateMessage, { color: mutedText }]}>{strings.home.loading}</Text>
            </>
          ) : hasLoadError ? (
            <View style={styles.errorContent} accessibilityRole="alert">
              <Text style={[styles.errorTitle, { color: baseText }]}>{strings.home.loadErrorTitle}</Text>
              <Text style={[styles.stateMessage, { color: mutedText }]}>{strings.home.loadErrorMessage}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={strings.home.retry}
                onPress={onRetry}
                style={[styles.retryButton, { backgroundColor: primary }]}
              >
                <Text style={[styles.retryLabel, { color: onPrimary }]}>{strings.home.retry}</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      )}
    </SafeAreaView>
  );
};

export default HomeScreenView;
