import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Heart, TrendingUp, Zap } from 'lucide-react-native';
import { Colors, Radius, FontSize } from '../../constants/colors';
import { useSecureStorage } from '../../hooks/useSecureStorage';

interface GrowthScore {
  total: number;
  streak: number;
  momentum: 'rising' | 'steady' | 'cooling';
}

const DEFAULT_SCORE: GrowthScore = { total: 0, streak: 0, momentum: 'steady' };

const MOMENTUM_LABELS = {
  rising: { label: '↑ Rising', color: '#22c55e' },
  steady: { label: '→ Steady', color: Colors.textMuted },
  cooling: { label: '↓ Cooling', color: '#f59e0b' },
};

export default function HomeScreen() {
  const { value: growthScore } = useSecureStorage<GrowthScore>('growth-score', DEFAULT_SCORE);
  const { value: coupleName } = useSecureStorage<string>('couple-name', '');

  const momentum = MOMENTUM_LABELS[growthScore.momentum];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {coupleName ? `Welcome back, ${coupleName}` : 'Welcome to Infinite Us'}
        </Text>
        <Text style={styles.subtext}>
          {coupleName
            ? 'Your next moment is always within reach.'
            : 'The relationship platform for couples.'}
        </Text>
      </View>

      <View style={styles.scoreCard}>
        <View style={styles.scoreRow}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreValue}>{growthScore.total.toLocaleString()}</Text>
            <Text style={styles.scoreLabel}>Growth Score</Text>
          </View>
          <View style={styles.scoreDivider} />
          <View style={styles.scoreItem}>
            <Text style={styles.scoreValue}>{growthScore.streak}</Text>
            <Text style={styles.scoreLabel}>Day Streak</Text>
          </View>
          <View style={styles.scoreDivider} />
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreValue, { color: momentum.color }]}>{momentum.label}</Text>
            <Text style={styles.scoreLabel}>Momentum</Text>
          </View>
        </View>
      </View>

      <Link href="/play" asChild>
        <TouchableOpacity style={styles.playButton}>
          <Heart size={22} color="#fff" fill="#fff" />
          <Text style={styles.playButtonText}>Begin Session</Text>
        </TouchableOpacity>
      </Link>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          {[
            { label: 'Mirror', icon: <TrendingUp size={20} color={Colors.primary} />, href: '/mirror' },
            { label: 'Journey', icon: <Zap size={20} color={Colors.thisOrThat} />, href: '/journey' },
            { label: 'Archive', icon: <Heart size={20} color={Colors.legacy} />, href: '/archive' },
            { label: 'Two Become One', icon: <Heart size={20} color={Colors.spicy} />, href: '/blend' },
          ].map(({ label, icon, href }) => (
            <Link key={label} href={href} asChild>
              <TouchableOpacity style={styles.actionCard}>
                {icon}
                <Text style={styles.actionLabel}>{label}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </View>

      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          State syncs to this device via secure storage. Cross-device sync requires a live session room.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 24 },
  greeting: { fontSize: FontSize['2xl'], fontWeight: '700', color: Colors.text, marginBottom: 4 },
  subtext: { fontSize: FontSize.sm, color: Colors.textMuted },
  scoreCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scoreRow: { flexDirection: 'row', alignItems: 'center' },
  scoreItem: { flex: 1, alignItems: 'center' },
  scoreDivider: { width: 1, height: 40, backgroundColor: Colors.border },
  scoreValue: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text },
  scoreLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 4 },
  playButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 28,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  playButtonText: { color: '#fff', fontSize: FontSize.lg, fontWeight: '700' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: FontSize.sm, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: {
    width: '47%',
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  actionLabel: { fontSize: FontSize.sm, color: Colors.text, fontWeight: '600' },
  notice: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  noticeText: { fontSize: FontSize.xs, color: Colors.textMuted, lineHeight: 18 },
});
