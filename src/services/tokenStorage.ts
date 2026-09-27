import { Platform } from 'react-native';

const TOKEN_KEY = 'surprise-planner.authToken';

let memoryToken: string | null = null;

async function nativeStore() {
  return import('expo-secure-store');
}

export async function saveAuthToken(token: string | null): Promise<void> {
  memoryToken = token;

  if (Platform.OS === 'web') {
    if (typeof localStorage === 'undefined') {
      return;
    }
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    return;
  }

  const SecureStore = await nativeStore();
  if (token) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}

export async function loadAuthToken(): Promise<string | null> {
  if (memoryToken) {
    return memoryToken;
  }

  if (Platform.OS === 'web') {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    memoryToken = localStorage.getItem(TOKEN_KEY);
    return memoryToken;
  }

  const SecureStore = await nativeStore();
  memoryToken = await SecureStore.getItemAsync(TOKEN_KEY);
  return memoryToken;
}

export function getAuthToken(): string | null {
  return memoryToken;
}
