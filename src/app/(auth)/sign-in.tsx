import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { InputField } from '@/components/InputField';
import { Text } from '@/components/Text';
import { colors, spacing } from '@/theme';
import { AuthError, useAuth } from '@/state';

/**
 * Sign in — Figma "03 Authentication / Sign In" (9:413 at 412×915,
 * 9:451 at 360×800, 9:560 error state).
 *
 * The 360×800 frame is the tight case: the form must not push the CTA off
 * screen, so the action block is pinned to the bottom and the heading block
 * flexes above it.
 */
export default function SignIn() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      await signIn({ email, password });
      // The root AuthGate takes over from here and redirects to the tabs.
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar back onBack={() => router.replace('/welcome')} />

      <View style={{ flex: 1, justifyContent: 'center', gap: spacing.sm, paddingHorizontal: 24 }}>
        <Text variant="display">Sign in</Text>
        <Text variant="body" tone="secondary" style={{ marginBottom: spacing.xl }}>
          Welcome back.
        </Text>

        <View style={{ gap: spacing.lg }}>
          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            editable={!submitting}
            testID="signin-email"
          />
          <InputField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="At least 8 characters"
            secure
            textContentType="password"
            autoComplete="current-password"
            editable={!submitting}
            onSubmitEditing={onSubmit}
            returnKeyType="go"
            testID="signin-password"
          />
        </View>

        {error ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: spacing.sm,
              marginTop: spacing.lg,
            }}
            accessibilityLiveRegion="polite"
          >
            <Icon name="info" size={18} color={colors.error} />
            <Text variant="caption" tone="error" style={{ flex: 1 }}>
              {error}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={{ padding: 24, gap: spacing.lg }}>
        <Button
          label="Sign in"
          block
          onPress={onSubmit}
          loading={submitting}
          disabled={!email || !password}
        />

        <Button
          label="Forgot password?"
          variant="ghost"
          block
          onPress={() => router.replace('/forgot-password')}
        />

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