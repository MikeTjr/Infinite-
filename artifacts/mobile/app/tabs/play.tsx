import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { Heart, ArrowLeft } from 'lucide-react-native';
import { Colors, Radius, FontSize } from '../../constants/colors';

export default function PlayScreen() {
  const handleStartSession = () => {
    Alert.alert(
      'Start Session',
      'Pass-and-play mode: share this device with your partner.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Begin', onPress: () => router.push('/play') },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroSection}>
        <Heart size={56} color={Colors.primary} fill={Colors.primary} />
        <Text style={styles.title}>Ready to play?</Text>
        <Text style={styles.subtitle}>
          Choose your session mode. The deck has been shaped for you.
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
            Set up a room via the web app and join with a 6-character code.
          </Text>
        </View>
      </View>

      <View style={styles.rulesCard}>
        <Text style={styles.rulesTitle}>How to play</Text>
        <View style={styles.rulesList}>
          {[
            'Swipe right → Done with a card',
            'Swipe left → Drift (skip without judgment)',
            'This or That: choose privately, reveal together',
            'Challenge: start the timer and go',
            'Thunder cards unlock after more sessions',
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
  content: { padding: 20, paddingBottom: 40, alignItems: 'center' },
  heroSection: { alignItems: 'center', paddingVertical: 32, gap: 12 },
  title: { fontSize: FontSize['3xl'], fontWeight: '700', color: Colors.text, textAlign: 'center' },
  subtitle: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', maxWidth: 280, lineHeight: 20 },
  modesSection: { width: '100%', marginBottom: 20 },
  sectionLabel: { fontSize: FontSize.xs, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  modeCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modeCardActive: { borderColor: Colors.primary + '60' },
  modeCardDisabled: { opacity: 0.6 },
  modeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  modeTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  modeBadge: {
    backgroundColor: Colors.primary + '25',
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  modeBadgeText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '600' },
  modeDesc: { fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 20 },
  rulesCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rulesTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  rulesList: { gap: 8 },
  ruleItem: { fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 20 },
});
