import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { mockDataAccess } from '../../services/mock/mockDataAccess';
import type { Doctor } from '../../types/domain';
import { resolveRuntimeTheme } from '../../theme/runtimeTheme';
import { useRuntimeThemeContext } from '../../theme/RuntimeThemeContext';
import type { BookScreenProps } from '../../navigation/types';
import type { BookingTarget } from '../../features/booking/types';
import BookingScreen from '../BookingScreen';
import BookScreenView from './view';

type LoadState = 'loading' | 'ready' | 'empty' | 'error';

const BookScreenContainer = (_props: BookScreenProps): React.ReactElement => {
  const { activeTheme, setActiveTheme, setActiveTabs } = useRuntimeThemeContext();
  const activeThemeRef = useRef(activeTheme);
  activeThemeRef.current = activeTheme;
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [target, setTarget] = useState<BookingTarget | null>(null);

  const load = useCallback(async (): Promise<void> => {
    setLoadState('loading');
    try {
      const initialConfigRequest = activeThemeRef.current === null
        ? mockDataAccess.fetchConfig()
        : Promise.resolve(null);
      const [nextConfig, nextDoctors] = await Promise.all([
        initialConfigRequest,
        mockDataAccess.fetchDoctors(),
      ]);
      if (nextConfig !== null && activeThemeRef.current === null) {
        const initialTheme = resolveRuntimeTheme(nextConfig);
        setActiveTheme(initialTheme);
        setActiveTabs(nextConfig.tabs);
      }
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
        theme={activeTheme}
        loadState={activeTheme === null ? 'loading' : loadState}
        onRetry={() => { void load(); }}
        onChooseDoctor={(doctor) => setTarget({
          doctorId: doctor.id,
          providerName: doctor.name,
          specialty: doctor.specialty,
          feeInr: doctor.feeInr,
        })}
      />
      {target !== null && activeTheme !== null ? (
        <BookingScreen target={target} theme={activeTheme} onClose={() => setTarget(null)} />
      ) : null}
    </>
  );
};

export default BookScreenContainer;
