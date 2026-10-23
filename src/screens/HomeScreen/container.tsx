import type React from 'react';
import { useCallback, useEffect, useState } from 'react';

import { mockDataAccess } from '../../services/mock/mockDataAccess';
import type { LayoutConfig } from '../../types/domain';
import { resolveRuntimeTheme } from '../../theme/runtimeTheme';
import type { BookingTarget } from '../../features/booking/types';
import { getHomeSectionModel, type DoctorItem, type ServiceItem } from '../../features/home/sectionData';
import BookingScreen from '../BookingScreen';
import HomeScreenView from './view';

type ConfigVariant = 'normal' | 'diwali';

const getConfigVariant = (config: LayoutConfig): ConfigVariant =>
  config.theme.festival?.name === 'Diwali' ? 'diwali' : 'normal';

const HomeScreenContainer = (): React.ReactElement => {
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

  return (
    <>
      <HomeScreenView
        config={config}
        theme={config === null ? null : resolveRuntimeTheme(config)}
        activeVariant={activeVariant}
        isLoading={isLoading}
        hasLoadError={hasLoadError}
        onRetry={() => { void loadConfig(activeVariant); }}
        onVariantChange={handleVariantChange}
        onDoctorPress={handleDoctorPress}
        onServicePress={handleServicePress}
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
