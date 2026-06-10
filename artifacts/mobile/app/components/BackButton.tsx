import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Colors, FontSize } from '../../constants/colors';

interface BackButtonProps {
  label?: string;
  onPress?: () => void;
  color?: string;
}

export function BackButton({ label = 'Back', onPress, color = Colors.text }: BackButtonProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress} hitSlop={12}>
      <ChevronLeft size={20} color={color} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 2,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: '600',
  },
});
