export const COUNTRIES = {
  tn: {
    name: { ar: 'تونس', fr: 'Tunisie', en: 'Tunisia' },
    flag: '🇹🇳',
    currency: { ar: 'د.ت', fr: 'DT', en: 'TND' },
    regions: [
      'تونس العاصمة','أريانة','بن عروس','منوبة',
      'نابل','زغوان','بنزرت','باجة','جندوبة','الكاف','سليانة',
      'القيروان','القصرين','سيدي بوزيد',
      'سوسة','المنستير','المهدية','صفاقس',
      'قفصة','توزر','قابس','مدنين','تطاوين','قبلي'
    ]
  },
  dz: {
    name: { ar: 'الجزائر', fr: 'Algérie', en: 'Algeria' },
    flag: '🇩🇿',
    currency: { ar: 'دج', fr: 'DA', en: 'DZD' },
    regions: [
      'أدرار','الشلف','الأغواط','أم البواقي','باتنة','بجاية','بسكرة','بشار',
      'البليدة','البويرة','تمنراست','تبسة','تلمسان','تيارت','تيزي وزو',
      'الجزائر العاصمة','الجلفة','جيجل','سطيف','سعيدة','سكيكدة',
      'سيدي بلعباس','عنابة','قالمة','قسنطينة','المدية','مستغانم',
      'المسيلة','معسكر','ورقلة','وهران','البيض','إليزي','برج بوعريريج',
      'بومرداس','الطارف','تندوف','تيسمسيلت','الوادي','خنشلة',
      'سوق أهراس','تيبازة','ميلة','عين الدفلى','النعامة','عين تموشنت',
      'غرداية','غليزان','تيميمون','برج باجي مختار','أولاد جلال',
      'بني عباس','إن صالح','إن قزام','تقرت','جانت','المغير','المنيعة'
    ]
  },
  ly: {
    name: { ar: 'ليبيا', fr: 'Libye', en: 'Libya' },
    flag: '🇱🇾',
    currency: { ar: 'د.ل', fr: 'LD', en: 'LYD' },
    regions: [
      'طرابلس','بنغازي','مصراتة','الزاوية','الجفارة','المرقب',
      'الجبل الغربي','غريان','نالوت','الزنتان',
      'الجبل الأخضر','البيضاء','درنة','المرج','البطنان','طبرق',
      'سرت','الجفرة','الواحات','الكفرة',
      'سبها','مرزق','وادي الحياة','وادي الشاطئ','غات',
      'أوباري','تراغن'
    ]
  }
}

export const ELECTRONICS_TYPES = {
  ar: [
    { key:'phone',    icon:'📱', label:'هاتف ذكي' },
    { key:'tablet',   icon:'📟', label:'جهاز لوحي' },
    { key:'laptop',   icon:'💻', label:'لاب توب' },
    { key:'desktop',  icon:'🖥️', label:'كمبيوتر مكتبي' },
    { key:'tv',       icon:'📺', label:'تلفزيون' },
    { key:'receiver', icon:'📡', label:'رسيفر' },
    { key:'camera',   icon:'📷', label:'كاميرا' },
    { key:'console',  icon:'🎮', label:'بلايستيشن / إكس بوكس' },
    { key:'audio',    icon:'🎧', label:'سماعات' },
    { key:'other',    icon:'🔌', label:'أخرى' },
  ],
  fr: [
    { key:'phone',    icon:'📱', label:'Smartphone' },
    { key:'tablet',   icon:'📟', label:'Tablette' },
    { key:'laptop',   icon:'💻', label:'Laptop' },
    { key:'desktop',  icon:'🖥️', label:'PC bureau' },
    { key:'tv',       icon:'📺', label:'Télévision' },
    { key:'receiver', icon:'📡', label:'Décodeur' },
    { key:'camera',   icon:'📷', label:'Appareil photo' },
    { key:'console',  icon:'🎮', label:'Console' },
    { key:'audio',    icon:'🎧', label:'Audio' },
    { key:'other',    icon:'🔌', label:'Autre' },
  ],
  en: [
    { key:'phone',    icon:'📱', label:'Smartphone' },
    { key:'tablet',   icon:'📟', label:'Tablet' },
    { key:'laptop',   icon:'💻', label:'Laptop' },
    { key:'desktop',  icon:'🖥️', label:'Desktop PC' },
    { key:'tv',       icon:'📺', label:'Television' },
    { key:'receiver', icon:'📡', label:'Receiver' },
    { key:'camera',   icon:'📷', label:'Camera' },
    { key:'console',  icon:'🎮', label:'Gaming Console' },
    { key:'audio',    icon:'🎧', label:'Audio' },
    { key:'other',    icon:'🔌', label:'Other' },
  ]
}