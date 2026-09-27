import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  ArrowRight,
  ArrowUp,
  Bookmark,
  CheckCheck,
  Clock,
  Heart,
  Lock,
  MapPin,
  Mic,
  Plus,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp,
  Users,
  Wallet,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { FloatingPromptRows, type PromptChip } from '@/components/ai/FloatingPromptRows';
import { AppFrame } from '@/components/AppFrame';
import { Colors, Fonts } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { usePlan } from '@/context/PlanContext';
import { EXPERIENCES } from '@/data/experiences';
import { AI_PRESETS, PLAN_OCCASIONS } from '@/data/planner';

const L = {
  bg: Colors.ink,
  ink: Colors.snow,
  muted: Colors.muted,
  outline: Colors.muted,
  primary: Colors.pink,
  primaryFill: Colors.pink,
  pink: Colors.pinkHot,
  white: '#FFFFFF',
} as const;

const FILTERS = [
  { id: 'best', label: 'Best match', emoji: '✨' },
  { id: 'budget', label: 'Within budget', emoji: '💰' },
  { id: 'emotional', label: 'Emotional', emoji: '💕' },
  { id: 'fun', label: 'Fun', emoji: '🎉' },
] as const;

type FilterId = (typeof FILTERS)[number]['id'];

type Idea = {
  id: string;
  emoji: string;
  title: string;
  image: string;
  priceLine: string;
  place: string;
  people: string;
  duration: string;
  blurb: string;
  rating: number;
  badges: { label: string; tone: 'violet' | 'pink' | 'lilac' }[];
  tags: FilterId[];
  preset: (typeof AI_PRESETS)[number]['id'];
  slug: string;
  peek?: boolean;
};

const IDEAS: Idea[] = [
  {
    id: 'rooftop',
    emoji: '🌸',
    title: 'Rooftop Birthday Setup',
    image: EXPERIENCES.find((item) => item.slug === 'romantic-surprise')?.image ?? EXPERIENCES[0].image,
    priceLine: '₹3,500 – ₹4,800',
    place: 'Jubilee Hills, HYD',
    people: '4–6 people',
    duration: '2–3 hours',
    blurb:
      'Private terrace with personalized memory wall, fairy lights, custom cake reveal, and curated playlist.',
    rating: 4.9,
    badges: [
      { label: 'Top Match', tone: 'violet' },
      { label: 'Bank discount', tone: 'pink' },
    ],
    tags: ['best', 'emotional', 'budget'],
    preset: 'rooftop-proposal',
    slug: 'romantic-surprise',
  },
  {
    id: 'cinema',
    emoji: '🎬',
    title: 'Private Cinema & Secret Video',
    image: EXPERIENCES.find((item) => item.slug === 'bollywood-moment')?.image ?? EXPERIENCES[0].image,
    priceLine: '₹4,000 – ₹4,999',
    place: 'Gachibowli, HYD',
    people: '6–8 people',
    duration: '3 hours',
    blurb: 'Custom pre-movie montage of childhood photos on 4K big screen followed by cake cutting.',
    rating: 4.8,
    badges: [{ label: 'Instant Confirm', tone: 'lilac' }],
    tags: ['best', 'emotional', 'fun'],
    preset: 'mumbai-birthday',
    slug: 'bollywood-moment',
  },
  {
    id: 'serenade',
    emoji: '🎸',
    title: 'Doorstep Musician Serenade',
    image: EXPERIENCES.find((item) => item.slug === 'midnight-mission')?.image ?? EXPERIENCES[0].image,
    priceLine: '₹2,800',
    place: 'Banjara Hills, HYD',
    people: '2–4 people',
    duration: '45 min',
    blurb: 'An acoustic set at the door with cake, balloons, and a song they will not see coming.',
    rating: 4.7,
    badges: [{ label: 'Under ₹3k', tone: 'pink' }],
    tags: ['best', 'budget', 'emotional', 'fun'],
    preset: 'nri-family',
    slug: 'midnight-mission',
    peek: true,
  },
];

function matchPreset(value: string, fallback: (typeof AI_PRESETS)[number]['id']) {
  const lower = value.toLowerCase();
  if (lower.includes('proposal') || lower.includes('sunset') || lower.includes('romantic')) {
    return 'rooftop-proposal' as const;
  }
  if (lower.includes('nri') || lower.includes('family') || lower.includes('mom') || lower.includes('gift')) {
    return 'nri-family' as const;
  }
  if (lower.includes('birthday') || lower.includes('sister')) {
    return 'mumbai-birthday' as const;
  }
  return fallback;
}

