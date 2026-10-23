const assert = require('node:assert/strict');
const test = require('node:test');
const { normalDayConfig, diwaliConfig } = require('../.test-build/src/features/config/fixtures.js');
const { LAST_VALID_CONFIG_KEY } = require('../.test-build/src/features/config/configCache.js');
const { validateLayoutConfig, ConfigValidationError } = require('../.test-build/src/features/config/validateConfig.js');
const { createMockDataAccess } = require('../.test-build/src/services/mock/mockDataAccess.js');
const { resolveRuntimeTheme } = require('../.test-build/src/theme/runtimeTheme.js');
const { colors } = require('../.test-build/src/theme/colors.js');

const contrastRatio = (foreground, background) => {
  const luminance = (hex) => {
    const normalized = hex.slice(1);
    const expanded = normalized.length === 3 ? normalized.split('').map((digit) => digit + digit).join('') : normalized;
    const channels = [0, 2, 4].map((offset) => Number.parseInt(expanded.slice(offset, offset + 2), 16) / 255);
    const linear = channels.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
    return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
  };
  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
};

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

test('runtime theme maps config colors and retains shared semantic tokens', () => {
  const normal = resolveRuntimeTheme(normalDayConfig);
  const diwali = resolveRuntimeTheme(diwaliConfig);

  assert.equal(normal.primary, normalDayConfig.theme.primary);
  assert.equal(diwali.primary, diwaliConfig.theme.primary);
  assert.equal(normal.secondary, normalDayConfig.theme.secondary);
  assert.equal(diwali.accent, diwaliConfig.theme.accent);
  assert.equal(normal.background, normalDayConfig.theme.background);
  assert.equal(diwali.surface, diwaliConfig.theme.surface);
  assert.equal(normal.border, colors.border);
  assert.equal(diwali.success, colors.success);
  assert.equal(diwali.successText, colors.successText);
  assert.equal(diwali.error, colors.error);
});

test('small runtime and success text colors meet 4.5:1 contrast in both themes', () => {
  for (const config of [normalDayConfig, diwaliConfig]) {
    const theme = resolveRuntimeTheme(config);
    assert.ok(contrastRatio(theme.textSecondary, theme.background) >= 4.5);
    assert.ok(contrastRatio(theme.successText, theme.surface) >= 4.5);
  }
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
