import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useState, useRef, useEffect, useCallback } from 'react';
import { router } from 'expo-router';
import { X, ChevronRight, ChevronLeft, Timer, Heart } from 'lucide-react-native';
import { Colors, Radius, FontSize } from '../constants/colors';
import { CARD_TYPE_COLORS, CARD_TYPE_LABELS, type CardType } from '../data/demoQuestions';
import { useDriftTracking } from '../hooks/useDriftTracking';
import { useSecureStorage } from '../hooks/useSecureStorage';

interface GameCard {
  id: string;
  type: CardType;
  prompt: string;
  subtext?: string;
  optionA?: string;
  optionB?: string;
  timerSeconds?: number;
}

interface ActiveSession {
  cards: GameCard[];
  index: number;
  savedAt: string;
  scoreEarned: number;
  drifted: number;
}

const PROGRESS_EXPIRY_HOURS = 24;

export const SESSION_CARDS: GameCard[] = [
  { id: 'g-01', type: 'thisOrThat', prompt: 'Would you rather…', optionA: 'Wake up together every morning', optionB: 'Have your own separate morning routines', },
  { id: 'g-02', type: 'legacy', prompt: 'What was the moment you first knew this relationship was different?', subtext: 'Take turns. No rushing.' },
  { id: 'g-03', type: 'dare', prompt: 'Delete one app from your phone that your partner chooses.', subtext: 'Show them your home screen. They pick.' },
  { id: 'g-04', type: 'whatIf', prompt: 'What if we had to move to a different country next month?', subtext: 'Where would we go? How would we make it work?' },
  { id: 'g-05', type: 'challenge', prompt: 'Re-create your first photo together right now.', timerSeconds: 120, subtext: 'Same pose, same energy.' },
  { id: 'g-06', type: 'repair', prompt: 'Is there something I do that makes you feel unseen? I want to understand.', subtext: 'This is a safe moment. No defensiveness.' },
  { id: 'g-07', type: 'thisOrThat', prompt: 'Would you rather…', optionA: 'Always travel together', optionB: 'Have solo adventures and share stories', },
  { id: 'g-08', type: 'spicy', prompt: 'What is something you want more of from me — in or out of the bedroom?', subtext: 'Be honest. This is exactly where honesty belongs.' },
  { id: 'g-09', type: 'legacy', prompt: 'If you wrote a letter to our future selves, what would you want us to remember about right now?', },
  { id: 'g-10', type: 'dare', prompt: 'Show your partner the most recent text you sent to a friend about them.', },
  { id: 'g-11', type: 'whatIf', prompt: 'What if we woke up tomorrow and everything in our relationship was exactly how we dreamed?', subtext: 'Describe it in detail.' },
  { id: 'g-12', type: 'challenge', prompt: 'Make your partner laugh without saying any words.', timerSeconds: 45 },
  { id: 'g-13', type: 'repair', prompt: 'What is one thing you have been holding back from saying?', subtext: 'Say it now, gently.' },
  { id: 'g-14', type: 'thisOrThat', prompt: 'Would you rather…', optionA: 'Always know you are loved but rarely hear it', optionB: 'Hear "I love you" every day but not always feel it', },
  { id: 'g-15', type: 'legacy', prompt: 'What does your partner do that makes you proud — even if you never say it?', subtext: 'Say it now.' },
];

function isProgressExpired(savedAt: string): boolean {
  const diff = Date.now() - new Date(savedAt).getTime();
  return diff > PROGRESS_EXPIRY_HOURS * 60 * 60 * 1000;
}

