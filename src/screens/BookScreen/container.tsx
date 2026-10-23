import type React from 'react';
import { useCallback, useEffect, useState } from 'react';

import { mockDataAccess } from '../../services/mock/mockDataAccess';
import type { Doctor, LayoutConfig } from '../../types/domain';
import { resolveRuntimeTheme } from '../../theme/runtimeTheme';
import type { RuntimeThemeTokens } from '../../theme/runtimeTheme';
import { useRuntimeThemeContext } from '../../theme/RuntimeThemeContext';
import type { BookScreenProps } from '../../navigation/types';
import type { BookingTarget } from '../../features/booking/types';
import BookingScreen from '../BookingScreen';
import BookScreenView from './view';

type LoadState = 'loading' | 'ready' | 'empty' | 'error';

const BookScreenContainer = (_props: BookScreenProps): React.ReactElement => {
  const { setActiveTheme, setActiveTabs } = useRuntimeThemeContext();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [theme, setTheme] = useState<RuntimeThemeTokens | null>(null);
  const [config, setConfig] = useState<LayoutConfig | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [target, setTarget] = useState<BookingTarget | null>(null);

  const load = useCallback(async (): Promise<void> => {
    setLoadState('loading');
    try {
      const [nextConfig, nextDoctors] = await Promise.all([
        mockDataAccess.fetchConfig(),
        mockDataAccess.fetchDoctors(),
      ]);
      const nextTheme = resolveRuntimeTheme(nextConfig);
      setConfig(nextConfig);
      setTheme(nextTheme);
      setActiveTheme(nextTheme);
      setActiveTabs(nextConfig.tabs);
      setDoctors(nextDoctors);
      setLoadState(nextDoctors.length > 0 ? 'ready' : 'empty');
    } catch {
      setLoadState('error');
    }
  }, [setActiveTabs, setActiveTheme]);

  useEffect(() => { void load(); }, [load]);

  return (
    <>
      <BookScreenView
        doctors={doctors}
        theme={theme}
        loadState={loadState}
        onRetry={() => { void load(); }}
        onChooseDoctor={(doctor) => setTarget({
          doctorId: doctor.id,
          providerName: doctor.name,
          specialty: doctor.specialty,
          feeInr: doctor.feeInr,
        })}
      />
      {target !== null && config !== null ? (
        <BookingScreen target={target} theme={resolveRuntimeTheme(config)} onClose={() => setTarget(null)} />
      ) : null}
    </>
  );
};

export default BookScreenContainer;
