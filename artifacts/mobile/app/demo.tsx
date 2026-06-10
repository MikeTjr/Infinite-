import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useState, useRef, useEffect, useCallback } from 'react';
import { router } from 'expo-router';
import { X, ChevronRight, ChevronLeft, Heart, Timer } from 'lucide-react-native';
import { Colors, Radius, FontSize } from '../constants/colors';
import {
  DEMO_QUESTIONS,
  CARD_TYPE_COLORS,
  CARD_TYPE_LABELS,
  type DemoCard,
} from '../data/demoQuestions';

type CardChoice = 'A' | 'B' | 'drifted' | null;

interface CardState {
  cardId: string;
  choice: CardChoice;
}

export default function DemoScreen() {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState<CardState[]>([]);
  const [currentChoice, setCurrentChoice] = useState<CardChoice>(null);
  const [finished, setFinished] = useState(false);
  const [timerLeft, setTimerLeft] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const card = DEMO_QUESTIONS[index];
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const typeColor = CARD_TYPE_COLORS[card?.type ?? 'whatIf'];

  const startTimer = useCallback((seconds: number) => {
    setTimerLeft(seconds);
    timerRef.current = setInterval(() => {
      setTimerLeft((t) => {
        if (t === null || t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return null;
        }
        return t - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    if (card?.timerSeconds && currentChoice === null) {
      startTimer(card.timerSeconds);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [index]);

  const animateTransition = useCallback((direction: 'forward' | 'back', onDone: () => void) => {
    const toValue = direction === 'forward' ? -30 : 30;
    Animated.parallel([
      Animated.timing(slideAnim, { toValue, duration: 180, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      onDone();
      slideAnim.setValue(direction === 'forward' ? 30 : -30);
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]).start();
    });
  }, [slideAnim, fadeAnim]);

  const advance = useCallback(
    (choice: CardChoice) => {
      if (timerRef.current) clearInterval(timerRef.current);
      const state: CardState = { cardId: card.id, choice };

      animateTransition('forward', () => {
        setHistory((h) => [...h, state]);
        setCurrentChoice(null);
        setTimerLeft(null);
        if (index + 1 >= DEMO_QUESTIONS.length) {
          setFinished(true);
        } else {
          setIndex((i) => i + 1);
        }
      });
    },
    [card, index, animateTransition]
  );

  const goBack = useCallback(() => {
    if (index === 0) {
      Alert.alert('Exit Demo', 'Leave the demo?', [
        { text: 'Stay', style: 'cancel' },
        { text: 'Exit', onPress: () => router.back() },
      ]);
      return;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    animateTransition('back', () => {
      setHistory((h) => h.slice(0, -1));
      setCurrentChoice(null);
      setTimerLeft(null);
      setIndex((i) => i - 1);
    });
  }, [index, animateTransition]);

  const handleExit = () => {
    Alert.alert('Exit Demo', 'Your demo progress will not be saved.', [
      { text: 'Keep Playing', style: 'cancel' },
      { text: 'Exit', style: 'destructive', onPress: () => router.back() },
    ]);
  };

  if (finished) {
    const drifted = history.filter((h) => h.choice === 'drifted').length;
    const engaged = history.length - drifted;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.finishContainer}>
          <Heart size={56} color={Colors.primary} fill={Colors.primary} />
          <Text style={styles.finishTitle}>Demo Complete!</Text>
          <Text style={styles.finishSub}>
            You engaged with {engaged} of {DEMO_QUESTIONS.length} cards.
            {drifted > 0 ? ` Skipped ${drifted} — that's totally normal.` : ' Perfect run!'}
          </Text>

          <View style={styles.finishNote}>
            <Text style={styles.finishNoteText}>
              In real journeys, the deck adapts to your patterns. Cards you skip are noted and
              gently reintroduced over time.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.primaryButtonText}>Start a Real Journey</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
            <Text style={styles.secondaryButtonText}>Back to Play</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <ChevronLeft size={20} color={Colors.text} />
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((index) / DEMO_QUESTIONS.length) * 100}%`, backgroundColor: typeColor },
            ]}
          />
        </View>

        <TouchableOpacity onPress={handleExit} style={styles.exitBtn}>
          <X size={20} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardCountRow}>
        <View style={[styles.typeBadge, { backgroundColor: typeColor + '20', borderColor: typeColor + '60' }]}>
          <Text style={[styles.typeBadgeText, { color: typeColor }]}>
            {CARD_TYPE_LABELS[card.type]}
          </Text>
        </View>
        <Text style={styles.countText}>{index + 1} / {DEMO_QUESTIONS.length}</Text>
        {timerLeft !== null && (
          <View style={styles.timerBadge}>
            <Timer size={12} color={Colors.challenge} />
            <Text style={styles.timerText}>{timerLeft}s</Text>
          </View>
        )}
      </View>

      <Animated.View
        style={[
          styles.cardArea,
          { transform: [{ translateX: slideAnim }], opacity: fadeAnim },
        ]}
      >
        <Text style={styles.cardPrompt}>{card.prompt}</Text>
        {card.subtext && <Text style={styles.cardSubtext}>{card.subtext}</Text>}

        {card.type === 'thisOrThat' && card.optionA && card.optionB && (
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[
                styles.optionCard,
                currentChoice === 'A' && { borderColor: typeColor, backgroundColor: typeColor + '15' },
              ]}
              onPress={() => setCurrentChoice('A')}
            >
              <Text style={styles.optionLabel}>A</Text>
              <Text style={styles.optionText}>{card.optionA}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionCard,
                currentChoice === 'B' && { borderColor: typeColor, backgroundColor: typeColor + '15' },
              ]}
              onPress={() => setCurrentChoice('B')}
            >
              <Text style={styles.optionLabel}>B</Text>
              <Text style={styles.optionText}>{card.optionB}</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.driftButton} onPress={() => advance('drifted')}>
          <Text style={styles.driftText}>Skip (Drift)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.doneButton,
            { backgroundColor: typeColor },
            card.type === 'thisOrThat' && currentChoice === null && styles.disabledAction,
          ]}
          onPress={() => advance(currentChoice ?? 'A')}
          disabled={card.type === 'thisOrThat' && currentChoice === null}
        >
          <Text style={styles.doneText}>
            {index + 1 === DEMO_QUESTIONS.length ? 'Finish' : 'Done'}
          </Text>
          <ChevronRight size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.demoBanner}>✦ DEMO — 15 Sample Questions</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 2, minWidth: 60 },
  backBtnText: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 2 },
  exitBtn: { minWidth: 40, alignItems: 'flex-end' },
  cardCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 10,
  },
  typeBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
  },
  typeBadgeText: { fontSize: FontSize.xs, fontWeight: '700', textTransform: 'uppercase' },
  countText: { fontSize: FontSize.xs, color: Colors.textMuted, marginLeft: 'auto' },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.challenge + '20',
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  timerText: { fontSize: FontSize.xs, color: Colors.challenge, fontWeight: '700' },
  cardArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    justifyContent: 'center',
    gap: 20,
  },
  cardPrompt: {
    fontSize: FontSize['2xl'],
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 34,
  },
  cardSubtext: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: 22,
  },
  optionsRow: { gap: 12 },
  optionCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: 18,
    borderWidth: 2,
    borderColor: Colors.border,
    gap: 6,
  },
  optionLabel: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  optionText: { fontSize: FontSize.md, color: Colors.text, lineHeight: 22 },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
    alignItems: 'center',
  },
  driftButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  driftText: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '600' },
  doneButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 16,
    borderRadius: Radius.full,
  },
  doneText: { fontSize: FontSize.md, fontWeight: '700', color: '#fff' },
  disabledAction: { opacity: 0.45 },
  demoBanner: {
    textAlign: 'center',
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 1.5,
    paddingBottom: 12,
  },
  finishContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  finishTitle: { fontSize: FontSize['3xl'], fontWeight: '800', color: Colors.text },
  finishSub: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  finishNote: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    maxWidth: 320,
  },
  finishNoteText: { fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 20, textAlign: 'center' },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontSize: FontSize.lg, fontWeight: '700' },
  secondaryButton: { paddingVertical: 12 },
  secondaryButtonText: { color: Colors.textMuted, fontSize: FontSize.sm, fontWeight: '600' },
});
