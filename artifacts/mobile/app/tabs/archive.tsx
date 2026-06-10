import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Calendar, Clock, Heart, ChevronLeft } from 'lucide-react-native';
import { Colors, Radius, FontSize } from '../../constants/colors';
import { useSecureStorage } from '../../hooks/useSecureStorage';
import { router } from 'expo-router';

interface SessionRecord {
  id: string;
  date: string;
  cardsPlayed: number;
  durationSeconds: number;
  scoreEarned: number;
  moodEmoji?: string;
  momentTag?: string;
  cardTypes: string[];
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function ArchiveScreen() {
  const { value: sessions } = useSecureStorage<SessionRecord[]>('sessions', []);
  const sorted = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sorted.length === 0) {
    return (
      <View style={styles.empty}>
        <Heart size={48} color={Colors.primary} />
        <Text style={styles.emptyTitle}>No sessions yet</Text>
        <Text style={styles.emptyText}>
          Complete your first play session and it will appear here.
        </Text>
        <TouchableOpacity style={styles.emptyAction} onPress={() => router.push('/game')}>
          <Text style={styles.emptyActionText}>Start a Session</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={sorted}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      style={styles.container}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardMeta}>
              <Calendar size={13} color={Colors.textMuted} />
              <Text style={styles.cardDate}>{formatDate(item.date)}</Text>
              {item.moodEmoji && <Text style={styles.emoji}>{item.moodEmoji}</Text>}
            </View>
            <Text style={styles.score}>+{item.scoreEarned} pts</Text>
          </View>

          <View style={styles.cardStats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{item.cardsPlayed}</Text>
              <Text style={styles.statLabel}>cards</Text>
            </View>
            <View style={styles.stat}>
              <Clock size={12} color={Colors.textMuted} />
              <Text style={styles.statValue}>{Math.round(item.durationSeconds / 60)}m</Text>
            </View>
          </View>

          {item.momentTag && (
            <Text style={styles.momentTag}>"{item.momentTag}"</Text>
          )}

          <View style={styles.cardTypes}>
            {item.cardTypes.slice(0, 4).map((type, i) => (
              <View key={i} style={styles.typePill}>
                <Text style={styles.typePillText}>{type}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16, paddingBottom: 40, gap: 12 },
  empty: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text },
  emptyText: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', lineHeight: 20 },
  emptyAction: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 14,
    paddingHorizontal: 28,
    marginTop: 8,
  },
  emptyActionText: { color: '#fff', fontSize: FontSize.sm, fontWeight: '700' },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardDate: { fontSize: FontSize.sm, color: Colors.textMuted },
  emoji: { fontSize: 16 },
  score: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },
  cardStats: { flexDirection: 'row', gap: 16 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statValue: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  momentTag: { fontSize: FontSize.sm, color: Colors.textMuted, fontStyle: 'italic' },
  cardTypes: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  typePill: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typePillText: { fontSize: FontSize.xs, color: Colors.textMuted, textTransform: 'capitalize' },
});
