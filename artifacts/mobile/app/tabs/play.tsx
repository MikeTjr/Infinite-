import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Heart, PlayCircle, Zap, Info } from 'lucide-react-native';
import { Colors, Radius, FontSize } from '../../constants/colors';
import { useDriftTracking } from '../../hooks/useDriftTracking';
import { CARD_TYPE_LABELS, CARD_TYPE_COLORS, type CardType } from '../../data/demoQuestions';

export default function PlayScreen() {
  const { avoidedTypes, intelligence } = useDriftTracking();

  const handleStartSession = () => {
    router.push('/game');
  };

  const handleStartDemo = () => {
    router.push('/demo');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroSection}>
        <Heart size={56} color={Colors.primary} fill={Colors.primary} />
        <Text style={styles.title}>Ready to play?</Text>
        <Text style={styles.subtitle}>
          The deck adapts to your patterns over time — every session shapes the next.
        </Text>
      </View>

      <View style={styles.modesSection}>
        <Text style={styles.sectionLabel}>Session Mode</Text>

        <TouchableOpacity style={[styles.modeCard, styles.modeCardActive]} onPress={handleStartSession}>
          <View style={styles.modeHeader}>
            <Text style={styles.modeTitle}>Pass & Play</Text>
            <View style={styles.modeBadge}>
              <Text style={styles.modeBadgeText}>Available</Text>
            </View>
          </View>
          <Text style={styles.modeDesc}>
            Share one device. Pass it back and forth for private choices during This or That cards.
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={handleStartSession}>
            <Zap size={16} color="#fff" />
            <Text style={styles.startButtonText}>Start Session</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <View style={[styles.modeCard, styles.modeCardDisabled]}>
          <View style={styles.modeHeader}>
            <Text style={[styles.modeTitle, { color: Colors.textMuted }]}>Live Sync</Text>
            <View style={[styles.modeBadge, { backgroundColor: Colors.border }]}>
              <Text style={[styles.modeBadgeText, { color: Colors.textMuted }]}>Coming Soon</Text>
            </View>
          </View>
          <Text style={styles.modeDesc}>
            Each partner on their own device. Choices sync in real time via WebSocket rooms.
          </Text>
        </View>
      </View>

      <View style={styles.demoSection}>
        <Text style={styles.sectionLabel}>New to this?</Text>
        <TouchableOpacity style={styles.demoCard} onPress={handleStartDemo}>
          <PlayCircle size={24} color={Colors.thisOrThat} />
          <View style={styles.demoText}>
            <Text style={styles.demoTitle}>Try 15 Sample Questions</Text>
            <Text style={styles.demoSub}>
              See how the game works before starting a real journey. Demo questions are unique — not in the actual deck.
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {avoidedTypes.length > 0 && (
        <View style={styles.driftSection}>
          <View style={styles.sectionHeader}>
            <Info size={14} color={Colors.textMuted} />
            <Text style={styles.sectionLabel}>Your Card Patterns</Text>
          </View>
          <View style={styles.driftPills}>
            {avoidedTypes.slice(0, 4).map((type) => (
              <View
                key={type}
                style={[
                  styles.driftPill,
                  { backgroundColor: CARD_TYPE_COLORS[type as CardType] + '20', borderColor: CARD_TYPE_COLORS[type as CardType] + '60' },
                ]}
              >
                <Text style={[styles.driftPillText, { color: CARD_TYPE_COLORS[type as CardType] }]}>
                  {CARD_TYPE_LABELS[type as CardType]} — reintroducing gently
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.driftNote}>
            Cards you drift are noted. We bring them back at lower stakes so you can approach them on your terms.
          </Text>
        </View>
      )}

      <View style={styles.rulesCard}>
        <Text style={styles.rulesTitle}>How to play</Text>
        <View style={styles.rulesList}>
          {[
            '"Done" → Card accepted, 10 points earned',
            '"Drift" → Skip without judgment (patterns tracked)',
            'This or That → choose privately, reveal together',
            'Challenge cards → start the timer and go',
            'Exit anytime — progress saves for 24 hours',
          ].map((rule, i) => (
            <Text key={i} style={styles.ruleItem}>• {rule}</Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 40, gap: 20 },
  heroSection: { alignItems: 'center', paddingVertical: 24, gap: 12 },
  title: { fontSize: FontSize['3xl'], fontWeight: '700', color: Colors.text, textAlign: 'center' },
  subtitle: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', maxWidth: 290, lineHeight: 20 },
  modesSection: { gap: 12 },
  sectionLabel: { fontSize: FontSize.xs, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  modeCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  modeCardActive: { borderColor: Colors.primary + '60' },
  modeCardDisabled: { opacity: 0.6 },
  modeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modeTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  modeBadge: {
    backgroundColor: Colors.primary + '25',
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  modeBadgeText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '600' },
  modeDesc: { fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 20 },
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
  demoSection: { gap: 10 },
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
  driftSection: { gap: 10 },
  driftPills: { gap: 8 },
  driftPill: {
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  driftPillText: { fontSize: FontSize.xs, fontWeight: '600' },
  driftNote: { fontSize: FontSize.xs, color: Colors.textMuted, lineHeight: 18 },
  rulesCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  rulesTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text },
  rulesList: { gap: 8 },
  ruleItem: { fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 20 },
});
