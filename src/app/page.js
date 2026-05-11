'use client'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useApp } from '@/context/AppContext'
import { t } from '@/lib/translations'
import { COUNTRIES, ELECTRONICS_TYPES } from '@/lib/countries'
import { supabase } from '@/lib/supabaseClient'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ListingCard from '@/components/ListingCard'
import BottomNav from '@/components/BottomNav'
import AuthModal from '@/components/AuthModal'
import CountrySelect from '@/components/CountrySelect'
import ProfileModal from '@/components/ProfileModal'
import GoogleAdBanner from '@/components/GoogleAdBanner'
import AdvancedFilter from '@/components/AdvancedFilter'
 
const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 35 }, (_, i) => currentYear - i)
 
const CAR_MAKES = [
  'تويوتا','هوندا','نيسان','هيونداي','كيا','فولكسفاغن','رينو','بيجو','سيتروين',
  'فورد','شيفروليه','مرسيدس','بي ام دبليو','أودي','فيات','أوبل','ميتسوبيشي',
  'سوزوكي','مازدا','لكزس','سكودا','سيات','داتشيا','لاند روفر','جيب',
  'بورش','فولفو','إنفينيتي','أكيورا','كاديلاك','شيري','جيلي',
  'BYD','MG','هافال','أخرى'
]
 
// ─── التصنيفات الفرعية ────────────────────────────────────────────────────────
const SUBCATEGORIES = {
  real: {
    ar: [
      { key: 'real_res_rent',  icon: '🏠', label: 'سكني للإيجار' },
      { key: 'real_com_rent',  icon: '🏢', label: 'تجاري للإيجار' },
      { key: 'real_room',      icon: '🛏', label: 'غرف للإيجار' },
      { key: 'real_monthly',   icon: '📅', label: 'إيجار شهري' },
      { key: 'real_daily',     icon: '🌙', label: 'إيجار يومي' },
      { key: 'real_res_sale',  icon: '🏡', label: 'سكني للبيع' },
      { key: 'real_com_sale',  icon: '🏗', label: 'تجاري للبيع' },
      { key: 'real_land',      icon: '🌍', label: 'أراضي' },
      { key: 'real_new',       icon: '✨', label: 'مشاريع جديدة' },
    ],
    fr: [
      { key: 'real_res_rent',  icon: '🏠', label: 'Résidentiel à louer' },
      { key: 'real_com_rent',  icon: '🏢', label: 'Commercial à louer' },
      { key: 'real_room',      icon: '🛏', label: 'Chambres à louer' },
      { key: 'real_monthly',   icon: '📅', label: 'Location mensuelle' },
      { key: 'real_daily',     icon: '🌙', label: 'Location journalière' },
      { key: 'real_res_sale',  icon: '🏡', label: 'Résidentiel à vendre' },
      { key: 'real_com_sale',  icon: '🏗', label: 'Commercial à vendre' },
      { key: 'real_land',      icon: '🌍', label: 'Terrains' },
      { key: 'real_new',       icon: '✨', label: 'Nouveaux projets' },
    ],
    en: [
      { key: 'real_res_rent',  icon: '🏠', label: 'Residential for Rent' },
      { key: 'real_com_rent',  icon: '🏢', label: 'Commercial for Rent' },
      { key: 'real_room',      icon: '🛏', label: 'Rooms for Rent' },
      { key: 'real_monthly',   icon: '📅', label: 'Monthly Short Term' },
      { key: 'real_daily',     icon: '🌙', label: 'Daily Short Term' },
      { key: 'real_res_sale',  icon: '🏡', label: 'Residential for Sale' },
      { key: 'real_com_sale',  icon: '🏗', label: 'Commercial for Sale' },
      { key: 'real_land',      icon: '🌍', label: 'Land' },
      { key: 'real_new',       icon: '✨', label: 'New Projects' },
    ],
  },
  electronics: {
    ar: [
      { key: 'elec_mobile',   icon: '📱', label: 'هواتف ذكية' },
      { key: 'elec_tablet',   icon: '📟', label: 'تابلت' },
      { key: 'elec_laptop',   icon: '💻', label: 'لابتوب' },
      { key: 'elec_desktop',  icon: '🖥', label: 'كمبيوتر مكتبي' },
      { key: 'elec_tv',       icon: '📺', label: 'تلفزيون' },
      { key: 'elec_camera',   icon: '📷', label: 'كاميرات' },
      { key: 'elec_gaming',   icon: '🎮', label: 'ألعاب فيديو' },
      { key: 'elec_audio',    icon: '🎧', label: 'صوتيات' },
      { key: 'elec_home',     icon: '🏠', label: 'أجهزة منزلية' },
      { key: 'elec_wearable', icon: '⌚', label: 'أجهزة ذكية' },
      { key: 'elec_other',    icon: '🔌', label: 'أخرى' },
    ],
    fr: [
      { key: 'elec_mobile',   icon: '📱', label: 'Téléphones' },
      { key: 'elec_tablet',   icon: '📟', label: 'Tablettes' },
      { key: 'elec_laptop',   icon: '💻', label: 'Laptops' },
      { key: 'elec_desktop',  icon: '🖥', label: 'PC bureau' },
      { key: 'elec_tv',       icon: '📺', label: 'Télévisions' },
      { key: 'elec_camera',   icon: '📷', label: 'Caméras' },
      { key: 'elec_gaming',   icon: '🎮', label: 'Gaming' },
      { key: 'elec_audio',    icon: '🎧', label: 'Audio' },
      { key: 'elec_home',     icon: '🏠', label: 'Électroménager' },
      { key: 'elec_wearable', icon: '⌚', label: 'Wearables' },
      { key: 'elec_other',    icon: '🔌', label: 'Autres' },
    ],
    en: [
      { key: 'elec_mobile',   icon: '📱', label: 'Mobile Phones' },
      { key: 'elec_tablet',   icon: '📟', label: 'Tablets' },
      { key: 'elec_laptop',   icon: '💻', label: 'Laptops' },
      { key: 'elec_desktop',  icon: '🖥', label: 'Desktop PCs' },
      { key: 'elec_tv',       icon: '📺', label: 'Televisions' },
      { key: 'elec_camera',   icon: '📷', label: 'Cameras' },
      { key: 'elec_gaming',   icon: '🎮', label: 'Gaming' },
      { key: 'elec_audio',    icon: '🎧', label: 'Audio' },
      { key: 'elec_home',     icon: '🏠', label: 'Home Appliances' },
      { key: 'elec_wearable', icon: '⌚', label: 'Wearables' },
      { key: 'elec_other',    icon: '🔌', label: 'Other' },
    ],
  },
}
 
