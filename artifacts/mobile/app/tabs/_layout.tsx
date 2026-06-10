import { Tabs } from 'expo-router';
import { Heart, BookOpen, Users, User, Gamepad2 } from 'lucide-react-native';
import { Colors } from '../../constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
        },
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Heart size={22} color={color} />,
          headerTitle: 'Infinite Us',
        }}
      />
      <Tabs.Screen
        name="play"
        options={{
          title: 'Play',
          tabBarIcon: ({ color }) => <Gamepad2 size={22} color={color} />,
          headerTitle: 'Play',
        }}
      />
      <Tabs.Screen
        name="archive"
        options={{
          title: 'Archive',
          tabBarIcon: ({ color }) => <BookOpen size={22} color={color} />,
          headerTitle: 'Session Archive',
        }}
      />
      <Tabs.Screen
        name="bonds"
        options={{
          title: 'Bonds',
          tabBarIcon: ({ color }) => <Users size={22} color={color} />,
          headerTitle: 'Bonds',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={22} color={color} />,
          headerTitle: 'Profile',
        }}
      />
    </Tabs>
  );
}
