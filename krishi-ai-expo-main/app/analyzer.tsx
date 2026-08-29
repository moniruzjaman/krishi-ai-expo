import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Alert, Image, ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { BRAND } from '../src/constants';
import { analyzeCropImage } from '../src/services/gemini';

export default function AnalyzerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const t = (bn: string, en: string) => lang === 'bn' ? bn : en;

  const pickImage = async (source: 'camera' | 'gallery') => {
    try {
      let res: ImagePicker.ImagePickerResult;

      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(t('অনুমতি প্রয়োজন', 'Permission Required'), t('ক্যামেরা ব্যবহারের অনুমতি দিন।', 'Please grant camera permission.'));
          return;
        }
        res = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
          base64: true,
          allowsEditing: true,
          aspect: [4, 3],
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(t('অনুমতি প্রয়োজন', 'Permission Required'), t('গ্যালারি অ্যাক্সেসের অনুমতি দিন।', 'Please grant gallery permission.'));
          return;
        }
        res = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
          base64: true,
          allowsEditing: true,
          aspect: [4, 3],
        });
      }

      if (!res.canceled && res.assets[0]) {
        const asset = res.assets[0];
        setImageUri(asset.uri);
        setImageBase64(asset.base64 ?? null);
        setResult(null);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (e) {
      Alert.alert(t('সমস্যা হয়েছে', 'Error'), String(e));
    }
  };

  const analyze = async () => {
    if (!imageBase64) return;
    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const diagnosis = await analyzeCropImage(imageBase64, 'image/jpeg', lang);
      setResult(diagnosis);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) {
      const msg = e?.message ?? 'Unknown error';
      setResult(t(`বিশ্লেষণে সমস্যা হয়েছে: ${msg}`, `Analysis error: ${msg}`));
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    setLoading(false);
  };

  const reset = () => { setImageUri(null); setImageBase64(null); setResult(null); };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← {t('ফিরুন', 'Back')}</Text>
        </TouchableOpacity>
        <View style={styles.langRow}>
          {(['bn', 'en'] as const).map((l) => (
            <TouchableOpacity key={l} onPress={() => setLang(l)} style={[styles.langBtn, lang === l && styles.langBtnActive]}>
              <Text style={[styles.langBtnText, lang === l && styles.langBtnTextActive]}>{l === 'bn' ? 'বাং' : 'EN'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>📸 {t('এআই ফসল স্ক্যানার', 'AI Crop Scanner')}</Text>
        <Text style={styles.subtitle}>{t('ফসলের ছবি তুলে রোগ সনাক্ত করুন', 'Take a photo to identify crop disease')}</Text>

        {/* Image Picker */}
        {!imageUri ? (
          <View style={styles.pickerArea}>
            <Text style={styles.pickerEmoji}>🌿</Text>
            <Text style={styles.pickerTitle}>{t('ছবি নির্বাচন করুন', 'Select Image')}</Text>
            <Text style={styles.pickerSub}>{t('ক্যামেরা বা গ্যালারি থেকে ছবি নিন', 'Take from camera or gallery')}</Text>
            <View style={styles.pickerBtns}>
              <TouchableOpacity style={styles.pickerBtn} onPress={() => pickImage('camera')} activeOpacity={0.85}>
                <Text style={styles.pickerBtnEmoji}>📷</Text>
                <Text style={styles.pickerBtnText}>{t('ক্যামেরা', 'Camera')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.pickerBtn, styles.pickerBtnOutline]} onPress={() => pickImage('gallery')} activeOpacity={0.85}>
                <Text style={styles.pickerBtnEmoji}>🖼️</Text>
                <Text style={[styles.pickerBtnText, { color: BRAND.primary }]}>{t('গ্যালারি', 'Gallery')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
            <TouchableOpacity style={styles.changeBtn} onPress={reset}>
              <Text style={styles.changeBtnText}>{t('পরিবর্তন করুন', 'Change')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Analyze Button */}
        {imageUri && !result && !loading && (
          <TouchableOpacity style={styles.analyzeBtn} onPress={analyze} activeOpacity={0.88}>
            <Text style={styles.analyzeBtnText}>🔍 {t('বিশ্লেষণ করুন', 'Analyze Now')}</Text>
          </TouchableOpacity>
        )}

        {/* Loading */}
        {loading && (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={BRAND.primary} />
            <Text style={styles.loadingTitle}>{t('বিশ্লেষণ চলছে...', 'Analyzing...')}</Text>
            <Text style={styles.loadingSub}>{t('AI প্রক্রিয়াকরণ হচ্ছে', 'AI is processing your image')}</Text>
          </View>
        )}

        {/* Result */}
        {result && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultIcon}>✅</Text>
              <Text style={styles.resultTitle}>{t('বিশ্লেষণ ফলাফল', 'Analysis Result')}</Text>
              <View style={styles.aiBadge}><Text style={styles.aiBadgeText}>AI</Text></View>
            </View>
            <Text style={styles.resultText}>{result}</Text>
            <Text style={styles.resultFooter}>
              {t('Powered by Google Gemini | BARI ও DAE নির্দেশিকা', 'Powered by Google Gemini | BARI & DAE guidelines')}
            </Text>
            <TouchableOpacity style={styles.newScanBtn} onPress={reset}>
              <Text style={styles.newScanText}>{t('নতুন স্ক্যান', 'New Scan')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 {t('ভালো ফলাফলের জন্য', 'For Best Results')}</Text>
          {[
            t('ভালো আলোতে ছবি তুলুন', 'Take photo in good lighting'),
            t('আক্রান্ত অংশ ক্লোজআপে তুলুন', 'Close-up of affected area'),
            t('পাতা, কাণ্ড বা ফল যেখানে সমস্যা সেখানে ছবি তুলুন', 'Photo where problem is visible on leaf, stem or fruit'),
          ].map((tip) => (
            <Text key={tip} style={styles.tipText}>• {tip}</Text>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { paddingVertical: 8, paddingRight: 12 },
  backText: { fontSize: 14, fontWeight: '700', color: BRAND.primary },
  langRow: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 999, padding: 3, gap: 2 },
  langBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  langBtnActive: { backgroundColor: BRAND.primary },
  langBtnText: { fontSize: 10, fontWeight: '800', color: '#94a3b8' },
  langBtnTextActive: { color: '#fff' },

  body: { paddingHorizontal: 16, paddingBottom: 40, gap: 16 },
  title: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
  subtitle: { fontSize: 13, color: '#64748b' },

  pickerArea: { backgroundColor: '#f0fdf4', borderRadius: 24, borderWidth: 2, borderColor: '#86efac', borderStyle: 'dashed', padding: 32, alignItems: 'center', gap: 8 },
  pickerEmoji: { fontSize: 56, marginBottom: 4 },
  pickerTitle: { fontSize: 18, fontWeight: '800', color: '#166534' },
  pickerSub: { fontSize: 13, color: '#4ade80', textAlign: 'center' },
  pickerBtns: { flexDirection: 'row', gap: 12, marginTop: 16 },
  pickerBtn: { flex: 1, backgroundColor: BRAND.primary, borderRadius: 16, paddingVertical: 14, alignItems: 'center', gap: 4 },
  pickerBtnOutline: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: BRAND.primary },
  pickerBtnEmoji: { fontSize: 24 },
  pickerBtnText: { fontSize: 13, fontWeight: '800', color: '#fff' },

  imageContainer: { position: 'relative', borderRadius: 20, overflow: 'hidden' },
  image: { width: '100%', height: 220, borderRadius: 20 },
  changeBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  changeBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  analyzeBtn: { backgroundColor: BRAND.primary, borderRadius: 20, paddingVertical: 16, alignItems: 'center', shadowColor: BRAND.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8 },
  analyzeBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' },

  loadingCard: { backgroundColor: '#f0fdf4', borderRadius: 20, padding: 32, alignItems: 'center', gap: 10 },
  loadingTitle: { fontSize: 16, fontWeight: '800', color: '#166534' },
  loadingSub: { fontSize: 13, color: '#4ade80' },

  resultCard: { backgroundColor: '#fff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resultIcon: { fontSize: 22 },
  resultTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', flex: 1 },
  aiBadge: { backgroundColor: '#ecfdf5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  aiBadgeText: { fontSize: 10, fontWeight: '800', color: BRAND.primary },
  resultText: { fontSize: 14, color: '#334155', lineHeight: 22 },
  resultFooter: { fontSize: 10, color: '#94a3b8', paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  newScanBtn: { borderWidth: 1.5, borderColor: BRAND.primary, borderRadius: 14, paddingVertical: 10, alignItems: 'center' },
  newScanText: { color: BRAND.primary, fontWeight: '800', fontSize: 13 },

  tipsCard: { backgroundColor: '#fffbeb', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#fde68a', gap: 6 },
  tipsTitle: { fontSize: 14, fontWeight: '800', color: '#92400e', marginBottom: 4 },
  tipText: { fontSize: 13, color: '#b45309', lineHeight: 20 },
});