// ماركات الهواتف
const PHONE_BRANDS = [
  { key: 'apple',    label: 'Apple' },
  { key: 'samsung',  label: 'Samsung' },
  { key: 'xiaomi',   label: 'Xiaomi' },
  { key: 'huawei',   label: 'Huawei' },
  { key: 'oppo',     label: 'Oppo' },
  { key: 'vivo',     label: 'Vivo' },
  { key: 'honor',    label: 'Honor' },
  { key: 'nokia',    label: 'Nokia' },
  { key: 'oneplus',  label: 'OnePlus' },
  { key: 'realme',   label: 'Realme' },
  { key: 'infinix',  label: 'Infinix' },
  { key: 'motorola', label: 'Motorola' },
  { key: 'other',    label: 'أخرى' },
]
 
// ─── Styles ───────────────────────────────────────────────────────────────────
const inputStyle = {
  width: '100%', background: '#f9fafb', border: '1px solid #e5e7eb',
  borderRadius: 10, padding: '10px 14px', fontSize: 14, outline: 'none',
  fontFamily: 'inherit', color: '#1f2937', transition: 'border-color 0.2s',
}
const labelStyle = { fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 6, fontWeight: 600 }
const fieldWrap  = { marginBottom: 16 }
 
const AD_BANNERS = [
  { bg: 'linear-gradient(135deg,#1a2740,#2d3f5c)', emoji: '🚀', title: { ar: 'أعلن معنا واصل لآلاف المشترين', fr: 'Annoncez avec nous', en: 'Advertise with us' }, sub: { ar: 'أسعار مناسبة لجميع الميزانيات', fr: 'Prix pour tous les budgets', en: 'Prices for all budgets' }, btn: { ar: 'تواصل معنا', fr: 'Nous contacter', en: 'Contact us' } },
  { bg: 'linear-gradient(135deg,#E8192C,#993556)', emoji: '📢', title: { ar: 'هل لديك منتج للبيع؟', fr: 'Vous avez quelque chose à vendre?', en: 'Have something to sell?' }, sub: { ar: 'انشر إعلانك مجاناً الآن', fr: 'Publiez gratuitement', en: 'Post your ad for free' }, btn: { ar: 'نشر إعلان', fr: 'Publier', en: 'Post Ad' } },
  { bg: 'linear-gradient(135deg,#10b981,#059669)', emoji: '🏆', title: { ar: 'إعلانات مميزة بأسعار خاصة', fr: 'Annonces premium', en: 'Premium ads' }, sub: { ar: 'وصول أكبر، مبيعات أسرع', fr: 'Plus de portée, ventes rapides', en: 'More reach, faster sales' }, btn: { ar: 'اعرف أكثر', fr: 'En savoir plus', en: 'Learn more' } },
]
 