export default function AiPlannerScreen() {
  const { user } = useAuth();
  const { patchDraft } = usePlan();
  const [prompt, setPrompt] = useState('');
  const [picked, setPicked] = useState<(typeof AI_PRESETS)[number]['id']>(AI_PRESETS[0].id);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterId>('best');
  const [followUp, setFollowUp] = useState('');
  const [sentAt, setSentAt] = useState('');

  const chatting = query.length > 0;

  const firstName = useMemo(() => {
    const raw = user?.name?.trim() || 'there';
    return raw.split(/\s+/)[0] ?? 'there';
  }, [user?.name]);

  const ideas = useMemo(
    () => IDEAS.filter((idea) => idea.tags.includes(filter)),
    [filter],
  );

  function applyPrompt(value: string) {
    setPrompt(value);
    setPicked(matchPreset(value, picked));
  }

  function startChat(seed = prompt) {
    const next = seed.trim();
    if (!next) {
      return;
    }
    setQuery(next);
    setSentAt(
      new Date().toLocaleTimeString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
      }),
    );
    setPicked(matchPreset(next, picked));
    setPrompt('');
    setFollowUp('');
    setFilter('best');
  }

  function resetChat() {
    setQuery('');
    setPrompt('');
    setFollowUp('');
    setFilter('best');
  }

  function planIdea(idea: Idea) {
    const preset = AI_PRESETS.find((item) => item.id === idea.preset) ?? AI_PRESETS[0];
    const occasion = PLAN_OCCASIONS.find((item) => item.id === preset.occasion);
    patchDraft({
      occasion: preset.occasion,
      vibe: preset.vibe,
      venue: preset.venue,
      addons: [...preset.addons],
      city: preset.city,
      revealText: query || occasion ? query || `Pack your bags — ${occasion?.label} is waiting.` : idea.title,
      step: 5,
    });
    router.push('/book/target');
  }

  return (
    <AppFrame>
      <View style={styles.stage}>
      {chatting ? (
        <>
          <View style={styles.chatBar}>
            <View style={styles.badge}>
              <Sparkles color={Colors.pink} size={14} />
              <Text style={styles.badgeText}>Surprise Assistant</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="New chat"
              onPress={resetChat}
              style={styles.newChat}
            >
              <Plus color={Colors.pink} size={16} />
              <Text style={styles.newChatLabel}>New</Text>
            </Pressable>
          </View>
          <ResultsView
            query={query}
            sentAt={sentAt}
            filter={filter}
            ideas={ideas}
            followUp={followUp}
            onFilter={setFilter}
            onFollowUp={setFollowUp}
            onSendFollowUp={() => startChat(followUp)}
            onPlan={planIdea}
            compact={false}
          />
        </>
      ) : (
        <>
          <ScrollView
            style={styles.scroller}
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.hero}>
              <View style={styles.modePill}>
                <View style={styles.liveDot} />
                <Text style={styles.modeText}>Autonomous Planning Mode</Text>
              </View>
              <Text style={styles.hello}>
                Hey {firstName}, <Text>👋</Text>
              </Text>
              <Text style={styles.question}>what&apos;s your surprise?</Text>
            </View>

            <Composer
              value={prompt}
              placeholder="✨ Tell me what you’re planning..."
              onChange={applyPrompt}
              onSend={() => startChat()}
            />

            <View style={styles.promptsHead}>
              <Text style={styles.promptsLabel}>Quick prompts & ideas</Text>
              <View style={styles.floating}>
                <Sparkles color={Colors.pink} size={12} />
                <Text style={styles.floatingText}>Floating ideas</Text>
              </View>
            </View>

            <FloatingPromptRows selected={prompt} onPick={(chip: PromptChip) => applyPrompt(chip.label)} />
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.footPill}>
              <Lock color={Colors.pink} size={14} />
              <Text style={styles.footText}>
                We plan occasions, timelines, budgets & secret logistics automatically.
              </Text>
            </View>
          </View>
        </>
      )}
      </View>
    </AppFrame>
  );
}

