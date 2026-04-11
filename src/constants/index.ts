// ─── Brand ────────────────────────────────────────────────────────────────────
export const BRAND = {
  primary: '#0A8A1F',
  primaryLight: '#22c55e',
  primaryDark: '#064e3b',
  accent: '#10b981',
  bg: '#f8fafc',
  surface: '#ffffff',
  border: '#e2e8f0',
  text: '#0f172a',
  textMuted: '#64748b',
};

// ─── Market Data ──────────────────────────────────────────────────────────────
export const MARKET_DATA = [
  { name: 'চাল (সরু)',        unit: 'কেজি',  wholesale: 70,  retail: 78,  trend: 'up',     change: '+২%'  },
  { name: 'আলু (ডায়মন্ড)', unit: 'কেজি',  wholesale: 40,  retail: 50,  trend: 'down',   change: '-৫%'  },
  { name: 'পেঁয়াজ (দেশি)',  unit: 'কেজি',  wholesale: 90,  retail: 110, trend: 'up',     change: '+১২%' },
  { name: 'কাঁচামরিচ',      unit: 'কেজি',  wholesale: 130, retail: 170, trend: 'up',     change: '+১৫%' },
  { name: 'মসুর ডাল',       unit: 'কেজি',  wholesale: 133, retail: 148, trend: 'stable', change: '০%'   },
  { name: 'সয়াবিন তেল',    unit: 'লিটার', wholesale: 158, retail: 166, trend: 'down',   change: '-১%'  },
  { name: 'টমেটো',          unit: 'কেজি',  wholesale: 65,  retail: 85,  trend: 'down',   change: '-১০%' },
  { name: 'রসুন (দেশি)',    unit: 'কেজি',  wholesale: 190, retail: 230, trend: 'up',     change: '+৮%'  },
  { name: 'ডিম (ফার্ম)',    unit: '১২ টি', wholesale: 135, retail: 150, trend: 'up',     change: '+৩%'  },
  { name: 'গরুর মাংস',      unit: 'কেজি',  wholesale: 710, retail: 760, trend: 'stable', change: '০%'   },
];

// ─── Crop Categories ──────────────────────────────────────────────────────────
export const CROP_CATEGORIES = [
  { id: 'cereals',    label: 'দানা ফসল',   labelEn: 'Cereals',    icon: '🌾', crops: ['ধান', 'গম', 'ভুট্রা', 'বার্লি'] },
  { id: 'vegetables', label: 'সবজি ফসল',  labelEn: 'Vegetables', icon: '🥦', crops: ['টমেটো', 'বেগুন', 'করলা', 'ঢেঁড়শ'] },
  { id: 'fruits',     label: 'ফল',         labelEn: 'Fruits',     icon: '🍎', crops: ['আম', 'কলা', 'পেঁপে', 'লিচু'] },
  { id: 'pulses',     label: 'ডাল ফসল',   labelEn: 'Pulses',     icon: '🍲', crops: ['মসুর', 'ছোলা', 'মুগ', 'মাসকলাই'] },
  { id: 'oilseeds',   label: 'তৈলবীজ',    labelEn: 'Oilseeds',   icon: '🌻', crops: ['সরিষা', 'সয়াবীন', 'চীনাবাদাম'] },
  { id: 'spices',     label: 'মসলা',       labelEn: 'Spices',     icon: '🌶️', crops: ['পেঁয়াজ', 'রসুন', 'হলুদ', 'আদা'] },
];

