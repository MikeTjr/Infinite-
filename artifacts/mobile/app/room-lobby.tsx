import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, SafeAreaView, Animated, Alert
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { router } from 'expo-router';
import { Wifi, WifiOff, Users, Plus, ChevronLeft, Copy } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors, Radius, FontSize } from '../constants/colors';
import { useRoomSync } from '../hooks/useRoomSync';

const TOTAL_CARDS = 15;

export default function RoomLobbyScreen() {
  const { state, connect, createRoom, joinRoom, clearError } = useRoomSync();
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose');
  const [joinCode, setJoinCode] = useState('');
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    if (state.error) {
      Alert.alert('Connection Error', state.error, [{ text: 'OK', onPress: clearError }]);
    }
  }, [state.error]);

  useEffect(() => {
    if (state.partnerConnected && state.role === 'host') {
      // Both connected — navigate to live game
      router.replace({ pathname: '/live-game', params: { role: 'host', code: state.roomCode } });
    }
    if (state.role === 'partner' && state.roomCode) {
      router.replace({ pathname: '/live-game', params: { role: 'partner', code: state.roomCode } });
    }
  }, [state.partnerConnected, state.role, state.roomCode]);

  // Pulse animation for waiting state
  useEffect(() => {
    if (state.roomCode && !state.partnerConnected) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.06, duration: 900, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [state.roomCode, state.partnerConnected]);

  const handleCopyCode = async () => {
    if (state.roomCode) {
      await Clipboard.setStringAsync(state.roomCode);
      Alert.alert('Copied!', `Code ${state.roomCode} copied to clipboard.`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={20} color={Colors.text} />
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.connStatus}>
          {state.connected
            ? <Wifi size={14} color="#22c55e" />
            : <WifiOff size={14} color={Colors.textMuted} />}
          <Text style={[styles.connText, { color: state.connected ? '#22c55e' : Colors.textMuted }]}>
            {state.connected ? 'Connected' : 'Connecting...'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Live Sync</Text>
        <Text style={styles.subtitle}>
          Two devices. One game. Each partner plays on their own phone — choices revealed together.
        </Text>

        {!state.connected && (
          <ActivityIndicator color={Colors.primary} style={{ marginVertical: 24 }} />
        )}

        {state.connected && mode === 'choose' && (
          <View style={styles.modeCards}>
            <TouchableOpacity style={styles.modeCard} onPress={() => { setMode('create'); createRoom(TOTAL_CARDS); }}>
              <Plus size={28} color={Colors.primary} />
              <Text style={styles.modeTitle}>Create Room</Text>
              <Text style={styles.modeDesc}>Get a 6-letter code to share with your partner</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modeCard} onPress={() => setMode('join')}>
              <Users size={28} color={Colors.thisOrThat} />
              <Text style={styles.modeTitle}>Join Room</Text>
              <Text style={styles.modeDesc}>Enter the code your partner shared with you</Text>
            </TouchableOpacity>
          </View>
        )}

        {mode === 'create' && (
          <View style={styles.waitSection}>
            {!state.roomCode
              ? <ActivityIndicator color={Colors.primary} />
              : (
                <>
                  <Text style={styles.waitLabel}>Your room code</Text>
                  <Animated.View style={[styles.codeBox, { transform: [{ scale: pulseAnim }] }]}>
                    <Text style={styles.codeText}>{state.roomCode}</Text>
                  </Animated.View>
                  <TouchableOpacity style={styles.copyBtn} onPress={handleCopyCode}>
                    <Copy size={14} color={Colors.primary} />
                    <Text style={styles.copyText}>Copy code</Text>
                  </TouchableOpacity>
                  <Text style={styles.waitInfo}>Share this with your partner. Waiting for them to join...</Text>
                  <ActivityIndicator color={Colors.primary} style={{ marginTop: 8 }} />
                </>
              )}
          </View>
        )}

        {mode === 'join' && !state.role && (
          <View style={styles.joinSection}>
            <Text style={styles.joinLabel}>Enter room code</Text>
            <TextInput
              style={styles.codeInput}
              value={joinCode}
              onChangeText={t => setJoinCode(t.toUpperCase())}
              placeholder="XXXXXX"
              placeholderTextColor={Colors.textMuted}
              maxLength={6}
              autoCapitalize="characters"
              autoFocus
            />
            <TouchableOpacity
              style={[styles.joinBtn, joinCode.length < 6 && { opacity: 0.5 }]}
              onPress={() => joinRoom(joinCode)}
              disabled={joinCode.length < 6}
            >
              <Text style={styles.joinBtnText}>Join Game</Text>
            </TouchableOpacity>
          </View>
        )}

        {state.role === 'partner' && (
          <View style={styles.waitSection}>
            <ActivityIndicator color={Colors.primary} />
            <Text style={styles.waitInfo}>Joined! Waiting for host to start...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backBtnText: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  connStatus: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  connText: { fontSize: FontSize.xs, fontWeight: '600' },
  content: { flex: 1, padding: 24, gap: 20 },
  title: { fontSize: FontSize['3xl'], fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 22 },
  modeCards: { gap: 14, marginTop: 12 },
  modeCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
    alignItems: 'flex-start',
  },
  modeTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  modeDesc: { fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 20 },
  waitSection: { alignItems: 'center', gap: 16, marginTop: 32 },
  waitLabel: { fontSize: FontSize.sm, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  codeBox: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    paddingHorizontal: 36,
    paddingVertical: 20,
    borderWidth: 2,
    borderColor: Colors.primary + '80',
  },
  codeText: { fontSize: 42, fontWeight: '800', color: Colors.primary, letterSpacing: 8 },
  copyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  copyText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
  waitInfo: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', maxWidth: 260, lineHeight: 20 },
  joinSection: { gap: 12, marginTop: 24, alignItems: 'center' },
  joinLabel: { fontSize: FontSize.sm, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  codeInput: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: 6,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 200,
  },
  joinBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 16,
    paddingHorizontal: 40,
    marginTop: 12,
  },
  joinBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: '700' },
});