// ─── Helper Components ────────────────────────────────────────────────────────
function PillSelect({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {options.map(opt => (
        <button key={opt.key} type="button" onClick={() => onChange(opt.key)}
          style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', border: `1.5px solid ${value===opt.key?'#E8192C':'#e5e7eb'}`, background: value===opt.key?'#FFF0F1':'white', color: value===opt.key?'#E8192C':'#6b7280', fontWeight: value===opt.key?700:400, transition: 'all 0.15s' }}
        >{opt.label}</button>
      ))}
    </div>
  )
}
 
function SubcategoryGrid({ options, value, onChange }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
      {options.map(opt => (
        <button key={opt.key} type="button" onClick={() => onChange(opt.key)}
          style={{ padding: '10px 6px', borderRadius: 12, fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', textAlign: 'center', lineHeight: 1.4, border: `1.5px solid ${value===opt.key?'#E8192C':'#e5e7eb'}`, background: value===opt.key?'#FFF0F1':'white', color: value===opt.key?'#E8192C':'#374151', fontWeight: value===opt.key?700:400, transition: 'all 0.15s' }}
        >
          <div style={{ fontSize: 20, marginBottom: 4 }}>{opt.icon}</div>
          <div>{opt.label}</div>
        </button>
      ))}
    </div>
  )
}
 
function StepBar({ step, total }) {
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 22 }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i < step ? '#E8192C' : '#e5e7eb', transition: 'background 0.3s' }} />
      ))}
    </div>
  )
}
 
function SectionHeader({ title, count, onSeeAll, lang, dark }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 4, height: 22, background: '#E8192C', borderRadius: 2 }} />
        <div style={{ fontSize: 17, fontWeight: 800, color: dark?'#f3f4f6':'#111827' }}>{title}</div>
        <div style={{ fontSize: 11, color: '#9ca3af', background: dark?'#2d2d5e':'#f3f4f6', padding: '2px 8px', borderRadius: 20 }}>
          {count} {lang==='ar'?'إعلان':lang==='fr'?'annonce':'ad'}
        </div>
      </div>
      <button onClick={onSeeAll} style={{ background: 'transparent', border: '1.5px solid #E8192C', color: '#E8192C', borderRadius: 8, padding: '5px 14px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 }}>
        {lang==='ar'?'عرض الكل ←':lang==='fr'?'Voir tout →':'See All →'}
      </button>
    </div>
  )
}
 
function AdBanner({ index, lang }) {
  const ad = AD_BANNERS[index % AD_BANNERS.length]
  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', background: ad.bg, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
      <div style={{ fontSize: 46, flexShrink: 0 }}>{ad.emoji}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 4 }}>{ad.title[lang]||ad.title.ar}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{ad.sub[lang]||ad.sub.ar}</div>
      </div>
      <button style={{ background: 'white', color: '#E8192C', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
        {ad.btn[lang]||ad.btn.ar}
      </button>
    </div>
  )
}
 
