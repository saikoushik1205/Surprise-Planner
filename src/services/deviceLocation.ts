import { Platform } from 'react-native';
import * as Location from 'expo-location';

function coordsOf(position: Location.LocationObject) {
  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };
}

async function withTimeout<T>(work: Promise<T>, ms: number, message: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<T>((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), ms);
  });
  try {
    return await Promise.race([work, timeout]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}

export async function getDeviceCoords(): Promise<{ lat: number; lng: number }> {
  const servicesOn = await Location.hasServicesEnabledAsync();
  if (!servicesOn) {
    throw new Error('Turn on Location in phone settings, then tap the pin again.');
  }

  const current = await Location.getForegroundPermissionsAsync();
  const permission =
    current.status === 'granted' ? current : await Location.requestForegroundPermissionsAsync();

  if (permission.status !== 'granted') {
    throw new Error('Allow Location for Surprise Planner in phone settings to drop the pin.');
  }

  if (Platform.OS === 'android') {
    try {
      await Location.enableNetworkProviderAsync();
    } catch {
      // User can still get a GPS or last-known fix.
    }
  }

  const last = await Location.getLastKnownPositionAsync().catch(() => null);

  try {
    const position = await withTimeout(
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }),
      12_000,
      'GPS timed out.',
    );
    return coordsOf(position);
  } catch {
    if (last) {
      return coordsOf(last);
    }
    throw new Error('Could not read GPS. Move outdoors or search the area instead.');
  }
}
