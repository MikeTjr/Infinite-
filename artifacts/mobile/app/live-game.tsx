import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  Animated, Alert
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ChevronRight, X, Check, Wifi } from 'lucide-react-native';
import { Colors, Radius, FontSize } from '../constants/colors';
import { CARD_TYPE_COLORS, CARD_TYPE_LABELS, type CardType } from '../data/demoQuestions';
import { useRoomSync, type ChoiceOption } from '../hooks/useRoomSync';
import { SESSION_CARDS } from './game';

export default function LiveGameScreen() {
  const { role } = useLocalSearchParams<{ role: 'host' | 'partner'; code: string }>();
  const { state, connect, makeChoice, advanceCard, disconnect } = useRoomSync();
  const [localCardIndex, setLocalCardIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const isHost = role === 'host';
  const cards = SESSION_CARDS;
  const card = cards[state.currentCardIndex] ?? cards[0];
  const typeColor = CARD_TYPE_COLORS[card?.type as CardType] ?? Colors.primary;

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  useEffect(() => {
    if (state.currentCardIndex !== localCardIndex) {
      animateTransition('forward', () => setLocalCardIndex(state.currentCardIndex));
    }
  }, [state.currentCardIndex]);

  useEffect(() => {
    if (state.finished) {
      router.replace({
        pathname: '/live-finish',
        params: {
          hostScore: state.scores.host,
          partnerScore: state.scores.partner,
          role,
        },
      });
    }
  }, [state.finished]);

  const animateTransition = (dir: 'forward' | 'back', onDone: () => void) => {
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
  };

  const handleChoice = (option: ChoiceOption) => {
    if (state.myChoice) return;
    makeChoice(option);
  };

  const handleAdvance = () => {
    if (!isHost) return;
    advanceCard();
  };

  const handleExit = () => {
    Alert.alert(
      'Leave Game',
      'Your partner will be notified. The session will end for both of you.',
      [
        { text: 'Stay', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: () => { disconnect(); router.replace('/(tabs)'); } },
      ]
    );
  };

  const waitingForPartner = state.myChoice !== null && !state.revealedChoices;
  const bothRevealed = state.revealedChoices !== null;
  const myRevealedChoice = bothRevealed
    ? (isHost ? state.revealedChoices!.hostChoice : state.revealedChoices!.partnerChoice)
    : null;
  const partnerRevealedChoice = bothRevealed
    ? (isHost ? state.revealedChoices!.partnerChoice : state.revealedChoices!.hostChoice)
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleExit} style={styles.backBtn}>
          <ChevronLeft size={20} color={Colors.text} />
          <Text style={styles.backBtnText}>Leave</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(state.currentCardIndex / cards.length) * 100}%`, backgroundColor: typeColor }]} />
        </View>
        <View style={styles.connDot}>
          <Wifi size={13} color={state.partnerConnected ? '#22c55e' : Colors.textMuted} />
          <Text style={[styles.connText, { color: state.partnerConnected ? '#22c55e' : Colors.textMuted }]}>
            {state.partnerConnected ? 'Synced' : 'Waiting'}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={[styles.typeBadge, { backgroundColor: typeColor + '20', borderColor: typeColor + '60' }]}>
          <Text style={[styles.typeBadgeText, { color: typeColor }]}>{CARD_TYPE_LABELS[card.type as CardType]}</Text>
        </View>
        <View style={styles.rolePill}>
          <Text style={styles.roleText}>{isHost ? '👑 Host' : '🤝 Partner'}</Text>
        </View>
        <Text style={styles.countText}>{state.currentCardIndex + 1} / {cards.length}</Text>
      </View>

      <Animated.View style={[styles.cardArea, { transform: [{ translateX: slideAnim }], opacity: fadeAnim }]}>
        <Text style={styles.prompt}>{card.prompt}</Text>
        {card.subtext && <Text style={styles.subtext}>{card.subtext}</Text>}

        {card.type === 'thisOrThat' && card.optionA && card.optionB && (
          <View style={styles.optionsRow}>
            {(['A', 'B'] as const).map((opt) => {
              const chosen = state.myChoice === opt;
              const revealed = bothRevealed && myRevealedChoice === opt;
              const partnerChoseThis = bothRevealed && partnerRevealedChoice === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.optionCard,
                    chosen && { borderColor: typeColor, backgroundColor: typeColor + '15' },
                    revealed && { borderColor: typeColor, backgroundColor: typeColor + '25' },
                  ]}
                  onPress={() => handleChoice(opt)}
                  disabled={!!state.myChoice}
                >
                  <Text style={styles.optionLabel}>{opt}</Text>
                  <Text style={styles.optionText}>{opt === 'A' ? card.optionA : card.optionB}</Text>
                  {bothRevealed && (
                    <View style={styles.voteRow}>
                      {myRevealedChoice === opt && <Text style={styles.voteLabel}>You</Text>}
                      {partnerRevealedChoice === opt && <Text style={[styles.voteLabel, { color: Colors.thisOrThat }]}>Partner</Text>}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {card.type !== 'thisOrThat' && !bothRevealed && (
          <View style={styles.simpleChoiceRow}>
            <TouchableOpacity
              style={[styles.doneSimple, state.myChoice === 'A' && { backgroundColor: typeColor }]}
              onPress={() => handleChoice('A')}
              disabled={!!state.myChoice}
            >
              <Check size={18} color={state.myChoice === 'A' ? '#fff' : Colors.textMuted} />
              <Text style={[styles.doneSimpleText, state.myChoice === 'A' && { color: '#fff' }]}>Done</Text>
            </TouchableOpacity>
          </View>
        )}

        {bothRevealed && card.type !== 'thisOrThat' && (
          <View style={styles.revealBanner}>
            <Text style={styles.revealText}>
              {state.revealedChoices?.hostChoice === 'drift' || state.revealedChoices?.partnerChoice === 'drift'
                ? `${state.revealedChoices.hostChoice === 'drift' ? (isHost ? 'You' : 'Partner') : (isHost ? 'Partner' : 'You')} drifted this one.`
                : '✓ Both played this card'}
            </Text>
          </View>
        )}
      </Animated.View>

      <View style={styles.actions}>
        {!state.myChoice && (
          <TouchableOpacity style={styles.driftButton} onPress={() => handleChoice('drift')}>
            <Text style={styles.driftText}>Drift</Text>
          </TouchableOpacity>
        )}

        {waitingForPartner && (
          <View style={styles.waitingPill}>
            <Text style={styles.waitingText}>
              {state.partnerChose ? '✓ Both chose — waiting for host' : 'Waiting for your partner...'}
            </Text>
          </View>
        )}

        {bothRevealed && isHost && (
          <TouchableOpacity style={[styles.nextBtn, { backgroundColor: typeColor }]} onPress={handleAdvance}>
            <Text style={styles.nextBtnText}>{state.currentCardIndex + 1 >= cards.length ? 'Finish' : 'Next Card'}</Text>
            <ChevronRight size={18} color="#fff" />
          </TouchableOpacity>
        )}

        {bothRevealed && !isHost && (
          <View style={styles.waitingPill}>
            <Text style={styles.waitingText}>Waiting for host to advance...</Text>
          </View>
        )}
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
  connDot: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  connText: { fontSize: FontSize.xs, fontWeight: '600' },
  metaRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12, gap: 8 },
  typeBadge: { borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1 },
  typeBadgeText: { fontSize: FontSize.xs, fontWeight: '700', textTransform: 'uppercase' },
  rolePill: { backgroundColor: Colors.surface, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: Colors.border },
  roleText: { fontSize: FontSize.xs, color: Colors.text, fontWeight: '600' },
  countText: { fontSize: FontSize.xs, color: Colors.textMuted, marginLeft: 'auto' },
  cardArea: { flex: 1, paddingHorizontal: 24, paddingTop: 12, justifyContent: 'center', gap: 20 },
  prompt: { fontSize: FontSize['2xl'], fontWeight: '700', color: Colors.text, lineHeight: 34 },
  subtext: { fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 22 },
  optionsRow: { gap: 12 },
  optionCard: { backgroundColor: Colors.card, borderRadius: Radius.xl, padding: 18, borderWidth: 2, borderColor: Colors.border, gap: 4 },
  optionLabel: { fontSize: FontSize.xs, fontWeight: '800', color: Colors.textMuted, textTransform: 'uppercase' },
  optionText: { fontSize: FontSize.md, color: Colors.text, lineHeight: 22 },
  voteRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  voteLabel: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.primary },
  simpleChoiceRow: { alignItems: 'center' },
  doneSimple: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 28, borderRadius: Radius.full, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  doneSimpleText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textMuted },
  revealBanner: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: 14, alignItems: 'center' },
  revealText: { fontSize: FontSize.sm, color: Colors.text, fontWeight: '600' },
  actions: { flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 16, gap: 12, alignItems: 'center', justifyContent: 'center' },
  driftButton: { flex: 1, paddingVertical: 16, alignItems: 'center', borderRadius: Radius.full, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  driftText: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '600' },
  waitingPill: { flex: 2, paddingVertical: 16, alignItems: 'center', borderRadius: Radius.full, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  waitingText: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '500' },
  nextBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 16, borderRadius: Radius.full },
  nextBtnText: { fontSize: FontSize.md, fontWeight: '700', color: '#fff' },
});
