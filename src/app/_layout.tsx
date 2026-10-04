import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, useFonts } from '@expo-google-fonts/inter';
import { Redirect, Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProviders, useAuth } from '@/state';
import { colors } from '@/theme';

/**
 * Root layout: fonts, safe areas, global state, the route tree, and the auth
 * gate.
 *
 * The gate lives here rather than in a root `index.tsx` on purpose: the tabs
 * group already owns `/`, so a separate root index would be a duplicate route.
 *
 * The design is light-only — Figma defines no dark palette — so the status bar
 * is always dark-on-light regardless of the OS setting. `userInterfaceStyle`
 * in app.json is pinned to "light" for the same reason.
 */
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProviders>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
            <Stack.Screen name="product/[id]" />
            <Stack.Screen name="checkout" />
            <Stack.Screen name="orders" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="membership" />
            <Stack.Screen name="help" />
          </Stack>
          <AuthGate />
        </AppProviders>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

/**
 * Sends signed-out users into the auth flow and pulls signed-in users back into
 * the app.
 *
 * Rendered as a sibling of `<Stack>` rather than inside a route so it applies no
 * matter which screen is currently mounted. While the session is still being read
 * from storage it renders nothing, which prevents a sign-in screen flashing for an
 * already-signed-in user on cold start.
 *
 * Both branches check the current route first. Redirecting unconditionally would
 * fight normal navigation — a signed-in user tapping through to `/settings`
 * would be yanked back to `/` on every render.
 */
function AuthGate() {
  const { status, onboardingSeen } = useAuth();
  const segments = useSegments();

  if (status === 'loading') return null;

  const inAuthGroup = segments[0] === '(auth)';

  if (status === 'signed-out') {
    // Already inside the sign-in flow — let the user move around it freely.
    if (inAuthGroup) return null;
    return <Redirect href={onboardingSeen ? '/sign-in' : '/onboarding'} />;
  }

  // Signed in: only the auth group is off-limits. The tabs and every other
  // stack route are valid destinations.
  if (inAuthGroup) return <Redirect href="/" />;

  return null;
}