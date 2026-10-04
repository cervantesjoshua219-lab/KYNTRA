import { useFonts } from 'expo-font';
import { Redirect, Stack, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProviders, useAuth } from '@/state';
import { colors } from '@/theme';

/**
 * The five Inter faces the design system uses, required individually.
 *
 * Deliberately not imported from the `@expo-google-fonts/inter` barrel: that
 * package's index statically requires all 18 weights and styles, so a single
 * import from it makes Metro bundle ~6MB of TTF when the app needs 5 faces
 * (~1.6MB). In Expo Go those assets are fetched over HTTP from the dev server,
 * so the 4.4MB of unused fonts is dead weight on every cold start.
 *
 * The object key becomes the font family name, which is what
 * `src/theme/typography.ts` references.
 */
const FONT_ASSETS = {
  Inter_400Regular: require('@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf'),
  Inter_500Medium: require('@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf'),
  Inter_600SemiBold: require('@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf'),
  Inter_700Bold: require('@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf'),
  Inter_800ExtraBold: require('@expo-google-fonts/inter/800ExtraBold/Inter_800ExtraBold.ttf'),
};

// Hold the native splash until the type system is ready. Without this the splash
// hides as soon as JS mounts and exposes the `null` returned while fonts load,
// which reads as a blank white screen. See the Expo font guide for SDK 57.
SplashScreen.preventAutoHideAsync().catch(() => {
  // Already hidden, or unsupported here. Nothing to do.
});

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
  const [fontsLoaded, fontError] = useFonts(FONT_ASSETS);

  useEffect(() => {
    // Reveal the app once the fonts are ready *or* have definitively failed.
    // Waiting on `loaded` alone would strand the splash forever on error.
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (fontError) {
      // Carry on with system fonts rather than showing nothing, but make the
      // cause obvious instead of failing silently to a blank screen.
      console.warn(
        '[kyntra] Inter failed to load; falling back to the system typeface.',
        fontError
      );
    }
  }, [fontError]);

  // Only block while the load is genuinely still in flight. The splash is
  // covering this branch, so the user sees the branded loading screen.
  if (!fontsLoaded && !fontError) return null;

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