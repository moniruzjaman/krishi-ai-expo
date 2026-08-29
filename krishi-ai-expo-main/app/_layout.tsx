import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Keep splash screen until fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Expo bundles local fonts; Hind Siliguri served via Google Fonts CDN at runtime
    // or add OTF/TTF files to assets/fonts/ and reference them here
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor="#ffffff" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#f8fafc' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="analyzer"  options={{ presentation: 'modal',  animation: 'slide_from_bottom' }} />
          <Stack.Screen name="chat"      options={{ presentation: 'card' }} />
          <Stack.Screen name="pesticide" options={{ presentation: 'card' }} />
          <Stack.Screen name="soil"      options={{ presentation: 'card' }} />
          <Stack.Screen name="yield"     options={{ presentation: 'card' }} />
          <Stack.Screen name="weather"   options={{ presentation: 'card' }} />
          <Stack.Screen name="calendar"  options={{ presentation: 'card' }} />
          <Stack.Screen name="market"    options={{ presentation: 'card' }} />
          <Stack.Screen name="nutrient"  options={{ presentation: 'card' }} />
          <Stack.Screen name="library"   options={{ presentation: 'card' }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
