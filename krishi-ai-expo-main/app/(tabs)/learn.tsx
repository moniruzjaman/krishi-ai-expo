import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BRAND, LEARNING_MODULES } from '../../src/constants';
import { getLearningContent } from '../../src/services/gemini';

export default function LearnScreen() {
  const insets = useSafeAreaInsets();
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [loading, setLoading] = useState<number | null>(null);
  const [content, setContent] = useState<{ id: number; text: string } | null>(null);
  const t = (bn: string, en: string) => lang === 'bn' ? bn : en;

  const openModule = async (module: typeof LEARNING_MODULES[0]) => {
    setLoading(module.id);
    setContent(null);
    try {
      const text = await getLearningContent(module.title, lang);
      setContent({ id: module.id, text });
    } catch {
      Alert.alert(t('সমস্যা হয়েছে', 'Error'), t('কন্টেন্ট লোড করতে পারেনি।', 'Could not load content.'));
    }
    setLoading(null);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: 100 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>🎓 {t('শিক্ষা কেন্দ্র', 'Learning Center')}</Text>
          <Text style={styles.subtitle}>{t('প্রশিক্ষণ মডিউল ও সার্টিফিকেশন', 'Training modules & certification')}</Text>
        </View>
        <View style={styles.langRow}>
          {(['bn', 'en'] as const).map((l) => (
            <TouchableOpacity key={l} onPress={() => setLang(l)} style={[styles.langBtn, lang === l && styles.langBtnActive]}>
              <Text style={[styles.langBtnText, lang === l && styles.langBtnTextActive]}>{l === 'bn' ? 'বাং' : 'EN'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {LEARNING_MODULES.map((module) => (
        <View key={module.id}>
          <TouchableOpacity
            style={styles.moduleCard}
            onPress={() => openModule(module)}
            activeOpacity={0.85}
          >
            <View style={styles.moduleLeft}>
              <Text style={styles.moduleEmoji}>{module.icon}</Text>
              <View style={styles.moduleInfo}>
                <Text style={styles.moduleTitle} numberOfLines={2}>{module.title}</Text>
                <View style={styles.moduleMeta}>
                  <View style={[styles.levelBadge, { backgroundColor: module.levelColor + '22' }]}>
                    <Text style={[styles.levelText, { color: module.levelColor }]}>{module.level}</Text>
                  </View>
                  <Text style={styles.moduleTime}>⏱ {module.duration}</Text>
                </View>
              </View>
            </View>
            <View style={styles.moduleRight}>
              <Text style={styles.moduleXp}>+{module.xp}</Text>
              <Text style={styles.moduleXpLabel}>XP</Text>
              {loading === module.id
                ? <ActivityIndicator size="small" color={BRAND.primary} style={{ marginTop: 6 }} />
                : <Text style={styles.moduleArrow}>→</Text>}
            </View>
          </TouchableOpacity>

          {/* Expanded content */}
          {content?.id === module.id && (
            <View style={styles.contentCard}>
              <View style={styles.contentHeader}>
                <Text style={styles.contentTitle}>📋 {t('পাঠের বিষয়বস্তু', 'Lesson Content')}</Text>
                <View style={styles.aiBadge}><Text style={styles.aiBadgeText}>AI</Text></View>
              </View>
              <Text style={styles.contentText}>{content.text}</Text>
              <View style={styles.completeRow}>
                <Text style={styles.poweredBy}>Powered by Gemini AI</Text>
                <TouchableOpacity style={styles.completeBtn}>
                  <Text style={styles.completeBtnText}>✓ {t('সম্পন্ন', 'Complete')} +{module.xp} XP</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { paddingHorizontal: 16, gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '900', color: '#0f172a' },
  subtitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  langRow: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 999, padding: 3, gap: 2 },
  langBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  langBtnActive: { backgroundColor: BRAND.primary },
  langBtnText: { fontSize: 10, fontWeight: '800', color: '#94a3b8' },
  langBtnTextActive: { color: '#fff' },

  moduleCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 16,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#e2e8f0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  moduleLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  moduleEmoji: { fontSize: 32 },
  moduleInfo: { flex: 1, gap: 6 },
  moduleTitle: { fontSize: 14, fontWeight: '800', color: '#0f172a', lineHeight: 20 },
  moduleMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  levelBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  levelText: { fontSize: 10, fontWeight: '700' },
  moduleTime: { fontSize: 11, color: '#94a3b8' },
  moduleRight: { alignItems: 'center', gap: 2, minWidth: 40 },
  moduleXp: { fontSize: 18, fontWeight: '900', color: '#f59e0b' },
  moduleXpLabel: { fontSize: 9, color: '#94a3b8', fontWeight: '700' },
  moduleArrow: { fontSize: 20, color: '#cbd5e1', marginTop: 4 },

  contentCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: '#e2e8f0',
    marginTop: -6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  contentHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  contentTitle: { fontSize: 14, fontWeight: '800', color: '#0f172a', flex: 1 },
  aiBadge: { backgroundColor: '#ecfdf5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  aiBadgeText: { fontSize: 10, fontWeight: '800', color: BRAND.primary },
  contentText: { fontSize: 13, color: '#334155', lineHeight: 22 },
  completeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  poweredBy: { fontSize: 10, color: '#94a3b8' },
  completeBtn: { backgroundColor: BRAND.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  completeBtnText: { color: '#fff', fontSize: 12, fontWeight: '800' },
});
