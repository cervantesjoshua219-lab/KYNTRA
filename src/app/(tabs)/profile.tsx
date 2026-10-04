import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Badge } from '@/components/ProductCard';
import { ListGroup, ListRow } from '@/components/ListRow';
import { Text } from '@/components/Text';
import { useAuth, useFavorites, useOrders, useUser } from '@/state';
import { colors, PAGE_MARGIN, spacing } from '@/theme';

const TAB_BAR_CLEARANCE = 96;

/**
 * Profile — Figma "11 Profile" page 9:4760, frames 9:2332 (overview),
 * 9:2420, 9:2460 and 9:2498 (address book, payment methods, order history).
 *
 * The tab bar already carries Favorites; this screen hosts everything else.
 */
export default function Profile() {
  const { firstName, lastName, email, membership, addresses, paymentMethods } = useUser();
  const { orders } = useOrders();
  const { count: savedCount } = useFavorites();
  const { signOut } = useAuth();

  const activeOrder = orders.find((o) => o.status !== 'delivered' && o.status !== 'cancelled');

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: TAB_BAR_CLEARANCE + spacing.xl, gap: spacing.xl }}
    >
      <View style={{ paddingHorizontal: PAGE_MARGIN, paddingTop: spacing.lg, gap: spacing.lg }}>
        <Text variant="title">You</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: colors.secondary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text variant="section">{firstName.charAt(0)}{lastName.charAt(0)}</Text>
          </View>

          <View style={{ flex: 1, gap: spacing.xs }}>
            <Text variant="section">
              {firstName} {lastName}
            </Text>
            <Text variant="caption" tone="secondary" lines={1}>
              {email}
            </Text>
            {membership !== 'guest' ? (
              <View style={{ flexDirection: 'row' }}>
                <Badge label={membership === 'plus' ? 'KYNTRA Plus' : 'Member'} tone="success" />
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: PAGE_MARGIN }}>
        <ListGroup>
          <ListRow
            label="Orders"
            detail={activeOrder ? `Latest: ${activeOrder.id} · ${activeOrder.status}` : `${orders.length} orders`}
            icon="package"
            onPress={() => router.push('/orders')}
          />
          <ListRow
            label="Saved items"
            detail={savedCount ? `${savedCount} saved` : 'Nothing saved yet'}
            icon="heart"
            onPress={() => router.navigate('/favorites')}
          />
          <ListRow
            label="Membership"
            detail={membership === 'plus' ? 'KYNTRA Plus' : membership === 'member' ? 'Member' : 'Guest'}
            icon="award"
            onPress={() => router.push('/membership')}
          />
        </ListGroup>
      </View>

      <View style={{ paddingHorizontal: PAGE_MARGIN }}>
        <ListGroup title="Account">
          <ListRow
            label="Addresses"
            detail={`${addresses.length} saved`}
            icon="pin"
            onPress={() => router.push('/settings')}
          />
          <ListRow
            label="Payment methods"
            detail={
              paymentMethods.length
                ? paymentMethods.map((p) => `${p.brand} ··${p.last4}`).join(', ')
                : 'None added'
            }
            icon="card"
            onPress={() => router.push('/settings')}
          />
          <ListRow
            label="Notifications"
            icon="bell"
            onPress={() => router.push('/notifications')}
          />
          <ListRow label="Settings" icon="settings" onPress={() => router.push('/settings')} />
          <ListRow label="Help centre" icon="help" onPress={() => router.push('/help')} />
        </ListGroup>
      </View>

      <View style={{ paddingHorizontal: PAGE_MARGIN }}>
        <ListGroup>
          <ListRow label="Sign out" destructive icon="signOut" onPress={() => void signOut()} />
        </ListGroup>
      </View>
    </ScrollView>
  );
}