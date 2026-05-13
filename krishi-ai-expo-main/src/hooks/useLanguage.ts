import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'bn' | 'en';

const LANG_KEY = 'krishi_ai_lang';

export const useLanguage = () => {
  const [lang, setLangState] = useState<Language>('bn');

  const setLang = useCallback(async (l: Language) => {
    setLangState(l);
    await AsyncStorage.setItem(LANG_KEY, l);
  }, []);

  const t = useCallback(
    (bn: string, en: string) => (lang === 'bn' ? bn : en),
    [lang],
  );

  return { lang, setLang, t };
};
