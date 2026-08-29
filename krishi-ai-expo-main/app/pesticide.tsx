import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BRAND, PESTICIDE_DATA } from '../src/constants';
import { getPesticideRecommendation } from '../src/services/gemini';

export default function PesticideScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [query, setQuery] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const t = (bn: string, en: string) => lang === 'bn' ? bn : en;

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await getPesticideRecommendation(query, lang);
      setAiResult(res);
    } catch {
      Alert.alert(t('সমস্যা', 'Error'), t('AI সংযোগে সমস্যা হয়েছে।', 'AI connection error.'));
    }
    setLoading(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← {t('ফিরুন', 'Back')}</Text>
        </TouchableOpacity>
        <View style={styles.langRow}>
          {(['bn', 'en'] as const).map(l => (
            <TouchableOpacity key={l} onPress={() => setLang(l)} style={[styles.langBtn, lang === l && styles.langBtnActive]}>
              <Text style={[styles.langBtnText, lang === l && styles.langBtnTextActive]}>{l === 'bn' ? 'বাং' : 'EN'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🧪 {t('বালাইনাশক বিশেষজ্ঞ', 'Pesticide Expert')}</Text>
        <Text style={styles.sub}>{t('DAE অনুমোদিত কীটনাশকের সুপারিশ', 'DAE approved pesticide recommendations')}</Text>

        {/* AI Search */}
        <View style={styles.aiCard}>
          <Text style={styles.aiTitle}>🤖 {t('AI সুপারিশ', 'AI Recommendation')}</Text>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder={t('পোকামাকড়/রোগের নাম লিখুন...', 'Enter pest/disease name...')}
              placeholderTextColor="#94a3b8"
            />
            <TouchableOpacity style={styles.searchBtn} onPress={search} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.searchBtnText}>{t('খুঁজুন', 'Search')}</Text>}
            </TouchableOpacity>
          </View>
          {aiResult !== '' && (
            <View style={styles.aiResult}>
              <Text style={styles.aiResultText}>{aiResult}</Text>
            </View>
          )}
        </View>

        {/* Common pests */}
        <Text style={styles.sectionLabel}>{t('সাধারণ পোকামাকড় ও রোগ', 'Common Pests & Diseases')}</Text>
        {PESTICIDE_DATA.map((item, i) => (
          <View key={i} style={styles.pestCard}>
            <TouchableOpacity style={styles.pestHeader} onPress={() => setExpanded(expanded === i ? null : i)}>
              <View>
                <Text style={styles.pestName}>{item.pest}</Text>
                <Text style={styles.pestNameEn}>{item.pestEn}</Text>
              </View>
              <Text style={styles.chevron}>{expanded === i ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {expanded === i && (
              <View style={styles.pestDetails}>
                <View style={styles.detailBlock}>
                  <Text style={styles.detailLabel}>💊 {t('সুপারিশকৃত রাসায়নিক', 'Recommended Chemical')}</Text>
                  <Text style={styles.detailValue}>{item.chemical}</Text>
                  <Text style={styles.detailSub}>{t('মাত্রা:', 'Dose:')} {item.dose}</Text>
                </View>
                <View style={[styles.detailBlock, { backgroundColor: '#fffbeb', borderColor: '#fde68a' }]}>
                  <Text style={[styles.detailLabel, { color: '#92400e' }]}>⏰ {t('প্রয়োগের সময়', 'Application Timing')}</Text>
                  <Text style={[styles.detailValue, { color: '#b45309' }]}>{item.timing}</Text>
                </View>
                <View style={[styles.detailBlock, { backgroundColor: '#fef2f2', borderColor: '#fecaca' }]}>
                  <Text style={[styles.detailLabel, { color: '#991b1b' }]}>⚠️ {t('নিরাপত্তা', 'Safety')}</Text>
                  <Text style={[styles.detailValue, { color: '#dc2626', fontSize: 12 }]}>{item.safety}</Text>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  back: { fontSize: 14, fontWeight: '700', color: BRAND.primary },
  langRow: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 999, padding: 3, gap: 2 },
  langBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  langBtnActive: { backgroundColor: BRAND.primary },
  langBtnText: { fontSize: 10, fontWeight: '800', color: '#94a3b8' },
  langBtnTextActive: { color: '#fff' },
  body: { paddingHorizontal: 16, paddingBottom: 40, gap: 14 },
  title: { fontSize: 22, fontWeight: '900', color: '#0f172a' },
  sub: { fontSize: 12, color: '#64748b' },
  aiCard: { backgroundColor: '#f0fdf4', borderRadius: 20, padding: 14, borderWidth: 1, borderColor: '#bbf7d0', gap: 10 },
  aiTitle: { fontSize: 14, fontWeight: '800', color: '#166534' },
  searchRow: { flexDirection: 'row', gap: 8 },
  searchInput: { flex: 1, borderWidth: 1.5, borderColor: '#86efac', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13, backgroundColor: '#fff', color: '#0f172a' },
  searchBtn: { backgroundColor: BRAND.primary, borderRadius: 14, paddingHorizontal: 14, justifyContent: 'center', minWidth: 64, alignItems: 'center' },
  searchBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  aiResult: { backgroundColor: '#fff', borderRadius: 14, padding: 12 },
  aiResultText: { fontSize: 13, color: '#334155', lineHeight: 22 },
  sectionLabel: { fontSize: 13, fontWeight: '800', color: '#475569', marginBottom: -4 },
  pestCard: { backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  pestHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  pestName: { fontSize: 14, fontWeight: '800', color: '#0f172a' },
  pestNameEn: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  chevron: { fontSize: 13, color: '#94a3b8' },
  pestDetails: { paddingHorizontal: 14, paddingBottom: 14, gap: 8 },
  detailBlock: { backgroundColor: '#eff6ff', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#bfdbfe', gap: 4 },
  detailLabel: { fontSize: 10, fontWeight: '900', color: '#1e40af', textTransform: 'uppercase' },
  detailValue: { fontSize: 14, fontWeight: '700', color: '#1e3a8a' },
  detailSub: { fontSize: 12, color: '#3b82f6' },
});
