import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Heart, Trophy, Users } from 'lucide-react-native';
import { Colors, Radius, FontSize } from '../constants/colors';

export default function LiveFinishScreen() {
  const { hostScore, partnerScore, role } = useLocalSearchParams<{
    hostScore: string;
    partnerScore: string;
    role: 'host' | 'partner';
  }>();

  const h = parseInt(hostScore ?? '0');
  const p = parseInt(partnerScore ?? '0');
  const total = h + p;

  const myScore = role === 'host' ? h : p;
  const partnerScoreNum = role === 'host' ? p : h;

  const result =
    h === p
      ? "It's a tie — you played perfectly in sync."
      : h > p
      ? role === 'host'
        ? "You edged your partner out. Barely."
        : "Your partner outplayed you this round. Rematch?"
      : role === 'partner'
      ? "You came out ahead. Your partner will want a rematch."
      : "Your partner outscored you. Rematch?";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconRow}>
          <Heart size={52} color={Colors.primary} fill={Colors.primary} />
        </View>
        <Text style={styles.title}>Session Complete</Text>
        <Text style={styles.subtitle}>{result}</Text>

        <View style={styles.scoreCard}>
          <View style={styles.scoreItem}>
            <Users size={18} color={Colors.textMuted} />
            <Text style={styles.scoreLabel}>Combined</Text>
            <Text style={styles.scoreValue}>{total}</Text>
          </View>
          <View style={styles.scoreDivider} />
          <View style={styles.scoreItem}>
            <Trophy size={18} color={Colors.primary} />
            <Text style={styles.scoreLabel}>You</Text>
            <Text style={[styles.scoreValue, { color: Colors.primary }]}>{myScore}</Text>
          </View>
          <View style={styles.scoreDivider} />
          <View style={styles.scoreItem}>
            <Heart size={18} color={Colors.thisOrThat} />
            <Text style={styles.scoreLabel}>Partner</Text>
            <Text style={[styles.scoreValue, { color: Colors.thisOrThat }]}>{partnerScoreNum}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace('/room-lobby')}>
          <Text style={styles.primaryBtnText}>Play Again</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.secondaryBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 20 },
  iconRow: { marginBottom: 8 },
  title: { fontSize: FontSize['3xl'], fontWeight: '800', color: Colors.text, textAlign: 'center' },
  subtitle: { fontSize: FontSize.md, color: Colors.textMuted, textAlign: 'center', lineHeight: 24, maxWidth: 300 },
  scoreCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '100%',
    alignItems: 'center',
  },
  scoreItem: { flex: 1, alignItems: 'center', gap: 6 },
  scoreLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  scoreValue: { fontSize: FontSize['2xl'], fontWeight: '800', color: Colors.text },
  scoreDivider: { width: 1, height: 50, backgroundColor: Colors.border },
  primaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 16,
    paddingHorizontal: 48,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnText: { color: '#fff', fontSize: FontSize.lg, fontWeight: '700' },
  secondaryBtn: {
    paddingVertical: 12,
  },
  secondaryBtnText: { color: Colors.textMuted, fontSize: FontSize.sm, fontWeight: '600' },
});
