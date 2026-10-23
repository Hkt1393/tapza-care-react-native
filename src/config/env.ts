type EnvKey = 'API_BASE_URL' | 'APP_NAME';

const getEnvValue = (key: EnvKey, fallback: string): string => {
  const environment = ((globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {}) as Record<string, string | undefined>;
  const value = environment[key];

  return value && value.trim().length > 0 ? value : fallback;
};

export const env = {
  appName: getEnvValue('APP_NAME', 'RnBaseProject'),
  apiBaseUrl: getEnvValue('API_BASE_URL', 'https://jsonplaceholder.typicode.com'),
} as const;
