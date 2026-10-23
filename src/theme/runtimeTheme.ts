import type { LayoutConfig, SectionBackground } from '../types/domain';
import { colors } from './colors';

export interface RuntimeThemeTokens {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  onPrimary: string;
  onAccent: string;
  surfaceTint: string;
  border: string;
  textTertiary: string;
  success: string;
  successText: string;
  warning: string;
  error: string;
  overlay: string;
}

export interface ResolvedSectionBackground {
  kind: SectionBackground['kind'];
  value: string;
  foreground: string;
}

const parseRgb = (hex: string): readonly [number, number, number] => {
  const normalized = hex.slice(1);
  const expanded = normalized.length === 3
    ? normalized.split('').map((digit) => `${digit}${digit}`).join('')
    : normalized;
  return [
    Number.parseInt(expanded.slice(0, 2), 16),
    Number.parseInt(expanded.slice(2, 4), 16),
    Number.parseInt(expanded.slice(4, 6), 16),
  ];
};

const relativeLuminance = (hex: string): number => {
  const channels = parseRgb(hex).map((channel) => {
    const srgb = channel / 255;
    return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
};

export const contrastingTextColor = (background: string): string =>
  relativeLuminance(background) > 0.179 ? colors.black : colors.white;

export const resolveRuntimeTheme = (config: LayoutConfig): RuntimeThemeTokens => ({
  primary: config.theme.primary,
  secondary: config.theme.secondary,
  background: config.theme.background,
  surface: config.theme.surface,
  textPrimary: config.theme.textPrimary,
  textSecondary: config.theme.textSecondary,
  accent: config.theme.accent,
  onPrimary: contrastingTextColor(config.theme.primary),
  onAccent: contrastingTextColor(config.theme.accent),
  surfaceTint: colors.surfaceTint,
  border: colors.border,
  textTertiary: colors.textTertiary,
  success: colors.success,
  successText: colors.successText,
  warning: colors.warning,
  error: colors.error,
  overlay: colors.overlay,
});

export const resolveSectionBackground = (
  background: SectionBackground,
  tokens: RuntimeThemeTokens,
): ResolvedSectionBackground => {
  if (background.kind === 'color') {
    return { ...background, foreground: contrastingTextColor(background.value) };
  }
  if (background.kind === 'gradient') {
    const firstStop = background.value.split(',')[0]?.trim() ?? tokens.primary;
    return { ...background, foreground: contrastingTextColor(firstStop) };
  }
  return { ...background, foreground: tokens.onPrimary };
};
