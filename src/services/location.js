import { Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PERMISSION = Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
export const DEFAULT_COORDS = { lat: '24.8607', lon: '67.0011' }; // Karachi

// Coordinates the app last saved (onboarding / location refresh), or the default city.
export const getSavedCoords = async () => {
  const [[, lat], [, lon]] = await AsyncStorage.multiGet(['ONLATI', 'ONLONGI']);
  return lat && lon ? { lat, lon, saved: true } : { ...DEFAULT_COORDS, saved: false };
};

// Asks for permission if needed, reads the current position and saves it. Returns coords or null.
export const refreshLocation = async () => {
  let status = await check(PERMISSION);
  if (status === RESULTS.DENIED) status = await request(PERMISSION);
  if (status !== RESULTS.GRANTED && status !== RESULTS.LIMITED) return null;
  const coords = await new Promise((resolve) =>
    Geolocation.getCurrentPosition(
      ({ coords: c }) => resolve({ lat: String(c.latitude), lon: String(c.longitude) }),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 },
    ),
  );
  if (coords) await AsyncStorage.multiSet([['ONLATI', coords.lat], ['ONLONGI', coords.lon]]);
  return coords;
};
