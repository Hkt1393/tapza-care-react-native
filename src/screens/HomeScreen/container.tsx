import type React from 'react';
import { useCallback, useEffect, useState } from 'react';

import { mockDataAccess } from '../../services/mock/mockDataAccess';
import type { LayoutConfig } from '../../types/domain';
import { resolveRuntimeTheme } from '../../theme/runtimeTheme';
import HomeScreenView from './view';

type ConfigVariant = 'normal' | 'diwali';

const getConfigVariant = (config: LayoutConfig): ConfigVariant =>
  config.theme.festival?.name === 'Diwali' ? 'diwali' : 'normal';

const HomeScreenContainer = (): React.ReactElement => {
  const [config, setConfig] = useState<LayoutConfig | null>(null);
  const [activeVariant, setActiveVariant] = useState<ConfigVariant>('normal');
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);

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

  return (
    <HomeScreenView
      config={config}
      theme={config === null ? null : resolveRuntimeTheme(config)}
      activeVariant={activeVariant}
      isLoading={isLoading}
      hasLoadError={hasLoadError}
      onRetry={() => { void loadConfig(activeVariant); }}
      onVariantChange={handleVariantChange}
    />
  );
};

export default HomeScreenContainer;
