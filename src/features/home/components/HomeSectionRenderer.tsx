import type React from 'react';
import { Image, ImageBackground, ScrollView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { AppPressable, AppText } from '../../../components';
import type { LayoutSection } from '../../../types/domain';
import type { RuntimeThemeTokens } from '../../../theme/runtimeTheme';
import { resolveSectionBackground } from '../../../theme/runtimeTheme';
import { strings } from '../../../constants/strings';
import { getHomeSectionModel } from '../sectionData';
import type { DoctorItem, ServiceItem } from '../sectionData';
import styles from './homeSectionStyles';

interface HomeSectionRendererProps {
  section: LayoutSection;
  theme: RuntimeThemeTokens;
  featuredDoctor?: DoctorItem;
  onDoctorPress?: (doctor: DoctorItem) => void;
  onServicePress?: (service: ServiceItem) => void;
  onQuickActionPress?: (actionId: string) => void;
}

const parseGradientStops = (value: string): [string, string, ...string[]] | null => {
  const [first, second, ...rest] = value.split(',').map((stop) => stop.trim());
  if (first === undefined || second === undefined) return null;
  return [first, second, ...rest];
};

const SectionBackgroundLayer = ({
  section,
  theme,
}: HomeSectionRendererProps): React.ReactElement => {
  const background = resolveSectionBackground(section.background, theme);

  if (background.kind === 'gradient') {
    const stops = parseGradientStops(background.value);
    if (stops !== null) {
      return (
        <LinearGradient
          colors={stops}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.8 }}
          style={styles.backgroundLayer}
          pointerEvents="none"
        />
      );
    }
  }

  if (background.kind === 'image') {
    return (
      <View pointerEvents="none" style={styles.backgroundLayer}>
        <ImageBackground
          source={{ uri: background.value }}
          resizeMode="cover"
          style={styles.imageFill}
          imageStyle={styles.backgroundImage}
          accessible={false}
        >
          <View style={[styles.imageTint, { backgroundColor: theme.primary }]} />
        </ImageBackground>
      </View>
    );
  }

  return (
    <View
      pointerEvents="none"
      style={[styles.backgroundLayer, { backgroundColor: background.kind === 'color' ? background.value : theme.background }]}
    />
  );
};

const SectionHeading = ({
  title,
  color,
}: {
  title?: string;
  color: string;
}): React.ReactElement | null => title
  ? <AppText style={[styles.sectionTitle, { color }]}>{title}</AppText>
  : null;

const getPriceLabel = (priceInr: number): string => `₹${priceInr.toLocaleString('en-IN')}`;

const getActionGlyph = (id: string): string => {
  switch (id) {
    case 'book': return '▦';
    case 'prescriptions': return '▤';
    case 'reminders': return '◷';
    case 'family': return '♧';
    default: return '•';
  }
};

