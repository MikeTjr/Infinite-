import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useState } from 'react';
import { User, LogOut, Edit2, Save, Trash2, RotateCcw, Heart } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { Colors, Radius, FontSize } from '../../constants/colors';
import { useSecureStorage } from '../../hooks/useSecureStorage';

interface GrowthScore {
  total: number;
  streak: number;
  momentum: 'rising' | 'steady' | 'cooling';
}

export default function ProfileScreen() {
  const { user, signOut, updateProfile } = useAuth();
  const { value: growthScore, set: setGrowthScore } = useSecureStorage<GrowthScore>('growth-score', {
    total: 0,
    streak: 0,
    momentum: 'steady',
  });

  const [editing, setEditing] = useState(false);
  const [partner1, setPartner1] = useState(user?.partner1Name ?? '');
  const [partner2, setPartner2] = useState(user?.partner2Name ?? '');
  const [coupleName, setCoupleName] = useState(user?.coupleName ?? '');
  const [anniversary, setAnniversary] = useState(user?.anniversaryDate ?? '');

  const handleSave = async () => {
    if (!partner1.trim() || !partner2.trim()) {
      Alert.alert('Required', 'Partner names cannot be empty.');
      return;
    }
    await updateProfile({
      partner1Name: partner1.trim(),
      partner2Name: partner2.trim(),
      coupleName: coupleName.trim() || `${partner1.trim()} & ${partner2.trim()}`,
      anniversaryDate: anniversary.trim() || undefined,
    });
    setEditing(false);
  };

  const handleResetScore = () => {
    Alert.alert(
      'Reset Leaderboard Score',
      'This will clear your growth score and streak. Bonds scores are managed by the server separately. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await setGrowthScore({ total: 0, streak: 0, momentum: 'steady' });
            Alert.alert('Done', 'Score reset to zero.');
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'This will clear all local data from this device — sessions, scores, and your profile. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            {user?.avatarApproved && user.avatarUrl ? (
              <Heart size={40} color={Colors.primary} fill={Colors.primary} />
            ) : (
              <User size={40} color={Colors.textMuted} />
            )}
          </View>
          <Text style={styles.coupleName}>{user?.coupleName ?? 'Your Couple'}</Text>
          {user?.anniversaryDate && (
            <Text style={styles.anniversaryText}>❤️ Since {user.anniversaryDate}</Text>
          )}
        </View>

        <View style={styles.statsRow}>
          {[
            { label: 'Growth Score', value: growthScore.total.toLocaleString() },
            { label: 'Day Streak', value: `${growthScore.streak}` },
            {
              label: 'Momentum',
              value: growthScore.momentum === 'rising' ? '↑' : growthScore.momentum === 'cooling' ? '↓' : '→',
            },
          ].map(({ label, value }) => (
            <View key={label} style={styles.statItem}>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <TouchableOpacity
              onPress={() => (editing ? handleSave() : setEditing(true))}
              style={styles.editButton}
            >
              {editing ? (
                <Save size={16} color={Colors.primary} />
              ) : (
                <Edit2 size={16} color={Colors.textMuted} />
              )}
              <Text style={[styles.editButtonText, editing && { color: Colors.primary }]}>
                {editing ? 'Save' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Couple Name</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={coupleName}
                onChangeText={setCoupleName}
                placeholder="e.g. The Wilsons"
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="words"
              />
            ) : (
              <Text style={styles.fieldValue}>{user?.coupleName}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Partner 1</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={partner1}
                onChangeText={setPartner1}
                placeholder="First name"
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="words"
              />
            ) : (
              <Text style={styles.fieldValue}>{user?.partner1Name}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Partner 2</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={partner2}
                onChangeText={setPartner2}
                placeholder="First name"
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="words"
              />
            ) : (
              <Text style={styles.fieldValue}>{user?.partner2Name}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Anniversary Date</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={anniversary}
                onChangeText={setAnniversary}
                placeholder="e.g. March 15, 2021"
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="words"
              />
            ) : (
              <Text style={styles.fieldValue}>{user?.anniversaryDate ?? '—'}</Text>
            )}
          </View>

          {editing && (
            <TouchableOpacity style={styles.cancelButton} onPress={() => setEditing(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Privacy</Text>
          <Text style={styles.sectionNote}>
            All data is stored locally on this device. Your couple photos are private until a couples avatar is chosen and approved.
          </Text>

          <TouchableOpacity style={styles.actionRow} onPress={handleResetScore}>
            <RotateCcw size={18} color={Colors.challenge} />
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Reset Leaderboard Score</Text>
              <Text style={styles.actionSub}>Sets your growth score back to zero</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <LogOut size={18} color={Colors.spicy} />
            <Text style={styles.signOutText}>Sign Out & Clear Data</Text>
          </TouchableOpacity>
          <Text style={styles.signOutWarning}>
            Sign out removes all local profile data from this device.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 60, gap: 20 },
  avatarSection: { alignItems: 'center', gap: 8, paddingVertical: 16 },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coupleName: { fontSize: FontSize['2xl'], fontWeight: '700', color: Colors.text },
  anniversaryText: { fontSize: FontSize.sm, color: Colors.textMuted },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  section: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  sectionNote: { fontSize: FontSize.xs, color: Colors.textMuted, lineHeight: 18 },
  editButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  editButtonText: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '600' },
  fieldGroup: { gap: 4 },
  fieldLabel: { fontSize: FontSize.xs, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 },
  fieldValue: { fontSize: FontSize.md, color: Colors.text, paddingVertical: 4 },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: FontSize.md,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButton: { alignSelf: 'flex-start' },
  cancelText: { fontSize: FontSize.sm, color: Colors.textMuted },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 8,
  },
  actionText: { flex: 1, gap: 2 },
  actionTitle: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text },
  actionSub: { fontSize: FontSize.xs, color: Colors.textMuted },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.spicy + '40',
  },
  signOutText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.spicy },
  signOutWarning: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center', lineHeight: 18 },
});
