'use client'
import { useState, useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import AdvancedFilter from '@/components/AdvancedFilter'

const BANNERS = [
  { bg: 'linear-gradient(120deg,#E8192C,#ff6b7a)', emoji: '🚗', title: { ar: 'بع سيارتك بأفضل سعر', fr: 'Vendez votre voiture au meilleur prix', en: 'Sell your car at the best price' }, sub: { ar: 'آلاف المشترين ينتظرون', fr: "Des milliers d'acheteurs attendent", en: 'Thousands of buyers waiting' }, btn: { ar: 'أعلن الآن', fr: 'Annoncer', en: 'Post Now' } },
  { bg: 'linear-gradient(120deg,#1a1a2e,#2d2d5e)', emoji: '🏠', title: { ar: 'ابحث عن شقتك المثالية', fr: 'Trouvez votre appartement idéal', en: 'Find your perfect apartment' }, sub: { ar: 'عقارات في كل المدن', fr: 'Immobilier dans toutes les villes', en: 'Properties in all cities' }, btn: { ar: 'اكتشف', fr: 'Découvrir', en: 'Explore' } },
  { bg: 'linear-gradient(120deg,#c0392b,#8e1010)', emoji: '📱', title: { ar: 'أحدث الأجهزة الإلكترونية', fr: 'Les derniers appareils électroniques', en: 'Latest electronics' }, sub: { ar: 'أسعار لا تقاوم', fr: 'Prix imbattables', en: 'Unbeatable prices' }, btn: { ar: 'تصفح', fr: 'Parcourir', en: 'Browse' } },
  { bg: 'linear-gradient(120deg,#E8192C,#8B0000)', emoji: '🔑', title: { ar: 'أجّر سيارة بسهولة', fr: 'Louez une voiture facilement', en: 'Rent a car easily' }, sub: { ar: 'يومي • أسبوعي • شهري', fr: 'Journalier • Hebdo • Mensuel', en: 'Daily • Weekly • Monthly' }, btn: { ar: 'احجز', fr: 'Réserver', en: 'Book' } },
]

export default function Hero({ onSearch, onCategoryChange, onFilter, regions = [] }) {
  const { lang } = useApp()
  const [searchText, setSearchText] = useState('')
  const [banner, setBanner] = useState(0)
  const [showFilter, setShowFilter] = useState(false)
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    const id = setInterval(() => setBanner(i => (i + 1) % BANNERS.length), 3500)
    return () => clearInterval(id)
  }, [])

  const handleSearch = () => {
    onSearch && onSearch(searchText)
  }

  const mainCats = [
    { key: 'car',         icon: '🚗', label: lang==='ar'?'سيارات':lang==='fr'?'Voitures':'Cars' },
    { key: 'rent',        icon: '🔑', label: lang==='ar'?'تأجير':lang==='fr'?'Location':'Rental' },
    { key: 'parts',       icon: '🔧', label: lang==='ar'?'قطع غيار':lang==='fr'?'Pièces':'Parts' },
    { key: 'electronics', icon: '💻', label: lang==='ar'?'إلكترونيات':lang==='fr'?'Électronique':'Electronics' },
    { key: 'real',        icon: '🏠', label: lang==='ar'?'عقارات':lang==='fr'?'Immobilier':'Real Estate' },
    { key: 'real_rent',   icon: '🏢', label: lang==='ar'?'إيجار عقاري':lang==='fr'?'Location Immo':'Property Rent' },
  ]

  const b = BANNERS[banner]

  return (
    <div style={{ background: '#f8f9fa', direction: dir }}>

      {/* 1️⃣ البانر */}
      <div style={{ padding: '10px 16px 0' }}>
        <div style={{ borderRadius: 14, overflow: 'hidden', position: 'relative', height: 100, background: b.bg, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16, transition: 'background 0.5s', cursor: 'pointer' }}>
          <div style={{ fontSize: 50, flexShrink: 0 }}>{b.emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'white', marginBottom: 4 }}>{b.title[lang]||b.title.ar}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>{b.sub[lang]||b.sub.ar}</div>
          </div>
          <button style={{ background: 'white', color: '#E8192C', border: 'none', borderRadius: 20, padding: '7px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {b.btn[lang]||b.btn.ar}
          </button>
          <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5 }}>
            {BANNERS.map((_, i) => (
              <div key={i} onClick={() => setBanner(i)} style={{ width: i===banner?18:6, height: 6, borderRadius: 3, background: i===banner?'white':'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.3s' }} />
            ))}
          </div>
        </div>
      </div>

      {/* 2️⃣ البحث + الفلتر */}
      <div style={{ background: 'white', padding: '12px 16px', borderBottom: '1px solid #e5e7eb', marginTop: 10 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#F7F7F7', border: '1.5px solid #eee', borderRadius: 12, padding: '0 12px', gap: 8 }}>
            <span style={{ fontSize: 16, color: '#aaa' }}>🔍</span>
            <input
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, color: '#333', padding: '11px 0', background: 'transparent', fontFamily: 'inherit', direction: dir }}
              placeholder={lang==='ar'?'ابحث عن سيارة، شقة، إلكترونيات...':lang==='fr'?'Rechercher une voiture, appartement...':'Search for a car, apartment...'}
            />
          </div>
          <button
            onClick={() => setShowFilter(v => !v)}
            style={{
              background: showFilter ? '#c0392b' : '#E8192C',
              color: 'white', border: 'none', borderRadius: 24,
              padding: '10px 16px', fontSize: 12, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              gap: 6, boxShadow: '0 4px 12px rgba(232,25,44,0.35)',
              whiteSpace: 'nowrap', fontFamily: 'inherit', flexShrink: 0,
              transition: 'background 0.2s',
            }}
          >
            <span style={{ fontSize: 15 }}>⚙️</span>
            {lang==='ar' ? 'فلتر متقدم' : lang==='fr' ? 'Filtre avancé' : 'Advanced Filter'}
            <span style={{ fontSize: 10 }}>{showFilter ? '▲' : '▼'}</span>
          </button>
        </div>

        {/* الفلتر تحت البحث مباشرة */}
        {showFilter && (
          <div style={{ marginTop: 12 }}>
            <AdvancedFilter
              onFilter={(params) => { onFilter && onFilter(params); setShowFilter(false) }}
              regions={regions}
              forceOpen={true}
            />
          </div>
        )}
      </div>

      {/* 3️⃣ الأزرار الزرقاء */}
      <div style={{ padding: '12px 16px 14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8 }}>
          {mainCats.map(cat => (
            <div
              key={cat.key}
              onClick={() => onCategoryChange && onCategoryChange(cat.key)}
              style={{ background: '#1d6fa8', border: '1px solid #155a8a', borderRadius: 14, padding: '12px 6px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background='#155a8a' }}
              onMouseLeave={e => { e.currentTarget.style.background='#1d6fa8' }}
            >
              <div style={{ fontSize: 24, marginBottom: 4 }}>{cat.icon}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'white' }}>{cat.label}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}