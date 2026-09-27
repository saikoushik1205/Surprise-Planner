import {
  ArrowRight,
  ArrowUpRight,
  AtSign,
  BadgeCheck,
  Check,
  Code,
  Eye,
  EyeOff,
  Fingerprint,
  Lock,
  UserRound,
} from 'lucide-react-native';
import { type ReactNode, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AuthNight } from '@/components/auth/MissionAuth';
import { Fonts } from '@/constants/theme';

type FieldProps = {
  label: string;
  icon: 'mail' | 'lock' | 'user';
  error?: string;
  verified?: boolean;
  trailing?: ReactNode;
  secureToggle?: boolean;
} & TextInputProps;

export function MissionField({
  label,
  icon,
  error,
  verified,
  trailing,
  secureToggle,
  ...inputProps
}: FieldProps) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const secure = Boolean(secureToggle && !visible);

  return (
    <View style={styles.fieldWrap}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <View style={[styles.field, focused && styles.fieldFocus, error ? styles.fieldError : null]}>
        {icon === 'mail' ? (
          <AtSign color={AuthNight.muted} size={18} />
        ) : icon === 'user' ? (
          <UserRound color={AuthNight.muted} size={18} />
        ) : (
          <Lock color={AuthNight.muted} size={18} />
        )}
        <TextInput
          placeholderTextColor={AuthNight.subtle}
          {...inputProps}
          onBlur={(event) => {
            setFocused(false);
            inputProps.onBlur?.(event);
          }}
          onFocus={(event) => {
            setFocused(true);
            inputProps.onFocus?.(event);
          }}
          secureTextEntry={secureToggle ? secure : inputProps.secureTextEntry}
          style={[styles.input, secureToggle && styles.secret]}
        />
        {verified ? <BadgeCheck color={AuthNight.live} size={18} /> : null}
        {secureToggle ? (
          <Pressable
            accessibilityLabel={visible ? 'Hide password' : 'Show password'}
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => setVisible((current) => !current)}
            style={styles.eye}
          >
            {visible ? <Eye color={AuthNight.muted} size={18} /> : <EyeOff color={AuthNight.muted} size={18} />}
          </Pressable>
        ) : null}
        {trailing}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

export function MissionLaunch({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.launch, pressed && !disabled && styles.launchPressed, disabled && styles.launchDisabled]}
    >
      <Text style={styles.launchLabel}>{label}</Text>
      <ArrowRight color={AuthNight.text} size={18} />
    </Pressable>
  );
}

export function MissionDivider() {
  return (
    <View style={styles.divider}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerLabel}>or continue with</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

export function MissionSocial({ onUnavailable }: { onUnavailable: (message: string) => void }) {
  return (
    <View style={styles.socialRow}>
      <Pressable
        accessibilityLabel="Google sign-in"
        accessibilityRole="button"
        onPress={() => onUnavailable('Google sign-in is not connected yet.')}
        style={styles.social}
      >
        <Svg height={20} viewBox="0 0 24 24" width={20}>
          <Path d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" fill="#EA4335" />
          <Path d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z" fill="#4285F4" />
          <Path d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" fill="#FBBC05" />
          <Path d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" fill="#34A853" />
        </Svg>
      </Pressable>
      <Pressable
        accessibilityLabel="Apple sign-in"
        accessibilityRole="button"
        onPress={() => onUnavailable('Apple sign-in is not connected yet.')}
        style={styles.social}
      >
        <Svg height={20} viewBox="0 0 24 24" width={20}>
          <Path
            d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8.92-2.85-.9.04-2 .6-2.65 1.35-.56.64-1.06 1.7-.92 2.73 1.01.08 2.04-.48 2.65-1.23z"
            fill="#FFFFFF"
          />
        </Svg>
      </Pressable>
      <Pressable
        accessibilityLabel="Passkey sign-in"
        accessibilityRole="button"
        onPress={() => onUnavailable('Passkey sign-in is not connected yet.')}
        style={styles.social}
      >
        <Fingerprint color={AuthNight.coral} size={18} />
        <Text style={styles.passkey}>Passkey</Text>
      </Pressable>
    </View>
  );
}

export function RememberRow({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.rememberRow}>
      <Pressable
        accessibilityLabel="Remember this device"
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        onPress={onToggle}
        style={styles.remember}
      >
        <View style={[styles.box, checked && styles.boxOn]}>
          {checked ? <Check color={AuthNight.text} size={14} strokeWidth={3} /> : null}
        </View>
        <Text style={styles.rememberLabel}>Remember this device</Text>
      </Pressable>
      <View style={styles.encrypted}>
        <View style={styles.liveDot} />
        <Text style={styles.encryptedLabel}>Encrypted</Text>
      </View>
    </View>
  );
}

