import { Link, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MissionAuth, AuthNight } from '@/components/auth/MissionAuth';
import {
  GuestLink,
  MissionDivider,
  MissionField,
  MissionLaunch,
  MissionSocial,
  RememberRow,
  SandboxCard,
  VaultLine,
} from '@/components/auth/MissionControls';
import { TEST_ACCOUNT, TEST_CREW_ACCOUNT } from '@/data/mockUsers';
import { Banner } from '@/components/Banner';
import { Fonts } from '@/constants/theme';
import { getAuthErrorMessage, useAuth } from '@/context/AuthContext';
import { authRoleFromParam } from '@/types/auth';
import { hasErrors, validateEmail, validateLogin } from '@/utils/authValidation';

function nextPath(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw && raw.startsWith('/') && !raw.startsWith('//')) {
    return raw;
  }
  return '/';
}

export default function LoginScreen() {
  const { login } = useAuth();
  const params = useLocalSearchParams<{ next?: string; role?: string }>();
  const next = Array.isArray(params.next) ? params.next[0] : params.next;
  const role = authRoleFromParam(params.role);
  const sandbox = role === 'crew' ? TEST_CREW_ACCOUNT : TEST_ACCOUNT;
  const [email, setEmail] = useState(role === 'crew' ? sandbox.email : '');
  const [password, setPassword] = useState(role === 'crew' ? sandbox.password : '');
  const [passwordFieldKey, setPasswordFieldKey] = useState(0);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<ReturnType<typeof validateLogin>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearFieldError(field: 'email' | 'password') {
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(null);
  }

  async function handleLogin() {
    if (isSubmitting) {
      return;
    }
    const nextErrors = validateLogin({ email, password });
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      setFormError('Fix the highlighted fields to continue.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setInfo(null);

    try {
      const nextUser = await login({
        email,
        password,
        ...(role ? { role } : {}),
      });
      if (!rememberMe) {
        setEmail('');
      }
      setPassword('');
      if (nextUser.role === 'crew') {
        router.replace((nextUser.crewStatus === 'approved' ? '/crew' : '/crew/pending') as never);
        return;
      }
      if (role === 'crew') {
        setFormError('This is a customer account. Use the crew sandbox credentials to open the crew dashboard.');
        return;
      }
      router.replace(nextPath(params.next) as never);
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  const signupHref = {
    pathname: '/signup' as const,
    params: { ...(next ? { next } : {}), ...(role ? { role } : {}) },
  };
  const cta = isSubmitting ? 'Verifying Secret Key...' : 'Log In to Mission Control';

  return (
    <MissionAuth
      mode="login"
      next={next}
      role={role}
      footer={
        <View style={styles.footer}>
          <Text style={styles.switch}>
            Don&apos;t have an account?{' '}
            <Link href={signupHref as never} style={styles.switchLink}>
              Create one in 30s
            </Link>
          </Text>
          <GuestLink onPress={() => router.push('/experiences')} />
          <VaultLine />
        </View>
      }
    >
      {formError ? <Banner tone="error" message={formError} /> : null}
      {info ? <Banner tone="success" message={info} /> : null}

      <View style={styles.form}>
        <MissionField
          label="Email or Mobile Number"
          icon="mail"
          placeholder="name@email.com or +91..."
          value={email}
          verified={!validateEmail(email)}
          onChangeText={(value) => {
            setEmail(value);
            clearFieldError('email');
          }}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          textContentType="emailAddress"
          returnKeyType="next"
        />

        <View style={styles.passwordBlock}>
          <View style={styles.labelRow}>
            <Text style={styles.sideLabel}>Secret Key / Password</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setInfo('Password reset will be available when the backend is connected.')}
            >
              <Text style={styles.link}>Forgot password?</Text>
            </Pressable>
          </View>
          <MissionField
            key={`password-${passwordFieldKey}`}
            label=""
            icon="lock"
            placeholder="••••••••••••"
            value={password}
            secureToggle
            onChangeText={(value) => {
              setPassword(value);
              clearFieldError('password');
            }}
            error={errors.password}
            autoComplete="password"
            returnKeyType="done"
            onSubmitEditing={() => {
              void handleLogin();
            }}
          />
        </View>

        <RememberRow checked={rememberMe} onToggle={() => setRememberMe((current) => !current)} />

        <MissionLaunch
          disabled={isSubmitting}
          label={cta}
          onPress={() => {
            void handleLogin();
          }}
        />

        <SandboxCard
          label={role === 'crew' ? 'Crew sandbox' : 'Customer sandbox'}
          email={sandbox.email}
          password={sandbox.password}
          onAutofill={() => {
            setEmail(sandbox.email);
            setPassword(sandbox.password);
            setPasswordFieldKey((current) => current + 1);
          }}
        />
      </View>

      <MissionDivider />
      <MissionSocial onUnavailable={setInfo} />
    </MissionAuth>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 14,
  },
  passwordBlock: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  sideLabel: {
    color: AuthNight.muted,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  link: {
    color: AuthNight.coral,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
  },
  footer: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 8,
  },
  switch: {
    color: AuthNight.muted,
    fontFamily: Fonts.jakarta,
    fontSize: 14,
    textAlign: 'center',
  },
  switchLink: {
    color: AuthNight.coral,
    fontFamily: Fonts.jakartaBold,
  },
});