// ─── Tools Hub ────────────────────────────────────────────────────────────────
export const TOOLS = [
  { id: 'analyzer',  icon: '📸', label: 'এআই স্ক্যানার',        labelEn: 'AI Scanner',      desc: 'ফসলের রোগ সনাক্তকরণ',      color: '#10b981', bg: '#ecfdf5', route: '/analyzer'  },
  { id: 'chat',      icon: '🤖', label: 'কৃষি চ্যাটবট',         labelEn: 'Agri Chatbot',    desc: 'বিশেষজ্ঞ পরামর্শ',          color: '#3b82f6', bg: '#eff6ff', route: '/chat'      },
  { id: 'pesticide', icon: '🧪', label: 'বালাইনাশক বিশেষজ্ঞ',  labelEn: 'Pesticide Expert',desc: 'DAE অনুমোদিত',             color: '#ef4444', bg: '#fef2f2', route: '/pesticide'  },
  { id: 'soil',      icon: '🔬', label: 'মাটি বিশেষজ্ঞ',        labelEn: 'Soil Expert',     desc: 'SRDI নির্দেশিকা',           color: '#f59e0b', bg: '#fffbeb', route: '/soil'       },
  { id: 'yield',     icon: '📊', label: 'উৎপাদন পূর্বাভাস',    labelEn: 'Yield Predictor', desc: 'BRRI/BARI ভিত্তিক',         color: '#8b5cf6', bg: '#f5f3ff', route: '/yield'      },
  { id: 'weather',   icon: '⛅', label: 'আবহাওয়া',              labelEn: 'Weather',         desc: 'কৃষি আবহাওয়া তথ্য',         color: '#0ea5e9', bg: '#f0f9ff', route: '/weather'    },
  { id: 'calendar',  icon: '📅', label: 'ফসল ক্যালেন্ডার',     labelEn: 'Crop Calendar',   desc: 'মৌসুম ভিত্তিক পরিকল্পনা',  color: '#14b8a6', bg: '#f0fdfa', route: '/calendar'   },
  { id: 'market',    icon: '💰', label: 'বাজার মূল্য',          labelEn: 'Market Prices',   desc: 'সর্বশেষ বাজার তথ্য',         color: '#22c55e', bg: '#f0fdf4', route: '/market'     },
  { id: 'nutrient',  icon: '⚗️', label: 'সার হিসাবকারী',        labelEn: 'Nutrient Calc',   desc: 'সুষম সার সুপারিশ',          color: '#f97316', bg: '#fff7ed', route: '/nutrient'   },
  { id: 'library',   icon: '📚', label: 'রোগ লাইব্রেরি',        labelEn: 'Disease Library', desc: 'রোগ ও সমাধান ডেটাবেস',     color: '#f43f5e', bg: '#fff1f2', route: '/library'    },
  { id: 'learn',     icon: '🎓', label: 'শিক্ষা কেন্দ্র',       labelEn: 'Learning Center', desc: 'প্রশিক্ষণ মডিউল',           color: '#6366f1', bg: '#eef2ff', route: '/learn'      },
  { id: 'profile',   icon: '👤', label: 'আমার প্রোফাইল',        labelEn: 'My Profile',      desc: 'অগ্রগতি ও সেটিংস',         color: '#64748b', bg: '#f8fafc', route: '/profile'    },
];

// ─── Pesticide Data ───────────────────────────────────────────────────────────
export const PESTICIDE_DATA = [
  { pest: 'মাজরা পোকা (ধান)',   pestEn: 'Yellow Stem Borer', chemical: 'কার্বোসালফান ২৫ EC',     dose: '১ লিটার/বিঘা',           timing: 'কুশি থেকে থোড় অবস্থা', safety: 'PPE পরিধান করুন, ৭ দিন পর সেচ দিন'                    },
  { pest: 'জাব পোকা (সরিষা)',   pestEn: 'Aphid (Mustard)',   chemical: 'ইমিডাক্লোপ্রিড ২০০ SL', dose: '০.৫ মিলি/লিটার পানি',    timing: 'আক্রমণের শুরুতে',       safety: 'ফুল আসার আগে প্রয়োগ করুন, মৌমাছি রক্ষা করুন'           },
  { pest: 'সাদা মাছি (টমেটো)', pestEn: 'Whitefly (Tomato)', chemical: 'অ্যাসিটামিপ্রিড ২০ SP', dose: '১ গ্রাম/লিটার পানি',     timing: 'লার্ভা দেখার সাথে সাথে', safety: 'বিকেলে স্প্রে করুন, ৩ দিন অন্তর ২ বার'                  },
  { pest: 'ফল ছিদ্রকারী পোকা', pestEn: 'Fruit Borer',       chemical: 'স্পিনোসাড ৪৫ SC',        dose: '০.৩ মিলি/লিটার পানি',    timing: 'ডিম পাড়ার আগে',        safety: 'ফল সংগ্রহের ৩ দিন আগে বন্ধ করুন'                         },
  { pest: 'বাদামি গাছ ফড়িং',   pestEn: 'Brown Planthopper', chemical: 'বিউপ্রোফেজিন ২৫ SC',     dose: '১.৫ মিলি/লিটার পানি',    timing: 'কুশি পর্যায়ে',          safety: 'ক্ষেতে পানি রেখে স্প্রে করুন'                            },
];

// ─── Soil Data ─────────────────────────────────────────────────────────────────
export const SOIL_TYPES = [
  { name: 'এটেল মাটি',    nameEn: 'Clay Soil',    pH: '৬.৫–৭.৫', crops: ['ধান', 'পাট'],          pros: 'পুষ্টি ধরে রাখে',   cons: 'পানি নিষ্কাশন কম'   },
  { name: 'বেলে মাটি',    nameEn: 'Sandy Soil',   pH: '৬.০–৭.০', crops: ['আলু', 'গাজর'],         pros: 'দ্রুত গরম হয়',     cons: 'পুষ্টি ধরে না'      },
  { name: 'দোঁআশ মাটি',  nameEn: 'Loam Soil',    pH: '৬.০–৭.০', crops: ['সব ফসল'],               pros: 'সর্বোত্তম মাটি',   cons: 'কম পাওয়া যায়'     },
  { name: 'এঁটেল দোঁআশ', nameEn: 'Clay Loam',    pH: '৬.৫–৭.৫', crops: ['ধান', 'সবজি'],         pros: 'ভালো পুষ্টি ও পানি', cons: 'ভারী চাষ প্রয়োজন' },
];

