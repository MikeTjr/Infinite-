import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';
import { Heart, TrendingUp, Zap, Brain, Camera, PlayCircle, Wifi } from 'lucide-react-native';
import { Colors, Radius, FontSize } from '../../constants/colors';
import { useSecureStorage } from '../../hooks/useSecureStorage';
import { useAuth } from '../../context/AuthContext';
import { useDriftTracking } from '../../hooks/useDriftTracking';
import { useRef, useCallback } from 'react';

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
  const { user } = useAuth();
  const { value: growthScore } = useSecureStorage<GrowthScore>('growth-score', DEFAULT_SCORE);
  const { avoidedTypes, insights } = useDriftTracking();
  const adminTapCount = useRef(0);
  const adminTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const momentum = MOMENTUM_LABELS[growthScore.momentum];

  // Hidden admin access: tap the heart logo 7 times within 3 seconds
  const handleLogoPress = useCallback(() => {
    adminTapCount.current += 1;
    if (adminTapTimer.current) clearTimeout(adminTapTimer.current);
    if (adminTapCount.current >= 7) {
      adminTapCount.current = 0;
      router.push('/admin');
      return;
    }
    adminTapTimer.current = setTimeout(() => { adminTapCount.current = 0; }, 3000);
  }, []);

  const quickActions = [
    { label: 'Mirror', icon: <TrendingUp size={20} color={Colors.primary} />, href: '/mirror' as const },
    { label: 'Journey', icon: <Zap size={20} color={Colors.thisOrThat} />, href: '/journey' as const },
    { label: 'Archive', icon: <Heart size={20} color={Colors.legacy} />, href: '/archive' as const },
    { label: 'Two Become One', icon: <Camera size={20} color={Colors.spicy} />, href: '/blend-screen' as const },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogoPress} activeOpacity={0.9} hitSlop={8}>
          <Text style={styles.greeting}>
            {user?.coupleName ? `Welcome back, ${user.coupleName}` : 'Welcome to Infinite Us'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.subtext}>
          {user?.coupleName
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

      <TouchableOpacity style={styles.playButton} onPress={() => router.push('/game')}>
        <Heart size={22} color="#fff" fill="#fff" />
        <Text style={styles.playButtonText}>Begin Session</Text>
      </TouchableOpacity>

      <View style={styles.secondaryActions}>
        <TouchableOpacity style={styles.demoButton} onPress={() => router.push('/demo')}>
          <PlayCircle size={18} color={Colors.thisOrThat} />
          <Text style={styles.demoButtonText}>15-Question Demo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.liveButton} onPress={() => router.push('/room-lobby')}>
          <Wifi size={18} color={Colors.repair} />
          <Text style={styles.liveButtonText}>Live Sync</Text>
        </TouchableOpacity>
      </View>

      {avoidedTypes.length > 0 && (
        <View style={styles.intelligenceCard}>
          <View style={styles.intelligenceHeader}>
            <Brain size={16} color={Colors.repair} />
            <Text style={styles.intelligenceTitle}>Card Intelligence</Text>
          </View>
          {insights.slice(0, 2).map((insight, i) => (
            <Text key={i} style={styles.insightText}>• {insight}</Text>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          {quickActions.map(({ label, icon, href }) => (
            <Link key={label} href={href} asChild>
              <TouchableOpacity style={styles.actionCard}>
                {icon}
                <Text style={styles.actionLabel}>{label}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 40, gap: 16 },
  header: { gap: 4 },
  greeting: { fontSize: FontSize['2xl'], fontWeight: '700', color: Colors.text },
  subtext: { fontSize: FontSize.sm, color: Colors.textMuted },
  scoreCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: 20,
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
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  playButtonText: { color: '#fff', fontSize: FontSize.lg, fontWeight: '700' },
  secondaryActions: { flexDirection: 'row', gap: 12 },
  demoButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.thisOrThat + '50',
  },
  demoButtonText: { color: Colors.thisOrThat, fontSize: FontSize.sm, fontWeight: '600' },
  liveButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.repair + '50',
  },
  liveButtonText: { color: Colors.repair, fontSize: FontSize.sm, fontWeight: '600' },
  intelligenceCard: {
    backgroundColor: Colors.repair + '12',
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.repair + '40',
    gap: 8,
  },
  intelligenceHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  intelligenceTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.repair },
  insightText: { fontSize: FontSize.xs, color: Colors.textMuted, lineHeight: 18 },
  section: { gap: 12 },
  sectionTitle: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
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
});
