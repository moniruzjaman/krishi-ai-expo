import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BRAND, MARKET_DATA, SEASONS, WEATHER_DATA } from '../src/constants';
import { TrendBadge, Button } from '../src/components/UI';

// ── Shared Header ─────────────────────────────────────────────────────────────
function ScreenHeader({ title, lang, setLang, onBack }: { title: string; lang: 'bn' | 'en'; setLang: (l: 'bn' | 'en') => void; onBack?: () => void }) {
  const router = useRouter();
  return (
    <View style={sh.row}>
      <TouchableOpacity onPress={onBack ?? (() => router.back())} style={sh.backBtn}>
        <Text style={sh.backText}>← {lang === 'bn' ? 'ফিরুন' : 'Back'}</Text>
      </TouchableOpacity>
      <View style={sh.langRow}>
        {(['bn', 'en'] as const).map((l) => (
          <TouchableOpacity key={l} onPress={() => setLang(l)} style={[sh.langBtn, lang === l && sh.langBtnActive]}>
            <Text style={[sh.langBtnText, lang === l && sh.langBtnTextActive]}>{l === 'bn' ? 'বাং' : 'EN'}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const sh = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { paddingVertical: 8, paddingRight: 12 },
  backText: { fontSize: 14, fontWeight: '700', color: BRAND.primary },
  langRow: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 999, padding: 3, gap: 2 },
  langBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  langBtnActive: { backgroundColor: BRAND.primary },
  langBtnText: { fontSize: 10, fontWeight: '800', color: '#94a3b8' },
  langBtnTextActive: { color: '#fff' },
});

// ─── MARKET ───────────────────────────────────────────────────────────────────
export function MarketScreen() {
  const insets = useSafeAreaInsets();
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const t = (bn: string, en: string) => lang === 'bn' ? bn : en;

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc', paddingTop: insets.top }}>
      <ScreenHeader title="market" lang={lang} setLang={setLang} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={s.title}>💰 {t('বাজার মূল্য', 'Market Prices')}</Text>
          <Text style={s.subtitle}>{t('আজকের পাইকারি ও খুচরা মূল্য', "Today's wholesale & retail prices")}</Text>
        </View>

        <View style={s.table}>
          <View style={s.tableHead}>
            <Text style={[s.th, { flex: 2 }]}>{t('পণ্য', 'Item')}</Text>
            <Text style={[s.th, { textAlign: 'center' }]}>{t('পাইকারি', 'Wholesale')}</Text>
            <Text style={[s.th, { textAlign: 'center' }]}>{t('খুচরা', 'Retail')}</Text>
            <Text style={[s.th, { textAlign: 'center' }]}>{t('পরিবর্তন', 'Change')}</Text>
          </View>
          {MARKET_DATA.map((item, i) => (
            <View key={item.name} style={[s.tableRow, i % 2 === 1 && { backgroundColor: '#f8fafc' }]}>
              <View style={{ flex: 2 }}>
                <Text style={s.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={s.itemUnit}>{item.unit}</Text>
              </View>
              <Text style={[s.td, { textAlign: 'center', color: '#475569' }]}>৳{item.wholesale}</Text>
              <Text style={[s.td, { textAlign: 'center', fontWeight: '800', color: '#0f172a' }]}>৳{item.retail}</Text>
              <View style={{ alignItems: 'center' }}>
                <TrendBadge trend={item.trend} change={item.change} />
              </View>
            </View>
          ))}
        </View>
        <Text style={s.source}>{t('উৎস: DAM বাংলাদেশ | আজ আপডেট', 'Source: DAM Bangladesh | Updated Today')}</Text>
      </ScrollView>
    </View>
  );
}

// ─── WEATHER ──────────────────────────────────────────────────────────────────
export function WeatherScreen() {
  const insets = useSafeAreaInsets();
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const t = (bn: string, en: string) => lang === 'bn' ? bn : en;

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc', paddingTop: insets.top }}>
      <ScreenHeader title="weather" lang={lang} setLang={setLang} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <Text style={s.title}>⛅ {t('কৃষি আবহাওয়া', 'Agri Weather')}</Text>

        <LinearGradient colors={['#1d4ed8', '#2563eb']} style={s.weatherHero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ color: '#bfdbfe', fontSize: 12, marginBottom: 4 }}>{WEATHER_DATA.location}</Text>
              <Text style={{ color: '#fff', fontSize: 48, fontWeight: '900' }}>{WEATHER_DATA.temp}°</Text>
              <Text style={{ color: '#93c5fd', fontSize: 14 }}>{t(WEATHER_DATA.condition, WEATHER_DATA.conditionEn)}</Text>
            </View>
            <Text style={{ fontSize: 72 }}>{WEATHER_DATA.icon}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            {[['💧', `${WEATHER_DATA.humidity}%`, t('আর্দ্রতা', 'Humidity')], ['💨', `${WEATHER_DATA.wind} km/h`, t('বায়ু', 'Wind')]].map(([icon, val, label]) => (
              <View key={label as string} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: 12 }}>
                <Text style={{ fontSize: 20 }}>{icon as string}</Text>
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 18 }}>{val as string}</Text>
                <Text style={{ color: '#bfdbfe', fontSize: 11 }}>{label as string}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Forecast */}
        <View style={s.card}>
          <Text style={s.cardTitle}>{t('৫ দিনের পূর্বাভাস', '5-Day Forecast')}</Text>
          {WEATHER_DATA.forecast.map((day) => (
            <View key={day.day} style={s.forecastRow}>
              <Text style={s.forecastDay}>{day.day}</Text>
              <Text style={s.forecastIcon}>{day.icon}</Text>
              <Text style={s.forecastHigh}>{day.high}°</Text>
              <Text style={s.forecastLow}>{day.low}°</Text>
            </View>
          ))}
        </View>

        {/* Advisory */}
        <View style={[s.card, { backgroundColor: '#fffbeb', borderColor: '#fde68a' }]}>
          <Text style={[s.cardTitle, { color: '#92400e' }]}>⚠️ {t('কৃষি পরামর্শ', 'Advisory')}</Text>
          <Text style={{ fontSize: 14, color: '#b45309', lineHeight: 22 }}>{WEATHER_DATA.advisory}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── CALENDAR ─────────────────────────────────────────────────────────────────
