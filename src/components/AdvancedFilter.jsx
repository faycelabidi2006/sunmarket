'use client'
import { useState, useEffect } from 'react'
import { useApp } from '@/context/AppContext'

const FUEL_OPTIONS = [
  { key: 'petrol',   ar: 'بنزين',       fr: 'Essence',    en: 'Petrol'   },
  { key: 'diesel',   ar: 'ديزل',        fr: 'Diesel',     en: 'Diesel'   },
  { key: 'hybrid',   ar: 'هجين',        fr: 'Hybride',    en: 'Hybrid'   },
  { key: 'electric', ar: 'كهربائي',     fr: 'Électrique', en: 'Electric' },
  { key: 'gpl',      ar: 'غاز',         fr: 'GPL',        en: 'GPL'      },
]

const CONDITION_OPTIONS = [
  { key: 'excellent',    ar: 'ممتازة',        fr: 'Excellent',  en: 'Excellent'    },
  { key: 'very_good',    ar: 'جيدة جداً',     fr: 'Très bon',   en: 'Very Good'    },
  { key: 'good',         ar: 'جيدة',          fr: 'Bon',        en: 'Good'         },
  { key: 'needs_repair', ar: 'تحتاج إصلاح',   fr: 'À réparer',  en: 'Needs Repair' },
]

const TYPE_OPTIONS = [
  { key: 'car',         icon: '🚗', ar: 'سيارات',      fr: 'Voitures',    en: 'Cars'        },
  { key: 'rent',        icon: '🔑', ar: 'تأجير',       fr: 'Location',    en: 'Rental'      },
  { key: 'real',        icon: '🏠', ar: 'عقارات',      fr: 'Immobilier',  en: 'Real Estate' },
  { key: 'parts',       icon: '🔧', ar: 'قطع غيار',   fr: 'Pièces',      en: 'Parts'       },
  { key: 'electronics', icon: '💻', ar: 'إلكترونيات', fr: 'Électronique',en: 'Electronics' },
]

function PillButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px', borderRadius: 20, fontSize: 12,
        fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.15s',
        border: `1.5px solid ${active ? '#E8192C' : '#e5e7eb'}`,
        background: active ? '#E8192C' : 'white',
        color: active ? 'white' : '#6b7280',
        fontWeight: active ? 700 : 400,
      }}
    >
      {label}
    </button>
  )
}

