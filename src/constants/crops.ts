// Crop categories and seasonal information
export const CROP_CATEGORIES = [
  { id: 'cereals',    label: 'দানা ফসল',   labelEn: 'Cereals',    icon: '🌾', crops: ['ধান', 'গম', 'ভুট্রা', 'বার্লি'] },
  { id: 'vegetables', label: 'সবজি ফসল',  labelEn: 'Vegetables', icon: '🥦', crops: ['টমেটো', 'বেগুন', 'করলা', 'ঢেঁড়শ'] },
  { id: 'fruits',     label: 'ফল',         labelEn: 'Fruits',     icon: '🍎', crops: ['আম', 'কলা', 'পেঁপে', 'লিচু'] },
  { id: 'pulses',     label: 'ডাল ফসল',   labelEn: 'Pulses',     icon: '🍲', crops: ['মসুর', 'ছোলা', 'মুগ', 'মাসকলাই'] },
  { id: 'oilseeds',   label: 'তৈলবীজ',    labelEn: 'Oilseeds',   icon: '🌻', crops: ['সরিষা', 'সয়াবীন', 'চীনাবাদাম'] },
  { id: 'spices',     label: 'মসলা',       labelEn: 'Spices',     icon: '🌶️', crops: ['পেঁয়াজ', 'রসুন', 'হলুদ', 'আদা'] },
] as const;

export const SEASONS = [
  { id: 'rabi',    name: 'রবি',    nameEn: 'Rabi (Winter)',   color: '#1e88e5', months: 'নভেম্বর – মার্চ', crops: ['বোরো ধান', 'গম', 'আলু', 'সরিষা', 'শীতকালীন সবজি'], icon: '❄️' },
  { id: 'kharif1', name: 'খরিফ-१', nameEn: 'Kharif-I (Summer)', color: '#e65100', months: 'এপ্রিল – জুলাই', crops: ['আউশ ধান', 'পাট', 'ভুট্টা', 'তিল'],            icon: '☀️' },
  { id: 'kharif2', name: 'খরিফ-२', nameEn: 'Kharif-II (Monsoon)', color: '#2e7d32', months: 'আগস্ট – অক্টোবর', crops: ['আমন ধান', 'বর্ষাকালীন সবজি'],           icon: '🌧️' },
] as const;
