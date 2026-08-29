import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BRAND, SOIL_TYPES, SOIL_NUTRIENTS, SEASONS, CROP_DISEASES } from '../src/constants';
import { getSoilAnalysis, getYieldPrediction, getSoilAnalysis as getNutrientRec } from '../src/services/gemini';

function Header({ title, lang, setLang }: any) {
  const router = useRouter();
  return (
    <View style={h.row}>
      <TouchableOpacity onPress={() => router.back()}><Text style={h.back}>←  {lang === 'bn' ? 'ফিরুন' : 'Back'}</Text></TouchableOpacity>
      <View style={h.lr}>
        {(['bn', 'en'] as const).map(l => (
          <TouchableOpacity key={l} onPress={() => setLang(l)} style={[h.lb, lang === l && h.lba]}>
            <Text style={[h.lbt, lang === l && h.lbta]}>{l === 'bn' ? 'বাং' : 'EN'}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
const h = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  back: { fontSize: 14, fontWeight: '700', color: BRAND.primary },
  lr: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 999, padding: 3, gap: 2 },
  lb: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  lba: { backgroundColor: BRAND.primary },
  lbt: { fontSize: 10, fontWeight: '800', color: '#94a3b8' },
  lbta: { color: '#fff' },
});

// ─── SOIL ─────────────────────────────────────────────────────────────────────
export function SoilScreen() {
  const insets = useSafeAreaInsets();
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [tab, setTab] = useState<'types'|'nutrients'|'ai'>('types');
  const [crop, setCrop] = useState(''); const [pH, setPH] = useState(''); const [soilType, setSoilType] = useState('দোঁআশ');
  const [result, setResult] = useState(''); const [loading, setLoading] = useState(false);
  const t = (bn: string, en: string) => lang === 'bn' ? bn : en;

  const analyze = async () => {
    if (!crop) return;
    setLoading(true);
    try { setResult(await getSoilAnalysis(crop, pH || '৬.৫', soilType, lang)); }
    catch { Alert.alert('Error', 'Could not analyze.'); }
    setLoading(false);
  };

  return (
    <View style={[{ flex: 1, backgroundColor: '#f8fafc' }, { paddingTop: insets.top }]}>
      <Header lang={lang} setLang={setLang} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <Text style={ss.title}>🔬 {t('মাটি বিশেষজ্ঞ', 'Soil Expert')}</Text>
        <View style={ss.tabs}>
          {[['types','মাটির ধরন','Soil Types'],['nutrients','পুষ্টি','Nutrients'],['ai','AI','AI']].map(([id,bn,en])=>(
            <TouchableOpacity key={id} onPress={()=>setTab(id as any)} style={[ss.tab, tab===id && ss.tabActive]}>
              <Text style={[ss.tabText, tab===id && ss.tabTextActive]}>{lang==='bn'?bn:en}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {tab==='types' && SOIL_TYPES.map(st=>(
          <View key={st.name} style={ss.card}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'}}>
              <View><Text style={ss.cardTitle}>{st.name}</Text><Text style={{fontSize:11,color:'#94a3b8'}}>{st.nameEn}</Text></View>
              <View style={ss.phBadge}><Text style={ss.phBadgeText}>pH {st.pH}</Text></View>
            </View>
            <View style={{flexDirection:'row',gap:8,marginTop:10}}>
              <View style={[ss.infoBox,{flex:1,backgroundColor:'#f0fdf4',borderColor:'#bbf7d0'}]}><Text style={{fontSize:10,fontWeight:'800',color:'#16a34a'}}>✓ {t('সুবিধা','Pros')}</Text><Text style={{fontSize:12,color:'#166534',marginTop:2}}>{st.pros}</Text></View>
              <View style={[ss.infoBox,{flex:1,backgroundColor:'#fef2f2',borderColor:'#fecaca'}]}><Text style={{fontSize:10,fontWeight:'800',color:'#dc2626'}}>✗ {t('অসুবিধা','Cons')}</Text><Text style={{fontSize:12,color:'#991b1b',marginTop:2}}>{st.cons}</Text></View>
            </View>
            <Text style={{fontSize:12,color:'#64748b',marginTop:8}}><Text style={{fontWeight:'700'}}>{t('ফসল: ','Crops: ')}</Text>{st.crops.join(', ')}</Text>
          </View>
        ))}
        {tab==='nutrients' && SOIL_NUTRIENTS.map(n=>(
          <View key={n.name} style={ss.card}>
            <Text style={ss.cardTitle}>{n.name}</Text>
            <View style={[ss.infoBox,{backgroundColor:'#fffbeb',borderColor:'#fde68a',marginTop:8}]}><Text style={{fontSize:10,fontWeight:'800',color:'#92400e'}}>⚠️ {t('ঘাটতির লক্ষণ','Deficiency')}</Text><Text style={{fontSize:13,color:'#b45309',marginTop:4}}>{n.deficiency}</Text></View>
            <View style={[ss.infoBox,{backgroundColor:'#f0fdf4',borderColor:'#bbf7d0',marginTop:6}]}><Text style={{fontSize:10,fontWeight:'800',color:'#16a34a'}}>✅ {t('প্রতিকার','Remedy')}</Text><Text style={{fontSize:13,color:'#166534',marginTop:4}}>{n.remedy}</Text></View>
          </View>
        ))}
        {tab==='ai' && (
          <View style={ss.card}>
            <Text style={ss.cardTitle}>🤖 AI {t('বিশ্লেষণ','Analysis')}</Text>
            {[['ফসলের নাম *','যেমন: ধান',crop,setCrop],['মাটির pH','যেমন: ৬.৫',pH,setPH]].map(([label,ph,val,setVal])=>(
              <View key={label as string} style={{marginBottom:10}}>
                <Text style={{fontSize:12,fontWeight:'700',color:'#475569',marginBottom:4}}>{label as string}</Text>
                <TextInput value={val as string} onChangeText={setVal as any} placeholder={ph as string} placeholderTextColor="#94a3b8" style={ss.input} />
              </View>
            ))}
            <View style={{flexDirection:'row',gap:8,marginBottom:12}}>
              {['এটেল','বেলে','দোঁআশ'].map(st=>(
                <TouchableOpacity key={st} onPress={()=>setSoilType(st)} style={[ss.stBtn, soilType===st && ss.stBtnActive]}>
                  <Text style={[ss.stBtnText, soilType===st && {color:'#fff'}]}>{st}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={ss.analyzeBtn} onPress={analyze} disabled={loading||!crop}>
              {loading?<ActivityIndicator color="#fff"/>:<Text style={{color:'#fff',fontWeight:'800',fontSize:14}}>🔬 {t('বিশ্লেষণ করুন','Analyze')}</Text>}
            </TouchableOpacity>
            {result!=='' && <View style={{marginTop:12,padding:12,backgroundColor:'#f8fafc',borderRadius:14}}><Text style={{fontSize:13,color:'#334155',lineHeight:22}}>{result}</Text></View>}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ─── YIELD ─────────────────────────────────────────────────────────────────────
export function YieldScreen() {
  const insets = useSafeAreaInsets();
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [form, setForm] = useState({crop:'',area:'',district:'',season:'rabi'});
  const [result, setResult] = useState(''); const [loading, setLoading] = useState(false);
  const t = (bn: string, en: string) => lang === 'bn' ? bn : en;
  const predict = async () => {
    if (!form.crop||!form.area) return; setLoading(true);
    try { setResult(await getYieldPrediction(form.crop,form.area,form.season,form.district||'ঢাকা',lang)); }
    catch { Alert.alert('Error','Could not predict.'); }
    setLoading(false);
  };
  return (
    <View style={[{flex:1,backgroundColor:'#f8fafc'},{paddingTop:insets.top}]}>
      <Header lang={lang} setLang={setLang}/>
      <ScrollView contentContainerStyle={{padding:16,gap:14,paddingBottom:40}}>
        <Text style={ss.title}>📊 {t('উৎপাদন পূর্বাভাস','Yield Prediction')}</Text>
        <View style={ss.card}>
          {[['ফসলের নাম *','যেমন: বোরো ধান','crop'],['জমি (বিঘা) *','যেমন: ৫','area'],['জেলা','যেমন: ময়মনসিংহ','district']].map(([label,ph,key])=>(
            <View key={key as string} style={{marginBottom:10}}>
              <Text style={{fontSize:12,fontWeight:'700',color:'#475569',marginBottom:4}}>{label as string}</Text>
              <TextInput value={(form as any)[key as string]} onChangeText={v=>setForm(p=>({...p,[key as string]:v}))} placeholder={ph as string} placeholderTextColor="#94a3b8" style={ss.input}/>
            </View>
          ))}
          <Text style={{fontSize:12,fontWeight:'700',color:'#475569',marginBottom:6}}>{t('মৌসুম','Season')}</Text>
          <View style={{flexDirection:'row',gap:8,marginBottom:14}}>
            {SEASONS.map(s=>(
              <TouchableOpacity key={s.id} onPress={()=>setForm(p=>({...p,season:s.id}))} style={[ss.stBtn,form.season===s.id&&{backgroundColor:s.color,borderColor:s.color}]}>
                <Text style={[ss.stBtnText,form.season===s.id&&{color:'#fff'}]}>{s.icon} {s.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={ss.analyzeBtn} onPress={predict} disabled={loading||!form.crop||!form.area}>
            {loading?<ActivityIndicator color="#fff"/>:<Text style={{color:'#fff',fontWeight:'800',fontSize:14}}>📊 {t('পূর্বাভাস দিন','Predict')}</Text>}
          </TouchableOpacity>
          {result!=='' && <View style={{marginTop:12,padding:12,backgroundColor:'#f8fafc',borderRadius:14}}><Text style={{fontSize:13,color:'#334155',lineHeight:22}}>{result}</Text></View>}
        </View>
      </ScrollView>
    </View>
  );
}

// ─── NUTRIENT ─────────────────────────────────────────────────────────────────
export function NutrientScreen() {
  const insets = useSafeAreaInsets();
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [crop, setCrop] = useState(''); const [area, setArea] = useState(''); const [soil, setSoil] = useState('দোঁআশ');
  const [result, setResult] = useState(''); const [loading, setLoading] = useState(false);
  const t = (bn: string, en: string) => lang === 'bn' ? bn : en;
  const calc = async () => {
    if (!crop||!area) return; setLoading(true);
    try { setResult(await getNutrientRec(crop,'৬.৫',soil,lang)); }
    catch { Alert.alert('Error','Could not calculate.'); }
    setLoading(false);
  };
  return (
    <View style={[{flex:1,backgroundColor:'#f8fafc'},{paddingTop:insets.top}]}>
      <Header lang={lang} setLang={setLang}/>
      <ScrollView contentContainerStyle={{padding:16,gap:14,paddingBottom:40}}>
        <Text style={ss.title}>⚗️ {t('সার হিসাবকারী','Fertilizer Calc')}</Text>
        <View style={[ss.card,{backgroundColor:'#fffbeb',borderColor:'#fde68a'}]}>
          <Text style={{fontSize:12,color:'#92400e',lineHeight:18}}>{t('BARC সারফলক অনুসারে ফসলের সুষম সার সুপারিশ।','Balanced fertilizer recommendation per BARC guide.')}</Text>
        </View>
        <View style={ss.card}>
          {[['ফসল *','ধান, টমেটো...',crop,setCrop],['জমি (বিঘা) *','৫',area,setArea]].map(([label,ph,val,setV])=>(
            <View key={label as string} style={{marginBottom:10}}>
              <Text style={{fontSize:12,fontWeight:'700',color:'#475569',marginBottom:4}}>{label as string}</Text>
              <TextInput value={val as string} onChangeText={setV as any} placeholder={ph as string} placeholderTextColor="#94a3b8" style={ss.input}/>
            </View>
          ))}
          <Text style={{fontSize:12,fontWeight:'700',color:'#475569',marginBottom:6}}>{t('মাটির ধরন','Soil Type')}</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:14}}>
            {['দোঁআশ','এটেল','বেলে','এটেল দোঁআশ'].map(st=>(
              <TouchableOpacity key={st} onPress={()=>setSoil(st)} style={[ss.stBtn, soil===st && ss.stBtnActive]}>
                <Text style={[ss.stBtnText, soil===st && {color:'#fff'}]}>{st}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={ss.analyzeBtn} onPress={calc} disabled={loading||!crop||!area}>
            {loading?<ActivityIndicator color="#fff"/>:<Text style={{color:'#fff',fontWeight:'800',fontSize:14}}>⚗️ {t('হিসাব করুন','Calculate')}</Text>}
          </TouchableOpacity>
          {result!=='' && <View style={{marginTop:12,padding:12,backgroundColor:'#f8fafc',borderRadius:14}}><Text style={{fontSize:13,color:'#334155',lineHeight:22}}>{result}</Text></View>}
        </View>
      </ScrollView>
    </View>
  );
}

// ─── DISEASE LIBRARY ──────────────────────────────────────────────────────────
export function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [selectedCrop, setSelectedCrop] = useState<typeof CROP_DISEASES[0] | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<any>(null);
  const t = (bn: string, en: string) => lang === 'bn' ? bn : en;

  if (selectedDisease) return (
    <View style={[{flex:1,backgroundColor:'#f8fafc'},{paddingTop:insets.top}]}>
      <Header lang={lang} setLang={setLang}/>
      <ScrollView contentContainerStyle={{padding:16,gap:12,paddingBottom:40}}>
        <TouchableOpacity onPress={()=>setSelectedDisease(null)}><Text style={{color:BRAND.primary,fontWeight:'700',fontSize:13}}>← {t('রোগের তালিকায় ফিরুন','Back to list')}</Text></TouchableOpacity>
        <Text style={ss.title}>{selectedDisease.name}</Text>
        <Text style={{fontSize:13,color:'#94a3b8',fontStyle:'italic'}}>{selectedDisease.nameEn} | {selectedDisease.pathogen}</Text>
        <View style={[ss.card,{backgroundColor:'#fffbeb',borderColor:'#fde68a'}]}>
          <Text style={{fontSize:12,fontWeight:'900',color:'#92400e',marginBottom:6}}>🔍 {t('লক্ষণ','Symptoms')}</Text>
          <Text style={{fontSize:14,color:'#b45309',lineHeight:22}}>{selectedDisease.symptoms}</Text>
        </View>
        <View style={[ss.card,{backgroundColor:'#f0fdf4',borderColor:'#bbf7d0'}]}>
          <Text style={{fontSize:12,fontWeight:'900',color:'#166534',marginBottom:6}}>💊 {t('প্রতিকার','Treatment')}</Text>
          <Text style={{fontSize:14,color:'#16a34a',lineHeight:22}}>{selectedDisease.treatment}</Text>
        </View>
      </ScrollView>
    </View>
  );

  if (selectedCrop) return (
    <View style={[{flex:1,backgroundColor:'#f8fafc'},{paddingTop:insets.top}]}>
      <Header lang={lang} setLang={setLang}/>
      <ScrollView contentContainerStyle={{padding:16,gap:12,paddingBottom:40}}>
        <TouchableOpacity onPress={()=>setSelectedCrop(null)}><Text style={{color:BRAND.primary,fontWeight:'700',fontSize:13}}>← {t('ফিরুন','Back')}</Text></TouchableOpacity>
        <Text style={ss.title}>{selectedCrop.crop} {selectedCrop.icon}</Text>
        {selectedCrop.diseases.map((d,i)=>(
          <TouchableOpacity key={i} style={ss.card} onPress={()=>setSelectedDisease(d)}>
            <Text style={{fontSize:15,fontWeight:'800',color:'#0f172a'}}>{d.name}</Text>
            <Text style={{fontSize:12,color:'#94a3b8',marginTop:2}}>{d.nameEn}</Text>
            <Text style={{fontSize:11,color:'#cbd5e1',fontStyle:'italic',marginTop:2}}>{d.pathogen}</Text>
            <Text style={{fontSize:13,color:BRAND.primary,fontWeight:'700',marginTop:8}}>→</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={[{flex:1,backgroundColor:'#f8fafc'},{paddingTop:insets.top}]}>
      <Header lang={lang} setLang={setLang}/>
      <ScrollView contentContainerStyle={{padding:16,gap:12,paddingBottom:40}}>
        <Text style={ss.title}>📚 {t('রোগ লাইব্রেরি','Disease Library')}</Text>
        {CROP_DISEASES.map((cd,i)=>(
          <TouchableOpacity key={i} style={ss.card} onPress={()=>setSelectedCrop(cd)}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <View>
                <Text style={{fontSize:16,fontWeight:'800',color:'#0f172a'}}>{cd.icon} {cd.crop}</Text>
                <Text style={{fontSize:12,color:'#94a3b8',marginTop:2}}>{cd.cropEn} • {cd.diseases.length}{t('টি রোগ',' diseases')}</Text>
              </View>
              <Text style={{fontSize:22,color:'#e2e8f0'}}>→</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// Shared styles
const ss = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '900', color: '#0f172a' },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  tabs: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 14, padding: 3, gap: 2 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  tabText: { fontSize: 12, fontWeight: '700', color: '#94a3b8' },
  tabTextActive: { color: BRAND.primary },
  input: { borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#0f172a', backgroundColor: '#f8fafc' },
  phBadge: { backgroundColor: '#fffbeb', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  phBadgeText: { fontSize: 12, fontWeight: '800', color: '#92400e' },
  infoBox: { borderRadius: 12, padding: 10, borderWidth: 1 },
  stBtn: { flex: 1, borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 12, paddingVertical: 8, alignItems: 'center' },
  stBtnActive: { backgroundColor: BRAND.primary, borderColor: BRAND.primary },
  stBtnText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  analyzeBtn: { backgroundColor: BRAND.primary, borderRadius: 16, height: 50, alignItems: 'center', justifyContent: 'center', shadowColor: BRAND.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
});

export default SoilScreen;
