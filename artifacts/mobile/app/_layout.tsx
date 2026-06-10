import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '../context/AuthContext';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 30_000 },
  },
});

function RootNavigator() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0f0f12' },
        headerTintColor: '#f4f4f8',
        contentStyle: { backgroundColor: '#0f0f12' },
      }}
    >
      {user ? (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="game" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
          <Stack.Screen name="demo" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
          <Stack.Screen name="room-lobby" options={{ headerShown: false }} />
          <Stack.Screen name="live-game" options={{ headerShown: false }} />
          <Stack.Screen name="live-finish" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
          <Stack.Screen name="blend-screen" options={{ title: 'Two Become One', headerBackTitle: 'Back' }} />
          <Stack.Screen name="admin" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </>
      ) : (
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({});
  useEffect(() => { if (loaded) SplashScreen.hideAsync(); }, [loaded]);
  if (!loaded) return null;
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider value={DarkTheme}>
          <RootNavigator />
          <StatusBar style="light" />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