export function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [season, setSeason] = useState(SEASONS[0]);
  const t = (bn: string, en: string) => lang === 'bn' ? bn : en;

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc', paddingTop: insets.top }}>
      <ScreenHeader title="calendar" lang={lang} setLang={setLang} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <Text style={s.title}>📅 {t('ফসল ক্যালেন্ডার', 'Crop Calendar')}</Text>

        {/* Season tabs */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {SEASONS.map((ss) => (
            <TouchableOpacity
              key={ss.id}
              onPress={() => setSeason(ss)}
              style={[s.seasonTab, season.id === ss.id && { backgroundColor: ss.color }]}
            >
              <Text style={[s.seasonTabText, season.id === ss.id && { color: '#fff' }]}>
                {ss.icon} {ss.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Season detail */}
        <View style={s.card}>
          <Text style={{ fontSize: 22, marginBottom: 4 }}>{season.icon}</Text>
          <Text style={[s.cardTitle, { color: season.color }]}>{season.name} মৌসুম</Text>
          <Text style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10 }}>{season.months}</Text>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 8 }}>{t('প্রধান ফসল:', 'Main Crops:')}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {season.crops.map((c) => (
              <View key={c} style={[s.cropPill, { borderColor: season.color + '44', backgroundColor: season.color + '11' }]}>
                <Text style={[s.cropPillText, { color: season.color }]}>{c}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Shared Styles ─────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '900', color: '#0f172a', marginBottom: 4 },
  subtitle: { fontSize: 12, color: '#64748b', marginBottom: 12 },
  source: { textAlign: 'center', fontSize: 11, color: '#94a3b8', marginTop: 12 },

  table: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden' },
  tableHead: { flexDirection: 'row', backgroundColor: '#f8fafc', padding: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  th: { fontSize: 10, fontWeight: '800', color: '#94a3b8', flex: 1, textTransform: 'uppercase' },
  tableRow: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', alignItems: 'center' },
  td: { flex: 1, fontSize: 13 },
  itemName: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  itemUnit: { fontSize: 10, color: '#94a3b8' },

  weatherHero: { borderRadius: 24, padding: 20 },

  card: { backgroundColor: '#fff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  forecastRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f8fafc' },
  forecastDay: { width: 50, fontSize: 13, fontWeight: '700', color: '#475569' },
  forecastIcon: { flex: 1, fontSize: 22, textAlign: 'center' },
  forecastHigh: { fontSize: 15, fontWeight: '900', color: '#0f172a', width: 38, textAlign: 'right' },
  forecastLow: { fontSize: 13, color: '#94a3b8', width: 32, textAlign: 'right' },

  seasonTab: { flex: 1, paddingVertical: 10, borderRadius: 14, backgroundColor: '#f1f5f9', alignItems: 'center' },
  seasonTabText: { fontSize: 12, fontWeight: '800', color: '#64748b' },

  cropPill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, borderWidth: 1 },
  cropPillText: { fontSize: 12, fontWeight: '700' },
});

// ─── Default export picks screen by filename ─────────────────────────────────
// Each file re-exports the right component (see individual screen files below)
export default MarketScreen;
