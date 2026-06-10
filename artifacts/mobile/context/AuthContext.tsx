import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';

export interface UserProfile {
  id: string;
  coupleName: string;
  partner1Name: string;
  partner2Name: string;
  avatarApproved: boolean;
  avatarUrl?: string;
  anniversaryDate?: string;
  joinedAt: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  signIn: (profile: Omit<UserProfile, 'id' | 'joinedAt'>) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (partial: Partial<UserProfile>) => Promise<void>;
  approveAvatar: (avatarUrl: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const PROFILE_KEY = 'user-profile';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync(PROFILE_KEY)
      .then((raw) => {
        if (raw) {
          try {
            setUser(JSON.parse(raw));
          } catch {
            setUser(null);
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const signIn = useCallback(async (profile: Omit<UserProfile, 'id' | 'joinedAt'>) => {
    const fullProfile: UserProfile = {
      ...profile,
      id: `couple-${Date.now()}`,
      joinedAt: new Date().toISOString(),
    };
    setUser(fullProfile);
    await SecureStore.setItemAsync(PROFILE_KEY, JSON.stringify(fullProfile));
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    const keys = [
      PROFILE_KEY,
      'growth-score',
      'couple-name',
      'sessions',
      'card-intelligence',
      'active-session',
      'pending-avatar',
    ];
    await Promise.all(keys.map((k) => SecureStore.deleteItemAsync(k)));
  }, []);

  const updateProfile = useCallback(
    async (partial: Partial<UserProfile>) => {
      if (!user) return;
      const updated = { ...user, ...partial };
      setUser(updated);
      await SecureStore.setItemAsync(PROFILE_KEY, JSON.stringify(updated));
    },
    [user]
  );

  const approveAvatar = useCallback(
    async (avatarUrl: string) => {
      if (!user) return;
      const updated = { ...user, avatarUrl, avatarApproved: true };
      setUser(updated);
      await SecureStore.setItemAsync(PROFILE_KEY, JSON.stringify(updated));
      await SecureStore.deleteItemAsync('pending-avatar');
    },
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, updateProfile, approveAvatar }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
