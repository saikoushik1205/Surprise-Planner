import {
  AuthError,
  type AuthService,
  type AuthUser,
  type CrewRegisterInput,
  type LoginInput,
  type SignupInput,
} from '@/types/auth';

import { ApiError, apiRequest } from './api';
import { loadAuthToken, saveAuthToken } from './tokenStorage';

type AuthPayload = {
  user: AuthUser;
  token: string;
};

type MePayload = {
  user: AuthUser;
};

export class RemoteAuthService implements AuthService {
  async signup(input: SignupInput): Promise<AuthUser> {
    const data = await apiRequest<AuthPayload>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: input.name.trim(),
        email: input.email.trim(),
        password: input.password,
      }),
    });
    await saveAuthToken(data.token);
    return data.user;
  }

  async registerCrew(input: CrewRegisterInput): Promise<AuthUser> {
    const data = await apiRequest<{ user: AuthUser }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: input.name.trim(),
        email: input.email.trim(),
        password: input.password,
        role: 'crew',
        phone: input.phone.trim(),
        city: input.city.trim(),
        category: input.category,
        experience: input.experience.trim(),
      }),
    });

    if (data.user.role !== 'crew' || data.user.crewStatus !== 'pending') {
      throw new ApiError('Something went wrong. Please try again.', 500);
    }

    return data.user;
  }

  async login(input: LoginInput): Promise<AuthUser> {
    const data = await apiRequest<AuthPayload>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: input.email.trim(),
        password: input.password,
      }),
    });
    await saveAuthToken(data.token);
    return data.user;
  }

  async logout(): Promise<void> {
    await saveAuthToken(null);
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const token = await loadAuthToken();
    if (!token) {
      return null;
    }

    try {
      const data = await apiRequest<MePayload>('/auth/me');
      return data.user;
    } catch (error) {
      if (error instanceof AuthError) {
        await saveAuthToken(null);
        return null;
      }
      throw error;
    }
  }
}

export const authService: AuthService = new RemoteAuthService();
