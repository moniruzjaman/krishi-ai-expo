// Agricultural tools and features metadata
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
] as const;
