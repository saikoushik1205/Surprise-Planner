import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ArrowRight, ChevronDown } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppFrame } from '@/components/AppFrame';
import { Colors, Fonts } from '@/constants/theme';
import { usePlan } from '@/context/PlanContext';
import { MOOD_VIBE } from '@/data/planner';
import { useResponsive } from '@/hooks/useResponsive';
import { formatBudget } from '@/utils/format';

const HERO = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&q=80';

const MOODS = [
  { id: 'loved', emoji: '❤️', label: 'Loved', line: 'Warm & cozy' },
  { id: 'laughing', emoji: '😄', label: 'Laughing', line: 'Pure chaos' },
  { id: 'emotional', emoji: '🥹', label: 'Emotional', line: 'Happy tears' },
  { id: 'shocked', emoji: '😲', label: 'Shocked', line: 'Did NOT see it' },
  { id: 'celebrated', emoji: '🥳', label: 'Celebrated', line: 'Main character' },
  { id: 'speechless', emoji: '🥺', label: 'Speechless', line: 'Pure magic' },
] as const;

const MISSIONS = [
  {
    id: 'birthday-raid',
    emoji: '🎂',
    title: 'Birthday Raid',
    body: 'A loud, joyful crew drops in with cake, chaos, and birthday energy.',
    tags: ['Birthday', 'Friends', 'Funny'],
    price: 1499,
    badge: 'Popular',
    image:
      'https://lh3.googleusercontent.com/aida/AEtjO1W1-rf5B35JHcgcyZySxOE55Ve_1OiMnt4dbdvzqHpDbDOC8pnidz5Qw7lQhWdCfwJRqbKBQF3DqkxPWvUjmXQPUJp1Gz6SRLI5FPd2E8fFAG2DOu3eVaLNm3xSt_mlkkhmDnShrpQw8_l6SyRUBhRNL47gOYAMf22j7tbVuwtb-XMdsAneXYoH5nefZYuyi2xStYDnmUl3m6P_CuEY6kGA53thcuSXMb8r6zoHFK4O1WOcuU08zWIZZLUU',
  },
  {
    id: 'midnight-mission',
    emoji: '🌙',
    title: 'Midnight Mission',
    body: 'A late-night moment — quiet, cinematic, and impossible to forget.',
    tags: ['Romantic', 'Date-night', 'Midnight'],
    price: 1999,
    badge: 'Popular',
    image:
      'https://lh3.googleusercontent.com/aida/AEtjO1XQLCbq4zzQPwrjQZq5UZhmmo56ngj6bwXfDX6LH_EBUiAYPosGSi5klqfVZZjgNX4DSeXtWKfbs8RCk9XKJooZIvj8TSsXVUVP_sROKihPkinTYHmrAPGtBVELFuw95RUtDrDABKwvcno12ns9IzA7qEc8fLmMGMG6rf-4XZhuCu_E1KdFg9RThCFWYZYxN6t56qgCVuEDQblXYYduUTw108mRn_TJ7KdzaKvdus29Ui7VjrRDznfDkRo',
  },
  {
    id: 'romantic-surprise',
    emoji: '❤️',
    title: 'Romantic Surprise',
    body: 'Roses, a handwritten letter, and a crew that knows how to set a scene.',
    tags: ['Anniversary', 'Romantic', 'Date'],
    price: 2499,
    badge: 'Popular',
    image:
      'https://lh3.googleusercontent.com/aida/AEtjO1UZI5AYXlqt4_E9I4_KAMnaUeReRESMtuX6x-u_365D6ymhD4buts-Rkzb_yGn5JmQOQgplU9lbY67XP5A9zoYNK3_Q47DYOI6MpUgKRu9HqC1Ze0fynfPr86ybPqP3G9EmzYr3ESivYROUQJ8FIFMJ6pVon-ersLeVvbSZ7nJ5HFv8VQsT8dytu0dRfbnyF0fqOXHNhTLZYdUudwl2v1qkN4Duj7-3AOjOonIV7qrTXvCEH1tPPQrWZuga',
  },
  {
    id: 'bollywood-moment',
    emoji: '🎬',
    title: 'Bollywood Moment',
    body: 'A singer, a song, and main character energy right in the middle of the street.',
    tags: ['Dramatic', 'Public'],
    price: 3499,
    badge: 'Dramatic',
    image:
      'https://lh3.googleusercontent.com/aida/AEtjO1VlgQGgyNHyLM2f4960a_EL96ryG-7IELxR0FQX1EYu5Bix03sxlgbmMihzzNfEX-U25cg9C88ItulJVSbAocLeDVZhMjmNa0oesVC-TnOCVO0ZjPYom9-yGIFXDsOaEvC8Lpc7pI5_PEmUDxlC8UxaQPl406-A1T9SUogC-R5GoV72ADy0do7D4PDbcbJc992-leBNF_yXc1pcqZpHaJRP4vLSyUug7W3EV8U3dGvcS00H9at5uSyaLn7X',
  },
] as const;

