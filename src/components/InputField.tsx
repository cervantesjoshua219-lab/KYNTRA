import { useState } from 'react';
import { TextInput, View } from 'react-native';
import type { KeyboardTypeOptions, StyleProp, TextInputProps, ViewStyle } from 'react-native';

import { colors, radius, spacing } from '@/theme';
import { Icon } from './Icon';
import { IconButton } from './IconButton';
import { Text } from './Text';

type Props = {
  label?: string;
  value: string;
  onChangeText: (next: string) => void;
  placeholder?: string;
  /** Shows the red error token and the message below the field. */
  error?: string | null;
  /** Adds the eye toggle and masks input. */
  secure?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
  textContentType?: TextInputProps['textContentType'];
  leading?: React.ReactNode;
  editable?: boolean;
  onSubmitEditing?: () => void;
  returnKeyType?: TextInputProps['returnKeyType'];
  autoFocus?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * Text input.
 *
 * 16dp radius per the Figma surface spec, with the hairline border carrying the
 * error state — the design has no red-filled fields.
 *
 * Height is `spacing.target` (48dp) so every field meets the minimum touch
 * target.
 */
export function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secure = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete,
  textContentType,
  leading,
  editable = true,
  onSubmitEditing,
  returnKeyType,
  autoFocus = false,
  containerStyle,
  testID,
}: Props) {
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const borderColor = error ? colors.error : focused ? colors.primary : colors.border;

  return (
    <View style={[{ gap: spacing.sm }, containerStyle]}>
      {label ? (
        <Text variant="label" tone={error ? 'error' : 'primary'}>
          {label}
        </Text>
      ) : null}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          minHeight: spacing.target,
          paddingHorizontal: spacing.lg,
          borderRadius: radius.input,
          borderWidth: 1,
          borderColor,
          backgroundColor: colors.background,
          opacity: editable ? 1 : 0.5,
        }}
      >
        {leading}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.secondaryText}
          secureTextEntry={secure && !revealed}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          textContentType={textContentType}
          editable={editable}
          autoFocus={autoFocus}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label ?? placeholder}
          testID={testID}
          style={{
            flex: 1,
            minHeight: spacing.target,
            paddingVertical: spacing.sm,
            fontFamily: 'Inter_400Regular',
            fontSize: 15,
            color: colors.primary,
          }}
        />

        {secure ? (
          <IconButton
            accessibilityLabel={revealed ? 'Hide password' : 'Show password'}
            tone="ghost"
            style={{ width: 32, height: 32 }}
            onPress={() => setRevealed((v) => !v)}
          >
            <Icon name={revealed ? 'eyeOff' : 'eye'} size={20} color={colors.secondaryText} />
          </IconButton>
        ) : null}
      </View>

      {error ? (
        <Text variant="caption" tone="error">
          {error}
        </Text>
      ) : null}
    </View>
  );
}