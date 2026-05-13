import { getOrFetchData } from './cache';
import type { MarketPrice } from '../types';

const DAM_URL = 'https://market.dam.gov.bd/market_daily_price_report?L=E';
const CACHE_KEY = 'market_prices_dam';
const CACHE_TTL = 30;

interface DamCommodity {
  nameEn: string;
  minPrice: number;
  maxPrice: number;
  trend: 'up' | 'down' | 'stable';
}

const COMMODITY_MAP: Record<string, { bn: string; unit: string }> = {
  'Aman-Fine': { bn: 'চাল (আমন-সরু)', unit: 'কেজি' },
  'Aman-Medium': { bn: 'চাল (আমন-মাঝারি)', unit: 'কেজি' },
  'Aman-Coarse': { bn: 'চাল (আমন-মোটা)', unit: 'কেজি' },
  'Boro-Fine': { bn: 'চাল (বোরো-সরু)', unit: 'কেজি' },
  'Boro-Medium': { bn: 'চাল (বোরো-মাঝারি)', unit: 'কেজি' },
  'Boro-Coarse': { bn: 'চাল (বোরো-মোটা)', unit: 'কেজি' },
  'Ata (packet)': { bn: 'আটা (প্যাকেট)', unit: 'কেজি' },
  'Farm-raised Hen': { bn: 'খামারের মুরগী', unit: 'কেজি' },
  'Beef': { bn: 'গরুর মাংস', unit: 'কেজি' },
  'Egg Farm-Red': { bn: 'ডিম (ফার্ম)', unit: '১২টি' },
  'Sugar (Local)': { bn: 'চিনি (দেশী)', unit: 'কেজি' },
  'Iodized Salt (Packed)': { bn: 'লবণ (প্যাকেট)', unit: 'কেজি' },
  'Mung': { bn: 'মুগ ডাল', unit: 'কেজি' },
  'Gram-Whole': { bn: 'ছোলা', unit: 'কেজি' },
  'Soybean': { bn: 'সয়াবিন তেল', unit: 'লিটার' },
  'Onion-local': { bn: 'পেঁয়াজ (দেশি)', unit: 'কেজি' },
  'Garlic-local': { bn: 'রসুন (দেশি)', unit: 'কেজি' },
  'Garlic-Imported': { bn: 'রসুন (আমদানি)', unit: 'কেজি' },
  'Green Chili': { bn: 'কাঁচামরিচ', unit: 'কেজি' },
  'Ginger-local': { bn: 'আদা (দেশি)', unit: 'কেজি' },
  'Ginger-Imported': { bn: 'আদা (আমদানি)', unit: 'কেজি' },
  'Mutton': { bn: 'খাসির মাংস', unit: 'কেজি' },
};

function parseDamHtml(html: string): DamCommodity[] {
  const results: DamCommodity[] = [];
  const regex = /<span class="stockbox">.*?<a[^>]*>([^<]+)<\/a>:\s*(?:&nbsp;)?\s*([\d.]+)\s*-\s*([\d.]+)\s*<span[^>]*>([^<]*)<\/span>[^<]*<\/span>/gs;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const nameEn = match[1].trim();
    const minPrice = parseFloat(match[2]);
    const maxPrice = parseFloat(match[3]);
    const arrow = match[4];
    const trend: 'up' | 'down' | 'stable' =
      /▲|&#x25B2[;]?/.test(arrow) ? 'up' :
      /▼|&#x25BC[;]?/.test(arrow) ? 'down' :
      'stable';

    if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice > 0) {
      results.push({ nameEn, minPrice, maxPrice, trend });
    }
  }

  return results;
}

function toMarketPrices(items: DamCommodity[]): MarketPrice[] {
  return items.map((item) => {
    const meta = COMMODITY_MAP[item.nameEn];
    return {
      commodity: meta?.bn ?? item.nameEn,
      unit: meta?.unit ?? 'কেজি',
      wholesale_price: Math.round(item.minPrice),
      retail_price: Math.round(item.maxPrice),
      trend: item.trend,
      change_percent: 0,
      location: 'জাতীয় (সর্বশেষ)',
      last_updated: new Date().toISOString(),
    };
  });
}

export async function fetchMarketPrices(): Promise<MarketPrice[]> {
  const response = await fetch(DAM_URL, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  const html = await response.text();
  const items = parseDamHtml(html);
  if (items.length === 0) throw new Error('No commodities found in DAM response');
  return toMarketPrices(items);
}

export async function getMarketPrices(): Promise<MarketPrice[]> {
  return getOrFetchData(CACHE_KEY, fetchMarketPrices, CACHE_TTL);
}

export { DAM_URL, COMMODITY_MAP };
