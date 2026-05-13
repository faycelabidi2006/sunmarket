'use client'
import { useState, useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { t } from '@/lib/translations'
import NotificationBell from '@/components/NotificationBell'
import AdminPanel from '@/components/AdminPanel'
import Sidebar from '@/components/Sidebar'
import CountrySelect from '@/components/CountrySelect'

const COUNTRIES_LIST = [
  { code: 'tn', flag: '🇹🇳', label: { ar: 'تونس',    fr: 'Tunisie', en: 'Tunisia' } },
  { code: 'dz', flag: '🇩🇿', label: { ar: 'الجزائر', fr: 'Algérie', en: 'Algeria' } },
  { code: 'ly', flag: '🇱🇾', label: { ar: 'ليبيا',   fr: 'Libye',   en: 'Libya'   } },
  { code: 'ma', flag: '🇲🇦', label: { ar: 'المغرب',  fr: 'Maroc',   en: 'Morocco' } },
]

export default function Navbar({ onPostClick, onLoginClick, onCategoryChange }) {
  const { lang, setLang, country, setCountry, resetCountry, darkMode, setDarkMode, isAdmin } = useApp()
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [showCountrySelect,   setShowCountrySelect]   = useState(false)
  const [showAdmin,           setShowAdmin]           = useState(false)
  const [showSidebar,         setShowSidebar]         = useState(false)
  const [installPrompt,       setInstallPrompt]       = useState(null)
  const [showInstall,         setShowInstall]         = useState(false)

  // ✅ isMobile state مع resize listener
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
    }
    const handler = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
      setShowInstall(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setShowInstall(false)
    setInstallPrompt(null)
  }

  const selected = COUNTRIES_LIST.find(c => c.code === country?.toLowerCase()) || COUNTRIES_LIST[0]

  const categories = [
    { key: 'car',         icon: '🚗', label: lang==='ar'?'سيارات':lang==='fr'?'Voitures':'Cars' },
    { key: 'rent',        icon: '🔑', label: lang==='ar'?'تأجير':lang==='fr'?'Location':'Rental' },
    { key: 'real',        icon: '🏠', label: lang==='ar'?'عقارات':lang==='fr'?'Immobilier':'Real Estate' },
    { key: 'parts',       icon: '🔧', label: lang==='ar'?'قطع غيار':lang==='fr'?'Pièces':'Parts' },
    { key: 'electronics', icon: '💻', label: lang==='ar'?'إلكترونيات':lang==='fr'?'Électronique':'Electronics' },
  ]

  const navBg     = darkMode ? '#1a1a2e' : '#fff'
  const navBorder = darkMode ? '#2d2d5e' : '#f0f0f0'
  const textColor = darkMode ? '#e5e7eb' : '#1a1a1a'
  const subText   = darkMode ? '#9ca3af' : '#aaa'
  const catColor  = darkMode ? '#d1d5db' : '#555'

  return (
    <>
      <nav style={{ background: navBg, borderBottom: `1px solid ${navBorder}`, position: 'sticky', top: 0, zIndex: 100, direction: dir, transition: 'background 0.3s' }}>

        {/* زر التثبيت */}
        {showInstall && (
          <div style={{ background: '#E8192C', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ fontSize: 12, color: 'white', fontWeight: 600 }}>
              📲 {lang==='ar'?'ثبّت التطبيق على هاتفك':lang==='fr'?"Installez l'application":'Install the app'}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleInstall} style={{ background: 'white', color: '#E8192C', border: 'none', borderRadius: 8, padding: '5px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                {lang==='ar'?'تثبيت':lang==='fr'?'Installer':'Install'}
              </button>
              <button onClick={() => setShowInstall(false)} style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 8, padding: '5px 10px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
            </div>
          </div>
        )}

        {/* Top row */}
        <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, borderBottom: `1px solid ${navBorder}` }}>

          {/* زر الـ Sidebar + Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <button
              onClick={() => setShowSidebar(true)}
              style={{ background: darkMode?'#2d2d5e':'#f3f4f6', border: 'none', borderRadius: 8, width: 36, height: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer', flexShrink: 0 }}
            >
              <div style={{ width: 18, height: 2, background: textColor, borderRadius: 2 }} />
              <div style={{ width: 18, height: 2, background: textColor, borderRadius: 2 }} />
              <div style={{ width: 18, height: 2, background: textColor, borderRadius: 2 }} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* ✅ اللوجو الجديد */}
              <img src="/logo.jpeg" alt="سوقنا المغاربي" style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 10 }} />
              <div>
                {/* ✅ الاسم الجديد */}
                <div style={{ fontWeight: 800, fontSize: 13, color: textColor, lineHeight: 1.3 }}>
                  {lang === 'ar' ? 'سوقنا المغاربي' : 'Souqna Al Magharibi'}
                </div>
                <div style={{ fontSize: 9, color: subText }}>
                  {lang === 'ar' ? 'وجهتك الذكية' : lang === 'fr' ? 'Votre destination intelligente' : 'Your Smart Destination'}
                </div>
              </div>
            </div>
          </div>

          {/* Ad space - مخفي على الموبايل */}
          {!isMobile && (
            <div style={{ flex: 1, height: 36, background: darkMode?'#2d1a1a':'#fff5f5', border: '1px dashed #fca5a5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', maxWidth: 340 }}>
              <span style={{ fontSize: 11, color: '#E8192C', fontWeight: 600 }}>
                📢 {lang==='ar'?'مساحة إعلانية — تواصل معنا':lang==='fr'?'Espace pub — Contactez-nous':'Ad space — Contact us'}
              </span>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>

            {/* Dark mode - يظهر دائماً */}
            <button
              onClick={() => setDarkMode(v => !v)}
              style={{ background: darkMode?'#2d2d5e':'#f3f4f6', border: 'none', borderRadius: 8, padding: '6px 10px', fontSize: 16, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {/* Notification - يظهر دائماً */}
            <NotificationBell />

            {/* ── Country picker - مخفي على الموبايل ── */}
            <div style={{ position: 'relative', display: isMobile ? 'none' : 'block' }}>
              <button
                onClick={() => setShowCountryDropdown(v => !v)}
                style={{ display: 'flex', alignItems: 'center', gap: 4, border: `1.5px solid ${darkMode?'#3d3d6e':'#eee'}`, borderRadius: 20, padding: '4px 10px', background: darkMode?'#2d2d5e':'#fafafa', fontSize: 11, fontWeight: 600, color: textColor, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <span style={{ fontSize: 14 }}>{selected.flag}</span>
                <span>{selected.label[lang]}</span>
                <span style={{ fontSize: 8, color: subText }}>▼</span>
              </button>

              {showCountryDropdown && (
                <>
                  <div onClick={() => setShowCountryDropdown(false)} style={{ position: 'fixed', inset: 0, zIndex: 199 }} />
                  <div style={{ position: 'absolute', top: 38, right: 0, background: darkMode?'#1e1e3f':'#fff', border: `1px solid ${darkMode?'#3d3d6e':'#eee'}`, borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.18)', zIndex: 200, minWidth: 160, overflow: 'hidden' }}>

                    {COUNTRIES_LIST.map(c => (
                      <div
                        key={c.code}
                        onClick={() => { setCountry(c.code); setShowCountryDropdown(false) }}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', cursor: 'pointer', fontSize: 12, fontWeight: country===c.code?700:500, color: country===c.code?'#E8192C':textColor, background: country===c.code?'#FFF0F1':'transparent' }}
                        onMouseEnter={e => e.currentTarget.style.background='#FFF0F1'}
                        onMouseLeave={e => e.currentTarget.style.background=country===c.code?'#FFF0F1':'transparent'}
                      >
                        <span style={{ fontSize: 16 }}>{c.flag}</span>
                        {c.label[lang]}
                      </div>
                    ))}

                    <div style={{ borderTop: `1px solid ${darkMode?'#3d3d6e':'#f0f0f0'}`, margin: '4px 0' }} />
                    <div
                      onClick={() => {
                        setShowCountryDropdown(false)
                        resetCountry()
                        setShowCountrySelect(true)
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', cursor: 'pointer', fontSize: 12, color: '#E8192C', fontWeight: 600 }}
                      onMouseEnter={e => e.currentTarget.style.background='#FFF0F1'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    >
                      🌍 {lang==='ar'?'تغيير البلد':lang==='fr'?'Changer de pays':'Change Country'}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Language - مخفي على الموبايل */}
            <div style={{ display: isMobile ? 'none' : 'flex', gap: 2, background: darkMode?'#2d2d5e':'#f3f4f6', borderRadius: 8, padding: 3 }}>
              {['ar','fr','en'].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{ background: lang===l?'#E8192C':'transparent', color: lang===l?'white':darkMode?'#9ca3af':'#6b7280', border: 'none', borderRadius: 6, padding: '3px 8px', fontSize: 11, cursor: 'pointer', fontWeight: lang===l?700:400, fontFamily: 'inherit' }}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Login - مخفي على الموبايل */}
            <button
              onClick={onLoginClick}
              style={{ display: isMobile ? 'none' : 'block', background: 'transparent', color: textColor, border: `1px solid ${darkMode?'#4d4d7e':'#d1d5db'}`, borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {t(lang,'login')}
            </button>

            {/* Post - يظهر دائماً */}
            <button onClick={onPostClick} style={{ background: '#E8192C', color: 'white', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' }}>
              + {t(lang,'post_ad')}
            </button>

            {isAdmin && (
              <button
                onClick={() => setShowAdmin(true)}
                style={{ background: '#1d6fa8', color: 'white', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' }}
              >
                ⚙️ أدمن
              </button>
            )}
          </div>
        </div>

        {/* Category bar */}
        <div style={{ display: 'flex', overflowX: 'auto', padding: '0 16px', gap: 0, background: navBg, scrollbarWidth: 'none' }}>
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => onCategoryChange && onCategoryChange(cat.key)}
              style={{ background: 'transparent', border: 'none', color: catColor, padding: '10px 14px', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5, borderBottom: '2px solid transparent', fontFamily: 'inherit', fontWeight: 500, transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.color='#E8192C'; e.currentTarget.style.borderBottomColor='#E8192C' }}
              onMouseLeave={e => { e.currentTarget.style.color=catColor; e.currentTarget.style.borderBottomColor='transparent' }}
            >
              <span style={{ fontSize: 15 }}>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>

        {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
      </nav>

      {/* Sidebar */}
      <Sidebar
        open={showSidebar}
        onClose={() => setShowSidebar(false)}
        onCategoryChange={onCategoryChange}
        onPostClick={onPostClick}
        onProfileClick={onLoginClick}
      />

      {/* CountrySelect modal */}
      {showCountrySelect && (
        <CountrySelect
          isModal={true}
          onClose={() => {
            setShowCountrySelect(false)
            window.location.replace('/')
          }}
        />
      )}
    </>
  )
}