export default function AdvancedFilter({ onFilter, regions = [], forceOpen = false }) {
  const { lang } = useApp()
  const [open,      setOpen]      = useState(false)
  const [minPrice,  setMinPrice]  = useState('')
  const [maxPrice,  setMaxPrice]  = useState('')
  const [region,    setRegion]    = useState('')
  const [minYear,   setMinYear]   = useState('')
  const [maxYear,   setMaxYear]   = useState('')
  const [condition, setCondition] = useState('')
  const [fuel,      setFuel]      = useState('')
  const [type,      setType]      = useState('')

  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => { if (forceOpen) setOpen(true) }, [forceOpen])

  const activeCount = [minPrice, maxPrice, region, minYear, maxYear, condition, fuel, type].filter(Boolean).length

  const apply = () => {
    onFilter && onFilter({ minPrice, maxPrice, region, minYear, maxYear, condition, fuel, type })
    setOpen(false)
  }

  const reset = () => {
    setMinPrice(''); setMaxPrice(''); setRegion(''); setMinYear('')
    setMaxYear(''); setCondition(''); setFuel(''); setType('')
    onFilter && onFilter({})
  }

  const inp = {
    background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10,
    padding: '9px 12px', fontSize: 13, outline: 'none', fontFamily: 'inherit',
    color: '#1f2937', width: '100%', boxSizing: 'border-box',
  }
  const lbl = { fontSize: 11, color: '#6b7280', fontWeight: 700, marginBottom: 6, display: 'block' }
  const section = { marginBottom: 18 }

  return (
    <div style={{ marginBottom: 16, direction: dir }}>

      {/* زر الفتح */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: activeCount > 0 ? '#FFF0F1' : 'white',
          border: `1.5px solid ${activeCount > 0 ? '#E8192C' : '#e5e7eb'}`,
          borderRadius: 10, padding: '8px 16px', fontSize: 13, cursor: 'pointer',
          fontFamily: 'inherit', fontWeight: 600,
          color: activeCount > 0 ? '#E8192C' : '#374151',
          transition: 'all 0.2s',
        }}
      >
        🔍 {lang==='ar'?'فلتر متقدم':lang==='fr'?'Filtres avancés':'Advanced Filter'}
        {activeCount > 0 && (
          <span style={{ background: '#E8192C', color: 'white', borderRadius: '50%', width: 20, height: 20, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
            {activeCount}
          </span>
        )}
        <span style={{ fontSize: 10, marginRight: 'auto', color: '#9ca3af' }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 16, padding: 20, marginTop: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}>

          {/* ── النوع ── */}
          <div style={section}>
            <label style={lbl}>
              {lang==='ar'?'📂 نوع الإعلان':lang==='fr'?'📂 Type':'📂 Type'}
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {TYPE_OPTIONS.map(opt => (
                <PillButton
                  key={opt.key}
                  label={`${opt.icon} ${opt[lang] || opt.ar}`}
                  active={type === opt.key}
                  onClick={() => setType(type === opt.key ? '' : opt.key)}
                />
              ))}
            </div>
          </div>

          {/* ── السعر ── */}
          <div style={section}>
            <label style={lbl}>
              {lang==='ar'?'💰 نطاق السعر':lang==='fr'?'💰 Fourchette de prix':'💰 Price Range'}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <input
                  type="number" value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  style={inp}
                  placeholder={lang==='ar'?'من':'Min'}
                />
              </div>
              <div>
                <input
                  type="number" value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  style={inp}
                  placeholder={lang==='ar'?'إلى':'Max'}
                />
              </div>
            </div>
          </div>

          {/* ── السنة ── */}
          <div style={section}>
            <label style={lbl}>
              {lang==='ar'?'📅 سنة الصنع':lang==='fr'?'📅 Année':'📅 Year'}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input
                type="number" value={minYear}
                onChange={e => setMinYear(e.target.value)}
                style={inp} placeholder="2000"
              />
              <input
                type="number" value={maxYear}
                onChange={e => setMaxYear(e.target.value)}
                style={inp} placeholder="2026"
              />
            </div>
          </div>

          {/* ── المنطقة ── */}
          <div style={section}>
            <label style={lbl}>
              {lang==='ar'?'📍 المنطقة':lang==='fr'?'📍 Région':'📍 Region'}
            </label>
            <select value={region} onChange={e => setRegion(e.target.value)} style={inp}>
              <option value="">{lang==='ar'?'كل المناطق':lang==='fr'?'Toutes les régions':'All Regions'}</option>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* ── الحالة ── */}
          <div style={section}>
            <label style={lbl}>
              {lang==='ar'?'🔖 الحالة':lang==='fr'?'🔖 État':'🔖 Condition'}
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {CONDITION_OPTIONS.map(opt => (
                <PillButton
                  key={opt.key}
                  label={opt[lang] || opt.ar}
                  active={condition === opt.key}
                  onClick={() => setCondition(condition === opt.key ? '' : opt.key)}
                />
              ))}
            </div>
          </div>

          {/* ── الوقود ── */}
          <div style={section}>
            <label style={lbl}>
              {lang==='ar'?'⛽ نوع الوقود':lang==='fr'?'⛽ Carburant':'⛽ Fuel Type'}
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {FUEL_OPTIONS.map(opt => (
                <PillButton
                  key={opt.key}
                  label={opt[lang] || opt.ar}
                  active={fuel === opt.key}
                  onClick={() => setFuel(fuel === opt.key ? '' : opt.key)}
                />
              ))}
            </div>
          </div>

          {/* ── الأزرار ── */}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={reset} style={{ flex: 1, border: '1.5px solid #e5e7eb', background: 'white', color: '#6b7280', borderRadius: 10, padding: '10px 0', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
              🗑 {lang==='ar'?'مسح الكل':lang==='fr'?'Réinitialiser':'Reset'}
            </button>
            <button onClick={apply} style={{ flex: 2, background: '#E8192C', color: 'white', border: 'none', borderRadius: 10, padding: '10px 0', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              ✅ {lang==='ar'?'تطبيق الفلتر':lang==='fr'?'Appliquer':'Apply Filter'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}