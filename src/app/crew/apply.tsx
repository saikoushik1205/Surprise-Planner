import { router } from 'expo-router';
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react-native';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AppScreen } from '@/components/layout/AppScreen';
import { AppScrollView } from '@/components/layout/AppScrollView';
import { PasswordRules } from '@/components/auth/PasswordRules';
import { CrewColors, CrewFonts, CrewRadius, CrewShadow, CrewSpace } from '@/constants/crewTheme';
import { getAuthErrorMessage, useAuth } from '@/context/AuthContext';
import { getPasswordChecks, isPasswordStrong, validateEmail } from '@/utils/authValidation';

const CATEGORIES = [
  { id: 'pickup',       label: 'Pickup & Delivery',    description: 'Collect cakes, flowers, gifts from shops' },
  { id: 'decorations',  label: 'Decorations',           description: 'Set up balloons, banners, venue styling' },
  { id: 'coordination', label: 'Setup & Coordination',  description: 'On-site setup and event coordination' },
  { id: 'delivery',     label: 'Delivery',              description: 'Deliver items to venues and customers' },
  { id: 'photography',  label: 'Photography',           description: 'Capture the surprise moments' },
  { id: 'performance',  label: 'Performance',           description: 'Singers, dancers, musicians & entertainers' },
];

const TOTAL_STEPS = 3;
const STEP_TITLES = ['Personal Details', 'Your Category', 'Experience'];