const HomeSectionRenderer = ({ section, theme, featuredDoctor, onDoctorPress, onServicePress, onQuickActionPress }: HomeSectionRendererProps): React.ReactElement | null => {
  const model = getHomeSectionModel(section);
  if (model === null) return null;
  const background = resolveSectionBackground(section.background, theme);
  const foreground = background.foreground;

  return (
    <View style={[styles.section, section.type === 'hero_banner' && styles.heroSection]}>
      <SectionBackgroundLayer section={section} theme={theme} />
      <View style={styles.sectionContent}>
        {model.type === 'hero_banner' ? (
          <View style={styles.heroContent}>
            <AppText style={[styles.heroTitle, { color: foreground }]}>
              {section.title ?? model.items[0]?.greeting ?? strings.home.title}
            </AppText>
            {model.items[0]?.subtitle ? (
              <AppText style={[styles.heroSubtitle, { color: foreground }]}>{model.items[0].subtitle}</AppText>
            ) : null}
            {featuredDoctor !== undefined && onDoctorPress !== undefined ? (
              <AppPressable
                accessibilityRole="button"
                accessibilityLabel={strings.booking.doctorAccessibility(featuredDoctor.name)}
                accessibilityHint={strings.booking.actions.bookDoctor}
                onPress={() => onDoctorPress(featuredDoctor)}
                style={[styles.heroAction, { backgroundColor: theme.surface }]}
              >
                <AppText style={[styles.heroActionLabel, { color: theme.primary }]}>
                  {strings.booking.actions.bookDoctor} · {getPriceLabel(featuredDoctor.feeInr)}
                </AppText>
                <AppText style={[styles.heroActionArrow, { color: theme.primary }]} accessibilityElementsHidden>
                  →
                </AppText>
              </AppPressable>
            ) : null}
          </View>
        ) : null}

        {model.type === 'category_chips' ? (
          <>
            <SectionHeading title={section.title} color={foreground} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {model.items.map((item) => (
                <View key={item.id} style={[styles.categoryChip, { backgroundColor: theme.surfaceTint }]}>
                  <AppText style={[styles.categoryLabel, { color: theme.textPrimary }]}>{item.label}</AppText>
                </View>
              ))}
            </ScrollView>
          </>
        ) : null}

        {model.type === 'quick_actions' ? (
          <>
            <SectionHeading title={section.title} color={foreground} />
            <View style={styles.actionGrid}>
              {model.items.map((item) => {
                const isSupportedAction = onQuickActionPress !== undefined
                  && (item.id === 'book' || item.id === 'prescriptions' || item.id === 'reminders');
                const actionHint = item.id === 'book'
                  ? strings.booking.actions.bookDoctor
                  : item.id === 'reminders' ? strings.doses.openHint : strings.home.openPrescriptionsHint;
                return (
                  <AppPressable
                    key={item.id}
                    accessibilityRole={isSupportedAction ? 'button' : undefined}
                    accessibilityLabel={item.label}
                    accessibilityHint={isSupportedAction ? actionHint : undefined}
                    accessibilityState={{ disabled: !isSupportedAction }}
                    disabled={!isSupportedAction}
                    onPress={() => onQuickActionPress?.(item.id)}
                    style={[styles.actionTile, { backgroundColor: theme.surface }]}
                  >
                    <View style={[styles.actionIcon, { backgroundColor: theme.surfaceTint }]}>
                      <AppText style={[styles.actionInitial, { color: theme.primary }]}>{getActionGlyph(item.id)}</AppText>
                    </View>
                    <AppText style={[styles.actionLabel, { color: theme.textPrimary }]}>{item.label}</AppText>
                  </AppPressable>
                );
              })}
            </View>
          </>
        ) : null}

        {model.type === 'service_grid' ? (
          <>
            <SectionHeading title={section.title} color={foreground} />
            <View style={styles.serviceGrid}>
              {model.items.map((item) => (
                <AppPressable
                  key={item.id}
                  accessibilityRole={item.doctorId && onServicePress ? 'button' : undefined}
                  accessibilityLabel={item.doctorId ? strings.booking.serviceAccessibility(item.name) : item.name}
                  accessibilityHint={item.doctorId && onServicePress ? strings.booking.actions.bookService : undefined}
                  disabled={!item.doctorId || onServicePress === undefined}
                  onPress={() => onServicePress?.(item)}
                  style={[styles.serviceCard, { backgroundColor: theme.surface }]}
                >
                  <View style={styles.serviceImageContainer}>
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.serviceImage}
                      accessibilityRole="image"
                      accessibilityLabel={item.name}
                    />
                    {item.badge ? <AppText style={[styles.serviceBadge, { color: theme.onAccent, backgroundColor: theme.accent }]}>{item.badge}</AppText> : null}
                  </View>
                  <AppText style={[styles.serviceName, { color: theme.textPrimary }]}>{item.name}</AppText>
                  {item.description ? <AppText style={[styles.serviceDescription, { color: theme.textSecondary }]}>{item.description}</AppText> : null}
                  <AppText style={[styles.servicePrice, { color: theme.primary }]}>{getPriceLabel(item.priceInr)}</AppText>
                  {item.doctorId && onServicePress ? (
                    <View style={[styles.serviceBookButton, { backgroundColor: theme.surfaceTint }]}>
                      <AppText style={[styles.serviceBookLabel, { color: theme.primary }]}>{strings.booking.actions.bookService}</AppText>
                    </View>
                  ) : null}
                </AppPressable>
              ))}
            </View>
          </>
        ) : null}

        {model.type === 'doctor_carousel' ? (
          <>
            <SectionHeading title={section.title} color={foreground} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.doctorRow}>
              {model.items.map((doctor) => (
                <AppPressable
                  key={doctor.id}
                  accessibilityRole={onDoctorPress ? 'button' : undefined}
                  accessibilityLabel={strings.booking.doctorAccessibility(doctor.name)}
                  accessibilityHint={strings.booking.actions.bookDoctor}
                  disabled={onDoctorPress === undefined}
                  onPress={() => onDoctorPress?.(doctor)}
                  style={[styles.doctorCard, { backgroundColor: theme.surface }]}
                >
                  <View style={styles.doctorHeader}>
                    <Image source={{ uri: doctor.photoUrl }} style={styles.doctorImage} accessibilityRole="image" accessibilityLabel={doctor.name} />
                    <View style={styles.doctorCopy}>
                      <AppText style={[styles.doctorName, { color: theme.textPrimary }]}>{doctor.name}</AppText>
                      <AppText style={[styles.doctorSpecialty, { color: theme.textSecondary }]}>{doctor.specialty}</AppText>
                    </View>
                  </View>
                  <AppText style={[styles.doctorAvailability, { color: theme.primary, backgroundColor: theme.surfaceTint }]}>{doctor.nextAvailableAt}</AppText>
                  <View style={styles.doctorFooter}>
                    <AppText style={[styles.doctorFee, { color: theme.textPrimary }]}>{getPriceLabel(doctor.feeInr)}</AppText>
                  </View>
                  <View style={[styles.doctorBookButton, { backgroundColor: theme.primary }]}>
                    <AppText style={[styles.doctorBookLabel, { color: theme.onPrimary }]}>{strings.booking.actions.bookDoctor}</AppText>
                  </View>
                </AppPressable>
              ))}
            </ScrollView>
          </>
        ) : null}

        {model.type === 'offer_strip' ? (
          <View style={styles.offerContent}>
            <View style={[styles.offerMark, { backgroundColor: theme.surface }]} accessibilityElementsHidden>
              <AppText style={[styles.offerMarkText, { color: theme.primary }]}>◇</AppText>
            </View>
            <View style={styles.offerCopy}>
              {model.items.map((item) => (
                <AppText key={item.message} style={[styles.offerText, { color: foreground }]}>{item.message}</AppText>
              ))}
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default HomeSectionRenderer;