function FeaturedStrip({ listings, currency, lang, dark, onDelete }) {
  const featured = listings.filter(l => l.featured)
  if (featured.length === 0) return null
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ background: 'linear-gradient(135deg,#EF9F27,#f59e0b)', borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 700, color: 'white' }}>
          ⭐ {lang==='ar'?'إعلانات مميزة':lang==='fr'?'Annonces Premium':'Featured Ads'}
        </div>
        <div style={{ fontSize: 11, color: '#9ca3af' }}>{featured.length} {lang==='ar'?'إعلان':'ad'}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14 }}>
        {featured.map(l => (
          <div key={l.id} style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, background: 'linear-gradient(135deg,#EF9F27,#f59e0b)', color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>⭐ مميز</div>
            <ListingCard listing={l} currency={currency} allListings={listings} onDelete={onDelete} />
          </div>
        ))}
      </div>
    </div>
  )
}
// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const { lang, user, country, loading, darkMode } = useApp()
 
  const [activeCategory,   setActiveCategory]   = useState('all')
  const [searchQuery,      setSearchQuery]       = useState('')
  const [showPostModal,    setShowPostModal]      = useState(false)
  const [showAuthModal,    setShowAuthModal]      = useState(false)
  const [showProfileModal, setShowProfileModal]   = useState(false)
  const [postStep,         setPostStep]           = useState(1)
  const [filterParams,     setFilterParams]       = useState({})
  // Form fields
  const [category,        setCategory]        = useState('')
  const [subcategory,     setSubcategory]     = useState('')
  const [phoneBrand,      setPhoneBrand]      = useState('')
  const [title,           setTitle]           = useState('')
  const [region,          setRegion]          = useState('')
  const [price,           setPrice]           = useState('')
  const [phone,           setPhone]           = useState('')
  const [whatsapp,        setWhatsapp]        = useState('')
  const [description,     setDescription]     = useState('')
  const [carMake,         setCarMake]         = useState('')
  const [carModel,        setCarModel]        = useState('')
  const [carYear,         setCarYear]         = useState('')
  const [carMileage,      setCarMileage]      = useState('')
  const [carFuel,         setCarFuel]         = useState('')
  const [carGearbox,      setCarGearbox]      = useState('')
  const [carCondition,    setCarCondition]    = useState('')
  const [carBody,         setCarBody]         = useState('')
  const [carColor,        setCarColor]        = useState('')
  const [isFeatured,      setIsFeatured]      = useState(false)
 
  const [imageUrls,      setImageUrls]      = useState([])
  const [imageUploading, setImageUploading] = useState(false)
  const fileInputRef = useRef(null)
 
  const [listings,     setListings]     = useState([])
  const [listLoading,  setListLoading]  = useState(false)
  const [publishing,   setPublishing]   = useState(false)
  const [publishError, setPublishError] = useState('')
 
  const currentCountry = useMemo(() => country ? COUNTRIES[country.toLowerCase()] : null, [country])
  const currency       = useMemo(() => currentCountry?.currency?.[lang] || 'د.ت', [currentCountry, lang])
  const regions        = useMemo(() => currentCountry?.regions || [], [currentCountry])
 
  const bg = darkMode ? '#0f172a' : '#f8f9fa'
 
  useEffect(() => {
    if (!country) return
    setListings([])
    const timer = setTimeout(() => {
      setListLoading(true)
      supabase.from('listings').select('*').eq('country', country)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .then(({ data, error }) => { if (!error) setListings(data || []); setListLoading(false) })
    }, 300)
    return () => clearTimeout(timer)
  }, [country])
 
  if (loading) return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#E8192C', fontSize: 32 }}>⏳</div>
    </div>
  )
 
  if (!country) return <CountrySelect onClose={() => window.location.replace('/')} />
 
  const isCarCategory = category === 'car' || category === 'rent'
  const isElectronics = category === 'electronics'
  const isReal        = category === 'real'
  const isMobilePhone = subcategory === 'elec_mobile'
  const dir           = lang === 'ar' ? 'rtl' : 'ltr'
 
  const FUEL_OPTIONS = [
    { key: 'petrol', label: 'بنزين' }, { key: 'diesel', label: 'ديزل' },
    { key: 'hybrid', label: 'هجين' }, { key: 'electric', label: 'كهربائي' }, { key: 'gpl', label: 'GPL' },
  ]
  const GEAR_OPTIONS = [
    { key: 'auto', label: 'أوتوماتيك' }, { key: 'manual', label: 'مانويل' }, { key: 'semi', label: 'نصف أوتو' },
  ]
  const COND_OPTIONS = [
    { key: 'excellent', label: 'ممتازة' }, { key: 'very_good', label: 'جيدة جداً' },
    { key: 'good', label: 'جيدة' }, { key: 'needs_repair', label: 'تحتاج إصلاح' },
  ]
  const BODY_OPTIONS = [
    { key: 'sedan', label: 'سيدان' }, { key: 'hatch', label: 'هاتشباك' }, { key: 'suv', label: 'SUV' },
    { key: 'pickup', label: 'بيكاب' }, { key: 'van', label: 'فان' }, { key: 'coupe', label: 'كوبيه' },
  ]
 
  const SECTIONS = [
    { key: 'car',         icon: '🚗', label: lang==='ar'?'سيارات للبيع':lang==='fr'?'Voitures à vendre':'Cars for Sale' },
    { key: 'rent',        icon: '🔑', label: lang==='ar'?'تأجير سيارات':lang==='fr'?'Location de voitures':'Car Rental' },
    { key: 'electronics', icon: '💻', label: lang==='ar'?'إلكترونيات':lang==='fr'?'Électronique':'Electronics' },
    { key: 'real',        icon: '🏠', label: lang==='ar'?'عقارات':lang==='fr'?'Immobilier':'Real Estate' },
    { key: 'parts',       icon: '🔧', label: lang==='ar'?'قطع غيار':lang==='fr'?'Pièces détachées':'Spare Parts' },
  ]
 
  const applyFilter = (list) => list.filter(l => {
    if (filterParams.minPrice  && Number(l.price)    < Number(filterParams.minPrice))  return false
    if (filterParams.maxPrice  && Number(l.price)    > Number(filterParams.maxPrice))  return false
    if (filterParams.region    && l.location         !== filterParams.region)           return false
    if (filterParams.condition && l.car_condition    !== filterParams.condition)        return false
    if (filterParams.fuel      && l.car_fuel         !== filterParams.fuel)             return false
    if (filterParams.minYear   && Number(l.car_year) < Number(filterParams.minYear))   return false
    if (filterParams.maxYear   && Number(l.car_year) > Number(filterParams.maxYear))   return false
    return true
  })
 
  const filtered = applyFilter(
    listings
      .filter(l => activeCategory === 'all' || l.type === activeCategory)
      .filter(l => searchQuery === '' || l.title?.toLowerCase().includes(searchQuery.toLowerCase()) || l.location?.includes(searchQuery))
  )
 
  const handlePostClick = () => {
    if (!user) { setShowAuthModal(true) }
    else {
      setCategory(''); setSubcategory(''); setPhoneBrand(''); setTitle('')
      setRegion(''); setPrice(''); setPhone(''); setWhatsapp(''); setDescription('')
      setCarMake(''); setCarModel(''); setCarYear(''); setCarMileage('')
      setCarFuel(''); setCarGearbox(''); setCarCondition(''); setCarBody(''); setCarColor('')
      setPublishError(''); setIsFeatured(false); setImageUrls([])
      setShowPostModal(true); setPostStep(1)
    }
  }
 
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setImageUploading(true)
    const uploaded = []
    for (const file of files) {
      const ext  = file.name.split('.').pop()
      const path = `listings/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('listing-images').upload(path, file, { cacheControl: '3600', upsert: false })
      if (!error) {
        const { data } = supabase.storage.from('listing-images').getPublicUrl(path)
        uploaded.push(data.publicUrl)
      }
    }
    setImageUrls(prev => [...prev, ...uploaded])
    setImageUploading(false)
    e.target.value = ''
  }
 
  const removeImage = (idx) => setImageUrls(prev => prev.filter((_, i) => i !== idx))
 
  const canProceedStep1 = () => {
    if (!category || !region || !price) return false
    if (isReal        && !subcategory)                              return false
    if (isElectronics && !subcategory)                              return false
    if (isMobilePhone && !phoneBrand)                               return false
    if (isCarCategory) return !!(carMake && carYear && carMileage && carFuel && carGearbox)
    return !!title
  }
 
  const handleNext = async () => {
    if (postStep === 1 && !canProceedStep1()) return
    if (postStep === 2) {
      setPublishing(true); setPublishError('')
      const emojiMap = { car: '🚗', rent: '🔑', electronics: '💻', real: '🏠', parts: '🔧' }
      const newListing = {
        type: category, emoji: emojiMap[category] || '📌',
        subcategory: subcategory || null,
        phone_brand: phoneBrand || null,
        title: isCarCategory ? `${carMake} ${carModel} ${carYear}`.trim() : title,
        location: region, price: Number(price), time: 'الآن', tags: [], featured: isFeatured, country,
        description, phone, whatsapp, images: imageUrls,
        car_make: carMake||null, car_model: carModel||null, car_year: carYear||null,
        car_mileage: carMileage||null, car_fuel: carFuel||null, car_gearbox: carGearbox||null,
        car_condition: carCondition||null, car_body: carBody||null, car_color: carColor||null,
      }
      const { data, error } = await supabase.from('listings').insert([newListing]).select()
      if (error) { setPublishError(lang==='ar'?'حدث خطأ أثناء النشر':'Erreur de publication'); setPublishing(false); return }
      if (data?.length > 0) setListings(prev => [data[0], ...prev])
      setPublishing(false)
    }
    if (postStep < 3) setPostStep(s => s + 1)
    else setShowPostModal(false)
  }
 
  return (
    <div style={{ minHeight: '100vh', background: bg, direction: dir, transition: 'background 0.3s' }}>
      <Navbar onPostClick={handlePostClick} onLoginClick={() => setShowAuthModal(true)} onCategoryChange={cat => { setActiveCategory(cat); setSearchQuery('') }} />
    <Hero
  onSearch={(text, cat) => { setSearchQuery(text); setActiveCategory(cat||'all') }}
  onCategoryChange={cat => { setActiveCategory(cat); setSearchQuery('') }}
  onFilter={setFilterParams}
  regions={regions}
/>  

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px 180px' }}>
        {activeCategory === 'all' && searchQuery === '' && (
<FeaturedStrip listings={listings} currency={currency} lang={lang} dark={darkMode} onDelete={id => setListings(prev => prev.filter(item => item.id !== id))} />
)}
 
 
        {searchQuery !== '' && (
          <div style={{ background: '#FFF0F1', border: '1px solid #fca5a5', borderRadius: 10, padding: '10px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: '#374151', fontSize: 13 }}>
              {lang==='ar'?'نتائج':'Résultats'}: <span style={{ color: '#E8192C', fontWeight: 700 }}>"{searchQuery}"</span> — {filtered.length} {lang==='ar'?'إعلان':'annonce'}
            </div>
            <button onClick={() => setSearchQuery('')} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: 18 }}>✕</button>
          </div>
        )}
 
        {(activeCategory !== 'all' || searchQuery !== '') ? (
          <div>
            <SectionHeader
              title={activeCategory!=='all' ? SECTIONS.find(s=>s.key===activeCategory)?.label||activeCategory : (lang==='ar'?'نتائج البحث':'Résultats')}
              count={filtered.length} onSeeAll={() => { setActiveCategory('all'); setSearchQuery('') }}
              lang={lang} dark={darkMode}
            />
            {listLoading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>⏳ {lang==='ar'?'جاري التحميل...':'Chargement...'}</div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
                <div style={{ fontSize: 52, marginBottom: 12 }}>📭</div>
                <div>{lang==='ar'?'لا توجد إعلانات':lang==='fr'?'Aucune annonce':'No listings found'}</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14 }}>
               {filtered.map(l => <ListingCard key={l.id} listing={l} currency={currency} allListings={listings} onDelete={id => setListings(prev => prev.filter(item => item.id !== id))} />)}
              </div>
            )}
          </div>
        ) : (
          <div>
            {listLoading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>⏳ {lang==='ar'?'جاري التحميل...':'Chargement...'}</div>
            ) : (
              SECTIONS.map((section, idx) => {
                const sectionListings = applyFilter(listings.filter(l => l.type === section.key))
                if (sectionListings.length === 0) return null
                return (
                  <div key={section.key}>
                    {idx > 0 && idx % 2 === 0 && <AdBanner index={Math.floor(idx/2)-1} lang={lang} />}
                    <div style={{ marginBottom: 32 }}>
                      <SectionHeader title={`${section.icon} ${section.label}`} count={sectionListings.length} onSeeAll={() => setActiveCategory(section.key)} lang={lang} dark={darkMode} />
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14 }}>
                       {sectionListings.slice(0, 4).map(l => <ListingCard key={l.id} listing={l} currency={currency} allListings={listings} onDelete={id => setListings(prev => prev.filter(item => item.id !== id))} />)}                    </div>
               </div>
                  </div>
                )
              })
            )}
          </div>
        )}
 
        <div style={{ background: 'linear-gradient(135deg,#E8192C,#c0392b)', borderRadius: 16, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, boxShadow: '0 8px 24px rgba(232,25,44,0.3)' }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 5 }}>{t(lang,'publish_free')}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>{lang==='ar'?'آلاف المشترين ينتظرون عرضك':lang==='fr'?"Des milliers d'acheteurs attendent":'Thousands of buyers are waiting'}</div>
          </div>
          <button onClick={handlePostClick} style={{ background: 'white', color: '#E8192C', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            {t(lang,'publish_now')} ←
          </button>
        </div>
 
        <div style={{ borderTop: `1px solid ${darkMode?'#2d2d5e':'#e5e7eb'}`, paddingTop: 20, marginTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: '#9ca3af' }}>© 2026 SUN MARKET</div>
          <div style={{ fontSize: 16 }}>🇹🇳 🇩🇿 🇱🇾 🇲🇦</div>
        </div>
      </div>
       
 
      {showAuthModal    && <AuthModal    onClose={() => setShowAuthModal(false)} />}
      {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
      <BottomNav
        onPostClick={handlePostClick}
        onCategoryChange={cat => { setActiveCategory(cat); setSearchQuery('') }}
        onLoginClick={() => setShowProfileModal(true)}
      />
      {/* ─── POST MODAL ─── */}
      {showPostModal && (
        <div onClick={e => e.target===e.currentTarget && setShowPostModal(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 16 }}
        >
          <div style={{ background: 'white', borderRadius: 18, padding: 24, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto', direction: dir }}>
 
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#111827' }}>{t(lang,'post_new_ad')}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontSize: 12, color: '#9ca3af', background: '#f3f4f6', padding: '3px 10px', borderRadius: 20 }}>{postStep} / 3</div>
                <button onClick={() => setShowPostModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#9ca3af' }}>✕</button>
              </div>
            </div>
            <StepBar step={postStep} total={3} />
 
            {/* ── STEP 1 ── */}
            {postStep === 1 && (
              <div>
                {/* نوع الإعلان */}
                <div style={fieldWrap}>
                  <label style={labelStyle}>{t(lang,'ad_type')} *</label>
                  <select value={category} onChange={e => { setCategory(e.target.value); setSubcategory(''); setPhoneBrand(''); setTitle('') }} style={inputStyle}>
                    <option value="">{t(lang,'ad_type_ph')}</option>
                    <option value="car">🚗 {t(lang,'cat_car')}</option>
                    <option value="rent">🔑 {t(lang,'cat_rent')}</option>
                    <option value="electronics">💻 {t(lang,'cat_electronics')}</option>
                    <option value="real">🏠 {t(lang,'cat_real')}</option>
                    <option value="parts">🔧 {t(lang,'cat_parts')}</option>
                  </select>
                </div>
 
                {/* ── تصنيف فرعي العقار ── */}
                {isReal && (
                  <div style={fieldWrap}>
                    <label style={labelStyle}>{lang==='ar'?'نوع العقار':lang==='fr'?'Type de bien':'Property Type'} *</label>
                    <SubcategoryGrid options={SUBCATEGORIES.real[lang]||SUBCATEGORIES.real.ar} value={subcategory} onChange={setSubcategory} />
                  </div>
                )}
 
                {/* ── تصنيف فرعي الإلكترونيات ── */}
                {isElectronics && (
                  <div style={fieldWrap}>
                    <label style={labelStyle}>{lang==='ar'?'نوع الجهاز':lang==='fr'?'Type d\'appareil':'Device Type'} *</label>
                    <SubcategoryGrid options={SUBCATEGORIES.electronics[lang]||SUBCATEGORIES.electronics.ar} value={subcategory} onChange={v => { setSubcategory(v); setPhoneBrand('') }} />
                  </div>
                )}
 
                {/* ── ماركة الهاتف ── */}
                {isMobilePhone && (
                  <div style={fieldWrap}>
                    <label style={labelStyle}>{lang==='ar'?'الماركة':lang==='fr'?'Marque':'Brand'} *</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
                      {PHONE_BRANDS.map(b => (
                        <button key={b.key} type="button" onClick={() => setPhoneBrand(b.key)}
                          style={{ padding: '8px 4px', borderRadius: 10, fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', textAlign: 'center', border: `1.5px solid ${phoneBrand===b.key?'#E8192C':'#e5e7eb'}`, background: phoneBrand===b.key?'#FFF0F1':'white', color: phoneBrand===b.key?'#E8192C':'#374151', fontWeight: phoneBrand===b.key?700:400 }}
                        >{b.label}</button>
                      ))}
                    </div>
                  </div>
                )}
 
                {/* ── حقول السيارة ── */}
                {isCarCategory && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                      <div>
                        <label style={labelStyle}>{t(lang,'car_make')} *</label>
                        <select value={carMake} onChange={e => setCarMake(e.target.value)} style={inputStyle}>
                          <option value="">{t(lang,'car_make_ph')}</option>
                          {CAR_MAKES.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>{t(lang,'car_year')} *</label>
                        <select value={carYear} onChange={e => setCarYear(e.target.value)} style={inputStyle}>
                          <option value="">{t(lang,'car_year_ph')}</option>
                          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={fieldWrap}>
                      <label style={labelStyle}>{t(lang,'car_model')}</label>
                      <input value={carModel} onChange={e => setCarModel(e.target.value)} style={inputStyle} placeholder={t(lang,'car_model_ph')} />
                    </div>
                    <div style={fieldWrap}>
                      <label style={labelStyle}>{t(lang,'car_mileage')} *</label>
                      <input type="number" value={carMileage} onChange={e => setCarMileage(e.target.value)} style={inputStyle} placeholder={t(lang,'car_mileage_ph')} min="0" />
                    </div>
                    <div style={fieldWrap}>
                      <label style={labelStyle}>{t(lang,'car_fuel')} *</label>
                      <PillSelect options={FUEL_OPTIONS} value={carFuel} onChange={setCarFuel} />
                    </div>
                    <div style={fieldWrap}>
                      <label style={labelStyle}>{t(lang,'car_gearbox')} *</label>
                      <PillSelect options={GEAR_OPTIONS} value={carGearbox} onChange={setCarGearbox} />
                    </div>
                    <div style={fieldWrap}>
                      <label style={labelStyle}>{t(lang,'car_condition')}</label>
                      <PillSelect options={COND_OPTIONS} value={carCondition} onChange={setCarCondition} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                      <div>
                        <label style={labelStyle}>{t(lang,'car_body')}</label>
                        <select value={carBody} onChange={e => setCarBody(e.target.value)} style={inputStyle}>
                          <option value="">{t(lang,'car_body_ph')}</option>
                          {BODY_OPTIONS.map(b => <option key={b.key} value={b.key}>{b.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>{t(lang,'car_color')}</label>
                        <input value={carColor} onChange={e => setCarColor(e.target.value)} style={inputStyle} placeholder={t(lang,'car_color_ph')} />
                      </div>
                    </div>
                    {carMake && carYear && (
                      <div style={{ background: '#FFF0F1', border: '1px solid #fca5a5', borderRadius: 8, padding: '8px 14px', marginBottom: 14, fontSize: 12, color: '#6b7280' }}>
                        💡 <span style={{ color: '#E8192C', fontWeight: 700 }}>{carMake} {carModel} {carYear}</span>
                      </div>
                    )}
                  </>
                )}
 
                {/* عنوان الإعلان */}
                {!isCarCategory && category && (
                  <div style={fieldWrap}>
                    <label style={labelStyle}>{t(lang,'ad_title')} *</label>
                    <input value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} placeholder={t(lang,'ad_title_ph')} />
                  </div>
                )}
 
                {/* المنطقة والسعر */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={labelStyle}>{t(lang,'region')} *</label>
                    <select value={region} onChange={e => setRegion(e.target.value)} style={inputStyle}>
                      <option value="">{t(lang,'region_ph')}</option>
                      {regions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>{t(lang,'price')} ({currency}) *</label>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} style={inputStyle} placeholder="0" min="0" />
                  </div>
                </div>
 
                {/* مميز */}
                <div onClick={() => setIsFeatured(v => !v)}
                  style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, background: isFeatured?'#FFFBEB':'#f9fafb', border: `1.5px solid ${isFeatured?'#f59e0b':'#e5e7eb'}`, borderRadius: 10, padding: '10px 14px', cursor: 'pointer' }}
                >
                  <div style={{ width: 20, height: 20, borderRadius: 6, background: isFeatured?'#f59e0b':'white', border: `2px solid ${isFeatured?'#f59e0b':'#d1d5db'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'white' }}>
                    {isFeatured ? '✓' : ''}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: isFeatured?'#92400e':'#374151' }}>⭐ {lang==='ar'?'إعلان مميز':lang==='fr'?'Annonce Premium':'Featured Ad'}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{lang==='ar'?'يظهر في الأعلى دائماً':'Toujours en haut'}</div>
                  </div>
                </div>
 
                <div style={{ marginTop: 10, fontSize: 11, color: '#9ca3af' }}>{t(lang,'required_fields')}</div>
              </div>
            )}
 
            {/* ── STEP 2 ── */}
            {postStep === 2 && (
              <div>
                <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImageChange} />
                <div onClick={() => fileInputRef.current?.click()}
                  style={{ border: '2px dashed #d1d5db', borderRadius: 12, padding: 20, textAlign: 'center', marginBottom: 16, cursor: 'pointer', background: '#f9fafb', color: '#9ca3af' }}
                >
                  {imageUploading ? (
                    <div style={{ color: '#E8192C' }}>⏳ {lang==='ar'?'جاري الرفع...':'Uploading...'}</div>
                  ) : (
                    <>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>📷</div>
                      <div style={{ fontSize: 13 }}>{t(lang,'add_photos')}</div>
                      <div style={{ fontSize: 11, marginTop: 4, color: '#d1d5db' }}>{lang==='ar'?'اضغط لاختيار صور':'Tap to choose images'}</div>
                    </>
                  )}
                </div>
 
                {imageUrls.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                    {imageUrls.map((url, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <img src={url} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }} />
                        <button onClick={() => removeImage(i)} style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#E8192C', border: 'none', color: 'white', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
 
                <div style={fieldWrap}>
                  <label style={labelStyle}>{t(lang,'description')}</label>
                  <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} style={{ ...inputStyle, resize: 'none' }} placeholder={t(lang,'description_ph')} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={labelStyle}>{t(lang,'phone')}</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} placeholder="+216" />
                  </div>
                  <div>
                    <label style={labelStyle}>{t(lang,'whatsapp')}</label>
                    <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} style={inputStyle} placeholder="+216" />
                  </div>
                </div>
                {publishError && (
                  <div style={{ marginTop: 12, background: '#FFF0F1', border: '1px solid #fca5a5', borderRadius: 8, padding: '8px 14px', fontSize: 12, color: '#E8192C' }}>⚠️ {publishError}</div>
                )}
              </div>
            )}
 
            {/* ── STEP 3 success ── */}
            {postStep === 3 && (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 60, marginBottom: 14 }}>✅</div>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: '#111827' }}>{t(lang,'success')}</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>{t(lang,'success_subtitle')}</div>
              </div>
            )}
 
            {/* Buttons */}
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              {postStep < 3 && (
                <button onClick={() => postStep > 1 ? setPostStep(s => s-1) : setShowPostModal(false)}
                  style={{ flex: 1, border: '1.5px solid #e5e7eb', background: 'white', color: '#374151', borderRadius: 10, padding: 12, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  {postStep > 1 ? `← ${t(lang,'back')}` : t(lang,'cancel')}
                </button>
              )}
              <button onClick={handleNext}
                disabled={(postStep===1 && !canProceedStep1()) || publishing || imageUploading}
                style={{
                  flex: 2, color: 'white', border: 'none', borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
                  background: (postStep===1 && !canProceedStep1()) || publishing || imageUploading ? '#fca5a5' : '#E8192C',
                  cursor: (postStep===1 && !canProceedStep1()) || publishing || imageUploading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                {publishing ? '⏳ ...' : postStep===3 ? t(lang,'close') : postStep===2 ? t(lang,'publish_now') : `${t(lang,'next')} ←`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}