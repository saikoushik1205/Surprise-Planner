export type AuthRole = 'customer' | 'crew';
export type CrewStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export function authRoleFromParam(value: string | string[] | undefined): AuthRole | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === 'customer' || raw === 'crew') {
    return raw;
  }
  return undefined;
}

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role?: AuthRole;
  crewStatus?: CrewStatus | null;
};

export function isApprovedCrew(user: AuthUser | null | undefined): boolean {
  return user?.role === 'crew' && user.crewStatus === 'approved';
}

export type LoginInput = {
  email: string;
  password: string;
};

export type SignupInput = {
  name: string;
  email: string;
  password: string;
};

export type CrewRegisterInput = {
  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  category: string;
  experience: string;
};

export type AuthService = {
  signup: (input: SignupInput) => Promise<AuthUser>;
  registerCrew: (input: CrewRegisterInput) => Promise<AuthUser>;
  login: (input: LoginInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<AuthUser | null>;
};

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}
