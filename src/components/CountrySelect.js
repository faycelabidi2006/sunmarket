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
  },
  dz: {
    flag: 'https://flagcdn.com/w80/dz.png',
    dial: '+213',
    name: { ar: 'الجزائر', fr: 'Algérie', en: 'Algeria' },
    desc: { ar: 'الجمهورية الجزائرية', fr: 'République Algérienne', en: 'Algerian Republic' },
    currency: { ar: 'د.ج', fr: 'DA', en: 'DZD' },
    regions: ['الجزائر العاصمة','وهران','قسنطينة','عنابة','سطيف','تيزي وزو','البليدة','بجاية','بسكرة','تلمسان','باتنة','جيجل','المسيلة','سكيكدة','الشلف','مستغانم','تبسة','عين الدفلى','خنشلة','برج بوعريريج','بومرداس','أدرار','غليزان','تيارت','ميلة','عين تموشنت','معسكر','سوق أهراس','المدية','الأغواط','الجلفة','غرداية','بشار','ورقلة'],
  },
  ly: {
    flag: 'https://flagcdn.com/w80/ly.png',
    dial: '+218',
    name: { ar: 'ليبيا', fr: 'Libye', en: 'Libya' },
    desc: { ar: 'دولة ليبيا', fr: 'État de Libye', en: 'State of Libya' },
    currency: { ar: 'د.ل', fr: 'LD', en: 'LYD' },
    regions: ['طرابلس','بنغازي','مصراتة','الزاوية','البيضاء','زليتن','سبها','درنة','أجدابيا','ترهونة','طبرق','غريان','الخمس','نالوت','غدامس','يفرن'],
  },
  ma: {
    flag: 'https://flagcdn.com/w80/ma.png',
    dial: '+212',
    name: { ar: 'المغرب', fr: 'Maroc', en: 'Morocco' },
    desc: { ar: 'المملكة المغربية', fr: 'Royaume du Maroc', en: 'Kingdom of Morocco' },
    currency: { ar: 'د.م', fr: 'MAD', en: 'MAD' },
    regions: ['الدار البيضاء','الرباط','مراكش','فاس','طنجة','أكادير','مكناس','وجدة','القنيطرة','تطوان','سلا','خريبكة','بني ملال','الجديدة','تازة','الحسيمة','ورزازات','الناظور'],
  },
}

const UI = {
  ar: { choose: 'اختر بلدك لتخصيص تجربتك', footer: 'يمكنك تغيير البلد لاحقاً من الإعدادات', regions: 'منطقة', currency: 'العملة' },
  fr: { choose: 'Choisissez votre pays', footer: 'Vous pouvez changer de pays dans les paramètres', regions: 'régions', currency: 'Devise' },
  en: { choose: 'Choose your country', footer: 'You can change your country in settings', regions: 'regions', currency: 'Currency' },
}

export default function CountrySelect({ isModal = false, onClose }) {
  const { lang, setLang, setCountry } = useApp()
  const ui  = UI[lang] || UI.ar
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  // setCountry يستقبل 'tn' | 'dz' | 'ly' | 'ma' مباشرة
  const handleSelect = (code) => {
  setCountry(code)
  if (onClose) onClose()
  else window.location.replace('/')
}

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: isModal ? 'rgba(0,0,0,0.75)' : '#f8f9fa',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px', overflowY: 'auto',
    }}>
      <div style={{
        width: '100%', maxWidth: 480, textAlign: 'center', direction: dir,
        background: 'white', borderRadius: 24, border: '1px solid #eee',
        padding: '32px 24px', boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
        margin: 'auto',
      }}>

        {/* ── Logo ── */}
        <div style={{ marginBottom: 24 }}>
          <img
            src="/logo.jpeg"
            alt="Sun Market"
            style={{ width: 96, height: 96, objectFit: 'contain', borderRadius: 20, display: 'block', margin: '0 auto 12px' }}
            onError={e => { e.target.style.display = 'none' }}
          />
          <div style={{ fontSize: 22, fontWeight: 900, color: '#1a1a2e', letterSpacing: 1 }}>SUN MARKET</div>
          <div style={{ fontSize: 10, color: '#aaa', letterSpacing: 2, marginTop: 3, textTransform: 'uppercase' }}>Your Smart Destination</div>
        </div>

        {/* ── Language ── */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 24 }}>
          {['ar', 'fr', 'en'].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              background: lang === l ? '#E8192C' : '#f3f4f6',
              color: lang === l ? 'white' : '#6b7280',
              border: 'none', borderRadius: 8, padding: '6px 14px',
              fontSize: 12, cursor: 'pointer', fontWeight: lang === l ? 700 : 400,
              fontFamily: 'inherit', transition: 'all 0.2s',
            }}>
              {l === 'ar' ? '🇸🇦 العربية' : l === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}
            </button>
          ))}
        </div>

        {/* ── Subtitle ── */}
        <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 20, fontWeight: 500 }}>
          {ui.choose}
        </div>

        {/* ── Country cards ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Object.entries(COUNTRIES_DATA).map(([code, c]) => (
            <div
              key={code}
              onClick={() => handleSelect(code)}
              style={{
                background: 'white', border: '1.5px solid #eee', borderRadius: 14,
                padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14,
                cursor: 'pointer', transition: 'all 0.2s', direction: dir,
                textAlign: lang === 'ar' ? 'right' : 'left',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#FFF0F1'
                e.currentTarget.style.borderColor = '#E8192C'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(232,25,44,0.12)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'white'
                e.currentTarget.style.borderColor = '#eee'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'
              }}
            >
              {/* Flag */}
              <img
                src={c.flag}
                alt={c.name[lang]}
                style={{ width: 52, height: 36, borderRadius: 6, objectFit: 'cover', border: '1px solid #e5e7eb', flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
              />

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#111827', marginBottom: 2 }}>
                  {c.name[lang]}
                </div>
                <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 6 }}>
                  {c.desc[lang]}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ background: '#FFF0F1', color: '#E8192C', border: '1px solid #fca5a5', borderRadius: 20, padding: '2px 9px', fontSize: 11, fontWeight: 700 }}>
                    📞 {c.dial}
                  </span>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>
                    {c.regions.length} {ui.regions}
                  </span>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>
                    {c.currency[lang]}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#FFF0F1', border: '1.5px solid #fca5a5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, color: '#E8192C', flexShrink: 0, fontWeight: 700,
              }}>
                {lang === 'ar' ? '←' : '→'}
              </div>
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <div style={{ fontSize: 11, color: '#d1d5db', marginTop: 22 }}>
          {ui.footer}
        </div>
      </div>
    </div>
  )
}