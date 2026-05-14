import '@testing-library/jest-native/extend-expect';

// Mock expo-modules that don't work in Jest
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({
      coords: { latitude: 23.8103, longitude: 90.4125 },
    }),
  ),
  reverseGeocodeAsync: jest.fn(() =>
    Promise.resolve([
      { city: 'Dhaka', district: 'Dhaka', region: 'Dhaka', country: 'Bangladesh' },
    ]),
  ),
}));

jest.mock('expo-av', () => ({}));
jest.mock('expo-font', () => ({ useFonts: () => [true] }));
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));
jest.mock('expo-status-bar', () => ({}));
jest.mock('expo-haptics', () => ({}));
jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestMediaLibraryPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  launchCameraAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));
jest.mock('expo-linear-gradient', () => 'LinearGradient');
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: 'View',
  Swipeable: 'View',
}));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};