import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { strings } from '../../constants/strings';
import { mockDataAccess } from '../../services/mock/mockDataAccess';
import type { LayoutConfig } from '../../types/domain';
import { resolveRuntimeTheme } from '../../theme/runtimeTheme';
import { useRuntimeThemeContext } from '../../theme/RuntimeThemeContext';
import type { BookingTarget } from '../../features/booking/types';
import { getHomeSectionModel, type DoctorItem, type ServiceItem } from '../../features/home/sectionData';
import type { HomeScreenProps } from '../../navigation/types';
import BookingScreen from '../BookingScreen';
import HomeScreenView from './view';

type ConfigVariant = 'normal' | 'diwali';
type Props = HomeScreenProps;

const getConfigVariant = (config: LayoutConfig): ConfigVariant =>
  config.theme.festival?.name === 'Diwali' ? 'diwali' : 'normal';

const getFeaturedDoctor = (config: LayoutConfig | null): DoctorItem | null => {
  if (config === null) return null;
  for (const section of config.sections) {
    const model = getHomeSectionModel(section);
    if (model?.type === 'doctor_carousel' && model.items.length > 0) return model.items[0];
  }
  return null;
};

const getHeroGreeting = (config: LayoutConfig | null): string | null => {
  if (config === null) return null;
  for (const section of config.sections) {
    const model = getHomeSectionModel(section);
    if (model?.type === 'hero_banner' && model.items[0]?.greeting !== undefined) return model.items[0].greeting;
  }
  return config.theme.festival?.greeting ?? null;
};

const HomeScreenContainer = ({ navigation }: Props): React.ReactElement => {
  const { setActiveTheme, setActiveTabs } = useRuntimeThemeContext();
  const [config, setConfig] = useState<LayoutConfig | null>(null);
  const [activeVariant, setActiveVariant] = useState<ConfigVariant>('normal');
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [bookingTarget, setBookingTarget] = useState<BookingTarget | null>(null);

  const loadConfig = useCallback(async (variant: ConfigVariant): Promise<void> => {
    setIsLoading(true);
    setHasLoadError(false);
    mockDataAccess.selectConfig(variant);

    try {
      const nextConfig = await mockDataAccess.fetchConfig();
      setConfig(nextConfig);
      setActiveVariant(getConfigVariant(nextConfig));
      setActiveTheme(resolveRuntimeTheme(nextConfig));
      setActiveTabs(nextConfig.tabs);
    } catch {
      setHasLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadConfig('normal');
  }, [loadConfig]);

  const handleVariantChange = (variant: ConfigVariant): void => {
    if (!isLoading && variant !== activeVariant) void loadConfig(variant);
  };

  const handleDoctorPress = (doctor: DoctorItem): void => {
    setBookingTarget({
      doctorId: doctor.id,
      providerName: doctor.name,
      specialty: doctor.specialty,
      feeInr: doctor.feeInr,
    });
  };

  const handleServicePress = (service: ServiceItem): void => {
    if (service.doctorId === undefined) return;
    const doctors = config?.sections.flatMap((section) => {
      const model = getHomeSectionModel(section);
      return model?.type === 'doctor_carousel' ? model.items : [];
    }) ?? [];
    const doctor = doctors.find((item) => item.id === service.doctorId);
    if (doctor === undefined) return;
    setBookingTarget({
      doctorId: service.doctorId,
      providerName: doctor.name,
      specialty: doctor.specialty,
      feeInr: doctor.feeInr,
      serviceName: service.name,
    });
  };

  const handleQuickActionPress = (actionId: string): void => {
    if (actionId === 'family') {
      Alert.alert(
        strings.home.familyComingSoon.title,
        strings.home.familyComingSoon.message,
        [{ text: strings.home.familyComingSoon.action }],
      );
      return;
    }
    if (actionId === 'prescriptions') {
      navigation.navigate('Prescriptions', { screen: 'PrescriptionList' });
      return;
    }
    if (actionId === 'reminders') {
      navigation.navigate('Doses', { screen: 'DoseTracker' });
      return;
    }
    if (actionId === 'book') {
      const doctor = getFeaturedDoctor(config);
      if (doctor !== null) handleDoctorPress(doctor);
    }
  };

  const handleCategoryPress = (categoryLabel: string): void => {
    Alert.alert(
      strings.home.categoryComingSoon.title(categoryLabel),
      strings.home.categoryComingSoon.message,
      [{ text: strings.home.categoryComingSoon.action }],
    );
  };

  return (
    <>
      <HomeScreenView
        config={config}
        theme={config === null ? null : resolveRuntimeTheme(config)}
        featuredDoctor={getFeaturedDoctor(config)}
        heroGreeting={getHeroGreeting(config)}
        activeVariant={activeVariant}
        isLoading={isLoading}
        hasLoadError={hasLoadError}
        onRetry={() => { void loadConfig(activeVariant); }}
        onVariantChange={handleVariantChange}
        onDoctorPress={handleDoctorPress}
        onServicePress={handleServicePress}
        onCategoryPress={handleCategoryPress}
        onQuickActionPress={handleQuickActionPress}
      />
      {bookingTarget !== null && config !== null ? (
        <BookingScreen
          target={bookingTarget}
          theme={resolveRuntimeTheme(config)}
          onClose={() => setBookingTarget(null)}
        />
      ) : null}
    </>
  );
};

export default HomeScreenContainer;
