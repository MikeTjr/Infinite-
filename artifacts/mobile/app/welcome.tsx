import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { Heart, Users } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors, Radius, FontSize } from '../constants/colors';
import { useAuth } from '../context/AuthContext';

export default function WelcomeScreen() {
  const { signIn } = useAuth();
  const [partner1, setPartner1] = useState('');
  const [partner2, setPartner2] = useState('');
  const [coupleName, setCoupleName] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'intro' | 'setup'>('intro');

  const handleBegin = async () => {
    if (!partner1.trim() || !partner2.trim()) {
      Alert.alert('Missing Info', 'Please enter both partner names.');
      return;
    }
    setLoading(true);
    try {
      const name = coupleName.trim() || `${partner1.trim()} & ${partner2.trim()}`;
      await signIn({
        coupleName: name,
        partner1Name: partner1.trim(),
        partner2Name: partner2.trim(),
        avatarApproved: false,
      });
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Error', 'Could not save your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'intro') {
    return (
      <View style={styles.introContainer}>
        <View style={styles.logoArea}>
          <View style={styles.logoRing}>
            <Heart size={52} color={Colors.primary} fill={Colors.primary} />
          </View>
          <Text style={styles.appName}>Infinite Us</Text>
          <Text style={styles.tagline}>The relationship platform for couples who refuse to stop growing.</Text>
        </View>

        <View style={styles.featureList}>
          {[
            { icon: '🃏', text: 'Card sessions that deepen connection' },
            { icon: '🧠', text: 'Adaptive cards shaped by your patterns' },
            { icon: '🔥', text: 'Journeys built for couples like you' },
            { icon: '🏆', text: 'Bonds to grow alongside other couples' },
          ].map(({ icon, text }) => (
            <View key={text} style={styles.feature}>
              <Text style={styles.featureIcon}>{icon}</Text>
              <Text style={styles.featureText}>{text}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => setStep('setup')}>
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>

        <Text style={styles.privacy}>
          Your data stays on this device. No account required.
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => setStep('intro')} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.setupHeader}>
          <Users size={32} color={Colors.primary} />
          <Text style={styles.setupTitle}>Set Up Your Couple</Text>
          <Text style={styles.setupSubtitle}>
            This lives on your device. You can always change it later in your profile.
          </Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Partner 1 Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Alex"
            placeholderTextColor={Colors.textMuted}
            value={partner1}
            onChangeText={setPartner1}
            autoCapitalize="words"
            returnKeyType="next"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Partner 2 Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Jordan"
            placeholderTextColor={Colors.textMuted}
            value={partner2}
            onChangeText={setPartner2}
            autoCapitalize="words"
            returnKeyType="next"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Couple Name (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder={
              partner1 && partner2 ? `${partner1} & ${partner2}` : 'e.g. The Wilsons'
            }
            placeholderTextColor={Colors.textMuted}
            value={coupleName}
            onChangeText={setCoupleName}
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={handleBegin}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            (!partner1.trim() || !partner2.trim()) && styles.disabled,
          ]}
          onPress={handleBegin}
          disabled={!partner1.trim() || !partner2.trim() || loading}
        >
          <Heart size={18} color="#fff" fill="#fff" />
          <Text style={styles.primaryButtonText}>
            {loading ? 'Setting up…' : 'Begin Our Journey'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  introContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 28,
    justifyContent: 'center',
    gap: 28,
  },
  logoArea: { alignItems: 'center', gap: 12 },
  logoRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary + '60',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: { fontSize: FontSize['3xl'], fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  tagline: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', lineHeight: 20, maxWidth: 280 },
  featureList: { gap: 12 },
  feature: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  featureIcon: { fontSize: 22, width: 32, textAlign: 'center' },
  featureText: { fontSize: FontSize.sm, color: Colors.text, flex: 1, lineHeight: 20 },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: { color: '#fff', fontSize: FontSize.lg, fontWeight: '700' },
  disabled: { opacity: 0.5 },
  privacy: { textAlign: 'center', fontSize: FontSize.xs, color: Colors.textMuted },
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 24, paddingBottom: 40, gap: 20 },
  backButton: { paddingVertical: 4 },
  backText: { color: Colors.textMuted, fontSize: FontSize.sm },
  setupHeader: { alignItems: 'center', gap: 8, marginBottom: 8 },
  setupTitle: { fontSize: FontSize['2xl'], fontWeight: '700', color: Colors.text },
  setupSubtitle: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', maxWidth: 280, lineHeight: 20 },
  fieldGroup: { gap: 6 },
  fieldLabel: { fontSize: FontSize.xs, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 },
  input: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: FontSize.md,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
