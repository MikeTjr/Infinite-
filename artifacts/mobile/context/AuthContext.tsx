import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export interface UserProfile {
  id: string;
  coupleName: string;
  partner1Name: string;
  partner2Name: string;
  avatarApproved: boolean;
  avatarUrl?: string;
  anniversaryDate?: string;
  anniversaryYear?: number;
  joinedAt: string;
  googleUserId?: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  googleSignIn: () => Promise<void>;
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

  // Google auth request — clientId from env var
  const [, googleResponse, promptGoogleAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    redirectUri: makeRedirectUri({ scheme: 'infiniteus' }),
  });

  // Handle Google auth response
  useEffect(() => {
    if (googleResponse?.type === 'success' && googleResponse.authentication?.accessToken) {
      fetchGoogleUser(googleResponse.authentication.accessToken);
    }
  }, [googleResponse]);

  async function fetchGoogleUser(accessToken: string) {
    try {
      const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const googleUser = await res.json();
      const existingRaw = await SecureStore.getItemAsync(PROFILE_KEY);
      const existing: Partial<UserProfile> = existingRaw ? JSON.parse(existingRaw) : {};
      const profile: UserProfile = {
        id: existing.id ?? `couple-${Date.now()}`,
        coupleName: existing.coupleName ?? googleUser.name ?? 'Us',
        partner1Name: existing.partner1Name ?? googleUser.given_name ?? '',
        partner2Name: existing.partner2Name ?? '',
        avatarApproved: existing.avatarApproved ?? false,
        avatarUrl: existing.avatarUrl,
        anniversaryDate: existing.anniversaryDate,
        anniversaryYear: existing.anniversaryYear,
        joinedAt: existing.joinedAt ?? new Date().toISOString(),
        googleUserId: googleUser.id,
      };
      setUser(profile);
      await SecureStore.setItemAsync(PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // Silently continue — Google fetch failure should not break the app
    }
  }

  useEffect(() => {
    SecureStore.getItemAsync(PROFILE_KEY)
      .then((raw) => {
        if (raw) {
          try { setUser(JSON.parse(raw)); } catch { setUser(null); }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const googleSignIn = useCallback(async () => {
    await promptGoogleAsync();
  }, [promptGoogleAsync]);

  const signIn = useCallback(async (profile: Omit<UserProfile, 'id' | 'joinedAt'>) => {
    const anniversaryYear = profile.anniversaryDate
      ? new Date(profile.anniversaryDate).getFullYear()
      : undefined;
    const fullProfile: UserProfile = {
      ...profile,
      anniversaryYear,
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
      'admin-session-token',
    ];
    await Promise.all(keys.map((k) => SecureStore.deleteItemAsync(k)));
  }, []);

  const updateProfile = useCallback(
    async (partial: Partial<UserProfile>) => {
      if (!user) return;
      const updated = {
        ...user,
        ...partial,
        anniversaryYear: partial.anniversaryDate
          ? new Date(partial.anniversaryDate).getFullYear()
          : user.anniversaryYear,
      };
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
    <AuthContext.Provider value={{ user, loading, googleSignIn, signIn, signOut, updateProfile, approveAvatar }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
