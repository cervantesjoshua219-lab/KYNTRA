import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { ACCOUNT } from '@/data/account';
import { readJson, storageKeys, writeJson } from '@/services/storage';
import type { Address, PaymentMethod, Preferences } from '@/types';

/** Seeded once, on first run, so the profile and checkout screens have content. */
const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    label: 'Home',
    line1: '18 Beaumont Rise',
    line2: 'Flat 3',
    city: 'Bristol',
    postcode: 'BS1 4TR',
    country: 'United Kingdom',
    isDefault: true,
  },
];

const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pay-1',
    brand: 'Visa',
    last4: '4242',
    expiry: Date.now() + 1000 * 60 * 60 * 24 * 365 * 3,
    isDefault: true,
  },
];

const DEFAULT_PREFERENCES: Preferences = {
  darkMode: false,
  emailNotifications: true,
  pushNotifications: true,
  orderSms: false,
};

type UserValue = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  membership: 'guest' | 'member' | 'plus';
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  preferences: Preferences;
  hydrating: boolean;

  setProfile: (p: { firstName: string; lastName: string; email: string; phone?: string }) => void;
  setMembership: (tier: 'guest' | 'member' | 'plus') => void;

  addAddress: (a: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, patch: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  addPaymentMethod: (p: Omit<PaymentMethod, 'id'>) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;

  setPreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
};

const UserContext = createContext<UserValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string>(ACCOUNT.email);
  const [firstName, setFirstName] = useState<string>(ACCOUNT.firstName);
  const [lastName, setLastName] = useState<string>(ACCOUNT.lastName);
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [membership, setMembership] = useState<UserValue['membership']>('member');
  const [addresses, setAddresses] = useState<Address[]>(DEFAULT_ADDRESSES);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(DEFAULT_PAYMENT_METHODS);
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [hydrating, setHydrating] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [a, p, pref] = await Promise.all([
        readJson<Address[]>(storageKeys.addresses, DEFAULT_ADDRESSES),
        readJson<PaymentMethod[]>(storageKeys.paymentMethods, DEFAULT_PAYMENT_METHODS),
        readJson<Preferences>(storageKeys.preferences, DEFAULT_PREFERENCES),
      ]);
      if (cancelled) return;
      setAddresses(a);
      setPaymentMethods(p);
      setPreferences(pref);
      setHydrating(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (hydrating) return;
    void writeJson(storageKeys.addresses, addresses);
  }, [addresses, hydrating]);

  useEffect(() => {
    if (hydrating) return;
    void writeJson(storageKeys.paymentMethods, paymentMethods);
  }, [paymentMethods, hydrating]);

  useEffect(() => {
    if (hydrating) return;
    void writeJson(storageKeys.preferences, preferences);
  }, [preferences, hydrating]);

  const setProfile = useCallback<UserValue['setProfile']>((next) => {
    setFirstName(next.firstName);
    setLastName(next.lastName);
    setEmail(next.email);
    setPhone(next.phone);
  }, []);

  const addAddress = useCallback<UserValue['addAddress']>((a) => {
    setAddresses((prev) => [
      ...prev,
      { ...a, id: `addr-${Date.now()}`, isDefault: prev.length === 0 || a.isDefault },
    ]);
  }, []);

  const updateAddress = useCallback<UserValue['updateAddress']>((id, patch) => {
    setAddresses((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }, []);

  const removeAddress = useCallback<UserValue['removeAddress']>((id) => {
    setAddresses((prev) => {
      const next = prev.filter((a) => a.id !== id);
      // Never leave the list with no default.
      if (next.length && !next.some((a) => a.isDefault)) next[0] = { ...next[0], isDefault: true };
      return next;
    });
  }, []);

  const setDefaultAddress = useCallback<UserValue['setDefaultAddress']>((id) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  }, []);

  const addPaymentMethod = useCallback<UserValue['addPaymentMethod']>((p) => {
    setPaymentMethods((prev) => [
      ...prev,
      { ...p, id: `pay-${Date.now()}`, isDefault: prev.length === 0 || p.isDefault },
    ]);
  }, []);

  const removePaymentMethod = useCallback<UserValue['removePaymentMethod']>((id) => {
    setPaymentMethods((prev) => {
      const next = prev.filter((p) => p.id !== id);
      if (next.length && !next.some((p) => p.isDefault)) next[0] = { ...next[0], isDefault: true };
      return next;
    });
  }, []);

  const setDefaultPaymentMethod = useCallback<UserValue['setDefaultPaymentMethod']>((id) => {
    setPaymentMethods((prev) => prev.map((p) => ({ ...p, isDefault: p.id === id })));
  }, []);

  const setPreference = useCallback<UserValue['setPreference']>((key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  }, []);

  const value = useMemo<UserValue>(
    () => ({
      firstName,
      lastName,
      email,
      phone,
      membership,
      addresses,
      paymentMethods,
      preferences,
      hydrating,
      setProfile,
      setMembership,
      addAddress,
      updateAddress,
      removeAddress,
      setDefaultAddress,
      addPaymentMethod,
      removePaymentMethod,
      setDefaultPaymentMethod,
      setPreference,
    }),
    [
      firstName,
      lastName,
      email,
      phone,
      membership,
      addresses,
      paymentMethods,
      preferences,
      hydrating,
      setProfile,
      setMembership,
      addAddress,
      updateAddress,
      removeAddress,
      setDefaultAddress,
      addPaymentMethod,
      removePaymentMethod,
      setDefaultPaymentMethod,
      setPreference,
    ],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside <UserProvider>');
  return ctx;
}