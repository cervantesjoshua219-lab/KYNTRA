import { Stack } from 'expo-router';

import { colors } from '@/theme';

/**
 * Pre-sign-in flow.
 *
 * Linear, so the back arrow is suppressed except where Figma designs one (see
 * the app bars on Welcome and Forgot Password).
 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="create-account" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}