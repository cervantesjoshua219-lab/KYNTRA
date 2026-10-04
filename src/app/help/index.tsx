import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { Icon } from '@/components/Icon';
import { ListGroup } from '@/components/ListRow';
import { Text } from '@/components/Text';
import { helpTopics } from '@/data/content';
import { useUser } from '@/state';
import { colors, PAGE_MARGIN, radius, spacing } from '@/theme';

/** Figma "15 Help Center" page 9:4764, frame 9:3226. */
export default function Help() {
  const { email, firstName } = useUser();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar back title="Help centre" />

      <ScrollView contentContainerStyle={{ padding: PAGE_MARGIN, gap: spacing.xl, paddingBottom: spacing.xxxl }}>
        <View style={{ gap: spacing.sm }}>
          <Text variant="headline">How can we help, {firstName}?</Text>
          <Text variant="body" tone="secondary">
            Browse a topic, or message us and we will reply within a working day.
          </Text>
        </View>

        <ListGroup>
          {helpTopics.map((topic) => (
            <Pressable
              key={topic.id}
              onPress={() =>
                router.push({
                  pathname: '/help',
                  params: { topic: topic.id },
                })
              }
              accessibilityRole="button"
              accessibilityLabel={`${topic.title}, ${topic.articleCount} articles`}
              style={({ pressed }) => ({
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.lg,
                backgroundColor: pressed ? colors.background : 'transparent',
                gap: spacing.xs,
              })}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <Text variant="body" style={{ flex: 1 }}>
                  {topic.title}
                </Text>
                <Icon name="chevronRight" size={18} color={colors.secondaryText} />
              </View>
              <Text variant="caption" tone="secondary">
                {topic.body} · {topic.articleCount} articles
              </Text>
            </Pressable>
          ))}
        </ListGroup>

        <View
          style={{
            padding: spacing.lg,
            borderRadius: radius.card,
            backgroundColor: colors.secondary,
            gap: spacing.md,
          }}
        >
          <Text variant="section">Still stuck?</Text>
          <Text variant="body" tone="secondary">
            Send us a message and we will get back to you at {email}.
          </Text>
          <Text variant="label" tone="secondary">
            This is a demo — no message is actually sent.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}