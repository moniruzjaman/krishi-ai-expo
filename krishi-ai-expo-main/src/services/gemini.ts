import Constants from 'expo-constants';

// ─── Config ───────────────────────────────────────────────────────────────────

/** Primary: your own FastAPI backend at api.krishiai.live (keys stay server-side) */
const BACKEND_URL =
  Constants.expoConfig?.extra?.BACKEND_URL ||
  process.env.EXPO_PUBLIC_BACKEND_URL ||
  'https://api.krishiai.live/api/v1';

/** Fallback: call Gemini directly if backend is unreachable */
const getApiKey = (): string =>
  Constants.expoConfig?.extra?.GEMINI_API_KEY ||
  process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
  '';

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// ─── Backend helper ───────────────────────────────────────────────────────────
const callBackend = async (
  path: string,
  body: Record<string, unknown>,
): Promise<string | null> => {
  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    const data = await res.json();
    // FastAPI responses: { result, text, answer, response } (any of these)
    return data.result ?? data.text ?? data.answer ?? data.response ?? null;
  } catch {
    return null; // backend unreachable → fall through to Gemini
  }
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface GeminiPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}

interface GeminiMessage {
  role: 'user' | 'model';
  parts: GeminiPart[];
}

// ─── Core Request ─────────────────────────────────────────────────────────────
const callGemini = async (
  messages: GeminiMessage[],
  systemInstruction?: string,
): Promise<string> => {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('EXPO_PUBLIC_GEMINI_API_KEY is not set');
  }

  const body: Record<string, unknown> = {
    contents: messages,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
      topP: 0.9,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  };

  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'উত্তর পাওয়া যায়নি।';
};

// ─── Public API (backend-first, Gemini fallback) ──────────────────────────────

/**
 * Analyze a crop image — tries /diagnosis/image on backend first,
 * falls back to direct Gemini if backend is down.
 */
export const analyzeCropImage = async (
  base64Image: string,
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg',
  language: 'bn' | 'en' = 'bn',
): Promise<string> => {
  // 1️⃣ Try backend
  const backendResult = await callBackend('/diagnosis/image', {
    image: base64Image,
    mime_type: mimeType,
    lang: language,
  });
  if (backendResult) return backendResult;

  // 2️⃣ Fallback: direct Gemini
  const prompt = language === 'bn'
    ? 'এই ফসলের ছবি বিশ্লেষণ করুন। রোগের নাম, কারণ, লক্ষণ, প্রতিকার ও প্রতিরোধমূলক ব্যবস্থা বিস্তারিত বলুন। সুস্থ ফসল হলে সেটিও বলুন।'
    : 'Analyze this crop image. Provide disease name, cause, symptoms, treatment and prevention. If the crop is healthy, say so.';

  const system = language === 'bn'
    ? 'আপনি একজন বিশেষজ্ঞ উদ্ভিদ রোগতত্ত্ববিদ। CABI Plantwise প্রোটোকল ও বাংলাদেশের BARI/BRRI/DAE নির্দেশিকা মেনে বাংলায় সংক্ষিপ্ত উত্তর দিন।'
    : 'You are an expert plant pathologist. Follow CABI Plantwise protocol and Bangladesh BARI/BRRI/DAE guidelines. Give concise advice in English.';

  return callGemini(
    [{ role: 'user', parts: [{ inlineData: { mimeType, data: base64Image } }, { text: prompt }] }],
    system,
  );
};

/**
 * Agri chatbot — tries /chat on backend first, falls back to Gemini.
 */
export const chatWithAgriExpert = async (
  messages: Array<{ role: 'user' | 'model'; content: string }>,
  language: 'bn' | 'en' = 'bn',
): Promise<string> => {
  const lastMessage = messages[messages.length - 1]?.content ?? '';

  // 1️⃣ Try backend
  const backendResult = await callBackend('/chat', {
    message: lastMessage,
    history: messages.slice(0, -1).map(m => ({ role: m.role, content: m.content })),
    lang: language,
  });
  if (backendResult) return backendResult;

  // 2️⃣ Fallback: direct Gemini
  const system = language === 'bn'
    ? 'আপনি বাংলাদেশের একজন বিশেষজ্ঞ কৃষি উপদেষ্টা। BARI, BRRI, DAE, BARC ও SRDI নির্দেশিকা অনুসরণ করুন। সংক্ষিপ্ত ও ব্যবহারিক পরামর্শ দিন।'
    : 'You are an expert agricultural advisor for Bangladesh. Follow BARI, BRRI, DAE, BARC and SRDI guidelines. Give concise, practical advice.';

  return callGemini(
    messages.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
    system,
  );
};

/**
 * Pesticide recommendation — tries /pesticide/recommend on backend first.
 */
