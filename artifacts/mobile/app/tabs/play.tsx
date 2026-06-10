import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Heart, PlayCircle, Zap, Wifi, Info } from 'lucide-react-native';
import { Colors, Radius, FontSize } from '../../constants/colors';
import { useDriftTracking } from '../../hooks/useDriftTracking';
import { CARD_TYPE_LABELS, CARD_TYPE_COLORS, type CardType } from '../../data/demoQuestions';

export default function PlayScreen() {
  const { avoidedTypes } = useDriftTracking();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroSection}>
        <Heart size={56} color={Colors.primary} fill={Colors.primary} />
        <Text style={styles.title}>Ready to play?</Text>
        <Text style={styles.subtitle}>
          The deck adapts to your patterns. Every session shapes the next.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Game Modes</Text>

        <TouchableOpacity style={[styles.modeCard, styles.modeCardActive]} onPress={() => router.push('/game')}>
          <View style={styles.modeHeader}>
            <Heart size={22} color={Colors.primary} />
            <View style={styles.modeText}>
              <Text style={styles.modeTitle}>Pass & Play</Text>
              <Text style={styles.modeDesc}>One device, shared between partners. Private choices, big reveals.</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.startButton} onPress={() => router.push('/game')}>
            <Zap size={16} color="#fff" />
            <Text style={styles.startButtonText}>Start Session</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.modeCard, styles.liveSyncCard]} onPress={() => router.push('/room-lobby')}>
          <View style={styles.modeHeader}>
            <Wifi size={22} color={Colors.repair} />
            <View style={styles.modeText}>
              <Text style={styles.modeTitle}>Live Sync</Text>
              <Text style={styles.modeDesc}>Two devices. Create a room, share the code. Choices revealed simultaneously.</Text>
            </View>
          </View>
          <View style={[styles.startButton, { backgroundColor: Colors.repair }]}>
            <Wifi size={16} color="#fff" />
            <Text style={styles.startButtonText}>Open Room Lobby</Text>
          </View>
        </TouchableOpacity>

        <View style={[styles.modeCard, styles.modeCardDisabled]}>
          <View style={styles.modeHeader}>
            <Text style={styles.tvEmoji}>📺</Text>
            <View style={styles.modeText}>
              <View style={styles.titleRow}>
                <Text style={[styles.modeTitle, { color: Colors.textMuted }]}>TV Mode</Text>
                <View style={styles.soonBadge}><Text style={styles.soonText}>Coming Soon</Text></View>
              </View>
              <Text style={styles.modeDesc}>Cast to your TV. Your phone becomes the controller. Like a couples game show.</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>New Here?</Text>
        <TouchableOpacity style={styles.demoCard} onPress={() => router.push('/demo')}>
          <PlayCircle size={24} color={Colors.thisOrThat} />
          <View style={styles.demoText}>
            <Text style={styles.demoTitle}>Try 15 Sample Questions</Text>
            <Text style={styles.demoSub}>Unique demo cards — not in the real deck. Learn how it works before going deep.</Text>
          </View>
        </TouchableOpacity>
      </View>

      {avoidedTypes.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Info size={13} color={Colors.textMuted} />
            <Text style={styles.sectionLabel}>Your Drift Patterns</Text>
          </View>
          <View style={styles.driftPills}>
            {avoidedTypes.slice(0, 4).map((type) => (
              <View
                key={type}
                style={[styles.driftPill, { backgroundColor: CARD_TYPE_COLORS[type as CardType] + '20', borderColor: CARD_TYPE_COLORS[type as CardType] + '60' }]}
              >
                <Text style={[styles.driftPillText, { color: CARD_TYPE_COLORS[type as CardType] }]}>
                  {CARD_TYPE_LABELS[type as CardType]} — reintroducing
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.driftNote}>Cards you drift are tracked. We bring them back at lower stakes.</Text>
        </View>
      )}

      <View style={styles.rulesCard}>
        <Text style={styles.rulesTitle}>How to play</Text>
        {[
          '"Done" → Card played, 10 points',
          '"Drift" → Skip. No shame. Patterns tracked.',
          'This or That → choose privately, reveal together',
          'Challenge → start the timer, get up and go',
          'Spicy → 18+. Go there. Seriously.',
          'Exit anytime — resumes within 24 hours',
        ].map((rule, i) => (
          <Text key={i} style={styles.ruleItem}>• {rule}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 40, gap: 20 },
  heroSection: { alignItems: 'center', paddingVertical: 20, gap: 12 },
  title: { fontSize: FontSize['3xl'], fontWeight: '700', color: Colors.text, textAlign: 'center' },
  subtitle: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', maxWidth: 290, lineHeight: 20 },
  section: { gap: 12 },
  sectionLabel: { fontSize: FontSize.xs, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  modeCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  modeCardActive: { borderColor: Colors.primary + '50' },
  liveSyncCard: { borderColor: Colors.repair + '50' },
  modeCardDisabled: { opacity: 0.55 },
  modeHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  tvEmoji: { fontSize: 22 },
  modeText: { flex: 1, gap: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  modeTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  modeDesc: { fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 20 },
  soonBadge: { backgroundColor: Colors.surface, borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  soonText: { fontSize: FontSize.xs, color: Colors.textMuted },
  startButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  startButtonText: { color: '#fff', fontSize: FontSize.sm, fontWeight: '700' },
  demoCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.thisOrThat + '40',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  demoText: { flex: 1, gap: 4 },
  demoTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  demoSub: { fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 20 },
  driftPills: { gap: 8 },
  driftPill: { borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, alignSelf: 'flex-start' },
  driftPillText: { fontSize: FontSize.xs, fontWeight: '600' },
  driftNote: { fontSize: FontSize.xs, color: Colors.textMuted, lineHeight: 18 },
  rulesCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  rulesTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text },
  ruleItem: { fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 22 },
});
