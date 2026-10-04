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
 * Forgot password — Figma "03 Authentication / Forgot Password — email sent"
 * (9:533). Figma only designs the confirmation state, so the form and the
 * confirmation are both implemented and swap on success.
 */
export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    setSending(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Something went wrong. Try again.');
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <AppBar back onBack={() => router.replace('/sign-in')} />
        <View style={{ flex: 1, justifyContent: 'center', gap: spacing.lg, paddingHorizontal: 24 }}>
          <Icon name="mail" size={40} color={colors.primary} />
          <Text variant="headline">Check your email</Text>
          <Text variant="body" tone="secondary">
            If an account exists for {email}, we have sent a link to reset your password.
          </Text>
        </View>
        <View style={{ padding: 24, gap: spacing.md }}>
          <Button label="Back to sign in" block onPress={() => router.replace('/sign-in')} />
          <Button
            label="Send to a different address"
            variant="ghost"
            block
            onPress={() => setSent(false)}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar back onBack={() => router.replace('/sign-in')} />

      <View style={{ flex: 1, justifyContent: 'center', gap: spacing.xl, paddingHorizontal: 24 }}>
        <View style={{ gap: spacing.sm }}>
          <Text variant="headline">Reset your password</Text>
          <Text variant="body" tone="secondary">
            Enter the email you used to sign up and we will send you a link.
          </Text>
        </View>

        <InputField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          editable={!sending}
          error={error}
          testID="reset-email"
        />
      </View>

      <View style={{ padding: 24 }}>
        <Button
          label="Send reset link"
          block
          onPress={onSubmit}
          loading={sending}
          disabled={!email}
        />
      </View>
    </View>
  );
}