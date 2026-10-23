const assert = require('node:assert/strict');
const test = require('node:test');
const { configFixtures } = require('../.test-build/src/features/config/fixtures.js');
const { getHomeSectionModel } = require('../.test-build/src/features/home/sectionData.js');
const { createMockDataAccess } = require('../.test-build/src/services/mock/mockDataAccess.js');

test('both home configs contain renderable data for all six supported section types', () => {
  const supportedTypes = new Set([
    'hero_banner', 'category_chips', 'quick_actions', 'service_grid', 'doctor_carousel', 'offer_strip',
  ]);

  for (const config of Object.values(configFixtures)) {
    const models = config.sections.map(getHomeSectionModel).filter((model) => model !== null);
    assert.deepEqual(new Set(models.map((model) => model.type)), supportedTypes);
  }
});

test('unknown sections and malformed items are skipped safely', () => {
  const [section] = configFixtures.normal.sections.filter((item) => item.type === 'service_grid');
  const unknownModel = getHomeSectionModel({ ...section, type: 'future_section' });
  const malformedModel = getHomeSectionModel({ ...section, items: [{ id: 'bad', name: 'No price' }] });

  assert.equal(unknownModel, null);
  assert.equal(malformedModel, null);
});

test('selecting Diwali changes the served theme, banner, order, and section items', async () => {
  const values = new Map();
  const services = createMockDataAccess({
    storage: {
      async get(key) { return values.get(key) ?? null; },
      async set(key, value) { values.set(key, value); },
    },
  });
  const normal = await services.fetchConfig();
  services.selectConfig('diwali');
  const diwali = await services.fetchConfig();

  assert.notEqual(diwali.theme.primary, normal.theme.primary);
  assert.equal(diwali.theme.festival.name, 'Diwali');
  assert.equal(diwali.sections[0].background.kind, 'image');
  assert.equal(normal.sections[0].background.kind, 'gradient');
  assert.equal(diwali.sections[1].type, 'offer_strip');
  assert.equal(diwali.sections[0].title, 'Celebrate a healthier Diwali');
  assert.notDeepEqual(diwali.sections[1].items, normal.sections[1].items);
});

test('HomeSectionRenderer renders a section and safely skips unknown types', () => {
  const Module = require('node:module');
  const originalLoad = Module._load;
  Module._load = function loadWithNativeStubs(request, parent, isMain) {
    if (request === 'react-native') {
      return {
        Image: 'Image',
        ImageBackground: 'ImageBackground',
        Platform: { select: (options) => options.default ?? options.ios ?? options.android },
        ScrollView: 'ScrollView',
        StyleSheet: { create: (value) => value },
        View: 'View',
      };
    }
    if (request === 'expo-linear-gradient') return { LinearGradient: 'LinearGradient' };
    if (request === '../../../components') return { AppPressable: 'AppPressable', AppText: 'AppText' };
    return originalLoad.call(this, request, parent, isMain);
  };

  let HomeSectionRenderer;
  try {
    HomeSectionRenderer = require('../.test-build/src/features/home/components/HomeSectionRenderer.js').default;
  } finally {
    Module._load = originalLoad;
  }

  const config = configFixtures.normal;
  const theme = require('../.test-build/src/theme/runtimeTheme.js').resolveRuntimeTheme(config);
  const hero = config.sections.find((section) => section.type === 'hero_banner');
  const rendered = HomeSectionRenderer({ section: hero, theme });
  assert.equal(rendered.type, 'View');

  const findElements = (node, type, matches = []) => {
    if (Array.isArray(node)) {
      node.forEach((child) => findElements(child, type, matches));
    } else if (node && typeof node === 'object') {
      if (node.type === type) matches.push(node);
      findElements(node.props?.children, type, matches);
    }
    return matches;
  };
  const textElements = findElements(rendered, 'AppText');
  assert.ok(textElements.some((element) => element.props.children === hero.title));

  assert.equal(HomeSectionRenderer({ section: { ...hero, type: 'future_section' }, theme }), null);
});
