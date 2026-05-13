import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// ─── Config ───────────────────────────────────────────────────────────────────
const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  Constants.expoConfig?.extra?.SUPABASE_URL ||
  'https://nmngzjrrysjzuxfcklrk.supabase.co';

const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_KEY ||
  Constants.expoConfig?.extra?.SUPABASE_ANON_KEY ||
  '';

// ─── Client (with AsyncStorage for session persistence) ───────────────────────
export const supabase = SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

// ─── User Profile ─────────────────────────────────────────────────────────────
export interface UserProfile {
  uid: string;
  displayName: string;
  mobile?: string;
  role?: string;
  district?: string;
  upazila?: string;
}

export const syncUserProfile = async (user: UserProfile): Promise<void> => {
  if (!supabase || !user.uid) return;
  try {
    await supabase.from('users').upsert({
      id: user.uid,
      name: user.displayName,
      phone: user.mobile,
      role: user.role,
      location: user.district ? `${user.district}, ${user.upazila ?? ''}` : null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });
  } catch (err) {
    console.warn('Supabase profile sync failed:', err);
  }
};

// ─── Reports ──────────────────────────────────────────────────────────────────
export interface SavedReport {
  id: string;
  userId: string;
  timestamp: string;
  type: 'disease' | 'soil' | 'pest' | 'yield' | 'chat';
  title: string;
  content: string;
  icon?: string;
}

export const saveReport = async (report: SavedReport): Promise<void> => {
  if (!supabase) return;
  try {
    await supabase.from('saved_reports').insert({
      id: report.id,
      user_id: report.userId,
      timestamp: report.timestamp,
      type: report.type,
      title: report.title,
      content: report.content,
      icon: report.icon,
    });
  } catch (err) {
    console.warn('Supabase report save failed:', err);
  }
};

export const fetchReports = async (userId: string): Promise<SavedReport[]> => {
  if (!supabase) return [];
  try {
    const { data } = await supabase
      .from('saved_reports')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(50);
    return (data ?? []) as SavedReport[];
  } catch {
    return [];
  }
};
