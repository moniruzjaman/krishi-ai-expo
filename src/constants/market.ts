// Real-time market data for commodities in Bangladesh
export const MARKET_DATA = [
  { name: 'চাল (সরু)',        unit: 'কেজি',  wholesale: 70,  retail: 78,  trend: 'up',     change: '+२%'  },
  { name: 'আলু (ডায়মন্ড)', unit: 'কেজি',  wholesale: 40,  retail: 50,  trend: 'down',   change: '-५%'  },
  { name: 'পেঁয়াজ (দেশি)',  unit: 'কেজি',  wholesale: 90,  retail: 110, trend: 'up',     change: '+१२%' },
  { name: 'কাঁচামরিচ',      unit: 'কেজি',  wholesale: 130, retail: 170, trend: 'up',     change: '+१५%' },
  { name: 'মসুর ডাল',       unit: 'কেজি',  wholesale: 133, retail: 148, trend: 'stable', change: '०%'   },
  { name: 'সয়াবিন তেল',    unit: 'লিটার', wholesale: 158, retail: 166, trend: 'down',   change: '-१%'  },
  { name: 'টমেটো',          unit: 'কেজি',  wholesale: 65,  retail: 85,  trend: 'down',   change: '-१०%' },
  { name: 'রসুন (দেশি)',    unit: 'কেজি',  wholesale: 190, retail: 230, trend: 'up',     change: '+८%'  },
  { name: 'ডিম (ফার্ম)',    unit: '१२ টি', wholesale: 135, retail: 150, trend: 'up',     change: '+३%'  },
  { name: 'গরুর মাংস',      unit: 'কেজি',  wholesale: 710, retail: 760, trend: 'stable', change: '०%'   },
] as const;
