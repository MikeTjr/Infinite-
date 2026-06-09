import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { useState } from 'react';
import { Users, Plus, Hash, Copy } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors, Radius, FontSize } from '../../constants/colors';

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? '';

export default function BondsScreen() {
  const [view, setView] = useState<'list' | 'create' | 'join'>('list');
  const [bondName, setBondName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [bonds, setBonds] = useState<Array<{ id: string; name: string; code: string; memberCount: number; collectiveScore: number }>>([]);

  const handleCreate = async () => {
    if (!bondName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/bonds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: bondName, coupleId: 'mobile-user', coupleName: 'Your Couple', score: 0 }),
      });
      const data = await res.json();
      setBonds(prev => [...prev, data]);
      setBondName('');
      setView('list');
      Alert.alert('Bond Created!', `Share code: ${data.code}`);
    } catch {
      Alert.alert('Error', 'Could not create bond. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (joinCode.length < 4) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/bonds/${joinCode}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coupleId: 'mobile-user', coupleName: 'Your Couple', score: 0 }),
      });
      if (!res.ok) {
        Alert.alert('Not Found', 'Bond not found. Check the code and try again.');
        return;
      }
      const data = await res.json();
      setBonds(prev => [...prev, data]);
      setJoinCode('');
      setView('list');
    } catch {
      Alert.alert('Error', 'Could not join bond. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {view === 'list' && (
        <View style={styles.section}>
          <View style={styles.header}>
            <Users size={24} color={Colors.primary} />
            <Text style={styles.title}>Bonds</Text>
          </View>
          <Text style={styles.subtitle}>Small groups of couples who compete and grow together.</Text>

          {bonds.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No bonds yet</Text>
              <Text style={styles.emptyText}>Create or join a Bond to compete with couples you know.</Text>
            </View>
          )}

          {bonds.map(bond => (
            <View key={bond.id} style={styles.bondCard}>
              <View style={styles.bondHeader}>
                <Text style={styles.bondName}>{bond.name}</Text>
                <TouchableOpacity onPress={() => Clipboard.setStringAsync(bond.code)} style={styles.codeButton}>
                  <Copy size={12} color={Colors.textMuted} />
                  <Text style={styles.codeText}>{bond.code}</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.bondMeta}>{bond.memberCount} couples · Score: {bond.collectiveScore.toLocaleString()}</Text>
            </View>
          ))}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => setView('create')}>
              <Plus size={18} color="#fff" />
              <Text style={styles.primaryButtonText}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => setView('join')}>
              <Hash size={18} color={Colors.text} />
              <Text style={styles.secondaryButtonText}>Join</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {view === 'create' && (
        <View style={styles.section}>
          <TouchableOpacity onPress={() => setView('list')} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create a Bond</Text>
          <Text style={styles.subtitle}>Give your bond a name that means something.</Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. The Storm Chasers"
            placeholderTextColor={Colors.textMuted}
            value={bondName}
            onChangeText={setBondName}
          />

          <TouchableOpacity
            style={[styles.primaryButton, { width: '100%' }, !bondName.trim() && styles.disabled]}
            onPress={handleCreate}
            disabled={!bondName.trim() || loading}
          >
            <Text style={styles.primaryButtonText}>{loading ? 'Creating...' : 'Create Bond'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {view === 'join' && (
        <View style={styles.section}>
          <TouchableOpacity onPress={() => setView('list')} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Join a Bond</Text>
          <Text style={styles.subtitle}>Enter the invite code from another couple.</Text>

          <TextInput
            style={[styles.input, styles.codeInput]}
            placeholder="e.g. XR7TKP"
            placeholderTextColor={Colors.textMuted}
            value={joinCode}
            onChangeText={t => setJoinCode(t.toUpperCase().slice(0, 8))}
            autoCapitalize="characters"
          />

          <TouchableOpacity
            style={[styles.primaryButton, { width: '100%' }, joinCode.length < 4 && styles.disabled]}
            onPress={handleJoin}
            disabled={joinCode.length < 4 || loading}
          >
            <Text style={styles.primaryButtonText}>{loading ? 'Joining...' : 'Join Bond'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 40 },
  section: { gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { fontSize: FontSize['2xl'], fontWeight: '700', color: Colors.text },
  subtitle: { fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 20 },
  empty: { alignItems: 'center', paddingVertical: 32, gap: 8 },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  emptyText: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center' },
  bondCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  bondHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bondName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  codeButton: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.surface, borderRadius: Radius.md, padding: 6 },
  codeText: { fontSize: FontSize.xs, color: Colors.textMuted, fontFamily: 'monospace' },
  bondMeta: { fontSize: FontSize.sm, color: Colors.textMuted },
  buttonRow: { flexDirection: 'row', gap: 12 },
  primaryButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: { color: '#fff', fontSize: FontSize.md, fontWeight: '700' },
  secondaryButton: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryButtonText: { color: Colors.text, fontSize: FontSize.md, fontWeight: '700' },
  disabled: { opacity: 0.5 },
  backButton: { paddingVertical: 4 },
  backText: { color: Colors.textMuted, fontSize: FontSize.sm },
  input: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: FontSize.md,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  codeInput: { fontSize: FontSize.xl, letterSpacing: 4, textAlign: 'center', fontFamily: 'monospace' },
});
