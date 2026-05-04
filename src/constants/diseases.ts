// Crop disease database with symptoms and treatment
export const CROP_DISEASES = [
  {
    crop: 'ধান', cropEn: 'Rice', icon: '🌾',
    diseases: [
      { name: 'ব্লাস্ট রোগ',    nameEn: 'Rice Blast',    pathogen: 'Magnaporthe oryzae',    symptoms: 'পাতায় ধূসর-সাদা বা বাদামি ক্ষত, ঘাড় ভেঙে পড়া',             treatment: 'ট্রাইসাইক্লাজল বা ইসপ্রোথিওলেন স্প্রে, রোগ প্রতিরোধী জাত ব্যবহার' },
      { name: 'খোল পচা',         nameEn: 'Sheath Blight', pathogen: 'Rhizoctonia solani',    symptoms: 'কাণ্ডের নিচের দিকে ডিম্বাকার দাগ, পচন',                       treatment: 'প্রোপিকোনাজল বা থিওফ্যানেট মিথাইল প্রয়োগ'                         },
      { name: 'বাদামি গাছ ফড়িং', nameEn: 'Brown Planthopper', pathogen: 'Nilaparvata lugens', symptoms: 'গাছের গোড়া হলুদ হয়ে মরা (হপার বার্ন)',                      treatment: 'ইমিডাক্লোপ্রিড বা বিউপ্রোফেজিন স্প্রে, ক्षेते पानी रखुँ'       },
    ],
  },
  {
    crop: 'টমেটো', cropEn: 'Tomato', icon: '🍅',
    diseases: [
      { name: 'আর্লি ব্লাইট', nameEn: 'Early Blight', pathogen: 'Alternaria solani',       symptoms: 'পাতায় গোলাকার বাদামি দাগ, হলুদ হলো',    treatment: 'ম্যানকোজেব বা ক্লোরোথ্যালোনিল स्प्रे'              },
      { name: 'লেট ব্লাইট',   nameEn: 'Late Blight',  pathogen: 'Phytophthora infestans', symptoms: 'পাতা কালো হয়ে পচে যায়, সাদা ছত্রাক দেখা যায়', treatment: 'মেটালক্সিল + ম्यानकोजेब, वर्षाको अगि रोकथाम' },
    ],
  },
  {
    crop: 'ভুট্রা', cropEn: 'Maize', icon: '🌽',
    diseases: [
      { name: 'ফল আর্মিওয়ার্ম', nameEn: 'Fall Armyworm', pathogen: 'Spodoptera frugiperda', symptoms: 'पातमा अनियमित छिद्र, लार्भको खोप देखिन्छ', treatment: 'स्पिनोसाड वा क्लोरपाइरिफस स्प्रे, ट्र्याप स्थापन' },
    ],
  },
  {
    crop: 'সরিষা', cropEn: 'Mustard', icon: '🌻',
    diseases: [
      { name: 'জাব পোকা',  nameEn: 'Aphid',            pathogen: 'Lipaphis erysimi',    symptoms: 'पात र फूलमा साना कीराको झुन्ड, गर्डिएको कमजोर', treatment: 'ইমিডাক्लোপ्रिड २०० SL, फूल आउने अगि प्रयोग' },
      { name: 'আলটারনেরিয়া', nameEn: 'Alternaria Blight', pathogen: 'Alternaria brassicae', symptoms: 'पातमा गाढा खैरो गोलाकार दाग',                treatment: 'म्यानकोजेब ८० WP, १५ दिन अन्तर २-३ पटक स्प्रे' },
    ],
  },
] as const;
