import { Image } from 'expo-image';
import { Clock, Star, Users } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Night } from '@/constants/experiencesTheme';
import { Fonts } from '@/constants/theme';
import type { Experience } from '@/data/experiences';
import { formatBudget } from '@/utils/format';

type ExperienceCardProps = {
  experience: Experience;
  onPress: () => void;
};

export function ExperienceCard({ experience, onPress }: ExperienceCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${experience.title}. ${experience.rating} stars. From ${formatBudget(experience.priceFrom)}. View experience.`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.art}>
        <Image
          accessibilityLabel={experience.title}
          contentFit="cover"
          recyclingKey={experience.slug}
          source={{ uri: experience.image }}
          style={styles.image}
          transition={200}
        />
        <View style={styles.shade} />
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>{experience.badge}</Text>
        </View>
        <View style={styles.rating}>
          <Star color={Night.amber} fill={Night.amber} size={12} />
          <Text style={styles.ratingValue}>{experience.rating.toFixed(1)}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{experience.title}</Text>
          <Text style={styles.price}>{formatBudget(experience.priceFrom)}</Text>
        </View>
        <Text numberOfLines={2} style={styles.copy}>
          {experience.description}
        </Text>
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Clock color={Night.magenta} size={14} />
            <Text style={styles.metaText}>{experience.durationMins} min</Text>
          </View>
          <View style={styles.metaItem}>
            <Users color={Night.violet} size={14} />
            <Text style={styles.metaText}>{experience.crew} crew</Text>
          </View>
        </View>
        <View style={styles.cta}>
          <Text style={styles.ctaLabel}>View experience</Text>
        </View>
      </View>
    </Pressable>
  );
}

export function ExperienceSkeleton() {
  return (
    <View accessibilityLabel="Loading experience" style={styles.card}>
      <View style={[styles.art, styles.skel]} />
      <View style={styles.body}>
        <View style={[styles.skelLine, { width: '70%' }]} />
        <View style={[styles.skelLine, { width: '92%' }]} />
        <View style={[styles.skelLine, { width: '54%' }]} />
        <View style={[styles.cta, styles.skel]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: Night.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Night.glass,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.92,
  },
  art: {
    width: '100%',
    aspectRatio: 16 / 10,
    backgroundColor: Night.base,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  shade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 64,
    backgroundColor: 'rgba(20, 22, 34, 0.45)',
    pointerEvents: 'none',
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(20, 22, 34, 0.9)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeLabel: {
    color: Night.text,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
  },
  rating: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(20, 22, 34, 0.9)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  ratingValue: {
    color: Night.text,
    fontFamily: Fonts.uiBold,
    fontSize: 12,
  },
  body: {
    padding: 16,
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    flex: 1,
    color: Night.text,
    fontFamily: Fonts.uiBold,
    fontSize: 20,
    lineHeight: 26,
  },
  price: {
    color: Night.magenta,
    fontFamily: Fonts.uiBold,
    fontSize: 18,
  },
  copy: {
    color: Night.muted,
    fontFamily: Fonts.jakarta,
    fontSize: 14,
    lineHeight: 20,
  },
  meta: {
    flexDirection: 'row',
    gap: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    color: Night.muted,
    fontFamily: Fonts.jakartaMedium,
    fontSize: 12,
  },
  cta: {
    marginTop: 4,
    minHeight: 44,
    borderRadius: 10,
    backgroundColor: Night.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: {
    color: Night.text,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 14,
  },
  skel: {
    backgroundColor: Night.elevated,
  },
  skelLine: {
    height: 12,
    borderRadius: 6,
    backgroundColor: Night.elevated,
  },
});
