import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { Icon } from '@/components/Icon';
import type { IconName } from '@/components/Icon';
import { Text } from '@/components/Text';
import { useOrders } from '@/state';
import { colors, PAGE_MARGIN, spacing } from '@/theme';
import type { NotificationKind } from '@/types';
import { relativeTime } from '@/utils';

const KIND_ICON: Record<NotificationKind, IconName> = {
  order: 'package',
  promotion: 'award',
  account: 'user',
  support: 'message',
};

/** Figma "13 Notifications" page 9:4762, frames 9:2835 and 9:2905. */
export default function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useOrders();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar
        back
        title="Notifications"
        right={
          unreadCount ? (
            <Pressable
              onPress={markAllNotificationsRead}
              accessibilityRole="button"
              accessibilityLabel="Mark all as read"
              hitSlop={8}
            >
              <Text variant="label" tone="secondary">
                Mark all read
              </Text>
            </Pressable>
          ) : undefined
        }
      />

      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxxl }}>
        {notifications.map((n) => (
          <Pressable
            key={n.id}
            onPress={() => {
              markNotificationRead(n.id);
              if (n.href) router.push(n.href as '/orders');
            }}
            accessibilityRole="button"
            accessibilityLabel={`${n.title}. ${n.body}`}
            style={({ pressed }) => ({
              flexDirection: 'row',
              gap: spacing.lg,
              paddingHorizontal: PAGE_MARGIN,
              paddingVertical: spacing.lg,
              backgroundColor: pressed ? colors.secondary : n.read ? colors.background : colors.secondary,
            })}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.background,
              }}
            >
              <Icon name={KIND_ICON[n.kind]} size={20} />
            </View>

            <View style={{ flex: 1, gap: spacing.xs }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <Text variant="label" style={{ flex: 1 }} lines={1}>
                  {n.title}
                </Text>
                {n.read ? null : (
                  <View
                    style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary }}
                  />
                )}
              </View>
              <Text variant="body" tone="secondary">
                {n.body}
              </Text>
              <Text variant="caption" tone="secondary">
                {relativeTime(n.createdAt)}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}