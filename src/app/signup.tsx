import { Link, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AuthNight, MissionAuth } from '@/components/auth/MissionAuth';
import {
  GuestLink,
  MissionDivider,
  MissionField,
  MissionLaunch,
  MissionSocial,
  VaultLine,
} from '@/components/auth/MissionControls';
import { PasswordRules } from '@/components/auth/PasswordRules';
import { Banner } from '@/components/Banner';
import { Fonts } from '@/constants/theme';
import { getAuthErrorMessage, useAuth } from '@/context/AuthContext';
import { authRoleFromParam } from '@/types/auth';
import { getPasswordChecks, hasErrors, validateSignup } from '@/utils/authValidation';

function nextPath(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw && raw.startsWith('/') && !raw.startsWith('//')) {
    return raw;
  }
  return '/';
}

export default function SignupScreen() {
  const { signup } = useAuth();
  const params = useLocalSearchParams<{ next?: string; role?: string }>();
  const next = Array.isArray(params.next) ? params.next[0] : params.next;
  const role = authRoleFromParam(params.role);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<ReturnType<typeof validateSignup>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordChecks = useMemo(() => getPasswordChecks(password), [password]);

  useEffect(() => {
    if (role === 'crew') {
      router.replace('/crew/apply');
    }
  }, [role]);

  function clearFieldError(field: keyof typeof errors) {
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(null);
  }

  async function handleSignup() {
    if (isSubmitting) {
      return;
    }

    const nextErrors = validateSignup({ name, email, password, confirmPassword });
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      setFormError('Fix the highlighted fields to continue.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setInfo(null);

    try {
      await signup({ name, email, password });
      router.replace(nextPath(params.next) as never);
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  const loginHref = {
    pathname: '/login' as const,
    params: { ...(next ? { next } : {}), ...(role ? { role } : {}) },
  };

  return (
    <MissionAuth
      mode="signup"
      next={next}
      role={role}
      footer={
        <View style={styles.footer}>
          <Text style={styles.switch}>
            Already have an account?{' '}
            <Link href={loginHref as never} style={styles.switchLink}>
              Log in
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
          label="Full name"
          icon="user"
          placeholder="Your name"
          value={name}
          onChangeText={(value) => {
            setName(value);
            clearFieldError('name');
          }}
          error={errors.name}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
        />
        <MissionField
          label="Email or Mobile Number"
          icon="mail"
          placeholder="name@email.com"
          value={email}
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
        <MissionField
          label="Secret Key / Password"
          icon="lock"
          placeholder="Create a secret key"
          value={password}
          secureToggle
          onChangeText={(value) => {
            setPassword(value);
            clearFieldError('password');
          }}
          error={errors.password}
          autoComplete="new-password"
          textContentType="newPassword"
        />
        <PasswordRules checks={passwordChecks} />
        <MissionField
          label="Confirm Secret Key"
          icon="lock"
          placeholder="Repeat your secret key"
          value={confirmPassword}
          secureToggle
          onChangeText={(value) => {
            setConfirmPassword(value);
            clearFieldError('confirmPassword');
          }}
          error={errors.confirmPassword}
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="done"
          onSubmitEditing={() => {
            void handleSignup();
          }}
        />
        <MissionLaunch
          disabled={isSubmitting}
          label={
            isSubmitting
              ? 'Initializing Account...'
              : role === 'crew'
                ? 'Register as Crew'
                : 'Initialize Surprise Account'
          }
          onPress={() => {
            void handleSignup();
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