export const SOIL_NUTRIENTS = [
  { name: 'নাইট্রোজেন (N)', deficiency: 'পাতা হলুদ হয়, বৃদ্ধি কম',         remedy: 'ইউরিয়া সার ৪৫ কেজি/বিঘা'           },
  { name: 'ফসফরাস (P)',      deficiency: 'পাতা বেগুনি হয়, শিকড় দুর্বল',    remedy: 'টিএসপি বা ডিএপি ১৫ কেজি/বিঘা'       },
  { name: 'পটাশিয়াম (K)',   deficiency: 'পাতার কিনারা পুড়ে যায়',           remedy: 'মিউরেট অব পটাশ ১০ কেজি/বিঘা'       },
  { name: 'সালফার (S)',      deficiency: 'নতুন পাতা হলুদ',                    remedy: 'জিপসাম ১২ কেজি/বিঘা'                },
  { name: 'জিঙ্ক (Zn)',      deficiency: 'পাতায় বাদামি ছোপ, ক্লোরোসিস',    remedy: 'জিঙ্ক সালফেট ২ কেজি/বিঘা'          },
];

// ─── Seasons ───────────────────────────────────────────────────────────────────
export const SEASONS = [
  { id: 'rabi',    name: 'রবি',    nameEn: 'Rabi (Winter)',   color: '#1e88e5', months: 'নভেম্বর – মার্চ', crops: ['বোরো ধান', 'গম', 'আলু', 'সরিষা', 'শীতকালীন সবজি'], icon: '❄️' },
  { id: 'kharif1', name: 'খরিফ-১', nameEn: 'Kharif-I (Summer)', color: '#e65100', months: 'এপ্রিল – জুলাই', crops: ['আউশ ধান', 'পাট', 'ভুট্টা', 'তিল'],            icon: '☀️' },
  { id: 'kharif2', name: 'খরিফ-২', nameEn: 'Kharif-II (Monsoon)', color: '#2e7d32', months: 'আগস্ট – অক্টোবর', crops: ['আমন ধান', 'বর্ষাকালীন সবজি'],           icon: '🌧️' },
];

// ─── Learning Modules ─────────────────────────────────────────────────────────
export const LEARNING_MODULES = [
  { id: 1, title: 'ধানের সমন্বিত বালাই ব্যবস্থাপনা', titleEn: 'IPM for Rice',              level: 'প্রাথমিক',   levelColor: '#10b981', duration: '৩০ মিনিট', icon: '🌾', xp: 100 },
  { id: 2, title: 'মাটি পরীক্ষা ও সার ব্যবস্থাপনা',  titleEn: 'Soil Testing & Fertilizer', level: 'মধ্যবর্তী',  levelColor: '#3b82f6', duration: '৪৫ মিনিট', icon: '🔬', xp: 150 },
  { id: 3, title: 'কৃষি আবহাওয়া ও ফসল পরিকল্পনা',   titleEn: 'Agro-meteorology',          level: 'প্রাথমিক',   levelColor: '#10b981', duration: '২০ মিনিট', icon: '⛅', xp: 80  },
  { id: 4, title: 'জৈব কৃষি পদ্ধতি',                  titleEn: 'Organic Farming',           level: 'উন্নত',      levelColor: '#8b5cf6', duration: '৬০ মিনিট', icon: '🌿', xp: 200 },
  { id: 5, title: 'ড্রিপ সেচ পদ্ধতি',                 titleEn: 'Drip Irrigation',           level: 'মধ্যবর্তী',  levelColor: '#3b82f6', duration: '৩৫ মিনিট', icon: '💧', xp: 120 },
  { id: 6, title: 'CABI রোগ নির্ণয় প্রশিক্ষণ',      titleEn: 'CABI Diagnosis Training',   level: 'পেশাদার',    levelColor: '#ef4444', duration: '৯০ মিনিট', icon: '🔭', xp: 300 },
];

