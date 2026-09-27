import * as Location from 'expo-location';

export async function getDeviceCoords(): Promise<{ lat: number; lng: number }> {
  const current = await Location.getForegroundPermissionsAsync();
  const permission =
    current.status === 'granted' ? current : await Location.requestForegroundPermissionsAsync();

  if (permission.status !== 'granted') {
    throw new Error('Location permission was denied. Allow location to drop the pin.');
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };
}
