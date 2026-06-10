import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Shield, ChevronLeft, LogOut, BarChart3, Users, BookOpen, Zap } from 'lucide-react-native';
import { Colors, Radius, FontSize } from '../constants/colors';
import * as SecureStore from 'expo-secure-store';

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000';
const ADMIN_TOKEN_KEY = 'admin-session-token';

export default function AdminScreen() {
  const [passphrase, setPassphrase] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!passphrase.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/admin/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passphrase }),
      });
      if (!res.ok) { setError('Access denied.'); setLoading(false); return; }
      const data = await res.json();
      setToken(data.token);
      await SecureStore.setItemAsync(ADMIN_TOKEN_KEY, data.token);
    } catch {
      setError('Could not reach server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await SecureStore.deleteItemAsync(ADMIN_TOKEN_KEY);
    setToken(null);
    setPassphrase('');
  };

  if (!token) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={20} color={Colors.text} />
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loginSection}>
          <Shield size={40} color={Colors.primary} />
          <Text style={styles.loginTitle}>Admin Access</Text>
          <TextInput
            style={styles.passphraseInput}
            value={passphrase}
            onChangeText={setPassphrase}
            placeholder="Enter passphrase"
            placeholderTextColor={Colors.textMuted}
            secureTextEntry
            autoFocus
            onSubmitEditing={handleVerify}
          />
          {!!error && <Text style={styles.errorText}>{error}</Text>}
          <TouchableOpacity style={styles.verifyBtn} onPress={handleVerify} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.verifyBtnText}>Verify</Text>}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={20} color={Colors.text} />
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn}>
          <LogOut size={16} color={Colors.textMuted} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.dashContent}>
        <Text style={styles.dashTitle}>Admin Dashboard</Text>
        <Text style={styles.dashSub}>Infinite Us — internal view</Text>

        {[
          { icon: <BarChart3 size={22} color={Colors.primary} />, label: 'Analytics', desc: 'Session volume, drift patterns, card performance', soon: false },
          { icon: <Users size={22} color={Colors.thisOrThat} />, label: 'Active Rooms', desc: 'Live sync sessions currently in progress', soon: false },
          { icon: <BookOpen size={22} color={Colors.legacy} />, label: 'Deck Manager', desc: 'Add, edit, retire cards across all categories', soon: true },
          { icon: <Zap size={22} color={Colors.challenge} />, label: 'Feature Flags', desc: 'Toggle features per platform or audience', soon: true },
        ].map(({ icon, label, desc, soon }) => (
          <View key={label} style={styles.adminCard}>
            {icon}
            <View style={styles.adminCardText}>
              <View style={styles.adminCardRow}>
                <Text style={styles.adminCardTitle}>{label}</Text>
                {soon && (
                  <View style={styles.soonBadge}>
                    <Text style={styles.soonText}>Soon</Text>
                  </View>
                )}
              </View>
              <Text style={styles.adminCardDesc}>{desc}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backBtnText: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  signOutText: { fontSize: FontSize.sm, color: Colors.textMuted },
  loginSection: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 },
  loginTitle: { fontSize: FontSize['2xl'], fontWeight: '700', color: Colors.text },
  passphraseInput: {
    width: '100%',
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: 16,
    fontSize: FontSize.md,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  errorText: { fontSize: FontSize.sm, color: '#ef4444' },
  verifyBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  verifyBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: '700' },
  dashContent: { padding: 20, gap: 14 },
  dashTitle: { fontSize: FontSize['2xl'], fontWeight: '800', color: Colors.text },
  dashSub: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: 8 },
  adminCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: 18,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  adminCardText: { flex: 1, gap: 4 },
  adminCardRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  adminCardTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  soonBadge: { backgroundColor: Colors.surface, borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  soonText: { fontSize: FontSize.xs, color: Colors.textMuted },
  adminCardDesc: { fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 20 },
});