export default function CrewApplyScreen() {
  const { registerCrew } = useAuth();
  const scrollRef = useRef<ScrollView>(null);

  const [step, setStep]             = useState(1);
  const [name, setName]             = useState('');
  const [email, setEmail]           = useState('');
  const [phone, setPhone]           = useState('');
  const [city, setCity]             = useState('');
  const [password, setPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [category, setCategory]     = useState<string | null>(null);
  const [experience, setExperience] = useState('');
  const [error, setError]           = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const passwordChecks = getPasswordChecks(password);

  function scrollTop() {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }

  function goNext() {
    setError(null);
    if (step === 1) {
      if (name.trim().length < 2) { setError('Please enter your full name.'); return; }
      const emailError = validateEmail(email);
      if (emailError) { setError(emailError); return; }
      if (phone.replace(/\D/g, '').length < 8) { setError('Please enter a valid phone number.'); return; }
      if (city.trim().length < 2) { setError('Please enter your city / service area.'); return; }
    }
    if (step === 2 && !category) { setError('Please select a category.'); return; }
    scrollTop();
    setStep((s) => s + 1);
  }

  function goBack() {
    setError(null);
    scrollTop();
    setStep((s) => s - 1);
  }

  async function submit() {
    if (submitting) {
      return;
    }
    if (!category) {
      setError('Please select a category.');
      return;
    }
    if (!isPasswordStrong(password)) {
      setError('Password must be at least 8 characters, with one uppercase letter and one number.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await registerCrew({
        name,
        email,
        password,
        phone,
        city,
        category,
        experience,
      });
      router.replace('/crew/pending');
    } catch (submitError) {
      setError(getAuthErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Multi-step form ──────────────────────────────────────────────── */
  return (
    <AppScreen backgroundColor={CrewColors.bg}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <AppScrollView ref={scrollRef} padded={false} contentContainerStyle={styles.scroll}>
            {/* Brand */}
            <View style={styles.brandRow}>
              <View style={styles.brandIcon}>
                <Shield color={CrewColors.pink} size={18} fill="rgba(255,45,120,0.15)" />
              </View>
              <View>
                <Text style={styles.brandName}>Surprise Planner</Text>
                <Text style={styles.brandSub}>Crew Application</Text>
              </View>
            </View>

            {/* Title */}
            <Text style={styles.heroTitle}>Join the Crew</Text>
            <Text style={styles.heroSub}>
              Apply to become a crew member and help create unforgettable moments.
            </Text>

            {/* Progress */}
            <View style={styles.progressWrap}>
              <View style={styles.progressRow}>
                {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
                  const n = i + 1;
                  const done    = n < step;
                  const current = n === step;
                  return (
                    <View key={n} style={styles.progressItem}>
                      <View style={[
                        styles.progressDot,
                        done    && styles.progressDotDone,
                        current && styles.progressDotActive,
                      ]}>
                        <Text style={[styles.progressNum, (done || current) && styles.progressNumOn]}>
                          {done ? '✓' : n}
                        </Text>
                      </View>
                      <Text style={[styles.progressStepName, current && styles.progressStepNameOn]}>
                        {STEP_TITLES[i]}
                      </Text>
                      {i < TOTAL_STEPS - 1 && (
                        <View style={[styles.progressLine, done && styles.progressLineDone]} />
                      )}
                    </View>
                  );
                })}
              </View>
              <Text style={styles.stepLabel}>Step {step} of {TOTAL_STEPS}</Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Error */}
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* ── Step 1: Personal Details ── */}
            {step === 1 && (
              <View style={styles.fields}>
                <View style={styles.field}>
                  <Text style={styles.label}>Full Name <Text style={styles.req}>*</Text></Text>
                  <TextInput
                    value={name} onChangeText={setName}
                    placeholder="Enter your full name"
                    placeholderTextColor={CrewColors.muted}
                    autoCapitalize="words" autoComplete="name"
                    style={styles.input}
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Email <Text style={styles.req}>*</Text></Text>
                  <TextInput
                    value={email} onChangeText={setEmail}
                    placeholder="you@example.com"
                    placeholderTextColor={CrewColors.muted}
                    keyboardType="email-address" autoCapitalize="none" autoComplete="email"
                    style={styles.input}
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Phone Number <Text style={styles.req}>*</Text></Text>
                  <TextInput
                    value={phone} onChangeText={setPhone}
                    placeholder="+91 98765 43210"
                    placeholderTextColor={CrewColors.muted}
                    keyboardType="phone-pad" autoComplete="tel"
                    style={styles.input}
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>City / Service Area <Text style={styles.req}>*</Text></Text>
                  <TextInput
                    value={city} onChangeText={setCity}
                    placeholder="e.g. Hyderabad"
                    placeholderTextColor={CrewColors.muted}
                    autoCapitalize="words"
                    style={styles.input}
                  />
                </View>
              </View>
            )}

            {/* ── Step 2: Category ── */}
            {step === 2 && (
              <View style={styles.fields}>
                <View style={styles.field}>
                  <Text style={styles.label}>Select Your Category <Text style={styles.req}>*</Text></Text>
                </View>
                {CATEGORIES.map((cat) => {
                  const selected = category === cat.id;
                  return (
                    <Pressable
                      key={cat.id}
                      accessibilityRole="radio"
                      accessibilityState={{ selected }}
                      onPress={() => setCategory(cat.id)}
                      style={[styles.catCard, selected && styles.catCardOn]}
                    >
                      <View style={[styles.radio, selected && styles.radioOn]}>
                        {selected && <View style={styles.radioDot} />}
                      </View>
                      <View style={styles.catText}>
                        <Text style={[styles.catLabel, selected && styles.catLabelOn]}>{cat.label}</Text>
                        <Text style={styles.catDesc}>{cat.description}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}

            {/* ── Step 3: Experience ── */}
            {step === 3 && (
              <View style={styles.fields}>
                <View style={styles.field}>
                  <Text style={styles.label}>
                    Experience <Text style={styles.optional}>(optional)</Text>
                  </Text>
                  <Text style={styles.hint}>
                    Tell us about relevant experience — events, deliveries, photography, performing, etc.
                  </Text>
                  <TextInput
                    value={experience} onChangeText={setExperience}
                    placeholder="e.g. 2 years of event photography, 50+ cake deliveries..."
                    placeholderTextColor={CrewColors.muted}
                    multiline numberOfLines={6} textAlignVertical="top"
                    style={[styles.input, styles.textarea]}
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Password <Text style={styles.req}>*</Text></Text>
                  <TextInput
                    value={password} onChangeText={setPassword}
                    placeholder="Create a password"
                    placeholderTextColor={CrewColors.muted}
                    secureTextEntry autoComplete="new-password"
                    style={styles.input}
                  />
                  <PasswordRules checks={passwordChecks} />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Confirm Password <Text style={styles.req}>*</Text></Text>
                  <TextInput
                    value={confirmPassword} onChangeText={setConfirmPassword}
                    placeholder="Repeat your password"
                    placeholderTextColor={CrewColors.muted}
                    secureTextEntry autoComplete="new-password"
                    style={styles.input}
                  />
                </View>

                {/* Summary */}
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryTitle}>Review your application</Text>
                  <SummaryRow label="Name"     value={name} />
                  <SummaryRow label="Email"    value={email} />
                  <SummaryRow label="Phone"    value={phone} />
                  <SummaryRow label="City"     value={city} />
                  <SummaryRow
                    label="Category"
                    value={CATEGORIES.find((c) => c.id === category)?.label ?? '—'}
                  />
                </View>
              </View>
            )}

            {/* Nav buttons */}
            <View style={styles.navRow}>
              {step > 1 && (
                <Pressable
                  accessibilityRole="button"
                  onPress={goBack}
                  style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
                >
                  <ChevronLeft color={CrewColors.text} size={18} />
                  <Text style={styles.backLabel}>Back</Text>
                </Pressable>
              )}
              {step < TOTAL_STEPS ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={goNext}
                  style={({ pressed }) => [styles.primaryBtn, styles.flex, pressed && styles.btnPressed]}
                >
                  <Text style={styles.primaryBtnLabel}>Next</Text>
                  <ChevronRight color="#fff" size={18} />
                </Pressable>
              ) : (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => void submit()}
                  disabled={submitting}
                  style={({ pressed }) => [styles.primaryBtn, styles.flex, pressed && styles.btnPressed, submitting && styles.btnDisabled]}
                >
                  <Text style={styles.primaryBtnLabel}>
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </Text>
                </Pressable>
              )}
            </View>

            {step === 1 && (
              <Text style={styles.loginHint}>
                Already a crew member?{' '}
                <Text style={styles.loginLink} onPress={() => router.replace({ pathname: '/login', params: { role: 'crew', next: '/crew' } })}>
                  Log in
                </Text>
              </Text>
            )}
          </AppScrollView>
        </KeyboardAvoidingView>
    </AppScreen>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minHeight: 0 },

  scroll: {
    paddingHorizontal: CrewSpace.screen,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 16,
  },

  /* Brand */
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  brandIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,45,120,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,45,120,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    color: CrewColors.text,
    fontFamily: CrewFonts.display,
    fontSize: 14,
  },
  brandSub: {
    color: CrewColors.muted,
    fontFamily: CrewFonts.body,
    fontSize: 11,
  },

  heroTitle: {
    color: CrewColors.text,
    fontFamily: CrewFonts.display,
    fontSize: 30,
    letterSpacing: -0.5,
  },
  heroSub: {
    color: CrewColors.muted,
    fontFamily: CrewFonts.body,
    fontSize: 13,
    lineHeight: 19,
  },

  /* Progress */
  progressWrap: {
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
    marginBottom: 4,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 2,
    borderColor: CrewColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotActive: {
    borderColor: CrewColors.pink,
    backgroundColor: 'rgba(255,45,120,0.14)',
    boxShadow: '0 0 10px rgba(255,45,120,0.35)',
  },
  progressDotDone: {
    borderColor: CrewColors.green,
    backgroundColor: 'rgba(34,197,94,0.14)',
  },
  progressNum: {
    color: CrewColors.muted,
    fontFamily: CrewFonts.bodySemi,
    fontSize: 12,
  },
  progressNumOn: { color: CrewColors.text },
  progressStepName: {
    color: CrewColors.muted,
    fontFamily: CrewFonts.body,
    fontSize: 10,
    marginLeft: 6,
    flexShrink: 1,
  },
  progressStepNameOn: {
    color: CrewColors.pink,
    fontFamily: CrewFonts.bodySemi,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: CrewColors.border,
    marginHorizontal: 8,
    borderRadius: 1,
  },
  progressLineDone: { backgroundColor: CrewColors.green },
  stepLabel: {
    color: CrewColors.muted,
    fontFamily: CrewFonts.body,
    fontSize: 12,
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  divider: {
    height: 1,
    backgroundColor: CrewColors.border,
    marginVertical: 4,
  },

  /* Error */
  errorBox: {
    backgroundColor: 'rgba(255,45,120,0.10)',
    borderWidth: 1,
    borderColor: CrewColors.pink,
    borderRadius: CrewRadius.card,
    padding: 12,
  },
  errorText: {
    color: CrewColors.pink,
    fontFamily: CrewFonts.bodySemi,
    fontSize: 14,
  },

  /* Fields */
  fields: { gap: 14 },
  field:  { gap: 7 },
  label: {
    color: CrewColors.text,
    fontFamily: CrewFonts.bodySemi,
    fontSize: 14,
  },
  req:      { color: CrewColors.pink },
  optional: { color: CrewColors.muted, fontFamily: CrewFonts.body },
  hint: {
    color: CrewColors.muted,
    fontFamily: CrewFonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
  input: {
    backgroundColor: CrewColors.card,
    borderWidth: 1,
    borderColor: CrewColors.border,
    borderRadius: CrewRadius.card,
    paddingHorizontal: CrewSpace.card,
    paddingVertical: 14,
    color: CrewColors.text,
    fontFamily: CrewFonts.body,
    fontSize: 16,
    boxShadow: CrewShadow.card,
  },
  textarea: {
    minHeight: 130,
    paddingTop: 14,
  },

  /* Category cards */
  catCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: CrewColors.card,
    borderWidth: 1,
    borderColor: CrewColors.border,
    borderRadius: CrewRadius.card,
    padding: CrewSpace.card,
  },
  catCardOn: {
    borderColor: CrewColors.pink,
    backgroundColor: 'rgba(255,45,120,0.06)',
  },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: CrewColors.muted,
    alignItems: 'center', justifyContent: 'center',
  },
  radioOn:  { borderColor: CrewColors.pink },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: CrewColors.pink },
  catText:  { flex: 1 },
  catLabel: { color: CrewColors.muted, fontFamily: CrewFonts.bodySemi, fontSize: 15 },
  catLabelOn: { color: CrewColors.text },
  catDesc:  { color: CrewColors.muted, fontFamily: CrewFonts.body, fontSize: 13, marginTop: 2 },

  /* Summary */
  summaryCard: {
    backgroundColor: CrewColors.card,
    borderWidth: 1,
    borderColor: CrewColors.border,
    borderRadius: CrewRadius.card,
    padding: CrewSpace.card,
    gap: 10,
  },
  summaryTitle: {
    color: CrewColors.text,
    fontFamily: CrewFonts.display,
    fontSize: 14,
    marginBottom: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  summaryLabel: { color: CrewColors.muted, fontFamily: CrewFonts.body, fontSize: 13 },
  summaryValue: {
    color: CrewColors.text, fontFamily: CrewFonts.bodySemi, fontSize: 13,
    flex: 1, textAlign: 'right',
  },

  /* Nav */
  navRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: CrewColors.border,
    borderRadius: CrewRadius.pill,
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: CrewColors.card,
  },
  backLabel: { color: CrewColors.text, fontFamily: CrewFonts.bodySemi, fontSize: 15 },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: CrewColors.pink,
    borderRadius: CrewRadius.pill,
    paddingVertical: 15,
    paddingHorizontal: 24,
    boxShadow: CrewShadow.cta,
  },
  primaryBtnLabel: { color: '#fff', fontFamily: CrewFonts.display, fontSize: 15 },
  btnPressed:  { opacity: 0.82 },
  btnDisabled: { opacity: 0.5 },

  loginHint: { color: CrewColors.muted, fontFamily: CrewFonts.body, fontSize: 14, textAlign: 'center' },
  loginLink: { color: CrewColors.pink, fontFamily: CrewFonts.bodySemi },
});
