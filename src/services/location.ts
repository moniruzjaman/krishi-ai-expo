import * as Location from 'expo-location';

export interface Coords {
  latitude: number;
  longitude: number;
}

const DEFAULT: Coords = { latitude: 23.8103, longitude: 90.4125 };

export async function getCurrentLocation(): Promise<Coords> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return DEFAULT;

    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Coarse,
    });
    return {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    };
  } catch {
    return DEFAULT;
  }
}

export async function getLocationName(lat: number, lng: number): Promise<string> {
  try {
    const geocode = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
    if (geocode.length > 0) {
      const a = geocode[0];
      const city = a.city ?? a.district ?? a.region ?? '';
      const country = a.country ?? '';
      return city ? `${city}, ${country}` : 'ঢাকা, বাংলাদেশ';
    }
  } catch {}
  return 'ঢাকা, বাংলাদেশ';
}

export { DEFAULT };