export function SandboxCard({ onAutofill }: { onAutofill: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onAutofill} style={styles.sandbox}>
      <Code color="#FFBA20" size={18} />
      <View style={styles.sandboxCopy}>
        <Text style={styles.sandboxLabel}>Sandbox test credentials</Text>
        <Text numberOfLines={1} style={styles.sandboxValue}>
          test@surpriseplanner.com • Test@1234
        </Text>
      </View>
      <View style={styles.autofill}>
        <Text style={styles.autofillLabel}>Autofill</Text>
      </View>
    </Pressable>
  );
}

export function VaultLine() {
  return (
    <View style={styles.vault}>
      <Lock color={AuthNight.live} size={14} />
      <Text style={styles.vaultText}>256-Bit Secret Vault • Never spoils the surprise</Text>
    </View>
  );
}

export function GuestLink({ onPress }: { onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.guest}>
      <Text style={styles.guestText}>Explore live surprises as a Guest</Text>
      <ArrowUpRight color={AuthNight.subtle} size={14} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fieldWrap: {
    gap: 8,
  },
  fieldLabel: {
    color: AuthNight.muted,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingHorizontal: 4,
  },
  field: {
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: AuthNight.elevated,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
  },
  fieldFocus: {
    boxShadow: 'inset 0 0 0 2px #FF4B72',
  },
  fieldError: {
    boxShadow: 'inset 0 0 0 2px #FFB4AB',
  },
  input: {
    flex: 1,
    minWidth: 0,
    color: AuthNight.text,
    fontFamily: Fonts.jakarta,
    fontSize: 14,
    paddingVertical: 12,
    overflow: 'hidden',
  },
  secret: {
    letterSpacing: 1,
    paddingRight: 44,
  },
  eye: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  error: {
    color: '#FFB4AB',
    fontFamily: Fonts.jakarta,
    fontSize: 12,
    paddingHorizontal: 4,
  },
  launch: {
    marginTop: 8,
    minHeight: 56,
    borderRadius: 12,
    backgroundColor: '#FF2D8A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0 8px 24px rgba(255, 45, 138, 0.35)',
  },
  launchPressed: {
    transform: [{ scale: 0.98 }],
  },
  launchDisabled: {
    opacity: 0.7,
  },
  launchLabel: {
    color: AuthNight.text,
    fontFamily: Fonts.jakartaBold,
    fontSize: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: AuthNight.elevated,
  },
  dividerLabel: {
    color: AuthNight.subtle,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  social: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: AuthNight.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  passkey: {
    color: AuthNight.text,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 12,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  remember: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: AuthNight.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOn: {
    backgroundColor: AuthNight.coral,
  },
  rememberLabel: {
    color: AuthNight.muted,
    fontFamily: Fonts.jakarta,
    fontSize: 12,
  },
  encrypted: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AuthNight.live,
  },
  encryptedLabel: {
    color: AuthNight.subtle,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
  },
  sandbox: {
    width: '100%',
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: '#1E1F26',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sandboxCopy: {
    flex: 1,
    minWidth: 0,
  },
  sandboxLabel: {
    color: AuthNight.muted,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
  },
  sandboxValue: {
    color: AuthNight.text,
    fontFamily: Fonts.uiBold,
    fontSize: 12,
  },
  autofill: {
    backgroundColor: AuthNight.elevated,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  autofillLabel: {
    color: AuthNight.coral,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
  },
  vault: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  vaultText: {
    color: AuthNight.subtle,
    fontFamily: Fonts.jakartaSemi,
    fontSize: 11,
    letterSpacing: 0.3,
  },
  guest: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 8,
  },
  guestText: {
    color: AuthNight.subtle,
    fontFamily: Fonts.jakarta,
    fontSize: 12,
  },
});