function Composer({
  value,
  placeholder,
  onChange,
  onSend,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onSend: () => void;
}) {
  return (
    <View style={styles.inputShell}>
      <View style={styles.sparkle}>
        <Sparkles color={L.primaryFill} size={18} />
      </View>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={Colors.muted}
        style={styles.input}
        returnKeyType="send"
        onSubmitEditing={onSend}
      />
      <Pressable accessibilityRole="button" accessibilityLabel="Voice input" style={styles.micBtn}>
        <Mic color={L.muted} size={18} />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Plan with AI"
        onPress={onSend}
        style={styles.sendBtn}
      >
        <ArrowUp color={L.white} size={18} />
      </Pressable>
    </View>
  );
}

function ResultsView({
  query,
  sentAt,
  filter,
  ideas,
  followUp,
  onFilter,
  onFollowUp,
  onSendFollowUp,
  onPlan,
  compact,
}: {
  query: string;
  sentAt: string;
  filter: FilterId;
  ideas: Idea[];
  followUp: string;
  onFilter: (id: FilterId) => void;
  onFollowUp: (value: string) => void;
  onSendFollowUp: () => void;
  onPlan: (idea: Idea) => void;
  compact: boolean;
}) {
  const who = query.toLowerCase().includes('sister') ? 'your sister' : 'them';

  return (
    <>
      <ScrollView
        style={styles.scroller}
        contentContainerStyle={styles.chatBody}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.userWrap}>
          <View style={styles.userBubble}>
            <Text style={styles.userText}>{query}</Text>
            <View style={styles.userMeta}>
              <Text style={styles.userTime}>{sentAt}</Text>
              <CheckCheck color="rgba(255,255,255,0.75)" size={12} />
            </View>
          </View>
        </View>

        <View style={styles.assistantHead}>
          <View style={styles.avatar} />
          <View style={styles.assistantCopy}>
            <Text style={styles.assistantEyebrow}>
              SURPRISE ASSISTANT  ·  Just now
            </Text>
            <Text style={styles.assistantTitle}>
              Here are some memorable surprise ideas I&apos;d plan for {who} ✨
            </Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTERS.map((item) => {
            const on = filter === item.id;
            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                onPress={() => onFilter(item.id)}
                style={[styles.filterChip, on && styles.filterOn]}
              >
                <Text style={[styles.filterText, on && styles.filterTextOn]}>
                  {item.emoji} {item.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {compact ? (
          <View style={styles.cardGrid}>
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} onPlan={() => onPlan(idea)} wide />
            ))}
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardRow}>
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} onPlan={() => onPlan(idea)} />
            ))}
          </ScrollView>
        )}

        <View style={styles.feedback}>
          <Heart color={Colors.pink} fill={Colors.pink} size={16} />
          <Text style={styles.feedbackText}>Which of these surprises feels right for {who}?</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Thumbs up" style={styles.reactBtn}>
            <ThumbsUp color={L.muted} size={16} />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Thumbs down" style={styles.reactBtn}>
            <ThumbsDown color={L.muted} size={16} />
          </Pressable>
        </View>

        <Text style={styles.disclaimer}>
          Surprise AI customizes itineraries, secret bookings & logistics seamlessly.
        </Text>
      </ScrollView>

      <View style={styles.dock}>
        <View style={styles.followShell}>
          <Sparkles color={L.primaryFill} size={18} />
          <TextInput
            value={followUp}
            onChangeText={onFollowUp}
            placeholder={'Ask Surprise AI (e.g., "Make it cheaper")'}
            placeholderTextColor={Colors.muted}
            style={styles.followInput}
            returnKeyType="send"
            onSubmitEditing={onSendFollowUp}
          />
          <Pressable accessibilityRole="button" accessibilityLabel="Voice input" style={styles.micBtn}>
            <Mic color={L.muted} size={16} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Send follow-up"
            onPress={onSendFollowUp}
            style={styles.sendBtn}
          >
            <ArrowUp color={L.white} size={18} />
          </Pressable>
        </View>
      </View>
    </>
  );
}

