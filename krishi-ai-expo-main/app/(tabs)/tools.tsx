import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BRAND, TOOLS } from '../../src/constants';

const { width } = Dimensions.get('window');

export default function ToolsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const t = (bn: string, en: string) => lang === 'bn' ? bn : en;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: 100 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t('সকল টুলস', 'All Tools')}</Text>
          <Text style={styles.subtitle}>{t('আপনার কৃষি কার্যক্রম পরিচালনা করুন', 'Manage your agricultural activities')}</Text>
        </View>
        <View style={styles.langRow}>
          {(['bn', 'en'] as const).map((l) => (
            <TouchableOpacity key={l} onPress={() => setLang(l)} style={[styles.langBtn, lang === l && styles.langBtnActive]}>
              <Text style={[styles.langBtnText, lang === l && styles.langBtnTextActive]}>{l === 'bn' ? 'বাং' : 'EN'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.grid}>
        {TOOLS.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={[styles.card, { backgroundColor: tool.bg }]}
            onPress={() => router.push(tool.route as any)}
            activeOpacity={0.82}
          >
            <View style={[styles.iconCircle, { backgroundColor: tool.color + '22' }]}>
              <Text style={styles.emoji}>{tool.icon}</Text>
            </View>
            <Text style={styles.cardLabel} numberOfLines={2}>{lang === 'bn' ? tool.label : tool.labelEn}</Text>
            <Text style={styles.cardDesc} numberOfLines={1}>{tool.desc}</Text>
            <View style={[styles.arrow, { backgroundColor: tool.color + '22' }]}>
              <Text style={[styles.arrowText, { color: tool.color }]}>→</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>🏛️ Powered by BARI · BRRI · DAE · BARC · SRDI</Text>
      </View>
    </ScrollView>
  );
}

const CARD_W = (width - 48) / 2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
  subtitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  langRow: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 999, padding: 3, gap: 2 },
  langBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  langBtnActive: { backgroundColor: BRAND.primary },
  langBtnText: { fontSize: 10, fontWeight: '800', color: '#94a3b8' },
  langBtnTextActive: { color: '#fff' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: CARD_W, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)', gap: 6 },
  iconCircle: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  emoji: { fontSize: 26 },
  cardLabel: { fontSize: 13, fontWeight: '800', color: '#0f172a', lineHeight: 18 },
  cardDesc: { fontSize: 10, color: '#64748b' },
  arrow: { alignSelf: 'flex-end', width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  arrowText: { fontSize: 16, fontWeight: '800' },
  footer: { marginTop: 24, alignItems: 'center' },
  footerText: { fontSize: 11, color: '#94a3b8', textAlign: 'center' },
});
