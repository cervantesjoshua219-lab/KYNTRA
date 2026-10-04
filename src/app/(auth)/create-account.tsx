import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { Button } from '@/components/Button';
import { InputField } from '@/components/InputField';
import { Text } from '@/components/Text';
import { colors, spacing } from '@/theme';
import { AuthError, useAuth } from '@/state';

/** Figma "03 Authentication / Create Account" (9:489). */
export default function CreateAccount() {
  const { signUp } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      await signUp({ firstName, lastName, email, password });
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const complete = firstName && lastName && email && password;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar back onBack={() => router.replace('/sign-in')} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 24, gap: spacing.xl }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ gap: spacing.sm }}>
          <Text variant="headline">Create an account</Text>
          <Text variant="body" tone="secondary">
            It takes about a minute.
          </Text>
        </View>

        <View style={{ gap: spacing.lg }}>
          <InputField
            label="First name"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Alex"
            autoCapitalize="words"
            textContentType="givenName"
            autoComplete="given-name"
            editable={!submitting}
            testID="signup-firstname"
          />
          <InputField
            label="Last name"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Morgan"
            autoCapitalize="words"
            textContentType="familyName"
            autoComplete="family-name"
            editable={!submitting}
            testID="signup-lastname"
          />
          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            editable={!submitting}
            testID="signup-email"
          />
          <InputField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="At least 8 characters"
            secure
            textContentType="newPassword"
            autoComplete="new-password"
            editable={!submitting}
            testID="signup-password"
          />
        </View>

        {error ? (
          <Text variant="caption" tone="error">
            {error}
          </Text>
        ) : null}

        <Text variant="caption" tone="secondary">
          By creating an account you agree to the Terms of Sale and Privacy Policy.
        </Text>
      </ScrollView>

      <View style={{ padding: 24 }}>
        <Button
          label="Create account"
          block
          onPress={onSubmit}
          loading={submitting}
          disabled={!complete}
        />
      </View>
    </View>
  );
}