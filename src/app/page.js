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
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Capacitor } from '@capacitor/core'

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 35 }, (_, i) => currentYear - i)

const CAR_MAKES = [
  'تويوتا','هوندا','نيسان','هيونداي','كيا','فولكسفاغن','رينو','بيجو','سيتروين',
  'فورد','شيفروليه','مرسيدس','بي ام دبليو','أودي','فيات','أوبل','ميتسوبيشي',
  'سوزوكي','مازدا','لكزس','سكودا','سيات','داتشيا','لاند روفر','جيب',
  'بورش','فولفو','إنفينيتي','أكيورا','كاديلاك','شيري','جيلي',
  'BYD','MG','هافال','أخرى'
]

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
      {/* ✅ سلايدر أفقي — عرض 160px للبطاقة */}
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
        {featured.map(l => (
          <div key={l.id} style={{ position: 'relative', flexShrink: 0, width: 160 }}>
            <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 10, background: 'linear-gradient(135deg,#EF9F27,#f59e0b)', color: 'white', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>⭐ مميز</div>
            <ListingCard listing={l} currency={currency} allListings={listings} onDelete={onDelete} />
          </div>
        ))}
      </div>
    </div>
  )
}

function HorizontalSection({ section, listings, currency, lang, dark, onSeeAll, onDelete }) {
  if (listings.length === 0) return null
  return (
    <div style={{ marginBottom: 32 }}>
      <SectionHeader
        title={`${section.icon} ${section.label}`}
        count={listings.length}
        onSeeAll={onSeeAll}
        lang={lang}
        dark={dark}
      />
      {/* ✅ سلايدر أفقي — عرض 160px للبطاقة */}
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 10, scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none' }}>
        {listings.slice(0, 10).map(l => (
          <div key={l.id} style={{ flexShrink: 0, width: 160 }}>
            <ListingCard listing={l} currency={currency} allListings={listings} onDelete={onDelete} />
          </div>
        ))}
        {listings.length > 10 && (
          <div
            onClick={onSeeAll}
            style={{ flexShrink: 0, width: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: dark?'#2d2d5e':'#f3f4f6', borderRadius: 16, cursor: 'pointer', gap: 8, color: '#E8192C', fontWeight: 700, fontSize: 13 }}
          >
            <div style={{ fontSize: 24 }}>←</div>
            <div>{lang==='ar'?'عرض الكل':lang==='fr'?'Voir tout':'See All'}</div>
          </div>
        )}
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

  const SEED_LISTINGS = [
    // 🚗 سيارات
    { id: 's1', type: 'car', emoji: '🚗', title: 'تويوتا كامري 2021', location: 'تونس العاصمة', price: 45000, time: 'منذ ساعة', tags: [], featured: true, country: 'tn', description: 'سيارة بحالة ممتازة، مالك واحد، كل الخدمات مكتملة', phone: '+21650000001', whatsapp: '+21650000001', images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400'], car_make: 'تويوتا', car_model: 'كامري', car_year: '2021', car_mileage: '45000', car_fuel: 'petrol', car_gearbox: 'auto', car_condition: 'excellent', car_body: 'sedan', car_color: 'أبيض' },
    { id: 's2', type: 'car', emoji: '🚗', title: 'هيونداي توسان 2020', location: 'صفاقس', price: 52000, time: 'منذ 3 ساعات', tags: [], featured: false, country: 'tn', description: 'SUV بحالة جيدة جداً، فتحة سقف، كاميرا خلفية', phone: '+21650000002', whatsapp: '+21650000002', images: ['https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?w=400'], car_make: 'هيونداي', car_model: 'توسان', car_year: '2020', car_mileage: '62000', car_fuel: 'diesel', car_gearbox: 'auto', car_condition: 'very_good', car_body: 'suv', car_color: 'رمادي' },
    { id: 's3', type: 'car', emoji: '🚗', title: 'رينو كليو 2019', location: 'سوسة', price: 28000, time: 'منذ 5 ساعات', tags: [], featured: false, country: 'tn', description: 'سيارة اقتصادية ممتازة للمدينة، استهلاك منخفض', phone: '+21650000003', whatsapp: '+21650000003', images: ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400'], car_make: 'رينو', car_model: 'كليو', car_year: '2019', car_mileage: '78000', car_fuel: 'petrol', car_gearbox: 'manual', car_condition: 'good', car_body: 'hatch', car_color: 'أحمر' },
    { id: 's4', type: 'car', emoji: '🚗', title: 'فولكسفاغن جولف 2022', location: 'بنزرت', price: 58000, time: 'أمس', tags: [], featured: true, country: 'dz', description: 'جولف 8 بمواصفات عالية، كامل الإكسسوارات', phone: '+21361000001', whatsapp: '+21361000001', images: ['https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=400'], car_make: 'فولكسفاغن', car_model: 'جولف', car_year: '2022', car_mileage: '18000', car_fuel: 'petrol', car_gearbox: 'auto', car_condition: 'excellent', car_body: 'hatch', car_color: 'أسود' },
    // 🔑 تأجير سيارات
    { id: 's5', type: 'rent', emoji: '🔑', title: 'مرسيدس C200 للإيجار', location: 'تونس العاصمة', price: 300, time: 'منذ ساعتين', tags: [], featured: true, country: 'tn', description: 'سيارة فاخرة للإيجار اليومي، مع سائق أو بدون', phone: '+21650000005', whatsapp: '+21650000005', images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400'], car_make: 'مرسيدس', car_model: 'C200', car_year: '2023', car_mileage: '0', car_fuel: 'petrol', car_gearbox: 'auto' },
    { id: 's6', type: 'rent', emoji: '🔑', title: 'كيا سبورتاج للإيجار', location: 'المنستير', price: 150, time: 'منذ يوم', tags: [], featured: false, country: 'tn', description: 'إيجار أسبوعي وشهري متاح، تسليم للمطار', phone: '+21650000006', whatsapp: '+21650000006', images: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400'], car_make: 'كيا', car_model: 'سبورتاج', car_year: '2022', car_mileage: '0', car_fuel: 'petrol', car_gearbox: 'auto' },
    // 📱 إلكترونيات
    { id: 's7', type: 'electronics', emoji: '💻', subcategory: 'elec_mobile', phone_brand: 'apple', title: 'iPhone 15 Pro Max 256GB', location: 'تونس العاصمة', price: 4200, time: 'منذ ساعة', tags: [], featured: true, country: 'tn', description: 'آيفون 15 برو ماكس جديد، ضمان سنة، كل الملحقات', phone: '+21650000007', whatsapp: '+21650000007', images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400'] },
    { id: 's8', type: 'electronics', emoji: '💻', subcategory: 'elec_mobile', phone_brand: 'samsung', title: 'Samsung Galaxy S24 Ultra', location: 'صفاقس', price: 3800, time: 'منذ 3 ساعات', tags: [], featured: false, country: 'tn', description: 'سامسونج S24 الترا، قلم S-Pen، كاميرا 200MP', phone: '+21650000008', whatsapp: '+21650000008', images: ['https://images.unsplash.com/photo-1706439136010-3e9af8a5ed07?w=400'] },
    { id: 's9', type: 'electronics', emoji: '💻', subcategory: 'elec_laptop', title: 'MacBook Pro M3 2024', location: 'تونس العاصمة', price: 6500, time: 'منذ 6 ساعات', tags: [], featured: false, country: 'tn', description: 'ماك بوك برو M3، 16GB RAM، 512GB SSD، كالجديد', phone: '+21650000009', whatsapp: '+21650000009', images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'] },
    { id: 's10', type: 'electronics', emoji: '💻', subcategory: 'elec_tv', title: 'Samsung QLED 65 بوصة', location: 'سوسة', price: 2800, time: 'أمس', tags: [], featured: false, country: 'tn', description: 'تلفزيون سامسونج QLED 4K، سمارت، بحالة ممتازة', phone: '+21650000010', whatsapp: '+21650000010', images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400'] },
    { id: 's11', type: 'electronics', emoji: '💻', subcategory: 'elec_gaming', title: 'PlayStation 5 + جهازين تحكم', location: 'تونس العاصمة', price: 1800, time: 'منذ يومين', tags: [], featured: true, country: 'dz', description: 'PS5 بحالة ممتازة، مع 5 ألعاب، جهازين تحكم', phone: '+21361000002', whatsapp: '+21361000002', images: ['https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400'] },
    // 🏠 عقارات
    { id: 's12', type: 'real', emoji: '🏠', subcategory: 'real_res_sale', title: 'شقة 3 غرف للبيع - حي النصر', location: 'تونس العاصمة', price: 280000, time: 'منذ ساعتين', tags: [], featured: true, country: 'tn', description: 'شقة واسعة 120م², 3 غرف نوم، صالة، مطبخ مجهز، موقف سيارة', phone: '+21650000012', whatsapp: '+21650000012', images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'] },
    { id: 's13', type: 'real', emoji: '🏠', subcategory: 'real_res_rent', title: 'شقة مفروشة للإيجار', location: 'المرسى', price: 1200, time: 'منذ 4 ساعات', tags: [], featured: false, country: 'tn', description: 'شقة مفروشة بالكامل، قريبة من البحر، إنترنت مجاني', phone: '+21650000013', whatsapp: '+21650000013', images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'] },
    { id: 's14', type: 'real', emoji: '🏠', subcategory: 'real_daily', title: 'فيلا للإيجار اليومي - الحمامات', location: 'الحمامات', price: 500, time: 'منذ يوم', tags: [], featured: true, country: 'tn', description: 'فيلا فاخرة مع مسبح خاص، 4 غرف نوم، مطلة على البحر', phone: '+21650000014', whatsapp: '+21650000014', images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400'] },
    { id: 's15', type: 'real', emoji: '🏠', subcategory: 'real_land', title: 'أرض للبيع - منطقة صناعية', location: 'بن عروس', price: 180000, time: 'منذ 3 أيام', tags: [], featured: false, country: 'tn', description: 'أرض 500م² بموقع استراتيجي، قريبة من الطريق السريع', phone: '+21650000015', whatsapp: '+21650000015', images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400'] },
    // 🔧 قطع غيار
    { id: 's16', type: 'parts', emoji: '🔧', title: 'كفرات ميشلان 205/55R16 جديدة', location: 'تونس العاصمة', price: 800, time: 'منذ ساعة', tags: [], featured: false, country: 'tn', description: '4 كفرات ميشلان جديدة، مقاس 205/55R16', phone: '+21650000016', whatsapp: '+21650000016', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'] },
    { id: 's17', type: 'parts', emoji: '🔧', title: 'كاميرا خلفية تويوتا كامري', location: 'صفاقس', price: 120, time: 'منذ 5 ساعات', tags: [], featured: false, country: 'tn', description: 'كاميرا خلفية أصلية لتويوتا كامري 2018-2022', phone: '+21650000017', whatsapp: '+21650000017', images: ['https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400'] },
    { id: 's18', type: 'parts', emoji: '🔧', title: 'بطارية بوش 70 أمبير', location: 'سوسة', price: 280, time: 'أمس', tags: [], featured: false, country: 'tn', description: 'بطارية بوش أصلية 70 أمبير، ضمان سنتين', phone: '+21650000018', whatsapp: '+21650000018', images: ['https://images.unsplash.com/photo-1609592806596-b2a1b5e98e1a?w=400'] },
  ]

  useEffect(() => {
    if (!country) return
    setListings([])
    const timer = setTimeout(() => {
      setListLoading(true)
      supabase.from('listings').select('*').eq('country', country)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error) {
            if (data && data.length > 0) {
              setListings(data)
            } else {
              setListings(SEED_LISTINGS)
            }
          } else {
            setListings(SEED_LISTINGS)
          }
          setListLoading(false)
        })
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

  const uploadBlobToSupabase = async (blob, ext) => {
    try {
      const path = `listings/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const contentType = ext === 'png' ? 'image/png' : 'image/jpeg'
      const { error } = await supabase.storage
        .from('listings')
        .upload(path, blob, {
          cacheControl: '3600',
          upsert: true,
          contentType,
        })
      if (error) {
        return null
      }
      const { data: urlData } = supabase.storage.from('listings').getPublicUrl(path)
      return urlData.publicUrl
    } catch (err) {
      return null
    }
  }

  const handleNativeCamera = async () => {
    setImageUploading(true)
    const uploaded = []
    try {
      await Camera.requestPermissions({ permissions: ['camera', 'photos'] })

      const photo = await Camera.getPhoto({
        quality: 85,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        saveToGallery: true,
      })

      const base64Data = photo.base64String
      const byteCharacters = atob(base64Data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'image/jpeg' })

      const url = await uploadBlobToSupabase(blob, 'jpg')
      if (url) uploaded.push(url)

    } catch (err) {
    }
    setImageUrls(prev => [...prev, ...uploaded])
    setImageUploading(false)
  }

  const handleNativeGallery = async () => {
    setImageUploading(true)
    const uploaded = []
    try {
      await Camera.requestPermissions({ permissions: ['photos'] })

      const result = await Camera.pickImages({
        quality: 85,
        limit: 5,
      })

      for (const photo of result.photos) {
        const response = await fetch(photo.webPath)
        const blob = await response.blob()
        const ext = photo.format || 'jpg'
        const url = await uploadBlobToSupabase(blob, ext)
        if (url) uploaded.push(url)
      }
    } catch (err) {
      console.error('Gallery error:', err)
    }
    setImageUrls(prev => [...prev, ...uploaded])
    setImageUploading(false)
  }

  const handleWebImageChange = async (e) => {
    setImageUploading(true)
    const uploaded = []
    try {
      const files = Array.from(e.target.files)
      for (const file of files) {
        const ext = file.name.split('.').pop()
        const url = await uploadBlobToSupabase(file, ext)
        if (url) uploaded.push(url)
      }
    } catch (err) {
      console.error('Web upload error:', err)
    }
    setImageUrls(prev => [...prev, ...uploaded])
    setImageUploading(false)
    if (e?.target) e.target.value = ''
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 10 }}>
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
                return (
                  <div key={section.key}>
                    {idx > 0 && idx % 2 === 0 && <AdBanner index={Math.floor(idx/2)-1} lang={lang} />}
                    <HorizontalSection
                      section={section}
                      listings={sectionListings}
                      currency={currency}
                      lang={lang}
                      dark={darkMode}
                      onSeeAll={() => setActiveCategory(section.key)}
                      onDelete={id => setListings(prev => prev.filter(item => item.id !== id))}
                    />
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
          <div style={{ fontSize: 12, color: '#9ca3af' }}>© 2026 Souqna Al Magharibi</div>
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

            {postStep === 1 && (
              <div>
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

                {isReal && (
                  <div style={fieldWrap}>
                    <label style={labelStyle}>{lang==='ar'?'نوع العقار':lang==='fr'?'Type de bien':'Property Type'} *</label>
                    <SubcategoryGrid options={SUBCATEGORIES.real[lang]||SUBCATEGORIES.real.ar} value={subcategory} onChange={setSubcategory} />
                  </div>
                )}

                {isElectronics && (
                  <div style={fieldWrap}>
                    <label style={labelStyle}>{lang==='ar'?'نوع الجهاز':lang==='fr'?'Type d\'appareil':'Device Type'} *</label>
                    <SubcategoryGrid options={SUBCATEGORIES.electronics[lang]||SUBCATEGORIES.electronics.ar} value={subcategory} onChange={v => { setSubcategory(v); setPhoneBrand('') }} />
                  </div>
                )}

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

                {!isCarCategory && category && (
                  <div style={fieldWrap}>
                    <label style={labelStyle}>{t(lang,'ad_title')} *</label>
                    <input value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} placeholder={t(lang,'ad_title_ph')} />
                  </div>
                )}

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

            {postStep === 2 && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleWebImageChange}
                />

                {Capacitor.isNativePlatform() ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                    <div
                      onClick={!imageUploading ? handleNativeCamera : undefined}
                      style={{ border: '2px dashed #d1d5db', borderRadius: 12, padding: '18px 10px', textAlign: 'center', cursor: imageUploading ? 'not-allowed' : 'pointer', background: '#f9fafb', color: '#9ca3af' }}
                    >
                      {imageUploading ? (
                        <div style={{ color: '#E8192C', fontSize: 12 }}>⏳ {lang==='ar'?'جاري الرفع...':'Uploading...'}</div>
                      ) : (
                        <>
                          <div style={{ fontSize: 28, marginBottom: 6 }}>📸</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>{lang==='ar'?'التقاط صورة':lang==='fr'?'Prendre photo':'Take Photo'}</div>
                          <div style={{ fontSize: 10, marginTop: 3, color: '#d1d5db' }}>{lang==='ar'?'فتح الكاميرا':'Open Camera'}</div>
                        </>
                      )}
                    </div>
                    <div
                      onClick={!imageUploading ? handleNativeGallery : undefined}
                      style={{ border: '2px dashed #d1d5db', borderRadius: 12, padding: '18px 10px', textAlign: 'center', cursor: imageUploading ? 'not-allowed' : 'pointer', background: '#f9fafb', color: '#9ca3af' }}
                    >
                      {imageUploading ? (
                        <div style={{ color: '#E8192C', fontSize: 12 }}>⏳ {lang==='ar'?'جاري الرفع...':'Uploading...'}</div>
                      ) : (
                        <>
                          <div style={{ fontSize: 28, marginBottom: 6 }}>🖼️</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>{lang==='ar'?'من الغاليري':lang==='fr'?'Galerie':'From Gallery'}</div>
                          <div style={{ fontSize: 10, marginTop: 3, color: '#d1d5db' }}>{lang==='ar'?'اختر حتى 5 صور':'Up to 5 photos'}</div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{ border: '2px dashed #d1d5db', borderRadius: 12, padding: 20, textAlign: 'center', marginBottom: 16, cursor: 'pointer', background: '#f9fafb', color: '#9ca3af' }}
                  >
                    {imageUploading ? (
                      <div style={{ color: '#E8192C' }}>⏳ {lang==='ar'?'جاري الرفع...':'Uploading...'}</div>
                    ) : (
                      <>
                        <div style={{ fontSize: 28, marginBottom: 6 }}>📷</div>
                        <div style={{ fontSize: 13 }}>{t(lang,'add_photos')}</div>
                        <div style={{ fontSize: 11, marginTop: 4, color: '#d1d5db' }}>{lang==='ar'?'اضغط لاختيار صور':'Click to choose images'}</div>
                      </>
                    )}
                  </div>
                )}

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

            {postStep === 3 && (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 60, marginBottom: 14 }}>✅</div>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: '#111827' }}>{t(lang,'success')}</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>{t(lang,'success_subtitle')}</div>
              </div>
            )}

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