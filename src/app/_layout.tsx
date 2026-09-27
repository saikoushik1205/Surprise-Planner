import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { Syne_700Bold, Syne_800ExtraBold } from '@expo-google-fonts/syne';
import { useFonts } from 'expo-font';
import { router, Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { Colors } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PlanProvider } from '@/context/PlanContext';
import { SurpriseProvider } from '@/context/SurpriseContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsReady] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Syne_700Bold,
    Syne_800ExtraBold,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    if (fontsReady) {
      SplashScreen.hide();
    }
  }, [fontsReady]);

  if (!fontsReady) {
    return null;
  }

  return (
    <AuthProvider>
      <SurpriseProvider>
        <PlanProvider>
          <StatusBar style="light" />
          <RootNavigator />
        </PlanProvider>
      </SurpriseProvider>
    </AuthProvider>
  );
}

function RootNavigator() {
  const { user, isReady } = useAuth();
  const pathname = usePathname();
  const isLoggedIn = Boolean(user);
  const isAuthRoute = pathname === '/role' || pathname === '/login' || pathname === '/signup';
  const isGuestBrowse = pathname.startsWith('/experiences');
  const isCrewPortal = pathname === '/crew' || pathname.startsWith('/crew/');

  useEffect(() => {
    if (!isReady) {
      return;
    }
    if (!isLoggedIn && !isAuthRoute && !isGuestBrowse && !isCrewPortal) {
      router.replace('/role');
    }
  }, [isAuthRoute, isCrewPortal, isGuestBrowse, isLoggedIn, isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.ink },
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="experiences" />
      <Stack.Screen name="crew" />
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="index" />
        <Stack.Screen name="create-surprise" />
        <Stack.Screen name="book" />
        <Stack.Screen name="surprise" />
        <Stack.Screen name="account" />
        <Stack.Screen name="track" />
        <Stack.Screen name="ai-planner" />
      </Stack.Protected>

      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="role" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
      </Stack.Protected>
    </Stack>
  );
}
