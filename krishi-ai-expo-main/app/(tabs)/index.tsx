import React, { useState } from 'react';
import {
  ScrollView, View, Text, TouchableOpacity,
  StyleSheet, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BRAND, MARKET_DATA, TOOLS, WEATHER_DATA } from '../../src/constants';
import { SectionHeader, TrendBadge } from '../../src/components/UI';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const t = (bn: string, en: string) => lang === 'bn' ? bn : en;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero ── */}
      <LinearGradient
        colors={['#064e3b', '#065f46', '#047857']}
        style={[styles.hero, { paddingTop: insets.top + 12 }]}
      >
        {/* Lang toggle */}
        <View style={styles.langRow}>
          {(['bn', 'en'] as const).map((l) => (
            <TouchableOpacity
              key={l}
              onPress={() => setLang(l)}
              style={[styles.langBtn, lang === l && styles.langBtnActive]}
            >
              <Text style={[styles.langBtnText, lang === l && styles.langBtnTextActive]}>
                {l === 'bn' ? 'বাং' : 'EN'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.heroContent}>
          <Text style={styles.heroEmoji}>🌱</Text>
          <Text style={styles.heroTitle}>কৃষি <Text style={{ color: '#6ee7b7' }}>AI</Text></Text>
          <Text style={styles.heroSubtitle}>{t('স্মার্ট কৃষি ইকোসিস্টেম', 'Smart Agri Ecosystem')}</Text>
          <Text style={styles.heroTag}>Bangladesh Agricultural Intelligence Platform</Text>

          <View style={styles.heroBtns}>
            <TouchableOpacity
              style={styles.heroBtnPrimary}
              onPress={() => router.push('/analyzer')}
              activeOpacity={0.85}
            >
              <Text style={styles.heroBtnPrimaryText}>📸 {t('রোগ স্ক্যান করুন', 'Scan Disease')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.heroBtnOutline}
              onPress={() => router.push('/chat')}
              activeOpacity={0.85}
            >
              <Text style={styles.heroBtnOutlineText}>🤖 {t('চ্যাটবট', 'Chatbot')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats strip */}
        <View style={styles.statsStrip}>
          {[['৪৩+', 'টুলস', 'Tools'], ['১৫০০০+', 'কৃষক', 'Farmers'], ['৯৮%', 'নির্ভুলতা', 'Accuracy']].map(([v, bn, en]) => (
            <View key={bn} style={styles.statItem}>
              <Text style={styles.statVal}>{v}</Text>
              <Text style={styles.statLabel}>{t(bn, en)}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* ── Weather strip ── */}
      <LinearGradient
        colors={['#2563eb', '#1d4ed8']}
        style={styles.weatherCard}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.weatherLoc}>{t('আজকের আবহাওয়া', "Today's Weather")}</Text>
          <View style={styles.weatherRow}>
            <Text style={styles.weatherEmoji}>{WEATHER_DATA.icon}</Text>
            <View>
              <Text style={styles.weatherTemp}>{WEATHER_DATA.temp}°C</Text>
              <Text style={styles.weatherCond}>{t(WEATHER_DATA.condition, WEATHER_DATA.conditionEn)}</Text>
            </View>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Text style={styles.weatherInfo}>💧 {WEATHER_DATA.humidity}%</Text>
          <Text style={styles.weatherInfo}>💨 {WEATHER_DATA.wind} km/h</Text>
          <TouchableOpacity onPress={() => router.push('/weather')}>
            <Text style={[styles.weatherInfo, { color: '#bfdbfe', textDecorationLine: 'underline' }]}>
              {t('বিস্তারিত →', 'Details →')}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* ── Market Prices ── */}
      <View style={styles.section}>
        <SectionHeader
          title={t('বাজার মূল্য', 'Market Prices')}
          action={t('সব দেখুন →', 'See All →')}
          onAction={() => router.push('/market')}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {MARKET_DATA.slice(0, 6).map((item) => (
            <View key={item.name} style={styles.marketCard}>
              <Text style={styles.marketName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.marketPrice}>৳{item.retail}</Text>
              <Text style={styles.marketUnit}>{t('প্রতি', 'per')} {item.unit}</Text>
              <TrendBadge trend={item.trend} change={item.change} />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* ── Quick Tools ── */}
      <View style={styles.section}>
        <SectionHeader title={t('দ্রুত টুলস', 'Quick Tools')} />
        <View style={styles.toolsGrid}>
          {TOOLS.slice(0, 6).map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={[styles.toolCard, { backgroundColor: tool.bg }]}
              onPress={() => router.push(tool.route as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.toolEmoji}>{tool.icon}</Text>
              <Text style={styles.toolLabel} numberOfLines={2}>
                {lang === 'bn' ? tool.label : tool.labelEn}
              </Text>
              <Text style={styles.toolDesc} numberOfLines={1}>{tool.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Mission ── */}
      <View style={styles.mission}>
        <Text style={styles.missionTitle}>{t('আমাদের লক্ষ্য', 'Our Mission')}</Text>
        <Text style={styles.missionText}>
          {t(
            'বাংলাদেশের কৃষকদের আধুনিক প্রযুক্তি ও AI-এর মাধ্যমে ক্ষমতায়ন করা। BARI, BRRI, DAE ও BARC-এর নির্দেশিকা অনুসরণ করে সঠিক পরামর্শ প্রদান।',
            'Empowering Bangladeshi farmers through modern technology and AI. Providing accurate guidance following BARI, BRRI, DAE and BARC guidelines.',
          )}
        </Text>
        <View style={styles.orgRow}>
          {['BARI', 'BRRI', 'DAE', 'BARC', 'SRDI'].map((o) => (
            <View key={o} style={styles.orgBadge}>
              <Text style={styles.orgBadgeText}>{o}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  // Hero
  hero: { paddingBottom: 0 },
  langRow: { flexDirection: 'row', alignSelf: 'flex-end', marginRight: 16, gap: 4, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 999, padding: 3 },
  langBtn: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 },
  langBtnActive: { backgroundColor: BRAND.primary },
  langBtnText: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '800' },
  langBtnTextActive: { color: '#fff' },
  heroContent: { alignItems: 'center', paddingVertical: 20, paddingHorizontal: 24 },
  heroEmoji: { fontSize: 48 },
  heroTitle: { fontSize: 32, fontWeight: '900', color: '#fff', marginTop: 8 },
  heroSubtitle: { fontSize: 13, color: '#a7f3d0', marginTop: 4 },
  heroTag: { fontSize: 10, color: '#6ee7b7', marginTop: 2 },
  heroBtns: { flexDirection: 'row', gap: 12, marginTop: 20 },
  heroBtnPrimary: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16 },
  heroBtnPrimaryText: { color: '#064e3b', fontWeight: '800', fontSize: 13 },
  heroBtnOutline: { borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16 },
  heroBtnOutlineText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  statsStrip: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.2)', paddingVertical: 12, paddingHorizontal: 24 },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 20, fontWeight: '900', color: '#6ee7b7' },
  statLabel: { fontSize: 10, color: '#a7f3d0', marginTop: 2 },

  // Weather
  weatherCard: { marginHorizontal: 16, marginTop: 12, borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center' },
  weatherLoc: { color: '#bfdbfe', fontSize: 10, fontWeight: '600', marginBottom: 6 },
  weatherRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  weatherEmoji: { fontSize: 36 },
  weatherTemp: { fontSize: 28, fontWeight: '900', color: '#fff' },
  weatherCond: { fontSize: 12, color: '#bfdbfe' },
  weatherInfo: { fontSize: 12, color: '#dbeafe' },

  // Sections
  section: { paddingHorizontal: 16, marginTop: 20 },

  // Market
  marketCard: { backgroundColor: '#fff', borderRadius: 16, padding: 12, marginRight: 10, width: 130, borderWidth: 1, borderColor: '#e2e8f0' },
  marketName: { fontSize: 11, color: '#64748b', fontWeight: '600' },
  marketPrice: { fontSize: 20, fontWeight: '900', color: '#0f172a', marginTop: 4 },
  marketUnit: { fontSize: 10, color: '#94a3b8' },

  // Tools
  toolsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  toolCard: { width: (width - 44) / 2, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)' },
  toolEmoji: { fontSize: 30 },
  toolLabel: { fontSize: 13, fontWeight: '800', color: '#0f172a', marginTop: 8, lineHeight: 18 },
  toolDesc: { fontSize: 10, color: '#94a3b8', marginTop: 2 },

  // Mission
  mission: { margin: 16, backgroundColor: '#f0fdf4', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#bbf7d0' },
  missionTitle: { fontSize: 14, fontWeight: '800', color: '#166534', marginBottom: 6 },
  missionText: { fontSize: 12, color: '#16a34a', lineHeight: 18 },
  orgRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  orgBadge: { backgroundColor: '#bbf7d0', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  orgBadgeText: { fontSize: 10, fontWeight: '800', color: '#166534' },
});
