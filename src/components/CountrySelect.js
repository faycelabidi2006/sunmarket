'use client'
import { useApp } from '@/context/AppContext'

const COUNTRIES_DATA = {
  tn: {
    flag: 'https://flagcdn.com/w80/tn.png',
    dial: '+216',
    name: { ar: 'تونس', fr: 'Tunisie', en: 'Tunisia' },
    desc: { ar: 'الجمهورية التونسية', fr: 'République Tunisienne', en: 'Tunisian Republic' },
    currency: { ar: 'د.ت', fr: 'DT', en: 'TND' },
    regions: ['تونس العاصمة','صفاقس','سوسة','القيروان','بنزرت','قابس','أريانة','بجة','جندوبة','الكاف','سليانة','نابل','زغوان','سيدي بوزيد','قفصة','توزر','قبلي','مدنين','تطاوين','منوبة','المهدية','المنستير'],
    bg: 'linear-gradient(135deg,#e63946,#c1121f)',
  },
  dz: {
    flag: 'https://flagcdn.com/w80/dz.png',
    dial: '+213',
    name: { ar: 'الجزائر', fr: 'Algérie', en: 'Algeria' },
    desc: { ar: 'الجمهورية الجزائرية', fr: 'République Algérienne', en: 'Algerian Republic' },
    currency: { ar: 'د.ج', fr: 'DA', en: 'DZD' },
    regions: ['الجزائر العاصمة','وهران','قسنطينة','عنابة','سطيف','تيزي وزو','البليدة','بجاية','بسكرة','تلمسان','باتنة','جيجل','المسيلة','سكيكدة','الشلف','مستغانم','تبسة','عين الدفلى','خنشلة','برج بوعريريج','بومرداس','أدرار','غليزان','تيارت','ميلة','عين تموشنت','معسكر','سوق أهراس','المدية','الأغواط','الجلفة','غرداية','بشار','ورقلة'],
    bg: 'linear-gradient(135deg,#2d6a4f,#1b4332)',
  },
  ly: {
    flag: 'https://flagcdn.com/w80/ly.png',
    dial: '+218',
    name: { ar: 'ليبيا', fr: 'Libye', en: 'Libya' },
    desc: { ar: 'دولة ليبيا', fr: 'État de Libye', en: 'State of Libya' },
    currency: { ar: 'د.ل', fr: 'LD', en: 'LYD' },
    regions: ['طرابلس','بنغازي','مصراتة','الزاوية','البيضاء','زليتن','سبها','درنة','أجدابيا','ترهونة','طبرق','غريان','الخمس','نالوت','غدامس','يفرن'],
    bg: 'linear-gradient(135deg,#1d3557,#0d1b2a)',
  },
  ma: {
    flag: 'https://flagcdn.com/w80/ma.png',
    dial: '+212',
    name: { ar: 'المغرب', fr: 'Maroc', en: 'Morocco' },
    desc: { ar: 'المملكة المغربية', fr: 'Royaume du Maroc', en: 'Kingdom of Morocco' },
    currency: { ar: 'د.م', fr: 'MAD', en: 'MAD' },
    regions: ['الدار البيضاء','الرباط','مراكش','فاس','طنجة','أكادير','مكناس','وجدة','القنيطرة','تطوان','سلا','خريبكة','بني ملال','الجديدة','تازة','الحسيمة','ورزازات','الناظور'],
    bg: 'linear-gradient(135deg,#c9184a,#a4133c)',
  },
}

const UI = {
  ar: { choose: 'اختر بلدك', footer: 'يمكنك تغيير البلد لاحقاً من القائمة', regions: 'منطقة' },
  fr: { choose: 'Choisissez votre pays', footer: 'Vous pouvez changer de pays depuis le menu', regions: 'régions' },
  en: { choose: 'Choose your country', footer: 'You can change your country from the menu', regions: 'regions' },
}

