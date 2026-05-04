// Pesticide and pest management data (DAE approved)
export const PESTICIDE_DATA = [
  { pest: 'মাজরা পোকা (ধান)',   pestEn: 'Yellow Stem Borer', chemical: 'কার্বোসালফান २५ EC',     dose: '१ লিটার/বিঘা',           timing: 'কুশি থেকে থোড় অবস্থা', safety: 'PPE পরিধান করুন, ७ দিন পর সেচ দিন'                    },
  { pest: 'জাব পোকা (সরিষা)',   pestEn: 'Aphid (Mustard)',   chemical: 'ইমিডাক্লোপ্রিড २०० SL', dose: '०.५ মিলি/লিটার পানি',    timing: 'আক্রমণের শুরুতে',       safety: 'ফুল আসার আগে প্রয়োগ করুন, মৌমাছি রক্ষা করুন'           },
  { pest: 'সাদা মাছি (টমেটো)', pestEn: 'Whitefly (Tomato)', chemical: 'অ্যাসিটামিপ্রিড २० SP', dose: '१ গ্রাম/লিটার পানি',     timing: 'লার্ভা দেখার সাথে সাথে', safety: 'বিকেলে স্প্রে করুন, ३ দিন অন্তর २ বার'                  },
  { pest: 'ফল ছিদ্রকারী পোকা', pestEn: 'Fruit Borer',       chemical: 'স্পিনোসাড ४५ SC',        dose: '०.३ মিলি/লিটার পানি',    timing: 'ডিম পাড়ার আগে',        safety: 'ফল সংগ্রহের ३ দিন আগে বন্ধ করুন'                         },
  { pest: 'বাদামি গাছ ফড়িং',   pestEn: 'Brown Planthopper', chemical: 'বিউপ্রোফেজিন २५ SC',     dose: '१.५ মিলি/লিটার পানি',    timing: 'কুশি পর্যায়ে',          safety: 'ক্ষেতে পানি রেখে স্প্রে করুন'                            },
] as const;
