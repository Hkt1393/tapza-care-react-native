import type { LayoutConfig, MockStorage } from '../../types/domain';
import { validateLayoutConfig } from './validateConfig';

export const LAST_VALID_CONFIG_KEY = 'tapza-care:last-valid-layout-config';

export const readCachedConfig = async (storage: MockStorage): Promise<LayoutConfig | null> => {
  try {
    const cachedValue = await storage.get<unknown>(LAST_VALID_CONFIG_KEY);
    if (cachedValue === null) return null;
    return validateLayoutConfig(cachedValue);
  } catch {
    return null;
  }
};

export const saveValidatedConfig = async (
  storage: MockStorage,
  payload: unknown,
): Promise<LayoutConfig> => {
  const config = validateLayoutConfig(payload);
  await storage.set(LAST_VALID_CONFIG_KEY, config);
  return config;
};
