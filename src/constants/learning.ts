// Agricultural learning modules and courses
export const LEARNING_MODULES = [
  { id: 1, title: 'ধানের সমন্বিত বালাই ব্যবস্থাপনা', titleEn: 'IPM for Rice',              level: 'প্রাথমিক',   levelColor: '#10b981', duration: '३० मिनेट', icon: '🌾', xp: 100 },
  { id: 2, title: 'মাটি পরীক्षা ও সার ব्यबস्थापना',  titleEn: 'Soil Testing & Fertilizer', level: 'मध्यबर्ती',  levelColor: '#3b82f6', duration: '४५ मिनेट', icon: '🔬', xp: 150 },
  { id: 3, title: 'कृषि आबतपको व फसल पिरीक्लना',   titleEn: 'Agro-meteorology',          level: 'प्राथमिक',   levelColor: '#10b981', duration: '२० मिनेट', icon: '⛅', xp: 80  },
  { id: 4, title: 'जैव कृषि पद्धति',                  titleEn: 'Organic Farming',           level: 'उन्नत',      levelColor: '#8b5cf6', duration: '६० मिनेट', icon: '🌿', xp: 200 },
  { id: 5, title: 'ड्रिप सेचन पद्धति',                 titleEn: 'Drip Irrigation',           level: 'मध्यबर्ती',  levelColor: '#3b82f6', duration: '३५ मिनेट', icon: '💧', xp: 120 },
  { id: 6, title: 'CABI रोग निर्णय प्रशिक्षण',      titleEn: 'CABI Diagnosis Training',   level: 'पेशेदार',    levelColor: '#ef4444', duration: '९० मिनेट', icon: '🔭', xp: 300 },
] as const;

// Weather data (static for demo)
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
    { day: 'कαल',  icon: '🌧️', high: 27, low: 22 },
    { day: 'परशु', icon: '☀️',  high: 32, low: 25 },
    { day: 'शनি',  icon: '🌤️', high: 31, low: 24 },
    { day: 'रबि',  icon: '☀️',  high: 33, low: 26 },
  ],
  advisory: 'আগামীকাল বৃষ्टির सम्भावना छ। स्प्रे कार्यक्रम स्थगित राखिहाल।',
} as const;