export default function CountrySelect({ isModal = false, onClose }) {
  const { lang, setLang, setCountry, country } = useApp()
  const ui  = UI[lang] || UI.ar
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  const handleSelect = (code) => {
    setCountry(code)
    if (onClose) onClose()
  }

  const entries = Object.entries(COUNTRIES_DATA)
  // يظهر زر الإغلاق فقط إذا كان هناك بلد محدد مسبقاً (أي مش أول مرة)
  const canClose = isModal || !!country

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: '#0f172a',
      display: 'flex', flexDirection: 'column',
      direction: dir,
    }}>

      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(135deg,#E8192C,#c0392b)',
        padding: '14px 16px 12px',
        flexShrink: 0,
      }}>
        {/* صف اللوجو مع زر الإغلاق */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>

          {/* زر إغلاق — فقط إذا ممكن الإغلاق */}
          {canClose ? (
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
              width: 34, height: 34, color: 'white', fontSize: 18, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>✕</button>
          ) : <div style={{ width: 34 }} />}

          {/* لوجو + اسم */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img
              src="/logo.jpeg"
              alt="سوقنا المغاربي"
              style={{ width: 38, height: 38, objectFit: 'contain', borderRadius: 8 }}
              onError={e => { e.target.style.display = 'none' }}
            />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: 'white' }}>سوقنا المغاربي</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', letterSpacing: 1 }}>وجهتك الذكية</div>
            </div>
          </div>

          {/* فراغ للتوازن */}
          <div style={{ width: 34 }} />
        </div>

        {/* اختيار اللغة */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
          {['ar', 'fr', 'en'].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              background: lang === l ? 'white' : 'rgba(255,255,255,0.2)',
              color: lang === l ? '#E8192C' : 'white',
              border: 'none', borderRadius: 8, padding: '5px 12px',
              fontSize: 11, cursor: 'pointer', fontWeight: lang === l ? 700 : 400,
              fontFamily: 'inherit', transition: 'all 0.2s',
            }}>
              {l === 'ar' ? '🇸🇦 ع' : l === 'fr' ? '🇫🇷 Fr' : '🇬🇧 En'}
            </button>
          ))}
        </div>
      </div>

      {/* ── عنوان ── */}
      <div style={{
        textAlign: 'center', padding: '10px 16px 6px',
        fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500, flexShrink: 0,
      }}>
        {ui.choose}
      </div>

      {/* ── شبكة 2×2 تملأ الشاشة بدون scroll ── */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: 10,
        padding: '0 12px 10px',
        minHeight: 0,
      }}>
        {entries.map(([code, c]) => (
          <div
            key={code}
            onClick={() => handleSelect(code)}
            style={{
              background: c.bg,
              borderRadius: 18,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.15s',
              // إبراز البلد المحدد حالياً
              boxShadow: country === code
                ? '0 0 0 3px white, 0 6px 20px rgba(0,0,0,0.5)'
                : '0 4px 16px rgba(0,0,0,0.3)',
            }}
            onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.96)' }}
            onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
          >
            {/* طبقة تعتيم */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)', borderRadius: 18 }} />

            {/* علامة ✓ للبلد الحالي */}
            {country === code && (
              <div style={{
                position: 'absolute', top: 10, right: 10, zIndex: 2,
                background: 'white', borderRadius: '50%',
                width: 22, height: 22,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, color: '#E8192C', fontWeight: 900,
              }}>✓</div>
            )}

            {/* العلم */}
            <img
              src={c.flag}
              alt={c.name[lang]}
              style={{
                width: 68, height: 46,
                borderRadius: 8, objectFit: 'cover',
                border: '2px solid rgba(255,255,255,0.4)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                zIndex: 1,
              }}
            />

            {/* الاسم */}
            <div style={{ textAlign: 'center', zIndex: 1, padding: '0 6px' }}>
              <div style={{ fontSize: 17, fontWeight: 900, color: 'white', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                {c.name[lang]}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 1 }}>
                {c.desc[lang]}
              </div>
            </div>

            {/* الهاتف + العملة */}
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center', zIndex: 1 }}>
              <span style={{ background: 'rgba(255,255,255,0.22)', color: 'white', borderRadius: 20, padding: '2px 8px', fontSize: 10, fontWeight: 700 }}>
                📞 {c.dial}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.22)', color: 'white', borderRadius: 20, padding: '2px 8px', fontSize: 10, fontWeight: 700 }}>
                {c.currency[lang]}
              </span>
            </div>

            {/* عدد المناطق */}
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', zIndex: 1 }}>
              {c.regions.length} {ui.regions}
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div style={{ textAlign: 'center', padding: '8px 16px 16px', fontSize: 10, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
        {ui.footer}
      </div>
    </div>
  )
}