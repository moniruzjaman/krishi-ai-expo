import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  FlatList, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { BRAND } from '../src/constants';
import { chatWithAgriExpert } from '../src/services/gemini';

interface Message { id: string; role: 'user' | 'model'; content: string }

const QUICK_BN = ['ধানের ব্লাস্ট রোগের প্রতিকার?', 'সরিষায় জাব পোকা দমন?', 'বোরো ধানে কখন সার দিতে হবে?'];
const QUICK_EN = ['How to treat rice blast?', 'Control aphid in mustard?', 'When to fertilize Boro rice?'];

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);
  const t = (bn: string, en: string) => lang === 'bn' ? bn : en;

  const [messages, setMessages] = useState<Message[]>([{
    id: '0',
    role: 'model',
    content: 'আস্সালামুয়ালাইকুম! আমি কৃষি AI চ্যাটবট। আপনার ফসল, রোগ, সার বা যেকোনো কৃষি বিষয়ে আমাকে জিজ্ঞেস করুন।',
  }]);

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setInput('');
    await Haptics.selectionAsync();

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));
      const reply = await chatWithAgriExpert(history, lang);
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'model', content: reply }]);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e: any) {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(), role: 'model',
        content: t('দুঃখিত, উত্তর পেতে সমস্যা হচ্ছে। আবার চেষ্টা করুন।', 'Sorry, error getting response. Please try again.'),
      }]);
    }
    setLoading(false);
  };

  const renderBubble = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.bubbleRow, isUser ? styles.bubbleRowUser : styles.bubbleRowModel]}>
        {!isUser && <Text style={styles.botAvatar}>🌱</Text>}
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleModel]}>
          <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>{item.content}</Text>
        </View>
      </View>
    );
  };

  const quickQ = lang === 'bn' ? QUICK_BN : QUICK_EN;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>🤖 {t('কৃষি চ্যাটবট', 'Agri Chatbot')}</Text>
          <Text style={styles.headerOnline}>● {t('অনলাইন', 'Online')}</Text>
        </View>
        <View style={styles.langRow}>
          {(['bn', 'en'] as const).map((l) => (
            <TouchableOpacity key={l} onPress={() => setLang(l)} style={[styles.langBtn, lang === l && styles.langBtnActive]}>
              <Text style={[styles.langBtnText, lang === l && styles.langBtnTextActive]}>{l === 'bn' ? 'বাং' : 'EN'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Message list */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderBubble}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={loading ? (
          <View style={styles.typingRow}>
            <Text style={styles.botAvatar}>🌱</Text>
            <View style={styles.bubbleModel}>
              <View style={styles.typingDots}>
                {[0, 1, 2].map((i) => (
                  <View key={i} style={[styles.dot, { opacity: 0.4 + i * 0.2 }]} />
                ))}
              </View>
            </View>
          </View>
        ) : null}
      />

      {/* Quick questions (only when empty) */}
      {messages.length === 1 && !loading && (
        <View style={styles.quickSection}>
          <Text style={styles.quickLabel}>{t('দ্রুত প্রশ্ন:', 'Quick Questions:')}</Text>
          <FlatList
            horizontal
            data={quickQ}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.quickChip} onPress={() => sendMessage(item)}>
                <Text style={styles.quickChipText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Input bar */}
      <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder={t('প্রশ্ন করুন...', 'Ask a question...')}
          placeholderTextColor="#94a3b8"
          multiline
          maxLength={500}
          returnKeyType="send"
          onSubmitEditing={() => sendMessage(input)}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
          onPress={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          activeOpacity={0.85}
        >
          <Text style={styles.sendBtnText}>{loading ? '⏳' : '→'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  backBtn: { padding: 8 },
  backText: { fontSize: 22, color: BRAND.primary },
  headerTitle: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  headerOnline: { fontSize: 11, color: '#22c55e', fontWeight: '600' },
  langRow: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 999, padding: 3, gap: 2, marginLeft: 'auto' },
  langBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  langBtnActive: { backgroundColor: BRAND.primary },
  langBtnText: { fontSize: 10, fontWeight: '800', color: '#94a3b8' },
  langBtnTextActive: { color: '#fff' },

  list: { padding: 16, gap: 12 },
  bubbleRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  bubbleRowUser: { flexDirection: 'row-reverse' },
  bubbleRowModel: {},
  botAvatar: { fontSize: 22, marginBottom: 4 },
  bubble: { maxWidth: '78%', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleUser: { backgroundColor: BRAND.primary, borderBottomRightRadius: 4 },
  bubbleModel: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderBottomLeftRadius: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  bubbleText: { fontSize: 14, color: '#334155', lineHeight: 20 },
  bubbleTextUser: { color: '#fff' },
  typingRow: { flexDirection: 'row', gap: 8, alignItems: 'center', paddingHorizontal: 16, paddingTop: 4 },
  typingDots: { flexDirection: 'row', gap: 5, paddingHorizontal: 6, paddingVertical: 8 },
  dot: { width: 8, height: 8, borderRadius: 999, backgroundColor: BRAND.primary },

  quickSection: { paddingVertical: 10 },
  quickLabel: { fontSize: 11, fontWeight: '700', color: '#94a3b8', paddingHorizontal: 16, marginBottom: 6 },
  quickChip: { backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#86efac', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  quickChipText: { fontSize: 12, color: '#166534', fontWeight: '600' },

  inputBar: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0', alignItems: 'flex-end' },
  input: { flex: 1, borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: '#0f172a', maxHeight: 100, backgroundColor: '#f8fafc' },
  sendBtn: { width: 46, height: 46, borderRadius: 14, backgroundColor: BRAND.primary, alignItems: 'center', justifyContent: 'center', shadowColor: BRAND.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },
  sendBtnDisabled: { backgroundColor: '#e2e8f0', shadowOpacity: 0 },
  sendBtnText: { fontSize: 20, color: '#fff', fontWeight: '800' },
});
