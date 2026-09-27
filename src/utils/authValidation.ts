import type { LoginInput, SignupInput } from '@/types/auth';

export type LoginErrors = Partial<Record<keyof LoginInput, string>>;
export type SignupErrors = Partial<Record<keyof SignupInput | 'confirmPassword', string>>;

export type PasswordChecks = {
  minLength: boolean;
  uppercase: boolean;
  number: boolean;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function getPasswordChecks(password: string): PasswordChecks {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
  };
}

export function isPasswordStrong(password: string): boolean {
  const checks = getPasswordChecks(password);
  return checks.minLength && checks.uppercase && checks.number;
}

export function validateEmail(email: string): string | undefined {
  const value = email.trim();
  if (!value) {
    return 'Email is required.';
  }
  if (!EMAIL_PATTERN.test(value)) {
    return 'Invalid email address.';
  }
  return undefined;
}

export function validateLogin(values: LoginInput): LoginErrors {
  const errors: LoginErrors = {};
  const emailError = validateEmail(values.email);
  if (emailError) {
    errors.email = emailError;
  }
  if (!values.password) {
    errors.password = 'Password is required.';
  }
  return errors;
}

export function validateSignup(values: SignupInput & { confirmPassword: string }): SignupErrors {
  const errors: SignupErrors = {};
  const name = values.name.trim();

  if (!name) {
    errors.name = 'Full name is required.';
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (name.length > 60) {
    errors.name = 'Name must be under 60 characters.';
  }

  const emailError = validateEmail(values.email);
  if (emailError) {
    errors.email = emailError;
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (!isPasswordStrong(values.password)) {
    errors.password = 'Password must be at least 8 characters, with one uppercase letter and one number.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm your password.';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some(Boolean);
}
