import { router } from 'expo-router';
import { View } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { colors, spacing } from '@/theme';

/**
 * Welcome — Figma "03 Authentication / Welcome" (9:393).
 *
 * Entry point for returning users, and the hand-off from onboarding.
 */
export default function Welcome() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar back onBack={() => router.replace('/onboarding')} />

      <View style={{ flex: 1, justifyContent: 'center', gap: spacing.md, paddingHorizontal: 24 }}>
        <Text variant="display">Welcome to KYNTRA</Text>
        <Text variant="body" tone="secondary">
          Sign in to sync your bag, orders and saved items.
        </Text>
      </View>

      <View style={{ padding: 24, gap: spacing.md }}>
        <Button label="Sign in" block onPress={() => router.replace('/sign-in')} />
        <Button
          label="Create an account"
          variant="outline"
          block
          onPress={() => router.replace('/create-account')}
        />
      </View>
    </View>
  );
}