export const getPesticideRecommendation = async (
  pestName: string,
  language: 'bn' | 'en' = 'bn',
): Promise<string> => {
  // 1️⃣ Try backend
  const backendResult = await callBackend('/pesticide/recommend', {
    pest: pestName,
    lang: language,
  });
  if (backendResult) return backendResult;

  // 2️⃣ Fallback: direct Gemini
  const prompt = language === 'bn'
    ? `বাংলাদেশে "${pestName}" সমস্যার জন্য DAE অনুমোদিত বালাইনাশকের সুপারিশ করুন। মাত্রা, প্রয়োগের সময় ও নিরাপত্তা নির্দেশিকা সহ বলুন।`
    : `Recommend DAE approved pesticides for "${pestName}" in Bangladesh. Include dose, timing and safety guidelines.`;

  return callGemini(
    [{ role: 'user', parts: [{ text: prompt }] }],
    language === 'bn'
      ? 'আপনি বাংলাদেশের একজন DAE অনুমোদিত বালাইনাশক বিশেষজ্ঞ।'
      : 'You are a DAE approved pesticide expert for Bangladesh.',
  );
};

/**
 * Soil analysis & fertilizer recommendation — tries /soil/analyze on backend first.
 */
export const getSoilAnalysis = async (
  crop: string,
  pH: string,
  soilType: string,
  language: 'bn' | 'en' = 'bn',
): Promise<string> => {
  // 1️⃣ Try backend
  const backendResult = await callBackend('/soil/analyze', {
    crop,
    ph: pH,
    soil_type: soilType,
    lang: language,
  });
  if (backendResult) return backendResult;

  // 2️⃣ Fallback: direct Gemini
  const prompt = language === 'bn'
    ? `বাংলাদেশে pH ${pH} ${soilType} মাটিতে ${crop} চাষের জন্য সুষম সার সুপারিশ করুন। ইউরিয়া, টিএসপি, এমওপি, গন্ধক ও জিঙ্কের পরিমাণ কেজিতে বলুন।`
    : `Recommend balanced fertilizer for ${crop} on ${soilType} soil (pH ${pH}) in Bangladesh. Specify urea, TSP, MOP, sulfur and zinc in kg.`;

  return callGemini(
    [{ role: 'user', parts: [{ text: prompt }] }],
    language === 'bn'
      ? 'আপনি বাংলাদেশের একজন SRDI ও BARC সার বিশেষজ্ঞ।'
      : 'You are a SRDI and BARC fertilizer expert for Bangladesh.',
  );
};

/**
 * Yield prediction — tries /yield/predict on backend first.
 */
export const getYieldPrediction = async (
  crop: string,
  area: string,
  season: string,
  district: string,
  language: 'bn' | 'en' = 'bn',
): Promise<string> => {
  // 1️⃣ Try backend
  const backendResult = await callBackend('/yield/predict', {
    crop,
    area,
    season,
    district,
    lang: language,
  });
  if (backendResult) return backendResult;

  // 2️⃣ Fallback: direct Gemini
  const prompt = language === 'bn'
    ? `বাংলাদেশের ${district} জেলায় ${season} মৌসুমে ${area} বিঘা জমিতে ${crop} চাষের আনুমানিক উৎপাদন পূর্বাভাস ও ব্যবস্থাপনার পরামর্শ দিন।`
    : `Yield forecast and management advice for ${crop} on ${area} bigha in ${district}, ${season} season, Bangladesh.`;

  return callGemini(
    [{ role: 'user', parts: [{ text: prompt }] }],
    language === 'bn'
      ? 'আপনি বাংলাদেশের একজন BARI/BRRI কৃষি অর্থনীতিবিদ।'
      : 'You are a BARI/BRRI agricultural economist for Bangladesh.',
  );
};

/**
 * Learning content — tries /learn/content on backend first.
 */
export const getLearningContent = async (
  topic: string,
  language: 'bn' | 'en' = 'bn',
): Promise<string> => {
  // 1️⃣ Try backend
  const backendResult = await callBackend('/learn/content', {
    topic,
    lang: language,
  });
  if (backendResult) return backendResult;

  // 2️⃣ Fallback: direct Gemini
  const prompt = language === 'bn'
    ? `বাংলাদেশের কৃষকদের জন্য "${topic}" বিষয়ে একটি সহজ, বাস্তব ও তথ্যবহুল পাঠ তৈরি করুন। ৩টি প্রধান বিষয় ও ব্যবহারিক টিপস অন্তর্ভুক্ত করুন।`
    : `Create a simple, practical lesson on "${topic}" for Bangladeshi farmers. Include 3 key topics and practical tips.`;

  return callGemini(
    [{ role: 'user', parts: [{ text: prompt }] }],
    language === 'bn'
      ? 'আপনি একজন কৃষি প্রশিক্ষক যিনি বাংলাদেশের কৃষকদের প্রশিক্ষণ দেন।'
      : 'You are an agricultural trainer who trains Bangladeshi farmers.',
  );
};