export default function GameScreen() {
  const { recordDrift, recordPlay } = useDriftTracking();
  const { value: savedSession, set: saveSession, clear: clearSession } =
    useSecureStorage<ActiveSession | null>('active-session', null);

  const [cards] = useState<GameCard[]>(SESSION_CARDS);
  const [index, setIndex] = useState(0);
  const [scoreEarned, setScoreEarned] = useState(0);
  const [driftedCount, setDriftedCount] = useState(0);
  const [currentChoice, setCurrentChoice] = useState<'A' | 'B' | null>(null);
  const [finished, setFinished] = useState(false);
  const [timerLeft, setTimerLeft] = useState<number | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const card = cards[index];
  const typeColor = CARD_TYPE_COLORS[card?.type ?? 'legacy'];

  useEffect(() => {
    if (savedSession && !isProgressExpired(savedSession.savedAt)) {
      Alert.alert(
        'Resume Session?',
        `You have a session in progress (card ${savedSession.index + 1}/${cards.length}). Resume where you left off?`,
        [
          { text: 'Start Fresh', style: 'destructive', onPress: () => { clearSession(); setSessionStarted(true); } },
          { text: 'Resume', onPress: () => { setIndex(savedSession.index); setScoreEarned(savedSession.scoreEarned); setDriftedCount(savedSession.drifted); setSessionStarted(true); } },
        ]
      );
    } else {
      if (savedSession) clearSession();
      setSessionStarted(true);
    }
  }, []);

  useEffect(() => {
    if (!sessionStarted) return;
    if (timerRef.current) clearInterval(timerRef.current);
    if (card?.timerSeconds) {
      setTimerLeft(card.timerSeconds);
      timerRef.current = setInterval(() => {
        setTimerLeft((t) => {
          if (t === null || t <= 1) { if (timerRef.current) clearInterval(timerRef.current); return null; }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [index, sessionStarted]);

  const saveProgress = useCallback(async (nextIndex: number, score: number, drifted: number) => {
    if (nextIndex >= cards.length) { await clearSession(); return; }
    await saveSession({ cards, index: nextIndex, savedAt: new Date().toISOString(), scoreEarned: score, drifted });
  }, [cards, saveSession, clearSession]);

  const animateTransition = useCallback((dir: 'forward' | 'back', onDone: () => void) => {
    const toValue = dir === 'forward' ? -30 : 30;
    Animated.parallel([
      Animated.timing(slideAnim, { toValue, duration: 180, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      onDone();
      slideAnim.setValue(dir === 'forward' ? 30 : -30);
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]).start();
    });
  }, [slideAnim, fadeAnim]);

  const advance = useCallback(async (drifted = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const pts = drifted ? 0 : 10;
    const newScore = scoreEarned + pts;
    const newDrifted = driftedCount + (drifted ? 1 : 0);

    if (drifted) { await recordDrift(card.id, card.type); }
    else { await recordPlay(card.id); }

    animateTransition('forward', async () => {
      setCurrentChoice(null);
      setTimerLeft(null);
      if (index + 1 >= cards.length) {
        setScoreEarned(newScore);
        setFinished(true);
        await clearSession();
      } else {
        setIndex((i) => i + 1);
        setScoreEarned(newScore);
        setDriftedCount(newDrifted);
        await saveProgress(index + 1, newScore, newDrifted);
      }
    });
  }, [card, index, scoreEarned, driftedCount, animateTransition, recordDrift, recordPlay, saveProgress, clearSession]);

  const handleExit = () => {
    Alert.alert('Exit Game', 'Your progress is saved. You can resume within 24 hours.', [
      { text: 'Keep Playing', style: 'cancel' },
      { text: 'Exit & Save', onPress: async () => { await saveProgress(index, scoreEarned, driftedCount); router.back(); } },
    ]);
  };

  if (!sessionStarted) return <View style={styles.container} />;

  if (finished) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.finishContainer}>
          <Heart size={56} color={Colors.primary} fill={Colors.primary} />
          <Text style={styles.finishTitle}>Session Complete</Text>
          <Text style={styles.finishScore}>+{scoreEarned} pts</Text>
          <Text style={styles.finishSub}>
            {driftedCount === 0
              ? 'You played every card. Respect.'
              : `You drifted ${driftedCount} card${driftedCount > 1 ? 's' : ''}. Those patterns help us shape what comes next.`}
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.primaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => index > 0 ? animateTransition('back', () => setIndex(i => i - 1)) : handleExit()} style={styles.backBtn}>
          <ChevronLeft size={20} color={Colors.text} />
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(index / cards.length) * 100}%`, backgroundColor: typeColor }]} />
        </View>
        <TouchableOpacity onPress={handleExit} style={styles.exitBtn} hitSlop={8}>
          <X size={20} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.metaRow}>
        <View style={[styles.typeBadge, { backgroundColor: typeColor + '20', borderColor: typeColor + '60' }]}>
          <Text style={[styles.typeBadgeText, { color: typeColor }]}>{CARD_TYPE_LABELS[card.type]}</Text>
        </View>
        <Text style={styles.countText}>{index + 1} / {cards.length}</Text>
        {timerLeft !== null && (
          <View style={styles.timerBadge}>
            <Timer size={12} color={Colors.challenge} />
            <Text style={styles.timerText}>{timerLeft}s</Text>
          </View>
        )}
      </View>

      <Animated.View style={[styles.cardArea, { transform: [{ translateX: slideAnim }], opacity: fadeAnim }]}>
        <Text style={styles.prompt}>{card.prompt}</Text>
        {card.subtext && <Text style={styles.subtext}>{card.subtext}</Text>}
        {card.type === 'thisOrThat' && card.optionA && card.optionB && (
          <View style={styles.optionsRow}>
            <TouchableOpacity style={[styles.optionCard, currentChoice === 'A' && { borderColor: typeColor, backgroundColor: typeColor + '15' }]} onPress={() => setCurrentChoice('A')}>
              <Text style={styles.optionLabel}>A</Text>
              <Text style={styles.optionText}>{card.optionA}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionCard, currentChoice === 'B' && { borderColor: typeColor, backgroundColor: typeColor + '15' }]} onPress={() => setCurrentChoice('B')}>
              <Text style={styles.optionLabel}>B</Text>
              <Text style={styles.optionText}>{card.optionB}</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.driftButton} onPress={() => advance(true)}>
          <Text style={styles.driftText}>Drift (Skip)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.doneButton, { backgroundColor: typeColor }, card.type === 'thisOrThat' && currentChoice === null && styles.disabledAction]}
          onPress={() => advance(false)}
          disabled={card.type === 'thisOrThat' && currentChoice === null}
        >
          <Text style={styles.doneText}>{index + 1 === cards.length ? 'Finish' : 'Done'}</Text>
          <ChevronRight size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, gap: 10 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 2, minWidth: 60 },
  backBtnText: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  progressBar: { flex: 1, height: 4, backgroundColor: Colors.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  exitBtn: { minWidth: 40, alignItems: 'flex-end' },
  metaRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12, gap: 10 },
  typeBadge: { borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1 },
  typeBadgeText: { fontSize: FontSize.xs, fontWeight: '700', textTransform: 'uppercase' },
  countText: { fontSize: FontSize.xs, color: Colors.textMuted, marginLeft: 'auto' },
  timerBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.challenge + '20', borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  timerText: { fontSize: FontSize.xs, color: Colors.challenge, fontWeight: '700' },
  cardArea: { flex: 1, paddingHorizontal: 24, paddingTop: 12, justifyContent: 'center', gap: 20 },
  prompt: { fontSize: FontSize['2xl'], fontWeight: '700', color: Colors.text, lineHeight: 34 },
  subtext: { fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 22 },
  optionsRow: { gap: 12 },
  optionCard: { backgroundColor: Colors.card, borderRadius: Radius.xl, padding: 18, borderWidth: 2, borderColor: Colors.border, gap: 6 },
  optionLabel: { fontSize: FontSize.xs, fontWeight: '800', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  optionText: { fontSize: FontSize.md, color: Colors.text, lineHeight: 22 },
  actions: { flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 16, gap: 12, alignItems: 'center' },
  driftButton: { flex: 1, paddingVertical: 16, alignItems: 'center', borderRadius: Radius.full, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  driftText: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '600' },
  doneButton: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 16, borderRadius: Radius.full },
  doneText: { fontSize: FontSize.md, fontWeight: '700', color: '#fff' },
  disabledAction: { opacity: 0.45 },
  finishContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 },
  finishTitle: { fontSize: FontSize['3xl'], fontWeight: '800', color: Colors.text },
  finishScore: { fontSize: FontSize['4xl'], fontWeight: '800', color: Colors.primary },
  finishSub: { fontSize: FontSize.md, color: Colors.textMuted, textAlign: 'center', lineHeight: 24, maxWidth: 300 },
  primaryButton: { backgroundColor: Colors.primary, borderRadius: Radius.full, paddingVertical: 16, paddingHorizontal: 40, alignItems: 'center', marginTop: 8 },
  primaryButtonText: { color: '#fff', fontSize: FontSize.lg, fontWeight: '700' },
});
