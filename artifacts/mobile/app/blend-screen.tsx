import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useState, useRef } from 'react';
import { router } from 'expo-router';
import { Camera, AlertTriangle, Check, ChevronLeft, Shuffle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Radius, FontSize } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { MiniGame } from './components/MiniGame';
import { useSecureStorage } from '../hooks/useSecureStorage';

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? '';

type Phase = 'setup' | 'warning' | 'processing' | 'done' | 'approved';

export default function BlendScreen() {
  const { user, approveAvatar } = useAuth();
  const { set: savePendingAvatar } = useSecureStorage<string | null>('pending-avatar', null);

  const [phase, setPhase] = useState<Phase>('setup');
  const [photo1, setPhoto1] = useState<string | null>(null);
  const [photo2, setPhoto2] = useState<string | null>(null);
  const [style, setStyle] = useState<'cartoon' | 'watercolor' | 'anime' | 'painterly'>('cartoon');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const processingRef = useRef(false);

  const pickPhoto = async (slot: 1 | 2) => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission Required', 'Allow access to your photo library to continue.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].base64
        ? `data:image/jpeg;base64,${result.assets[0].base64}`
        : result.assets[0].uri;
      if (slot === 1) setPhoto1(uri);
      else setPhoto2(uri);
    }
  };

  const takePhoto = async (slot: 1 | 2) => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission Required', 'Allow camera access to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].base64
        ? `data:image/jpeg;base64,${result.assets[0].base64}`
        : result.assets[0].uri;
      if (slot === 1) setPhoto1(uri);
      else setPhoto2(uri);
    }
  };

  const handleContinue = () => {
    if (!photo1 || !photo2) {
      Alert.alert('Two Photos Required', 'Please add a photo for each partner first.');
      return;
    }
    setPhase('warning');
  };

  const startProcessing = async () => {
    if (processingRef.current) return;
    processingRef.current = true;
    setPhase('processing');
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/blend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo1, photo2, style }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error ?? 'Something went wrong.');
        setPhase('setup');
        return;
      }

      await savePendingAvatar(data.imageUrl);
      setResultUrl(data.imageUrl);
      setResultMessage(data.message ?? '');
      setPhase('done');
    } catch (err) {
      setError('Could not reach the server. Check your connection.');
      setPhase('setup');
    } finally {
      processingRef.current = false;
    }
  };

  const handleApprove = async () => {
    if (!resultUrl) return;
    await approveAvatar(resultUrl);
    setPhase('approved');
  };

  const handleRetake = () => {
    setPhoto1(null);
    setPhoto2(null);
    setResultUrl(null);
    setError(null);
    setPhase('setup');
  };

  if (phase === 'processing') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.processingHeader}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.processingTitle}>Creating your couple avatar…</Text>
          <Text style={styles.processingNote}>This takes about 20–40 seconds. Play while you wait!</Text>
        </View>
        <MiniGame />
      </SafeAreaView>
    );
  }

  if (phase === 'done' && resultUrl) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.doneContent}>
          <Text style={styles.doneTitle}>✨ Your Avatar is Ready!</Text>
          <Text style={styles.doneMessage}>{resultMessage}</Text>

          <View style={styles.resultImageContainer}>
            <Image source={{ uri: resultUrl }} style={styles.resultImage} resizeMode="cover" />
            <View style={styles.privateOverlay}>
              <Text style={styles.privateText}>🔒 Only visible to you until approved</Text>
            </View>
          </View>

          <Text style={styles.approvalNote}>
            Once you both approve this avatar, it becomes your permanent couple icon. Take your time.
          </Text>

          <TouchableOpacity style={styles.approveButton} onPress={handleApprove}>
            <Check size={20} color="#fff" />
            <Text style={styles.approveButtonText}>We Love It — Set as Avatar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
            <Text style={styles.retakeText}>Try Again with New Photos</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (phase === 'approved') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.finishContainer}>
          <Text style={styles.approvedEmoji}>💑</Text>
          <Text style={styles.approvedTitle}>Avatar Set!</Text>
          <Text style={styles.approvedSub}>Your couple avatar is now live on your profile.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.primaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (phase === 'warning') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.warningContainer}>
          <TouchableOpacity onPress={() => setPhase('setup')} style={styles.backButton}>
            <ChevronLeft size={20} color={Colors.text} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <AlertTriangle size={48} color={Colors.challenge} />
          <Text style={styles.warningTitle}>Before We Process</Text>

          <View style={styles.warningCard}>
            <Text style={styles.warningHeading}>📸 Photo Quality Warning</Text>
            <Text style={styles.warningBody}>
              AI avatar generation uses real tokens and cannot be undone. To avoid wasting a generation:
            </Text>
            <View style={styles.tipList}>
              {[
                'Use clear, front-facing photos — both people visible',
                'Good lighting: no harsh shadows or backlight',
                'Face fills most of the frame — no full-body shots',
                'Avoid sunglasses, hats, or anything covering the face',
                'High-contrast backgrounds work best',
              ].map((tip, i) => (
                <Text key={i} style={styles.tip}>• {tip}</Text>
              ))}
            </View>
          </View>

          <Text style={styles.warningFine}>
            Processing takes 20–40 seconds. A mini-game will keep you company while we work.
          </Text>

          <TouchableOpacity style={styles.primaryButton} onPress={startProcessing}>
            <Text style={styles.primaryButtonText}>Photos Look Good — Generate Avatar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setPhase('setup')} style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>Let Me Change the Photos First</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const STYLES: Array<{ id: typeof style; label: string }> = [
    { id: 'cartoon', label: 'Cartoon' },
    { id: 'watercolor', label: 'Watercolor' },
    { id: 'anime', label: 'Anime' },
    { id: 'painterly', label: 'Painterly' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={20} color={Colors.text} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Two Become One</Text>
        <Text style={styles.subtitle}>
          Upload a clear photo of each partner to create your couple avatar.
        </Text>

        {error && (
          <View style={styles.errorCard}>
            <AlertTriangle size={16} color={Colors.spicy} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.photosRow}>
          {(['Partner 1', 'Partner 2'] as const).map((label, i) => {
            const photo = i === 0 ? photo1 : photo2;
            const slot = (i + 1) as 1 | 2;
            return (
              <View key={label} style={styles.photoSlot}>
                <Text style={styles.photoLabel}>{label}</Text>
                {photo ? (
                  <TouchableOpacity onPress={() => (i === 0 ? setPhoto1(null) : setPhoto2(null))}>
                    <Image source={{ uri: photo }} style={styles.photoPreview} />
                    <View style={styles.removeOverlay}>
                      <Text style={styles.removeText}>✕ Remove</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.photoActions}>
                    <TouchableOpacity style={styles.photoBtn} onPress={() => takePhoto(slot)}>
                      <Camera size={20} color={Colors.primary} />
                      <Text style={styles.photoBtnText}>Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.photoBtn} onPress={() => pickPhoto(slot)}>
                      <Shuffle size={20} color={Colors.textMuted} />
                      <Text style={styles.photoBtnText}>Library</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Art Style</Text>
        <View style={styles.styleRow}>
          {STYLES.map(({ id, label }) => (
            <TouchableOpacity
              key={id}
              style={[styles.styleChip, style === id && styles.styleChipActive]}
              onPress={() => setStyle(id)}
            >
              <Text style={[styles.styleChipText, style === id && styles.styleChipTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.privacyNote}>
          <Text style={styles.privacyIcon}>🔒</Text>
          <Text style={styles.privacyText}>
            Photos are processed privately and never stored on our servers. The generated avatar is only
            visible on your device until you approve it.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, (!photo1 || !photo2) && styles.disabled]}
          onPress={handleContinue}
          disabled={!photo1 || !photo2}
        >
          <Text style={styles.primaryButtonText}>Continue to Review</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 40, gap: 16 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingBottom: 4 },
  backText: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  title: { fontSize: FontSize['2xl'], fontWeight: '700', color: Colors.text },
  subtitle: { fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 20 },
  errorCard: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.spicy + '15', borderRadius: Radius.lg, padding: 14, borderWidth: 1, borderColor: Colors.spicy + '40' },
  errorText: { fontSize: FontSize.sm, color: Colors.spicy, flex: 1 },
  photosRow: { flexDirection: 'row', gap: 12 },
  photoSlot: { flex: 1, gap: 8 },
  photoLabel: { fontSize: FontSize.xs, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 },
  photoPreview: { width: '100%', aspectRatio: 1, borderRadius: Radius.xl, backgroundColor: Colors.surface },
  removeOverlay: { position: 'absolute', bottom: 8, right: 8, backgroundColor: Colors.spicy + 'cc', borderRadius: Radius.md, paddingHorizontal: 8, paddingVertical: 4 },
  removeText: { color: '#fff', fontSize: FontSize.xs, fontWeight: '700' },
  photoActions: { gap: 8 },
  photoBtn: { backgroundColor: Colors.card, borderRadius: Radius.xl, paddingVertical: 20, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, gap: 8 },
  photoBtnText: { fontSize: FontSize.xs, color: Colors.textMuted },
  sectionLabel: { fontSize: FontSize.xs, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 },
  styleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  styleChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: Radius.full, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  styleChipActive: { backgroundColor: Colors.primary + '20', borderColor: Colors.primary },
  styleChipText: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '600' },
  styleChipTextActive: { color: Colors.primary },
  privacyNote: { flexDirection: 'row', gap: 10, backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: 14, borderWidth: 1, borderColor: Colors.border, alignItems: 'flex-start' },
  privacyIcon: { fontSize: 18 },
  privacyText: { flex: 1, fontSize: FontSize.xs, color: Colors.textMuted, lineHeight: 18 },
  primaryButton: { backgroundColor: Colors.primary, borderRadius: Radius.full, paddingVertical: 18, alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  primaryButtonText: { color: '#fff', fontSize: FontSize.lg, fontWeight: '700' },
  disabled: { opacity: 0.45 },
  processingHeader: { alignItems: 'center', gap: 8, padding: 20, paddingTop: 24 },
  processingTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  processingNote: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center' },
  warningContainer: { flex: 1, padding: 24, gap: 18, alignItems: 'center', justifyContent: 'center' },
  warningTitle: { fontSize: FontSize['2xl'], fontWeight: '700', color: Colors.text },
  warningCard: { backgroundColor: Colors.card, borderRadius: Radius.xl, padding: 18, borderWidth: 1, borderColor: Colors.border, gap: 12, width: '100%' },
  warningHeading: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  warningBody: { fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 20 },
  tipList: { gap: 6 },
  tip: { fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 20 },
  warningFine: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center', lineHeight: 18 },
  secondaryButton: { paddingVertical: 12 },
  secondaryText: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '600' },
  doneContent: { padding: 24, gap: 18, alignItems: 'center' },
  doneTitle: { fontSize: FontSize['2xl'], fontWeight: '700', color: Colors.text },
  doneMessage: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', lineHeight: 20, maxWidth: 280 },
  resultImageContainer: { width: '80%', aspectRatio: 1, borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 2, borderColor: Colors.primary + '60' },
  resultImage: { width: '100%', height: '100%' },
  privateOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#000000aa', padding: 10, alignItems: 'center' },
  privateText: { fontSize: FontSize.xs, color: '#fff', fontWeight: '600' },
  approvalNote: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', lineHeight: 20, maxWidth: 300 },
  approveButton: { backgroundColor: Colors.legacy, borderRadius: Radius.full, paddingVertical: 16, paddingHorizontal: 32, flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'center' },
  approveButtonText: { color: '#fff', fontSize: FontSize.md, fontWeight: '700' },
  retakeButton: { paddingVertical: 12 },
  retakeText: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '600' },
  finishContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 14 },
  approvedEmoji: { fontSize: 64 },
  approvedTitle: { fontSize: FontSize['3xl'], fontWeight: '800', color: Colors.text },
  approvedSub: { fontSize: FontSize.md, color: Colors.textMuted, textAlign: 'center' },
});
