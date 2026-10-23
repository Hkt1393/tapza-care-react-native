import type { LayoutSection } from '../../types/domain';

export interface HeroBannerItem {
  greeting?: string;
  subtitle?: string;
}

export interface LabeledItem {
  id: string;
  label: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  priceInr: number;
  doctorId?: string;
  badge?: string;
}

export interface DoctorItem {
  id: string;
  name: string;
  specialty: string;
  photoUrl: string;
  feeInr: number;
  nextAvailableAt: string;
}

export interface OfferItem {
  message: string;
}

export type HomeSectionModel =
  | { type: 'hero_banner'; section: LayoutSection; items: HeroBannerItem[] }
  | { type: 'category_chips'; section: LayoutSection; items: LabeledItem[] }
  | { type: 'quick_actions'; section: LayoutSection; items: LabeledItem[] }
  | { type: 'service_grid'; section: LayoutSection; items: ServiceItem[] }
  | { type: 'doctor_carousel'; section: LayoutSection; items: DoctorItem[] }
  | { type: 'offer_strip'; section: LayoutSection; items: OfferItem[] };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const parseHeroItem = (value: unknown): HeroBannerItem | null => {
  if (!isRecord(value)) return null;
  const greeting = value.greeting;
  const subtitle = value.subtitle;
  if (greeting !== undefined && !isNonEmptyString(greeting)) return null;
  if (subtitle !== undefined && !isNonEmptyString(subtitle)) return null;
  return {
    ...(typeof greeting === 'string' ? { greeting } : {}),
    ...(typeof subtitle === 'string' ? { subtitle } : {}),
  };
};

const parseLabeledItem = (value: unknown): LabeledItem | null => {
  if (!isRecord(value) || !isNonEmptyString(value.id) || !isNonEmptyString(value.label)) return null;
  return { id: value.id, label: value.label };
};

const parseServiceItem = (value: unknown): ServiceItem | null => {
  if (!isRecord(value) || !isNonEmptyString(value.id) || !isNonEmptyString(value.name)) return null;
  if (!isNonEmptyString(value.imageUrl) || !/^https?:\/\//i.test(value.imageUrl)) return null;
  if (typeof value.priceInr !== 'number' || !Number.isFinite(value.priceInr) || value.priceInr < 0) return null;
  if (value.description !== undefined && !isNonEmptyString(value.description)) return null;
  if (value.badge !== undefined && !isNonEmptyString(value.badge)) return null;
  return {
    id: value.id,
    name: value.name,
    ...(typeof value.description === 'string' ? { description: value.description } : {}),
    imageUrl: value.imageUrl,
    priceInr: value.priceInr,
    ...(isNonEmptyString(value.doctorId) ? { doctorId: value.doctorId } : {}),
    ...(typeof value.badge === 'string' ? { badge: value.badge } : {}),
  };
};

const parseDoctorItem = (value: unknown): DoctorItem | null => {
  if (!isRecord(value)) return null;
  if (!isNonEmptyString(value.id) || !isNonEmptyString(value.name) || !isNonEmptyString(value.specialty)) return null;
  if (!isNonEmptyString(value.photoUrl) || !/^https?:\/\//i.test(value.photoUrl)) return null;
  if (typeof value.feeInr !== 'number' || !Number.isFinite(value.feeInr) || value.feeInr < 0) return null;
  if (!isNonEmptyString(value.nextAvailableAt)) return null;
  return {
    id: value.id,
    name: value.name,
    specialty: value.specialty,
    photoUrl: value.photoUrl,
    feeInr: value.feeInr,
    nextAvailableAt: value.nextAvailableAt,
  };
};

const parseOfferItem = (value: unknown): OfferItem | null => {
  if (!isRecord(value) || !isNonEmptyString(value.message)) return null;
  return { message: value.message };
};

const parseItems = <T>(items: unknown[], parse: (item: unknown) => T | null): T[] =>
  items.flatMap((item) => {
    const parsed = parse(item);
    return parsed === null ? [] : [parsed];
  });

export const getHomeSectionModel = (section: LayoutSection): HomeSectionModel | null => {
  switch (section.type) {
    case 'hero_banner':
      return { type: section.type, section, items: parseItems(section.items, parseHeroItem) };
    case 'category_chips': {
      const items = parseItems(section.items, parseLabeledItem);
      return items.length > 0 ? { type: section.type, section, items } : null;
    }
    case 'quick_actions': {
      const items = parseItems(section.items, parseLabeledItem);
      return items.length > 0 ? { type: section.type, section, items } : null;
    }
    case 'service_grid': {
      const items = parseItems(section.items, parseServiceItem);
      return items.length > 0 ? { type: section.type, section, items } : null;
    }
    case 'doctor_carousel': {
      const items = parseItems(section.items, parseDoctorItem);
      return items.length > 0 ? { type: section.type, section, items } : null;
    }
    case 'offer_strip': {
      const items = parseItems(section.items, parseOfferItem);
      return items.length > 0 ? { type: section.type, section, items } : null;
    }
    default:
      return null;
  }
};