function IdeaCard({ idea, onPlan, wide }: { idea: Idea; onPlan: () => void; wide?: boolean }) {
  if (idea.peek) {
    return (
      <View style={[styles.peekCard, wide && styles.peekCardWide]}>
        <View style={styles.peekArt}>
          <Image source={{ uri: idea.image }} style={styles.peekImage} contentFit="cover" />
          {idea.badges[0] ? (
            <View style={[styles.badgeMini, idea.badges[0].tone === 'pink' && styles.badgePink]}>
              <Text style={styles.badgeMiniText}>{idea.badges[0].label}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.peekTitle}>
          {idea.emoji} {idea.title}
        </Text>
        <Text style={styles.peekPrice}>{idea.priceLine}</Text>
        <Pressable accessibilityRole="button" onPress={onPlan} style={styles.peekCta}>
          <Text style={styles.peekCtaText}>Plan</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.ideaCard, wide && styles.ideaCardWide]}>
      <View style={styles.artWrap}>
        <Image source={{ uri: idea.image }} style={styles.art} contentFit="cover" />
        <View style={styles.badgeCol}>
          {idea.badges.map((badge) => (
            <View
              key={badge.label}
              style={[
                styles.floatBadge,
                badge.tone === 'pink' && styles.badgePink,
                badge.tone === 'lilac' && styles.badgeLilac,
              ]}
            >
              <Text style={styles.floatBadgeText}>{badge.label}</Text>
            </View>
          ))}
        </View>
        <View style={styles.bookmark}>
          <Bookmark color={L.muted} size={16} />
        </View>
        <View style={styles.ratingPill}>
          <Star color="#F59E0B" fill="#F59E0B" size={12} />
          <Text style={styles.ratingText}>{idea.rating.toFixed(1)}</Text>
        </View>
      </View>

      <Text style={styles.ideaTitle}>
        {idea.emoji} {idea.title}
      </Text>
      <View style={styles.metaGrid}>
        <View style={styles.metaCell}>
          <Wallet color={L.primaryFill} size={14} />
          <Text style={styles.metaPrice}>{idea.priceLine}</Text>
        </View>
        <View style={styles.metaCell}>
          <MapPin color={L.muted} size={14} />
          <Text style={styles.metaText}>{idea.place}</Text>
        </View>
        <View style={styles.metaCell}>
          <Users color={L.muted} size={14} />
          <Text style={styles.metaText}>{idea.people}</Text>
        </View>
        <View style={styles.metaCell}>
          <Clock color={L.muted} size={14} />
          <Text style={styles.metaText}>{idea.duration}</Text>
        </View>
      </View>
      <View style={styles.blurb}>
        <Text style={styles.blurbText}>{idea.blurb}</Text>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={`Plan ${idea.title}`} onPress={onPlan} style={styles.planBtn}>
        <Text style={styles.planBtnText}>Plan this surprise</Text>
        <ArrowRight color={L.white} size={16} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    minHeight: 0,
  },
  scroller: {
    flex: 1,
  },
  chatBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  newChat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.pinkMuted,
    borderWidth: 1,
    borderColor: 'rgba(255, 45, 120, 0.3)',
  },
  newChatLabel: {
    color: Colors.pink,
    fontFamily: Fonts.ui,
    fontSize: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.pinkMuted,
    borderWidth: 1,
    borderColor: 'rgba(255, 45, 120, 0.25)',
  },
  badgeText: {
    color: Colors.pink,
    fontFamily: Fonts.uiMedium,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 14,
  },
  hero: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.panel,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  modeText: {
    color: L.muted,
    fontFamily: Fonts.uiMedium,
    fontSize: 12,
  },
  hello: {
    color: L.ink,
    fontFamily: Fonts.displayExtra,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  question: {
    color: Colors.pinkHot,
    fontFamily: Fonts.displayExtra,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  inputShell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 999,
    backgroundColor: Colors.raised,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sparkle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.pinkMuted,
  },
  input: {
    flex: 1,
    color: L.ink,
    fontFamily: Fonts.bodyMedium,
    fontSize: 15,
    paddingVertical: 8,
  },
  micBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.panel,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.pink,
  },
  promptsHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  promptsLabel: {
    color: L.outline,
    fontFamily: Fonts.jakartaExtra,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  floating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  floatingText: {
    color: L.primaryFill,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 12,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: 8,
    alignItems: 'center',
    backgroundColor: Colors.ink,
  },
  footPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    maxWidth: 420,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: Colors.panel,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  footText: {
    flex: 1,
    color: L.muted,
    fontFamily: Fonts.body,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
  chatBody: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 14,
  },
  userWrap: {
    alignItems: 'flex-end',
  },
  userBubble: {
    maxWidth: '85%',
    backgroundColor: Colors.pink,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userText: {
    color: L.white,
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 6,
  },
  userTime: {
    color: 'rgba(255,255,255,0.7)',
    fontFamily: Fonts.body,
    fontSize: 10,
  },
  assistantHead: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.pink,
    marginTop: 2,
  },
  assistantCopy: {
    flex: 1,
    gap: 4,
  },
  assistantEyebrow: {
    color: Colors.pink,
    fontFamily: Fonts.uiMedium,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  assistantTitle: {
    color: L.ink,
    fontFamily: Fonts.display,
    fontSize: 20,
    lineHeight: 24,
  },
  filterRow: {
    gap: 8,
    paddingRight: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.panel,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterOn: {
    backgroundColor: Colors.pink,
    borderColor: Colors.pink,
  },
  filterText: {
    color: L.muted,
    fontFamily: Fonts.uiMedium,
    fontSize: 12,
  },
  filterTextOn: {
    color: L.white,
  },
  cardRow: {
    gap: 14,
    paddingRight: 24,
    paddingVertical: 4,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  ideaCard: {
    width: 304,
    backgroundColor: Colors.panel,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 10,
    gap: 10,
  },
  ideaCardWide: {
    width: '48%',
    minWidth: 280,
    flexGrow: 1,
  },
  artWrap: {
    height: 176,
    borderRadius: 16,
    overflow: 'hidden',
  },
  art: {
    width: '100%',
    height: '100%',
  },
  badgeCol: {
    position: 'absolute',
    top: 10,
    left: 10,
    gap: 6,
  },
  floatBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.pink,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgePink: {
    backgroundColor: Colors.pinkHot,
  },
  badgeLilac: {
    backgroundColor: '#8B83FF',
  },
  floatBadgeText: {
    color: L.white,
    fontFamily: Fonts.ui,
    fontSize: 10,
  },
  bookmark: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(12, 11, 16, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingPill: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(12, 11, 16, 0.82)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  ratingText: {
    color: L.ink,
    fontFamily: Fonts.ui,
    fontSize: 11,
  },
  ideaTitle: {
    color: L.ink,
    fontFamily: Fonts.display,
    fontSize: 16,
    paddingHorizontal: 6,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 6,
  },
  metaCell: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaPrice: {
    color: Colors.pink,
    fontFamily: Fonts.ui,
    fontSize: 12,
  },
  metaText: {
    color: L.muted,
    fontFamily: Fonts.body,
    fontSize: 12,
    flex: 1,
  },
  blurb: {
    marginHorizontal: 6,
    backgroundColor: Colors.raised,
    borderRadius: 14,
    padding: 10,
  },
  blurbText: {
    color: L.muted,
    fontFamily: Fonts.body,
    fontSize: 12,
    lineHeight: 17,
    fontStyle: 'italic',
  },
  planBtn: {
    marginHorizontal: 6,
    marginBottom: 6,
    backgroundColor: Colors.pink,
    borderRadius: 999,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  planBtnText: {
    color: L.white,
    fontFamily: Fonts.ui,
    fontSize: 13,
  },
  peekCard: {
    width: 160,
    backgroundColor: Colors.panel,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 10,
    gap: 8,
    opacity: 0.92,
  },
  peekCardWide: {
    width: 200,
  },
  peekArt: {
    height: 128,
    borderRadius: 16,
    overflow: 'hidden',
  },
  peekImage: {
    width: '100%',
    height: '100%',
  },
  badgeMini: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: L.pink,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgeMiniText: {
    color: L.white,
    fontFamily: Fonts.jakartaBold,
    fontSize: 10,
  },
  peekTitle: {
    color: L.ink,
    fontFamily: Fonts.jakartaBold,
    fontSize: 14,
    lineHeight: 18,
  },
  peekPrice: {
    color: L.primaryFill,
    fontFamily: Fonts.jakartaBold,
    fontSize: 13,
  },
  peekCta: {
    alignSelf: 'flex-start',
    backgroundColor: L.primaryFill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  peekCtaText: {
    color: L.white,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 12,
  },
  feedback: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.panel,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  feedbackText: {
    flex: 1,
    color: L.ink,
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
  },
  reactBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.raised,
  },
  disclaimer: {
    color: L.outline,
    fontFamily: Fonts.body,
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  dock: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: 6,
  },
  followShell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.raised,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  followInput: {
    flex: 1,
    color: L.ink,
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    paddingVertical: 6,
  },
});
