import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BRAND } from '../../src/constants';

const ALL_CROPS = ['ধান', 'গম', 'টমেটো', 'পেঁয়াজ', 'আলু', 'সরিষা', 'ভুট্রা', 'মসুর'];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [myCrops, setMyCrops] = useState<string[]>(['ধান', 'টমেটো']);
  const t = (bn: string, en: string) => lang === 'bn' ? bn : en;

  const xp = 120 + myCrops.length * 20;
  const level = Math.floor(xp / 200) + 1;
  const progress = ((xp % 200) / 200) * 100;

  const toggleCrop = (c: string) =>
    setMyCrops((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: 100 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>👤 {t('আমার প্রোফাইল', 'My Profile')}</Text>
        <View style={styles.langRow}>
          {(['bn', 'en'] as const).map((l) => (
            <TouchableOpacity key={l} onPress={() => setLang(l)} style={[styles.langBtn, lang === l && styles.langBtnActive]}>
              <Text style={[styles.langBtnText, lang === l && styles.langBtnTextActive]}>{l === 'bn' ? 'বাং' : 'EN'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* User Card */}
      <LinearGradient colors={['#065f46', '#0A8A1F']} style={styles.userCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}><Text style={styles.avatarEmoji}>👨‍🌾</Text></View>
          <View style={styles.avatarInfo}>
            <Text style={styles.userName}>{t('কৃষক বন্ধু', 'Farmer Friend')}</Text>
            <Text style={styles.userRole}>{t('নবিশ কৃষক', 'Novice Farmer')}</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>⭐ Level {level}</Text>
            </View>
          </View>
        </View>

        {/* XP Bar */}
        <View style={styles.xpContainer}>
          <View style={styles.xpRow}>
            <Text style={styles.xpLabel}>{t('অভিজ্ঞতা পয়েন্ট', 'Experience Points')}</Text>
            <Text style={styles.xpValue}>{xp} / {level * 200} XP</Text>
          </View>
          <View style={styles.xpBar}>
            <View style={[styles.xpFill, { width: `${progress}%` as any }]} />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[['🔥', '৩', t('ধারা', 'Streak')], ['📊', '৫', t('রিপোর্ট', 'Reports')], ['🎓', '২', t('কোর্স', 'Courses')]].map(([icon, val, label]) => (
            <View key={label as string} style={styles.statItem}>
              <Text style={styles.statTop}>{icon as string} <Text style={styles.statVal}>{val as string}</Text></Text>
              <Text style={styles.statLabel}>{label as string}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* My Crops */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('আমার ফসল', 'My Crops')}</Text>
        <View style={styles.cropsWrap}>
          {ALL_CROPS.map((crop) => (
            <TouchableOpacity
              key={crop}
              onPress={() => toggleCrop(crop)}
              style={[styles.cropChip, myCrops.includes(crop) && styles.cropChipActive]}
            >
              <Text style={[styles.cropChipText, myCrops.includes(crop) && styles.cropChipTextActive]}>
                {crop}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Skills */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('দক্ষতা', 'Skills')}</Text>
        {[
          ['🌱', t('মাটি ব্যবস্থাপনা', 'Soil Management'), 40, '#10b981'],
          ['🛡️', t('ফসল রক্ষা', 'Crop Protection'), 30, '#ef4444'],
          ['📱', t('প্রযুক্তি', 'Technology'), 50, '#3b82f6'],
        ].map(([icon, label, val, color]) => (
          <View key={label as string} style={styles.skillRow}>
            <View style={styles.skillLeft}>
              <Text style={styles.skillIcon}>{icon as string}</Text>
              <Text style={styles.skillLabel}>{label as string}</Text>
            </View>
            <Text style={[styles.skillPct, { color: color as string }]}>{val}%</Text>
            <View style={styles.skillBarBg}>
              <View style={[styles.skillBarFill, { width: `${val}%` as any, backgroundColor: color as string }]} />
            </View>
          </View>
        ))}
      </View>

      {/* Contacts */}
      <View style={[styles.card, styles.infoCard]}>
        <Text style={styles.cardTitle}>ℹ️ {t('কৃষি হেল্পলাইন', 'Agri Helpline')}</Text>
        {[
          ['📞', `DAE ${t('হেল্পলাইন', 'Helpline')}: 16123`],
          ['🌾', 'BARI: bari.gov.bd'],
          ['🌱', 'BRRI: brri.gov.bd'],
          ['🔬', 'BARC: barc.gov.bd'],
        ].map(([icon, text]) => (
          <Text key={text as string} style={styles.infoText}>{icon as string} {text as string}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { paddingHorizontal: 16, gap: 14 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '900', color: '#0f172a' },
  langRow: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 999, padding: 3, gap: 2 },
  langBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  langBtnActive: { backgroundColor: BRAND.primary },
  langBtnText: { fontSize: 10, fontWeight: '800', color: '#94a3b8' },
  langBtnTextActive: { color: '#fff' },

  userCard: { borderRadius: 24, padding: 20, gap: 16 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: { width: 64, height: 64, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 36 },
  avatarInfo: { gap: 4 },
  userName: { fontSize: 18, fontWeight: '900', color: '#fff' },
  userRole: { fontSize: 12, color: '#a7f3d0' },
  levelBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, alignSelf: 'flex-start', marginTop: 4 },
  levelBadgeText: { fontSize: 11, fontWeight: '800', color: '#fff' },

  xpContainer: { backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 16, padding: 12, gap: 8 },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between' },
  xpLabel: { fontSize: 11, color: '#a7f3d0' },
  xpValue: { fontSize: 11, color: '#fff', fontWeight: '800' },
  xpBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 999 },
  xpFill: { height: 6, backgroundColor: '#fff', borderRadius: 999 },

  statsRow: { flexDirection: 'row' },
  statItem: { flex: 1, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14, paddingVertical: 10, marginHorizontal: 3 },
  statTop: { fontSize: 14, color: '#fff' },
  statVal: { fontWeight: '900' },
  statLabel: { fontSize: 10, color: '#a7f3d0', marginTop: 2 },

  card: { backgroundColor: '#fff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#0f172a', marginBottom: 12 },

  cropsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cropChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, backgroundColor: '#f1f5f9' },
  cropChipActive: { backgroundColor: BRAND.primary },
  cropChipText: { fontSize: 13, color: '#64748b', fontWeight: '600' },
  cropChipTextActive: { color: '#fff', fontWeight: '800' },

  skillRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  skillLeft: { flexDirection: 'row', alignItems: 'center', gap: 6, width: 150 },
  skillIcon: { fontSize: 16 },
  skillLabel: { fontSize: 13, color: '#334155', flex: 1 },
  skillPct: { fontSize: 13, fontWeight: '800', width: 36, textAlign: 'right' },
  skillBarBg: { flex: 1, height: 6, backgroundColor: '#f1f5f9', borderRadius: 999 },
  skillBarFill: { height: 6, borderRadius: 999 },

  infoCard: { backgroundColor: '#fffbeb', borderColor: '#fde68a' },
  infoText: { fontSize: 13, color: '#92400e', marginBottom: 6 },
});