// ─── Disease Library ──────────────────────────────────────────────────────────
export const CROP_DISEASES = [
  {
    crop: 'ধান', cropEn: 'Rice', icon: '🌾',
    diseases: [
      { name: 'ব্লাস্ট রোগ',    nameEn: 'Rice Blast',    pathogen: 'Magnaporthe oryzae',    symptoms: 'পাতায় ধূসর-সাদা বা বাদামি ক্ষত, ঘাড় ভেঙে পড়া',             treatment: 'ট্রাইসাইক্লাজল বা ইসপ্রোথিওলেন স্প্রে, রোগ প্রতিরোধী জাত ব্যবহার' },
      { name: 'খোল পচা',         nameEn: 'Sheath Blight', pathogen: 'Rhizoctonia solani',    symptoms: 'কাণ্ডের নিচের দিকে ডিম্বাকার দাগ, পচন',                       treatment: 'প্রোপিকোনাজল বা থিওফ্যানেট মিথাইল প্রয়োগ'                         },
      { name: 'বাদামি গাছ ফড়িং', nameEn: 'Brown Planthopper', pathogen: 'Nilaparvata lugens', symptoms: 'গাছের গোড়া হলুদ হয়ে মরা (হপার বার্ন)',                      treatment: 'ইমিডাক্লোপ্রিড বা বিউপ্রোফেজিন স্প্রে, ক্ষেতে পানি রাখুন'       },
    ],
  },
  {
    crop: 'টমেটো', cropEn: 'Tomato', icon: '🍅',
    diseases: [
      { name: 'আর্লি ব্লাইট', nameEn: 'Early Blight', pathogen: 'Alternaria solani',       symptoms: 'পাতায় গোলাকার বাদামি দাগ, হলুদ হলো',    treatment: 'ম্যানকোজেব বা ক্লোরোথ্যালোনিল স্প্রে'              },
      { name: 'লেট ব্লাইট',   nameEn: 'Late Blight',  pathogen: 'Phytophthora infestans', symptoms: 'পাতা কালো হয়ে পচে যায়, সাদা ছত্রাক দেখা যায়', treatment: 'মেটালক্সিল + ম্যানকোজেব, বৃষ্টির আগে প্রতিরোধ' },
    ],
  },
  {
    crop: 'ভুট্রা', cropEn: 'Maize', icon: '🌽',
    diseases: [
      { name: 'ফল আর্মিওয়ার্ম', nameEn: 'Fall Armyworm', pathogen: 'Spodoptera frugiperda', symptoms: 'পাতায় অনিয়মিত ছিদ্র, লার্ভার মল দেখা যায়', treatment: 'স্পিনোসাড বা ক্লোরপাইরিফস স্প্রে, ট্র্যাপ স্থাপন' },
    ],
  },
  {
    crop: 'সরিষা', cropEn: 'Mustard', icon: '🌻',
    diseases: [
      { name: 'জাব পোকা',  nameEn: 'Aphid',            pathogen: 'Lipaphis erysimi',    symptoms: 'পাতা ও ফুলে ছোট পোকার ঝাঁক, গাছ দুর্বল হয়', treatment: 'ইমিডাক্লোপ্রিড ২০০ SL, ফুল আসার আগে প্রয়োগ' },
      { name: 'আলটারনেরিয়া', nameEn: 'Alternaria Blight', pathogen: 'Alternaria brassicae', symptoms: 'পাতায় গাঢ় বাদামি গোলাকার দাগ',                treatment: 'ম্যানকোজেব ৮০ WP, ১৫ দিন অন্তর ২-৩ বার স্প্রে' },
    ],
  },
];

// ─── Weather (static for Expo Go demo) ────────────────────────────────────────
export const WEATHER_DATA = {
  location: 'ঢাকা, বাংলাদেশ',
  temp: 28,
  humidity: 75,
  wind: 12,
  condition: 'আংশিক মেঘলা',
  conditionEn: 'Partly Cloudy',
  icon: '⛅',
  forecast: [
    { day: 'আজ',   icon: '⛅',  high: 30, low: 24 },
    { day: 'কাল',  icon: '🌧️', high: 27, low: 22 },
    { day: 'পরশু', icon: '☀️',  high: 32, low: 25 },
    { day: 'শনি',  icon: '🌤️', high: 31, low: 24 },
    { day: 'রবি',  icon: '☀️',  high: 33, low: 26 },
  ],
  advisory: 'আগামীকাল বৃষ্টির সম্ভাবনা আছে। স্প্রে কার্যক্রম স্থগিত রাখুন।',
};

// ─── Districts ────────────────────────────────────────────────────────────────
export const DISTRICTS = [
  'ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট',
  'রংপুর', 'ময়মনসিংহ', 'কুমিল্লা', 'বগুড়া', 'যশোর', 'নারায়ণগঞ্জ',
  'গাজীপুর', 'টাঙ্গাইল', 'পাবনা', 'দিনাজপুর', 'ফরিদপুর', 'সিরাজগঞ্জ',
];
