import type React from 'react';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppPressable, AppText, SkeletonBlock } from '../../components';
import { strings } from '../../constants/strings';
import { colors } from '../../theme/colors';
import type { LayoutConfig } from '../../types/domain';
import type { RuntimeThemeTokens } from '../../theme/runtimeTheme';
import HomeSectionRenderer from '../../features/home/components/HomeSectionRenderer';
import type { DoctorItem, ServiceItem } from '../../features/home/sectionData';
import styles from './styles';
import { getReducedMotionPreference } from '../../utils/motionPreference';

type ConfigVariant = 'normal' | 'diwali';

interface HomeSectionEntranceProps {
  index: number;
  children: React.ReactNode;
}

const HomeSectionEntrance = ({ index, children }: HomeSectionEntranceProps): React.ReactElement => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;
    let animation: Animated.CompositeAnimation | undefined;
    void getReducedMotionPreference().then((reduceMotion) => {
      if (cancelled) return;
      if (reduceMotion) {
        progress.setValue(1);
        return;
      }
      animation = Animated.timing(progress, {
        toValue: 1,
        delay: Math.min(index * 38, 190),
        duration: 220,
        useNativeDriver: true,
      });
      animation.start();
    });
    return () => {
      cancelled = true;
      animation?.stop();
    };
  }, [index, progress]);

  return (
    <Animated.View
      style={{
        opacity: progress,
        transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
      }}
    >
      {children}
    </Animated.View>
  );
};

export interface HomeScreenViewProps {
  config: LayoutConfig | null;
  theme: RuntimeThemeTokens | null;
  featuredDoctor: DoctorItem | null;
  heroGreeting: string | null;
  activeVariant: ConfigVariant;
  isLoading: boolean;
  hasLoadError: boolean;
  onRetry: () => void;
  onVariantChange: (variant: ConfigVariant) => void;
  onDoctorPress: (doctor: DoctorItem) => void;
  onServicePress: (service: ServiceItem) => void;
  onCategoryPress: (categoryLabel: string) => void;
  onQuickActionPress: (actionId: string) => void;
}

const HomeScreenView = ({
  config,
  theme,
  featuredDoctor,
  heroGreeting,
  activeVariant,
  isLoading,
  hasLoadError,
  onRetry,
  onVariantChange,
  onDoctorPress,
  onServicePress,
  onCategoryPress,
  onQuickActionPress,
}: HomeScreenViewProps): React.ReactElement => {
  const backgroundColor = theme?.background;
  const baseBackground = backgroundColor ?? colors.background;
  const baseText = theme?.textPrimary ?? colors.text;
  const mutedText = theme?.textSecondary ?? colors.textMuted;
  const primary = theme?.primary ?? colors.primary;
  const onPrimary = theme?.onPrimary ?? colors.white;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: baseBackground }]} edges={['top']}>
      {config !== null && theme !== null ? (
        <>
          <View style={[styles.header, { backgroundColor: theme.surface }]}>
            <View style={styles.headerTitleRow}>
              <View style={[styles.brandMark, { backgroundColor: theme.primary }]} accessibilityElementsHidden>
                <AppText style={[styles.brandMarkText, { color: theme.onPrimary }]}>+</AppText>
              </View>
              <View style={styles.headerCopy}>
                <AppText style={[styles.appTitle, { color: theme.textPrimary }]}>{strings.home.title}</AppText>
                <AppText style={[styles.headerSubtitle, { color: theme.textSecondary }]}>{strings.home.subtitle}</AppText>
              </View>
              <View style={[styles.themeSwitch, { backgroundColor: theme.surfaceTint }]} accessibilityLabel={strings.home.switchHint}>
                <AppPressable
                  accessibilityRole="button"
                  accessibilityLabel={strings.home.everydayTheme}
                  accessibilityState={{ selected: activeVariant === 'normal', disabled: isLoading }}
                  disabled={isLoading}
                  onPress={() => onVariantChange('normal')}
                  style={[styles.themeOption, activeVariant === 'normal' && { backgroundColor: theme.primary }]}
                >
                  <AppText style={[styles.themeOptionLabel, { color: activeVariant === 'normal' ? theme.onPrimary : theme.textSecondary }]}>
                    {strings.home.everydayTheme}
                  </AppText>
                </AppPressable>
                <AppPressable
                  accessibilityRole="button"
                  accessibilityLabel={strings.home.diwaliTheme}
                  accessibilityState={{ selected: activeVariant === 'diwali', disabled: isLoading }}
                  disabled={isLoading}
                  onPress={() => onVariantChange('diwali')}
                  style={[styles.themeOption, activeVariant === 'diwali' && { backgroundColor: theme.primary }]}
                >
                  <AppText style={[styles.themeOptionLabel, { color: activeVariant === 'diwali' ? theme.onPrimary : theme.textSecondary }]}>
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
            {config.theme.festival ? (
              <View style={[styles.festivalBadge, { backgroundColor: theme.surfaceTint }]}>
                <AppText style={[styles.festivalBadgeLabel, { color: theme.primary }]}>{config.theme.festival.name}</AppText>
              </View>
            ) : null}
          </View>

          <ScrollView
            contentContainerStyle={styles.sections}
            showsVerticalScrollIndicator={false}
          >
            {heroGreeting !== null ? (
              <View style={styles.greetingRow}>
                <AppText style={[styles.greetingText, { color: theme.textPrimary }]}>{heroGreeting}</AppText>
              </View>
            ) : null}
            {config.sections.map((section, index) => (
              <HomeSectionEntrance key={section.id} index={index}>
                <HomeSectionRenderer
                  section={section}
                  theme={theme}
                  featuredDoctor={section.type === 'hero_banner' ? featuredDoctor ?? undefined : undefined}
                  onDoctorPress={onDoctorPress}
                  onServicePress={onServicePress}
                  onCategoryPress={onCategoryPress}
                  onQuickActionPress={onQuickActionPress}
                />
              </HomeSectionEntrance>
            ))}
          </ScrollView>

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
