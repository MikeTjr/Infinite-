import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Heart, Star, Zap } from 'lucide-react-native';
import { Colors, Radius, FontSize } from '../../constants/colors';

const { width } = Dimensions.get('window');

interface HeartTarget {
  id: number;
  x: number;
  y: number;
  anim: Animated.Value;
  opacity: Animated.Value;
  caught: boolean;
}

interface MiniGameProps {
  onDone?: () => void;
}

const TOTAL_ROUNDS = 15;

export function MiniGame({ onDone }: MiniGameProps) {
  const [score, setScore] = useState(0);
  const [targets, setTargets] = useState<HeartTarget[]>([]);
  const [round, setRound] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const nextId = useRef(0);
  const spawnTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const spawnTarget = useCallback(() => {
    if (round >= TOTAL_ROUNDS) {
      setGameOver(true);
      return;
    }

    const id = nextId.current++;
    const x = Math.random() * (width - 80) + 20;
    const anim = new Animated.Value(0);
    const opacity = new Animated.Value(1);

    const target: HeartTarget = { id, x, y: 0, anim, opacity, caught: false };
    setTargets((prev) => [...prev.slice(-6), target]);
    setRound((r) => r + 1);

    Animated.timing(anim, {
      toValue: 1,
      duration: 2200,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setTargets((prev) => prev.filter((t) => t.id !== id));
      }
    });
  }, [round]);

  useEffect(() => {
    spawnTimer.current = setInterval(spawnTarget, 1200);
    return () => {
      if (spawnTimer.current) clearInterval(spawnTimer.current);
    };
  }, [spawnTarget]);

  useEffect(() => {
    if (gameOver && spawnTimer.current) {
      clearInterval(spawnTimer.current);
    }
  }, [gameOver]);

  const catchTarget = useCallback((id: number, opacity: Animated.Value) => {
    setTargets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, caught: true } : t))
    );
    Animated.timing(opacity, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setTargets((prev) => prev.filter((t) => t.id !== id));
    });
    setScore((s) => s + 10);
  }, []);

  if (gameOver) {
    const grade = score >= 120 ? '💫' : score >= 80 ? '❤️' : '✨';
    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultEmoji}>{grade}</Text>
        <Text style={styles.resultTitle}>Session Complete!</Text>
        <Text style={styles.resultScore}>{score} pts</Text>
        <Text style={styles.resultSub}>
          {score >= 120
            ? 'In perfect sync!'
            : score >= 80
            ? 'Great connection!'
            : 'Keep reaching for each other!'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.scoreBadge}>
          <Star size={14} color={Colors.challenge} />
          <Text style={styles.scoreText}>{score}</Text>
        </View>
        <Text style={styles.instruction}>Tap the hearts before they fall!</Text>
        <View style={styles.progressPill}>
          <Text style={styles.progressText}>{round}/{TOTAL_ROUNDS}</Text>
        </View>
      </View>

      <View style={styles.gameArea}>
        {targets.map((t) => {
          const translateY = t.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 340],
          });
          const scale = t.anim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.8, 1.1, 0.8],
          });

          return (
            <Animated.View
              key={t.id}
              style={[
                styles.target,
                {
                  left: t.x,
                  transform: [{ translateY }, { scale }],
                  opacity: t.opacity,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => !t.caught && catchTarget(t.id, t.opacity)}
                style={styles.targetTouch}
                hitSlop={10}
              >
                <Heart size={36} color={Colors.primary} fill={Colors.primary} />
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {targets.length === 0 && round < TOTAL_ROUNDS && (
          <View style={styles.waitingHint}>
            <Zap size={18} color={Colors.textMuted} />
            <Text style={styles.waitingText}>Get ready…</Text>
          </View>
        )}
      </View>

      <Text style={styles.footerNote}>Avatar still processing in background…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.card,
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scoreText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text },
  instruction: { fontSize: FontSize.xs, color: Colors.textMuted, flex: 1, textAlign: 'center' },
  progressPill: {
    backgroundColor: Colors.card,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressText: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '600' },
  gameArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  target: {
    position: 'absolute',
    top: 0,
  },
  targetTouch: {
    padding: 6,
  },
  waitingHint: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  waitingText: { fontSize: FontSize.sm, color: Colors.textMuted },
  footerNote: {
    textAlign: 'center',
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    paddingBottom: 20,
    paddingTop: 8,
  },
  resultContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  resultEmoji: { fontSize: 64 },
  resultTitle: { fontSize: FontSize['2xl'], fontWeight: '700', color: Colors.text },
  resultScore: { fontSize: FontSize['3xl'], fontWeight: '800', color: Colors.primary },
  resultSub: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', maxWidth: 240 },
});
