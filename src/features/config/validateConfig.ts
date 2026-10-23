import type {
  AppScreen,
  LayoutConfig,
  LayoutSection,
  LayoutTab,
  LayoutTheme,
  SectionBackground,
} from '../../types/domain';

const hexColorPattern = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const urlPattern = /^https?:\/\//i;

export class ConfigValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigValidationError';
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const requireString = (value: unknown, path: string): string => {
  if (!isNonEmptyString(value)) {
    throw new ConfigValidationError(`${path} must be a non-empty string.`);
  }
  return value;
};

const parseAppScreen = (value: string, path: string): AppScreen => {
  switch (value) {
    case 'home':
    case 'bookings':
    case 'prescriptions':
    case 'profile':
      return value;
    default:
      throw new ConfigValidationError(`${path} is unsupported.`);
  }
};

const validateTheme = (value: unknown): LayoutTheme => {
  if (!isRecord(value)) throw new ConfigValidationError('theme must be an object.');
  const colorKeys = ['primary', 'secondary', 'background', 'surface', 'textPrimary', 'textSecondary', 'accent'] as const;
  const themeColors: Record<(typeof colorKeys)[number], string> = {
    primary: '', secondary: '', background: '', surface: '', textPrimary: '', textSecondary: '', accent: '',
  };

  for (const key of colorKeys) {
    const color = requireString(value[key], `theme.${key}`);
    if (!hexColorPattern.test(color)) {
      throw new ConfigValidationError(`theme.${key} must be a 3 or 6 digit hex color.`);
    }
    themeColors[key] = color;
  }

  let festival: LayoutTheme['festival'];
  if (value.festival !== undefined) {
    if (!isRecord(value.festival)) throw new ConfigValidationError('theme.festival must be an object.');
    festival = {
      name: requireString(value.festival.name, 'theme.festival.name'),
      greeting: requireString(value.festival.greeting, 'theme.festival.greeting'),
      bannerImageUrl: requireString(value.festival.bannerImageUrl, 'theme.festival.bannerImageUrl'),
    };
    if (!urlPattern.test(festival.bannerImageUrl)) {
      throw new ConfigValidationError('theme.festival.bannerImageUrl must be an HTTP(S) URL.');
    }
  }

  return festival === undefined ? themeColors : { ...themeColors, festival };
};

const validateTab = (value: unknown, index: number): LayoutTab => {
  const path = `tabs[${index}]`;
  if (!isRecord(value)) throw new ConfigValidationError(`${path} must be an object.`);
  const screen = parseAppScreen(requireString(value.screen, `${path}.screen`), `${path}.screen`);
  return {
    id: requireString(value.id, `${path}.id`),
    label: requireString(value.label, `${path}.label`),
    icon: requireString(value.icon, `${path}.icon`),
    screen,
  };
};

const validateBackground = (value: unknown, path: string): SectionBackground => {
  if (!isRecord(value)) throw new ConfigValidationError(`${path} must be an object.`);
  const kind = requireString(value.kind, `${path}.kind`);
  const backgroundValue = requireString(value.value, `${path}.value`);

  if (kind === 'color') {
    if (!hexColorPattern.test(backgroundValue)) {
      throw new ConfigValidationError(`${path}.value must be a hex color for a color background.`);
    }
    return { kind, value: backgroundValue };
  }
  if (kind === 'gradient') {
    const stops = backgroundValue.split(',').map((stop) => stop.trim());
    if (stops.length < 2 || stops.some((stop) => !hexColorPattern.test(stop))) {
      throw new ConfigValidationError(`${path}.value must contain at least two comma-separated hex colors.`);
    }
    return { kind, value: backgroundValue };
  }
  if (kind === 'image') {
    if (!urlPattern.test(backgroundValue)) {
      throw new ConfigValidationError(`${path}.value must be an HTTP(S) URL for an image background.`);
    }
    return { kind, value: backgroundValue };
  }
  throw new ConfigValidationError(`${path}.kind is unsupported.`);
};

const validateSection = (value: unknown, index: number): LayoutSection => {
  const path = `sections[${index}]`;
  if (!isRecord(value)) throw new ConfigValidationError(`${path} must be an object.`);
  if (!Array.isArray(value.items)) throw new ConfigValidationError(`${path}.items must be an array.`);
  const section: LayoutSection = {
    id: requireString(value.id, `${path}.id`),
    type: requireString(value.type, `${path}.type`),
    background: validateBackground(value.background, `${path}.background`),
    items: value.items,
  };
  if (value.title !== undefined) section.title = requireString(value.title, `${path}.title`);
  return section;
};

export const validateLayoutConfig = (value: unknown): LayoutConfig => {
  if (!isRecord(value)) throw new ConfigValidationError('config must be an object.');
  if (typeof value.version !== 'number' || !Number.isInteger(value.version) || value.version < 1) {
    throw new ConfigValidationError('version must be a positive integer.');
  }
  if (!Array.isArray(value.tabs) || value.tabs.length === 0) {
    throw new ConfigValidationError('tabs must be a non-empty array.');
  }
  if (!Array.isArray(value.sections)) {
    throw new ConfigValidationError('sections must be an array.');
  }

  return {
    version: value.version,
    theme: validateTheme(value.theme),
    tabs: value.tabs.map(validateTab),
    sections: value.sections.map(validateSection),
  };
};
