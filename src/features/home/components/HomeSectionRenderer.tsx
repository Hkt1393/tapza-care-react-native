import type React from 'react';
import { Image, ImageBackground, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import type { LayoutSection } from '../../../types/domain';
import type { RuntimeThemeTokens } from '../../../theme/runtimeTheme';
import { resolveSectionBackground } from '../../../theme/runtimeTheme';
import { strings } from '../../../constants/strings';
import { getHomeSectionModel } from '../sectionData';
import styles from './homeSectionStyles';

interface HomeSectionRendererProps {
  section: LayoutSection;
  theme: RuntimeThemeTokens;
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
  ? <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
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

const HomeSectionRenderer = ({ section, theme }: HomeSectionRendererProps): React.ReactElement | null => {
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
            <Text style={[styles.heroEyebrow, { color: foreground }]}>
              {model.items[0]?.greeting ?? section.title ?? strings.home.title}
            </Text>
            <Text style={[styles.heroTitle, { color: foreground }]}>
              {section.title ?? model.items[0]?.greeting ?? strings.home.title}
            </Text>
            {model.items[0]?.subtitle ? (
              <Text style={[styles.heroSubtitle, { color: foreground }]}>{model.items[0].subtitle}</Text>
            ) : null}
          </View>
        ) : null}

        {model.type === 'category_chips' ? (
          <>
            <SectionHeading title={section.title} color={foreground} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {model.items.map((item) => (
                <View key={item.id} style={[styles.categoryChip, { backgroundColor: theme.surface }]}>
                  <Text style={[styles.categoryLabel, { color: theme.textPrimary }]}>{item.label}</Text>
                </View>
              ))}
            </ScrollView>
          </>
        ) : null}

        {model.type === 'quick_actions' ? (
          <>
            <SectionHeading title={section.title} color={foreground} />
            <View style={styles.actionGrid}>
              {model.items.map((item) => (
                <View key={item.id} style={[styles.actionTile, { backgroundColor: theme.surface }]}>
                  <View style={[styles.actionIcon, { backgroundColor: theme.accent }]}>
                    <Text style={[styles.actionInitial, { color: theme.onAccent }]}>{getActionGlyph(item.id)}</Text>
                  </View>
                  <Text style={[styles.actionLabel, { color: theme.textPrimary }]}>{item.label}</Text>
                </View>
              ))}
            </View>
          </>
        ) : null}

        {model.type === 'service_grid' ? (
          <>
            <SectionHeading title={section.title} color={foreground} />
            <View style={styles.serviceGrid}>
              {model.items.map((item) => (
                <View key={item.id} style={[styles.serviceCard, { backgroundColor: theme.surface }]}>
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.serviceImage}
                    accessibilityRole="image"
                    accessibilityLabel={item.name}
                  />
                  {item.badge ? <Text style={[styles.serviceBadge, { color: theme.onAccent, backgroundColor: theme.accent }]}>{item.badge}</Text> : null}
                  <Text style={[styles.serviceName, { color: theme.textPrimary }]}>{item.name}</Text>
                  <Text style={[styles.servicePrice, { color: theme.primary }]}>{getPriceLabel(item.priceInr)}</Text>
                </View>
              ))}
            </View>
          </>
        ) : null}

        {model.type === 'doctor_carousel' ? (
          <>
            <SectionHeading title={section.title} color={foreground} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.doctorRow}>
              {model.items.map((doctor) => (
                <View key={doctor.id} style={[styles.doctorCard, { backgroundColor: theme.surface }]}>
                  <Image source={{ uri: doctor.photoUrl }} style={styles.doctorImage} accessibilityRole="image" accessibilityLabel={doctor.name} />
                  <Text style={[styles.doctorName, { color: theme.textPrimary }]}>{doctor.name}</Text>
                  <Text style={[styles.doctorSpecialty, { color: theme.textSecondary }]}>{doctor.specialty}</Text>
                  <Text style={[styles.doctorAvailability, { color: theme.primary }]}>{doctor.nextAvailableAt}</Text>
                  <Text style={[styles.doctorFee, { color: theme.textPrimary }]}>{getPriceLabel(doctor.feeInr)}</Text>
                </View>
              ))}
            </ScrollView>
          </>
        ) : null}

        {model.type === 'offer_strip' ? (
          <View style={styles.offerContent}>
            {model.items.map((item) => (
              <Text key={item.message} style={[styles.offerText, { color: foreground }]}>{item.message}</Text>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default HomeSectionRenderer;
