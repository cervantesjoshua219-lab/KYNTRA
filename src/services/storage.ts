import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Thin AsyncStorage wrapper.
 *
 * Every persisted key is namespaced so `clear()` cannot collide with anything
 * else the app might store later.
 */

const PREFIX = '@kyntra/';

export const storageKeys = {
  auth: `${PREFIX}auth`,
  cart: `${PREFIX}cart`,
  favorites: `${PREFIX}favorites`,
  orders: `${PREFIX}orders`,
  user: `${PREFIX}user`,
  addresses: `${PREFIX}addresses`,
  paymentMethods: `${PREFIX}paymentMethods`,
  preferences: `${PREFIX}preferences`,
  recentSearches: `${PREFIX}recentSearches`,
  onboardingSeen: `${PREFIX}onboardingSeen`,
} as const;

export type StorageKey = (typeof storageKeys)[keyof typeof storageKeys];

export async function readJson<T>(key: StorageKey, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    // Corrupt value or storage unavailable — fall back rather than crash.
    return fallback;
  }
}

export async function writeJson<T>(key: StorageKey, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable. Persistence is best-effort by design.
  }
}

export async function remove(key: StorageKey): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // ignore
  }
}