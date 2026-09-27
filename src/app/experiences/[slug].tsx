import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Clock, Star, Users } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Night } from '@/constants/experiencesTheme';
import { Fonts } from '@/constants/theme';
import { usePlan } from '@/context/PlanContext';
import { getExperienceBySlug } from '@/data/experiences';
import { MISSION_OCCASION } from '@/data/planner';
import { formatBudget } from '@/utils/format';

export default function ExperienceDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { patchDraft } = usePlan();
  const experience = getExperienceBySlug(slug);

  function customize() {
    if (!experience) {
      return;
    }
    const occasion = MISSION_OCCASION[experience.slug] ?? '';
    patchDraft({
      occasion,
      step: occasion ? 2 : 1,
    });
    router.push({ pathname: '/book/target', params: { mission: experience.slug } });
  }

  if (!experience) {
    return (
      <View style={styles.screen}>
        <Text style={styles.missing}>This experience could not be found.</Text>
        <Pressable accessibilityRole="button" onPress={() => router.replace('/experiences')} style={styles.primary}>
          <Text style={styles.primaryLabel}>Back to experiences</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image
            accessibilityLabel={experience.title}
            contentFit="cover"
            source={{ uri: experience.image }}
            style={styles.heroImage}
          />
          <View style={styles.heroShade} />
          <Pressable
            accessibilityLabel="Back to experiences"
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.back}>
            <ArrowLeft color={Night.text} size={18} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>{experience.badge}</Text>
          </View>
          <Text style={styles.title}>{experience.title}</Text>
          <View style={styles.ratingRow}>
            <Star color={Night.amber} fill={Night.amber} size={14} />
            <Text style={styles.rating}>
              {experience.rating.toFixed(1)} · {experience.reviews} reviews
            </Text>
          </View>
          <Text style={styles.story}>{experience.story}</Text>
          <Text style={styles.price}>From {formatBudget(experience.priceFrom)}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaCard}>
              <Clock color={Night.magenta} size={16} />
              <Text style={styles.metaValue}>{experience.durationMins} min</Text>
              <Text style={styles.metaHint}>Duration</Text>
            </View>
            <View style={styles.metaCard}>
              <Users color={Night.violet} size={16} />
              <Text style={styles.metaValue}>{experience.crewLabel}</Text>
              <Text style={styles.metaHint}>Crew</Text>
            </View>
          </View>

          <Text style={styles.section}>What&apos;s included</Text>
          {experience.includes.map((item) => (
            <Text key={item} style={styles.bullet}>
              {item}
            </Text>
          ))}

          <Text style={styles.section}>What happens</Text>
          {experience.happens.map((item, index) => (
            <Text key={item} style={styles.bullet}>
              {index + 1}. {item}
            </Text>
          ))}

          <Text style={styles.section}>How customization works</Text>
          <Text style={styles.copy}>{experience.customizeNote}</Text>
        </View>
      </ScrollView>

      <View style={styles.sticky}>
        <Pressable accessibilityRole="button" onPress={customize} style={styles.primary}>
          <Text style={styles.primaryLabel}>Customize this surprise</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Night.base,
  },
  body: {
    paddingBottom: 24,
  },
  hero: {
    width: '100%',
    aspectRatio: 16 / 10,
    backgroundColor: Night.card,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11, 12, 18, 0.18)',
  },
  back: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(11, 12, 18, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 45, 138, 0.16)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeLabel: {
    color: Night.magenta,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
  },
  title: {
    color: Night.text,
    fontFamily: Fonts.uiBold,
    fontSize: 28,
    lineHeight: 34,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rating: {
    color: Night.muted,
    fontFamily: Fonts.jakartaMedium,
    fontSize: 13,
  },
  story: {
    color: Night.muted,
    fontFamily: Fonts.jakarta,
    fontSize: 15,
    lineHeight: 22,
  },
  price: {
    color: Night.magenta,
    fontFamily: Fonts.uiBold,
    fontSize: 22,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metaCard: {
    flex: 1,
    backgroundColor: Night.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Night.glass,
    padding: 12,
    gap: 4,
  },
  metaValue: {
    color: Night.text,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 13,
  },
  metaHint: {
    color: Night.subtle,
    fontFamily: Fonts.jakarta,
    fontSize: 11,
  },
  section: {
    color: Night.text,
    fontFamily: Fonts.ui,
    fontSize: 16,
    marginTop: 8,
  },
  bullet: {
    color: Night.muted,
    fontFamily: Fonts.jakarta,
    fontSize: 14,
    lineHeight: 20,
  },
  copy: {
    color: Night.muted,
    fontFamily: Fonts.jakarta,
    fontSize: 14,
    lineHeight: 20,
  },
  sticky: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: Night.glass,
    backgroundColor: Night.base,
  },
  primary: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: Night.magenta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: {
    color: Night.text,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 15,
  },
  missing: {
    color: Night.muted,
    fontFamily: Fonts.jakarta,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 48,
    marginHorizontal: 24,
  },
});
