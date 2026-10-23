const assert = require('node:assert/strict');
const test = require('node:test');
const { normalDayConfig, diwaliConfig } = require('../.test-build/src/features/config/fixtures.js');
const { LAST_VALID_CONFIG_KEY } = require('../.test-build/src/features/config/configCache.js');
const { validateLayoutConfig, ConfigValidationError } = require('../.test-build/src/features/config/validateConfig.js');
const { createMockDataAccess } = require('../.test-build/src/services/mock/mockDataAccess.js');

const createMemoryStorage = () => {
  const values = new Map();
  return {
    async get(key) { return values.get(key) ?? null; },
    async set(key, value) { values.set(key, value); },
    values,
  };
};

test('normal and Diwali configs validate with required content', () => {
  assert.equal(validateLayoutConfig(normalDayConfig).sections.length, 6);
  assert.equal(validateLayoutConfig(diwaliConfig).theme.festival.name, 'Diwali');
});

test('unknown section types are retained and malformed config is rejected', () => {
  const source = structuredClone(normalDayConfig);
  source.sections.push({ id: 'future-section', type: 'future_type', background: { kind: 'color', value: '#FFFFFF' }, items: [{ anything: true }] });
  assert.equal(validateLayoutConfig(source).sections.at(-1).type, 'future_type');
  assert.throws(() => validateLayoutConfig({ ...source, theme: { ...source.theme, primary: 'green' } }), ConfigValidationError);
});

test('invalid config does not replace the last validated cached config', async () => {
  const memory = createMemoryStorage();
  const services = createMockDataAccess({ storage: memory, now: () => '2026-10-23T12:00:00.000Z' });
  await services.fetchConfig();
  const previous = memory.values.get(LAST_VALID_CONFIG_KEY);
  services.setConfigPayloadOverride({ version: 1, theme: {}, tabs: [], sections: [] });
  assert.deepEqual(await services.fetchConfig(), previous);
  assert.deepEqual(memory.values.get(LAST_VALID_CONFIG_KEY), previous);
});
