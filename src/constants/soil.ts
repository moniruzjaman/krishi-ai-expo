// Soil types and nutrient management data (SRDI guidelines)
export const SOIL_TYPES = [
  { name: 'এটেল মাটি',    nameEn: 'Clay Soil',    pH: '६.५–७.५', crops: ['ধান', 'পাট'],          pros: 'পুষ্টি ধরে রাখে',   cons: 'পানি নিষ্কাশন কম'   },
  { name: 'বেলে মাটি',    nameEn: 'Sandy Soil',   pH: '६.०–७.०', crops: ['আলু', 'গাজর'],         pros: 'দ্রুত গরম হয়',     cons: 'পুষ্টি ধরে না'      },
  { name: 'দোঁআশ মাটি',  nameEn: 'Loam Soil',    pH: '६.०–७.०', crops: ['সব ফসল'],               pros: 'সর্বোত্তম মাটি',   cons: 'কম পাওয়া যায়'     },
  { name: 'এঁটেল দোঁআশ', nameEn: 'Clay Loam',    pH: '६.५–७.५', crops: ['ধান', 'সবজি'],         pros: 'ভালো পুষ্টি ও পানি', cons: 'ভারী চাষ প্রয়োজন' },
] as const;

export const SOIL_NUTRIENTS = [
  { name: 'নাইট্রোজেন (N)', deficiency: 'পাতা হলুদ হয়, বৃদ্ধি কম',         remedy: 'ইউরিয়া সার ४५ কেজি/বিঘা'           },
  { name: 'ফসফরাস (P)',      deficiency: 'পাতা বেগুনি হয়, শিকড় দুর্বল',    remedy: 'টিএসপি বা ডিএপি १५ কেজি/বিঘা'       },
  { name: 'পটাশিয়াম (K)',   deficiency: 'পাতার কিনারা পুড়ে যায়',           remedy: 'মিউরেট অব পটাশ १० কেজি/বিঘা'       },
  { name: 'সালফার (S)',      deficiency: 'নতুন পাতা হলুদ',                    remedy: 'জিপসাম १२ কেজি/বিঘা'                },
  { name: 'জিঙ্ক (Zn)',      deficiency: 'পাতায় বাদামি ছোপ, ক্লোরোসিস',    remedy: 'জিঙ্ক সালফেট २ কেজি/বিঘা'          },
] as const;
