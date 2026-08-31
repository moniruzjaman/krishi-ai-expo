import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BRAND } from '../../src/constants';

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemActive]}>
      <Text style={styles.tabEmoji}>{emoji}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

function ScanButton() {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.push('/analyzer')}
      style={styles.scanBtn}
      activeOpacity={0.85}
    >
      <Text style={styles.scanEmoji}>📸</Text>
      <Text style={styles.scanLabel}>স্ক্যান</Text>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 64 + insets.bottom,
          paddingBottom: insets.bottom,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: BRAND.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="হোম" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🛠️" label="টুলস" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="scan-placeholder"
        options={{
          tabBarIcon: () => <ScanButton />,
          tabBarStyle: { display: 'none' }, // hide default; we override with custom btn
        }}
        listeners={{ tabPress: (e) => e.preventDefault() }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🎓" label="শিখুন" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="প্রোফাইল" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: { alignItems: 'center', paddingTop: 6, gap: 2, opacity: 0.5 },
  tabItemActive: { opacity: 1 },
  tabEmoji: { fontSize: 22 },
  tabLabel: { fontSize: 9, fontWeight: '700', color: '#94a3b8', letterSpacing: 0.5 },
  tabLabelActive: { color: BRAND.primary },

  scanBtn: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: BRAND.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: BRAND.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    gap: 2,
  },
  scanEmoji: { fontSize: 22, color: '#fff' },
  scanLabel: { fontSize: 8, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
});
