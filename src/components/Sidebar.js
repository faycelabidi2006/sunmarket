'use client'
import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { supabase } from '@/lib/supabaseClient'

const CATEGORIES = [
  { key: 'car',         icon: '🚗', ar: 'سيارات للبيع',  fr: 'Voitures',     en: 'Cars' },
  { key: 'rent',        icon: '🔑', ar: 'تأجير سيارات',  fr: 'Location Auto', en: 'Car Rental' },
  { key: 'real',        icon: '🏠', ar: 'عقارات',         fr: 'Immobilier',   en: 'Real Estate' },
  { key: 'electronics', icon: '💻', ar: 'إلكترونيات',     fr: 'Électronique', en: 'Electronics' },
  { key: 'parts',       icon: '🔧', ar: 'قطع غيار',       fr: 'Pièces',       en: 'Parts' },
]

const LANGS = [
  { code: 'ar', flag: '🇸🇦', label: 'العربية' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
]

const COUNTRIES_LIST = [
  { code: 'tn', flag: '🇹🇳', label: { ar: 'تونس',    fr: 'Tunisie', en: 'Tunisia' } },
  { code: 'dz', flag: '🇩🇿', label: { ar: 'الجزائر', fr: 'Algérie', en: 'Algeria' } },
  { code: 'ly', flag: '🇱🇾', label: { ar: 'ليبيا',   fr: 'Libye',   en: 'Libya'   } },
  { code: 'ma', flag: '🇲🇦', label: { ar: 'المغرب',  fr: 'Maroc',   en: 'Morocco' } },
]

export default function Sidebar({ open, onClose, onCategoryChange, onPostClick, onProfileClick }) {
  const { lang, setLang, country, setCountry, user, setUser, resetCountry } = useApp()
  const [showCats,    setShowCats]    = useState(false)
  const [showLang,    setShowLang]    = useState(false)
  const [showCountry, setShowCountry] = useState(false)

  const tr = (ar, fr, en) => lang === 'ar' ? ar : lang === 'fr' ? fr : en
  const isRTL = lang === 'ar'

  const selectedCountry = COUNTRIES_LIST.find(c => c.code === country?.toLowerCase()) || COUNTRIES_LIST[0]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    if (resetCountry) resetCountry()
    onClose()
    window.location.reload()
  }

  const handleCat = (key) => {
    onCategoryChange && onCategoryChange(key)
    onClose()
  }

  const sideStyle = {
    position: 'fixed', top: 0, bottom: 0,
    width: 290, background: 'white', zIndex: 401,
    display: 'flex', flexDirection: 'column',
    boxShadow: isRTL ? '-4px 0 24px rgba(0,0,0,0.12)' : '4px 0 24px rgba(0,0,0,0.12)',
    direction: isRTL ? 'rtl' : 'ltr',
    transition: 'transform 0.3s ease',
    ...(isRTL ? {
      right: 0, left: 'auto',
      transform: open ? 'translateX(0)' : 'translateX(100%)',
    } : {
      left: 0, right: 'auto',
      transform: open ? 'translateX(0)' : 'translateX(-100%)',
    }),
  }

  const Row = ({ icon, label, onClick, color }) => (
    <div
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0', background: 'white', transition: 'background 0.15s', flexShrink: 0 }}
      onMouseEnter={e => e.currentTarget.style.background = '#FFF5F5'}
      onMouseLeave={e => e.currentTarget.style.background = 'white'}
    >
      <div style={{ width: 36, height: 36, borderRadius: 10, background: color || '#FFF0F1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
        {icon}
      </div>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#111' }}>{label}</span>
      <span style={{ fontSize: 14, color: '#d1d5db' }}>{isRTL ? '‹' : '›'}</span>
    </div>
  )

  return (
    <>
      {open && (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 400 }} />
      )}

      <div style={sideStyle}>

        {/* ── القسم العلوي القابل للتمرير ── */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg,#E8192C,#c0392b)', padding: '20px 16px', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: 'white' }}>☀️ SUN MARKET</div>
              <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 30, height: 30, color: 'white', cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👤</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{user?.user_metadata?.name || tr('مستخدم','Utilisateur','User')}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>{user?.email}</div>
                </div>
              </div>
            ) : (
              <button onClick={() => { onProfileClick && onProfileClick(); onClose() }}
                style={{ width: '100%', background: 'white', border: 'none', borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 700, color: '#E8192C', cursor: 'pointer' }}>
                🔑 {tr('تسجيل الدخول / إنشاء حساب','Connexion / Inscription','Login / Register')}
              </button>
            )}
          </div>

          {/* نشر إعلان */}
          <div onClick={() => { onPostClick && onPostClick(); onClose() }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', cursor: 'pointer', background: 'linear-gradient(135deg,#FFF0F1,#fff5f5)', borderBottom: '2px solid #E8192C', flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#E8192C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>➕</div>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#E8192C' }}>{tr('نشر إعلان مجاناً','Publier gratuitement','Post for Free')}</span>
          </div>

          {/* البلد */}
          <div onClick={() => setShowCountry(!showCountry)}
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.background = '#FFF5F5'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FFF9EC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌍</div>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#111' }}>{tr('البلد','Pays','Country')}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#E8192C' }}>
              {selectedCountry.flag} {selectedCountry.label[lang]}
            </span>
          </div>

          {showCountry && COUNTRIES_LIST.map(c => (
            <div key={c.code} onClick={() => { setCountry(c.code); setShowCountry(false) }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 20px 11px 56px', cursor: 'pointer', borderBottom: '1px solid #f9fafb', background: country === c.code ? '#FFF0F1' : '#fafafa', flexShrink: 0 }}
              onMouseEnter={e => e.currentTarget.style.background = '#FFF0F1'}
              onMouseLeave={e => e.currentTarget.style.background = country === c.code ? '#FFF0F1' : '#fafafa'}>
              <span style={{ fontSize: 14, color: '#374151' }}>{c.flag} {c.label[lang]}</span>
              {country === c.code && <span style={{ color: '#E8192C', fontWeight: 700 }}>✓</span>}
            </div>
          ))}

          {/* التصنيفات */}
          <div onClick={() => setShowCats(!showCats)}
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0', background: showCats ? '#f9fafb' : 'white', flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🗂️</div>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#111' }}>{tr('التصنيفات','Catégories','Categories')}</span>
            <span style={{ fontSize: 12, color: '#9ca3af', display: 'inline-block', transform: showCats ? 'rotate(90deg)' : 'none', transition: '0.2s' }}>{isRTL ? '‹' : '›'}</span>
          </div>

          {showCats && CATEGORIES.map(cat => (
            <div key={cat.key} onClick={() => handleCat(cat.key)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px 11px 56px', cursor: 'pointer', borderBottom: '1px solid #f9fafb', background: '#fafafa', flexShrink: 0 }}
              onMouseEnter={e => e.currentTarget.style.background = '#FFF0F1'}
              onMouseLeave={e => e.currentTarget.style.background = '#fafafa'}>
              <span style={{ fontSize: 16 }}>{cat.icon}</span>
              <span style={{ fontSize: 13, color: '#374151' }}>{lang === 'ar' ? cat.ar : lang === 'fr' ? cat.fr : cat.en}</span>
            </div>
          ))}

          <Row icon="📋" label={tr('إعلاناتي','Mes annonces','My Ads')} color="#EFF6FF"
            onClick={() => { onProfileClick && onProfileClick(); onClose() }} />

          <Row icon="❤️" label={tr('المفضلة','Favoris','Favorites')} color="#FFF0F1" onClick={() => {}} />

          {/* اللغة */}
          <div onClick={() => setShowLang(!showLang)}
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.background = '#FFF5F5'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌐</div>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#111' }}>{tr('اللغة','Langue','Language')}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#E8192C' }}>
              {LANGS.find(l => l.code === lang)?.flag} {lang.toUpperCase()}
            </span>
          </div>

          {showLang && LANGS.map(l => (
            <div key={l.code} onClick={() => { setLang(l.code); setShowLang(false) }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 20px 11px 56px', cursor: 'pointer', borderBottom: '1px solid #f9fafb', background: lang === l.code ? '#FFF0F1' : '#fafafa', flexShrink: 0 }}
              onMouseEnter={e => e.currentTarget.style.background = '#FFF0F1'}
              onMouseLeave={e => e.currentTarget.style.background = lang === l.code ? '#FFF0F1' : '#fafafa'}>
              <span style={{ fontSize: 14, color: '#374151' }}>{l.flag} {l.label}</span>
              {lang === l.code && <span style={{ color: '#E8192C', fontWeight: 700 }}>✓</span>}
            </div>
          ))}

          <Row icon="📞" label={tr('تواصل معنا','Nous contacter','Contact Us')} color="#F0FDF4" onClick={() => {}} />
          <Row icon="ℹ️" label={tr('من نحن','À propos','About Us')} color="#EFF6FF" onClick={() => {}} />
          <Row icon="📄" label={tr('الشروط والأحكام','Conditions','Terms')} color="#FAFAFA" onClick={() => {}} />

        </div>

        {/* ── زر تسجيل الخروج — ثابت في الأسفل دائماً ── */}
        {user && (
          <div style={{ padding: '14px 20px', borderTop: '1px solid #f0f0f0', background: 'white', flexShrink: 0 }}>
            <button onClick={handleLogout}
              style={{ width: '100%', height: 44, background: 'linear-gradient(135deg,#FFF0F1,#fee2e2)', border: '1.5px solid #fca5a5', borderRadius: 10, fontSize: 14, fontWeight: 700, color: '#E8192C', cursor: 'pointer', fontFamily: 'inherit' }}>
              🚪 {tr('تسجيل الخروج','Se déconnecter','Log Out')}
            </button>
          </div>
        )}

      </div>
    </>
  )
}