const REACTIONS = [
  { text: 'omg she literally started crying 😭😭😭', time: '4:12 PM' },
  { text: 'WHAT IS THIS?! omg bestiesee 🥹', time: '5:43 PM' },
  { text: 'best birthday of my life, tell me who sent this', time: '11:02 PM' },
] as const;

export default function HomeScreen() {
  const { patchDraft } = usePlan();
  const { horizontalPadding } = useResponsive();

  function openMood(mood: string) {
    const vibe = MOOD_VIBE[mood];
    if (vibe) {
      patchDraft({ vibe, step: 1 });
    }
    router.push({ pathname: '/book/target', params: { mood } });
  }

  function customize(missionId: string) {
    router.push({ pathname: '/book/target', params: { mission: missionId } });
  }

  return (
    <AppFrame>
      <ScrollView style={styles.scroller} contentContainerStyle={[styles.feed, { paddingHorizontal: horizontalPadding }]} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>India&apos;s Surprise Network</Text>
          </View>
          <Text style={styles.headline}>You don&apos;t have to be there.</Text>
          <Text style={styles.headlinePink}>Launch the moment anyway.</Text>
          <Text style={styles.lede}>
            Send a real experience — cake raids, midnight missions, Bollywood drops — through a Surprise Crew in
            their city. You stay wherever. They get the magic.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/book/target')}
            style={({ pressed }) => [styles.primary, pressed && styles.pressed]}>
            <Text style={styles.primaryLabel}>Create Surprise</Text>
            <ArrowRight color="#FFFFFF" size={16} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/book/target')}
            style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}>
            <Text style={styles.secondaryLabel}>Build a Plan</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => router.push('/experiences')}>
            <Text style={styles.browse}>Browse Experiences</Text>
          </Pressable>

          <View style={styles.heroCard}>
            <Image contentFit="cover" source={{ uri: HERO }} style={styles.heroImage} />
            <View style={styles.heroShade} />
            <View style={styles.cityRow}>
              <Text style={styles.cityPill}>Hyderabad</Text>
              <Text style={styles.cityPill}>Mumbai</Text>
            </View>
            <View style={styles.liveBanner}>
              <View>
                <Text style={styles.liveEyebrow}>Live Execution</Text>
                <Text style={styles.liveTitle}>Crew deployed in 12 mins</Text>
              </View>
              <Pressable accessibilityRole="button" onPress={() => router.push('/track/demo')} style={styles.trackPill}>
                <Text style={styles.trackLabel}>Track Live</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>What do you want them to feel?</Text>
            <Text style={styles.sectionHint}>Tap a vibe</Text>
          </View>
          <View style={styles.moodGrid}>
            {MOODS.map((mood) => (
              <Pressable
                key={mood.id}
                accessibilityRole="button"
                onPress={() => openMood(mood.id)}
                style={({ pressed }) => [styles.mood, pressed && styles.pressed]}>
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <View>
                  <Text style={styles.moodLabel}>{mood.label}</Text>
                  <Text style={styles.moodLine}>{mood.line}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View>
              <Text style={styles.missionsTitle}>Highlight missions</Text>
              <Text style={styles.sectionHint}>Pick a vibe. Customize it. Launch it.</Text>
            </View>
            <Text style={styles.topPicks}>Top Picks</Text>
          </View>
          {MISSIONS.map((mission) => (
            <View key={mission.id} style={styles.mission}>
              <View style={styles.missionArt}>
                <Image contentFit="cover" source={{ uri: mission.image }} style={styles.missionImage} />
                <View style={styles.emojiBubble}>
                  <Text>{mission.emoji}</Text>
                </View>
                <Text style={styles.popular}>{mission.badge}</Text>
              </View>
              <View style={styles.missionBody}>
                <Text style={styles.missionTitle}>{mission.title}</Text>
                <Text style={styles.missionCopy}>{mission.body}</Text>
                <View style={styles.tags}>
                  {mission.tags.map((tag) => (
                    <Text key={tag} style={styles.tag}>
                      {tag}
                    </Text>
                  ))}
                </View>
                <View style={styles.missionFoot}>
                  <View>
                    <Text style={styles.starting}>Starting at</Text>
                    <Text style={styles.price}>{formatBudget(mission.price)} onwards</Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => customize(mission.id)}
                    style={({ pressed }) => [styles.customize, pressed && styles.pressed]}>
                    <Text style={styles.customizeLabel}>Customize</Text>
                    <ArrowRight color="#FFFFFF" size={14} />
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/experiences')}
            style={({ pressed }) => [styles.seeAll, pressed && styles.pressed]}>
            <Text style={styles.seeAllLabel}>See all experiences</Text>
            <ChevronDown color="#E4E4E7" size={16} />
          </Pressable>
        </View>

        <View style={styles.group}>
          <Text style={styles.groupEyebrow}>Group Split</Text>
          <Text style={styles.groupTitle}>Surprising someone together?</Text>
          <Text style={styles.groupBody}>
            Split the cost with friends. Everyone chips in from ₹500, then we launch one equal-sized surprise.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/book/target', params: { type: 'group' } })}
            style={({ pressed }) => [styles.groupBtn, pressed && styles.pressed]}>
            <Text style={styles.groupBtnLabel}>Start a Group Surprise</Text>
          </Pressable>
          <View style={styles.metrics}>
            <Metric value="₹500" label="min. share" />
            <Metric value="10 min" label="to split cost" />
            <Metric value="100%" label="thank-you rate" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Real reactions. Real moments.</Text>
          <Text style={styles.sectionHint}>Captured in real-time by Surprise Crews.</Text>
          {REACTIONS.map((reaction) => (
            <View key={reaction.time} style={styles.bubble}>
              <View style={styles.bubbleHead}>
                <Text style={styles.whatsapp}>WhatsApp</Text>
                <Text style={styles.time}>{reaction.time}</Text>
              </View>
              <Text style={styles.reaction}>{reaction.text}</Text>
            </View>
          ))}
          <Text style={styles.privacy}>Names hidden to protect the surprise confidentiality</Text>
        </View>
      </ScrollView>
    </AppFrame>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroller: {
    flex: 1,
    minHeight: 0,
  },
  feed: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 20,
  },
  hero: {
    alignItems: 'center',
  },
  badge: {
    borderRadius: 999,
    backgroundColor: 'rgba(255, 45, 120, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 45, 120, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 14,
  },
  badgeText: {
    color: Colors.pink,
    fontFamily: Fonts.ui,
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  headline: {
    color: '#FFFFFF',
    fontFamily: Fonts.displayExtra,
    fontSize: 32,
    lineHeight: 36,
    textAlign: 'center',
    letterSpacing: -0.6,
  },
  headlinePink: {
    color: Colors.pinkHot,
    fontFamily: Fonts.displayExtra,
    fontSize: 32,
    lineHeight: 36,
    textAlign: 'center',
    letterSpacing: -0.6,
    marginBottom: 12,
  },
  lede: {
    color: '#A1A1AA',
    fontFamily: Fonts.uiMedium,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: 560,
    marginBottom: 16,
  },
  primary: {
    width: '100%',
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: Colors.pink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },
  primaryLabel: {
    color: '#FFFFFF',
    fontFamily: Fonts.display,
    fontSize: 14,
  },
  secondary: {
    width: '100%',
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: '#1E1C25',
    borderWidth: 1,
    borderColor: '#2D2938',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  secondaryLabel: {
    color: '#E4E4E7',
    fontFamily: Fonts.display,
    fontSize: 14,
  },
  browse: {
    color: '#A1A1AA',
    fontFamily: Fonts.ui,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  heroCard: {
    marginTop: 22,
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2B2738',
    backgroundColor: '#1A1822',
    padding: 6,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    backgroundColor: '#121118',
  },
  heroShade: {
    position: 'absolute',
    left: 6,
    right: 6,
    bottom: 6,
    height: 120,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: 'rgba(20, 19, 24, 0.2)',
  },
  cityRow: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    gap: 6,
  },
  cityPill: {
    overflow: 'hidden',
    color: '#F4F4F5',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontFamily: Fonts.ui,
    fontSize: 10,
  },
  liveBanner: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(23, 21, 30, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  liveEyebrow: {
    color: '#F472B6',
    fontFamily: Fonts.ui,
    fontSize: 9,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  liveTitle: {
    color: '#FFFFFF',
    fontFamily: Fonts.ui,
    fontSize: 12,
  },
  trackPill: {
    backgroundColor: Colors.pink,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  trackLabel: {
    color: '#FFFFFF',
    fontFamily: Fonts.ui,
    fontSize: 10,
  },
  section: {
    gap: 12,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontFamily: Fonts.display,
    fontSize: 18,
    flex: 1,
  },
  missionsTitle: {
    color: '#FFFFFF',
    fontFamily: Fonts.displayExtra,
    fontSize: 20,
  },
  sectionHint: {
    color: '#A1A1AA',
    fontFamily: Fonts.uiMedium,
    fontSize: 12,
    marginTop: 2,
  },
  topPicks: {
    color: Colors.pink,
    backgroundColor: 'rgba(255, 45, 120, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 45, 120, 0.2)',
    borderRadius: 999,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontFamily: Fonts.ui,
    fontSize: 10,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  mood: {
    width: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 16,
    backgroundColor: '#1B1923',
    borderWidth: 1,
    borderColor: '#2B2737',
    padding: 14,
  },
  moodEmoji: {
    fontSize: 22,
  },
  moodLabel: {
    color: '#F4F4F5',
    fontFamily: Fonts.ui,
    fontSize: 12,
  },
  moodLine: {
    color: '#A1A1AA',
    fontFamily: Fonts.uiMedium,
    fontSize: 10,
  },
  mission: {
    backgroundColor: '#1B1922',
    borderWidth: 1,
    borderColor: '#282534',
    borderRadius: 16,
    overflow: 'hidden',
  },
  missionArt: {
    height: 176,
    backgroundColor: '#121118',
  },
  missionImage: {
    width: '100%',
    height: '100%',
  },
  emojiBubble: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popular: {
    position: 'absolute',
    top: 10,
    right: 10,
    overflow: 'hidden',
    backgroundColor: Colors.pink,
    color: '#FFFFFF',
    fontFamily: Fonts.ui,
    fontSize: 9,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  missionBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
  },
  missionTitle: {
    color: '#FFFFFF',
    fontFamily: Fonts.display,
    fontSize: 16,
    marginBottom: 4,
  },
  missionCopy: {
    color: '#A1A1AA',
    fontFamily: Fonts.uiMedium,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    color: '#D4D4D8',
    backgroundColor: '#23202D',
    borderWidth: 1,
    borderColor: '#312C3F',
    borderRadius: 6,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontFamily: Fonts.uiMedium,
    fontSize: 10,
  },
  missionFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#292636',
    paddingTop: 10,
  },
  starting: {
    color: '#A1A1AA',
    fontFamily: Fonts.uiMedium,
    fontSize: 10,
  },
  price: {
    color: '#FFFFFF',
    fontFamily: Fonts.ui,
    fontSize: 14,
  },
  customize: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.pink,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  customizeLabel: {
    color: '#FFFFFF',
    fontFamily: Fonts.ui,
    fontSize: 12,
  },
  seeAll: {
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: '#1E1C26',
    borderWidth: 1,
    borderColor: '#2D2938',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  seeAllLabel: {
    color: '#E4E4E7',
    fontFamily: Fonts.ui,
    fontSize: 12,
  },
  group: {
    borderRadius: 16,
    backgroundColor: Colors.pink,
    padding: 20,
  },
  groupEyebrow: {
    color: 'rgba(255,255,255,0.8)',
    fontFamily: Fonts.ui,
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  groupTitle: {
    color: '#FFFFFF',
    fontFamily: Fonts.displayExtra,
    fontSize: 20,
    marginBottom: 6,
  },
  groupBody: {
    color: 'rgba(255,255,255,0.92)',
    fontFamily: Fonts.uiMedium,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  groupBtn: {
    backgroundColor: '#000000',
    borderRadius: 12,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  groupBtnLabel: {
    color: '#FFFFFF',
    fontFamily: Fonts.display,
    fontSize: 12,
  },
  metrics: {
    flexDirection: 'row',
    gap: 8,
  },
  metric: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    alignItems: 'center',
  },
  metricValue: {
    color: '#FFFFFF',
    fontFamily: Fonts.displayExtra,
    fontSize: 14,
  },
  metricLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontFamily: Fonts.uiMedium,
    fontSize: 9,
    textAlign: 'center',
  },
  bubble: {
    backgroundColor: '#1B1923',
    borderWidth: 1,
    borderColor: '#2B2737',
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  bubbleHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  whatsapp: {
    color: '#25D366',
    backgroundColor: '#10281E',
    borderWidth: 1,
    borderColor: 'rgba(37, 211, 102, 0.2)',
    borderRadius: 999,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontFamily: Fonts.ui,
    fontSize: 9,
  },
  time: {
    color: '#71717A',
    fontFamily: Fonts.uiMedium,
    fontSize: 10,
  },
  reaction: {
    color: '#E4E4E7',
    fontFamily: Fonts.uiMedium,
    fontSize: 12,
    lineHeight: 18,
  },
  privacy: {
    color: '#71717A',
    fontFamily: Fonts.uiMedium,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  pressed: {
    opacity: 0.88,
  },
});
