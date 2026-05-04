/**
 * Shared TypeScript interfaces for type-safe API responses and data models
 */

// ─── User & Authentication ────────────────────────────────────────────────────
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'farmer' | 'extension_officer' | 'researcher';
  location?: {
    district: string;
    upazila?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  preferences?: {
    language: 'bn' | 'en';
    notifications_enabled: boolean;
    theme: 'light' | 'dark';
  };
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: UserProfile;
  session: {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };
}

// ─── Market Data ──────────────────────────────────────────────────────────────
export interface MarketPrice {
  commodity: string;
  unit: string;
  wholesale_price: number;
  retail_price: number;
  trend: 'up' | 'down' | 'stable';
  change_percent: number;
  location?: string;
  last_updated: string;
}

export interface MarketDataResponse {
  data: MarketPrice[];
  timestamp: string;
  source: string;
}

// ─── Weather Data ─────────────────────────────────────────────────────────────
export interface WeatherForecast {
  day: string;
  condition: string;
  temperature_high: number;
  temperature_low: number;
  humidity_percent: number;
  wind_speed: number;
  precipitation_mm?: number;
  advisory?: string;
  icon: string;
}

export interface WeatherData {
  location: {
    district: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  current: {
    temperature: number;
    condition: string;
    humidity_percent: number;
    wind_speed: number;
    last_updated: string;
  };
  forecast: WeatherForecast[];
}

// ─── AI Analysis (Gemini) ─────────────────────────────────────────────────────
export interface CropAnalysisRequest {
  image: string; // Base64 or image path
  crop_type?: string;
  region?: string;
}

export interface CropAnalysisResponse {
  detected_disease?: {
    name: string;
    confidence: number;
    symptoms: string[];
    treatment: string;
    prevention: string;
    severity: 'mild' | 'moderate' | 'severe';
  };
  crop_health_score: number; // 0-100
  recommendations: string[];
  message?: string;
  timestamp: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ChatResponse {
  message: string;
  sources?: string[];
  confidence?: number;
}

// ─── Crop & Farming Data ──────────────────────────────────────────────────────
export interface CropData {
  id: string;
  name: string;
  season: 'rabi' | 'kharif1' | 'kharif2';
  sowing_date?: string;
  expected_harvest_date?: string;
  area_hectares?: number;
  soil_type?: string;
  irrigation_type?: string;
}

export interface PestData {
  id: string;
  name: string;
  crop: string;
  symptoms: string[];
  recommended_pesticide: {
    name: string;
    dosage: string;
    frequency: string;
    safety_precautions: string[];
  };
}

export interface DiseaseData {
  id: string;
  name: string;
  crop: string;
  pathogen?: string;
  symptoms: string[];
  treatment: string[];
  prevention: string[];
}

// ─── Soil Data ────────────────────────────────────────────────────────────────
export interface SoilAnalysis {
  soil_type: string;
  ph_level: number;
  nutrient_status: {
    nitrogen: 'low' | 'medium' | 'high';
    phosphorus: 'low' | 'medium' | 'high';
    potassium: 'low' | 'medium' | 'high';
  };
  recommendations: string[];
  fertilizer_suggestions?: {
    type: string;
    quantity: number;
    unit: string;
  }[];
}

// ─── Yield Prediction ─────────────────────────────────────────────────────────
export interface YieldPredictionInput {
  crop: string;
  area_hectares: number;
  soil_type: string;
  rainfall_mm?: number;
  temperature_avg?: number;
  variety?: string;
}

export interface YieldPredictionResponse {
  predicted_yield: number;
  unit: string;
  confidence_interval: {
    lower: number;
    upper: number;
  };
  assumptions: string[];
  factors: {
    name: string;
    impact: 'positive' | 'negative' | 'neutral';
    weight: number;
  }[];
}

// ─── Learning & Education ─────────────────────────────────────────────────────
export interface LearningModule {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes: number;
  content_url?: string;
  video_url?: string;
  resources?: string[];
  xp_reward: number;
  completion_status?: 'not_started' | 'in_progress' | 'completed';
}

export interface UserProgress {
  module_id: string;
  progress_percent: number;
  xp_earned: number;
  completed_at?: string;
}

// ─── API Error Response ────────────────────────────────────────────────────────
export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: APIError;
  meta?: {
    page?: number;
    per_page?: number;
    total?: number;
  };
}

// ─── Utility Types ────────────────────────────────────────────────────────────
export type Language = 'bn' | 'en';

export interface LocalizedString {
  bn: string;
  en: string;
}

export interface Pagination {
  page: number;
  per_page: number;
  total: number;
}

export interface CacheConfig {
  ttl_minutes: number;
  enabled: boolean;
}
