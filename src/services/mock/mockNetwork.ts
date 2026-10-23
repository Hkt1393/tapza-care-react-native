import type { MockNetworkSettings, MockOperation } from '../../types/domain';
import { MockRequestError } from '../../types/domain';

const defaultSettings: MockNetworkSettings = { latencyMs: 0, failures: {}, emptyLists: {} };

export const createMockNetwork = () => {
  let settings: MockNetworkSettings = { ...defaultSettings };

  const configure = (next: Partial<MockNetworkSettings>): void => {
    settings = {
      latencyMs: next.latencyMs ?? settings.latencyMs,
      failures: { ...settings.failures, ...next.failures },
      emptyLists: { ...settings.emptyLists, ...next.emptyLists },
    };
  };

  const reset = (): void => {
    settings = { ...defaultSettings, failures: {}, emptyLists: {} };
  };

  const getSettings = (): MockNetworkSettings => ({
    latencyMs: settings.latencyMs,
    failures: { ...settings.failures },
    emptyLists: { ...settings.emptyLists },
  });

  const beforeRequest = async (operation: MockOperation): Promise<void> => {
    const { latencyMs, failures } = settings;
    if (!Number.isFinite(latencyMs) || latencyMs < 0) {
      throw new RangeError('Mock latency must be a non-negative finite number.');
    }
    if (latencyMs > 0) await new Promise<void>((resolve) => setTimeout(resolve, latencyMs));
    if (failures[operation]) throw new MockRequestError(operation);
  };

  const isEmpty = (list: 'doctors' | 'slots' | 'prescriptions'): boolean =>
    settings.emptyLists[list] === true;

  return { configure, reset, getSettings, beforeRequest, isEmpty };
};
