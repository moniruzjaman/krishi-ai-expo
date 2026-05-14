import { getOrFetchData } from './cache';

const OWM_BASE = 'https://api.open-meteo.com/v1/forecast';
const CACHE_KEY = 'weather_live';
const CACHE_TTL = 30;

// Dhaka default coords (used when location permission not granted)
const DEFAULT_LAT = 23.8103;
const DEFAULT_LNG = 90.4125;

interface OpenMeteoResponse {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

interface WmoInfo {
  en: string;
  bn: string;
  icon: string;
}

const WMO_MAP: Record<number, WmoInfo> = {
  0: { en: 'Clear Sky', bn: 'পরিষ্কার আকাশ', icon: '☀️' },
  1: { en: 'Mainly Clear', bn: 'প্রায় পরিষ্কার', icon: '🌤️' },
  2: { en: 'Partly Cloudy', bn: 'আংশিক মেঘলা', icon: '⛅' },
  3: { en: 'Overcast', bn: 'মেঘলা', icon: '☁️' },
  45: { en: 'Foggy', bn: 'কুয়াশা', icon: '🌫️' },
  48: { en: 'Depositing Rime Fog', bn: 'ঘন কুয়াশা', icon: '🌫️' },
  51: { en: 'Light Drizzle', bn: 'হালকা গুঁড়িগুঁড়ি', icon: '🌦️' },
  53: { en: 'Moderate Drizzle', bn: 'মাঝারি গুঁড়িগুঁড়ি', icon: '🌦️' },
  55: { en: 'Dense Drizzle', bn: 'ঘন গুঁড়িগুঁড়ি', icon: '🌧️' },
  61: { en: 'Slight Rain', bn: 'হালকা বৃষ্টি', icon: '🌦️' },
  63: { en: 'Moderate Rain', bn: 'মাঝারি বৃষ্টি', icon: '🌧️' },
  65: { en: 'Heavy Rain', bn: 'ভারী বৃষ্টি', icon: '🌧️' },
  71: { en: 'Slight Snow', bn: 'হালকা তুষার', icon: '🌨️' },
  73: { en: 'Moderate Snow', bn: 'মাঝারি তুষার', icon: '🌨️' },
  75: { en: 'Heavy Snow', bn: 'ভারী তুষার', icon: '❄️' },
  80: { en: 'Slight Rain Showers', bn: 'হালকা বৃষ্টিপাত', icon: '🌦️' },
  81: { en: 'Moderate Rain Showers', bn: 'মাঝারি বৃষ্টিপাত', icon: '🌧️' },
  82: { en: 'Violent Rain Showers', bn: 'প্রবল বৃষ্টিপাত', icon: '🌧️' },
  85: { en: 'Slight Snow Showers', bn: 'হালকা তুষারপাত', icon: '🌨️' },
  86: { en: 'Heavy Snow Showers', bn: 'ভারী তুষারপাত', icon: '❄️' },
  95: { en: 'Thunderstorm', bn: 'বজ্রপাত সহ বৃষ্টি', icon: '⛈️' },
  96: { en: 'Thunderstorm with Slight Hail', bn: 'বজ্রপাত ও হালকা শিলা', icon: '⛈️' },
  99: { en: 'Thunderstorm with Heavy Hail', bn: 'বজ্রপাত ও ভারী শিলা', icon: '⛈️' },
};

function wmoInfo(code: number): WmoInfo {
  return WMO_MAP[code] ?? { en: 'Unknown', bn: 'অজানা', icon: '❓' };
}

const DAY_NAMES_BN = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি'];
const DAY_NAMES_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function dayLabel(dateStr: string, index: number): { bn: string; en: string } {
  if (index === 0) return { bn: 'আজ', en: 'Today' };
  if (index === 1) return { bn: 'কাল', en: 'Tomorrow' };
  const d = new Date(dateStr + 'T12:00:00');
  return { bn: DAY_NAMES_BN[d.getDay()], en: DAY_NAMES_EN[d.getDay()] };
}

export interface LiveWeatherData {
  location: string;
  temp: number;
  humidity: number;
  wind: number;
  condition: string;
  conditionEn: string;
  icon: string;
  forecast: { day: string; icon: string; high: number; low: number }[];
  advisory: string;
}

export async function fetchWeather(
  lat: number = DEFAULT_LAT,
  lng: number = DEFAULT_LNG,
): Promise<LiveWeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    timezone: 'auto',
    forecast_days: '5',
  });

  const res = await fetch(`${OWM_BASE}?${params}`);
  const data: OpenMeteoResponse = await res.json();

  const now = wmoInfo(data.current.weather_code);

  const forecast = data.daily.time.map((date, i) => {
    const wmo = wmoInfo(data.daily.weather_code[i]);
    const day = dayLabel(date, i);
    return {
      day: day.bn,
      icon: wmo.icon,
      high: Math.round(data.daily.temperature_2m_max[i]),
      low: Math.round(data.daily.temperature_2m_min[i]),
    };
  });

  const advisory = generateAdvisory(data);

  return {
    location: 'ঢাকা, বাংলাদেশ',
    temp: Math.round(data.current.temperature_2m),
    humidity: data.current.relative_humidity_2m,
    wind: Math.round(data.current.wind_speed_10m),
    condition: now.bn,
    conditionEn: now.en,
    icon: now.icon,
    forecast,
    advisory,
  };
}

function generateAdvisory(data: OpenMeteoResponse): string {
  const todayCode = data.daily.weather_code[0];
  const todayMax = data.daily.temperature_2m_max[0];

  const parts: string[] = [];

  if (todayCode >= 80 && todayCode <= 82) {
    parts.push('আজ বৃষ্টিপাতের সম্ভাবনা রয়েছে। স্প্রে কার্যক্রম স্থগিত রাখুন।');
  } else if (todayCode >= 95) {
    parts.push('আজ বজ্রপাত সহ বৃষ্টির সম্ভাবনা। নিরাপদ স্থানে থাকুন এবং মাঠকর্ম এড়িয়ে চলুন।');
  } else if (todayCode >= 61 && todayCode <= 65) {
    parts.push('আজ বৃষ্টির সম্ভাবনা রয়েছে। সেচ স্থগিত রাখুন।');
  }

  if (todayMax > 35) {
    parts.push('তাপমাত্রা বেশি, ফসলে পানি দিতে ভুলবেন না।');
  } else if (todayMax < 20) {
    parts.push('তাপমাত্রা কম, চারা রোপণে সতর্কতা অবলম্বন করুন।');
  }

  if (parts.length === 0) {
    parts.push('আজকের আবহাওয়া কৃষি কাজের জন্য অনুকূল।');
  }

  return parts.join(' ');
}

export async function getWeather(
  lat?: number,
  lng?: number,
): Promise<LiveWeatherData> {
  const key = `weather_${lat ?? DEFAULT_LAT}_${lng ?? DEFAULT_LNG}`;
  return getOrFetchData(key, () => fetchWeather(lat, lng), CACHE_TTL);
}

export { DEFAULT_LAT, DEFAULT_LNG };
