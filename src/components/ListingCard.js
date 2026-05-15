'use client'
import { useState, useEffect, useCallback } from 'react'
import { useApp } from '@/context/AppContext'
import { supabase } from '@/lib/supabaseClient'

const TYPE_LABELS = {
  car:         { ar:'سيارات',     color:'#3b82f6' },
  rent:        { ar:'تأجير',      color:'#8b5cf6' },
  electronics: { ar:'إلكترونيات', color:'#f59e0b' },
  real:        { ar:'عقارات',     color:'#10b981' },
  real_rent:   { ar:'إيجار عقار', color:'#06b6d4' },
  parts:       { ar:'قطع غيار',   color:'#ef4444' },
}

const APP_NAME = 'SUN MARKET'
const APP_URL  = 'https://sunmarket.app' // ← غيّر للرابط الحقيقي

// ── عرض الصورة بملء الشاشة ──
function FullscreenImage({ images, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex)

  const prev = useCallback(() => setIdx(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIdx(i => (i + 1) % images.length), [images.length])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape')     onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [prev, next, onClose])

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.97)', zIndex:999, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}
    >
      <button onClick={onClose}
        style={{ position:'absolute', top:16, left:16, background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'50%', width:42, height:42, color:'white', fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10 }}
      >✕</button>

      <div style={{ position:'absolute', top:20, left:'50%', transform:'translateX(-50%)', color:'white', fontSize:13, background:'rgba(0,0,0,0.5)', padding:'4px 14px', borderRadius:20 }}>
        {idx + 1} / {images.length}
      </div>

      <img src={images[idx]} alt="" style={{ maxWidth:'95vw', maxHeight:'85vh', objectFit:'contain', borderRadius:10 }} />

      {images.length > 1 && (
        <>
          <button onClick={prev} style={{ position:'absolute', top:'50%', left:16, transform:'translateY(-50%)', background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'50%', width:46, height:46, color:'white', fontSize:24, cursor:'pointer' }}>‹</button>
          <button onClick={next} style={{ position:'absolute', top:'50%', right:16, transform:'translateY(-50%)', background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'50%', width:46, height:46, color:'white', fontSize:24, cursor:'pointer' }}>›</button>
        </>
      )}

      {images.length > 1 && (
        <div style={{ position:'absolute', bottom:16, display:'flex', gap:8, overflowX:'auto', padding:'0 16px', maxWidth:'95vw' }}>
          {images.map((url, i) => (
            <img key={i} src={url} alt="" onClick={() => setIdx(i)}
              style={{ width:56, height:56, objectFit:'cover', borderRadius:8, cursor:'pointer', flexShrink:0, border: i === idx ? '2px solid #E24B4A' : '2px solid transparent', opacity: i === idx ? 1 : 0.6, transition:'all 0.2s' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── زر المشاركة ──
function SharePanel({ listing, onClose }) {
  const title   = encodeURIComponent(`${listing.title} — ${APP_NAME}`)
  const url     = encodeURIComponent(`${APP_URL}/listing/${listing.id}`)
  const text    = encodeURIComponent(`${listing.title}\n💰 ${Number(listing.price).toLocaleString()}\n📍 ${listing.location}\n\n${APP_NAME}: ${APP_URL}`)

  const platforms = [
    { label: 'واتساب',   color: '#25D366', emoji: '💬', href: `https://wa.me/?text=${text}` },
    { label: 'تيليغرام', color: '#0088cc', emoji: '✈️', href: `https://t.me/share/url?url=${url}&text=${title}` },
    { label: 'فيسبوك',   color: '#1877f2', emoji: '👍', href: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
    { label: 'تويتر',    color: '#1da1f2', emoji: '🐦', href: `https://twitter.com/intent/tweet?text=${text}` },
    { label: 'نسخ الرابط', color: '#6b7280', emoji: '🔗', href: null },
  ]

  const copyLink = () => {
    navigator.clipboard.writeText(`${APP_URL}/listing/${listing.id}`)
    alert('تم نسخ الرابط ✓')
  }

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:500, display:'flex', alignItems:'flex-end', justifyContent:'center' }}
    >
      <div style={{ background:'#1e2d42', borderRadius:'20px 20px 0 0', padding:'20px 20px 36px', width:'100%', maxWidth:500, border:'1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ textAlign:'center', color:'white', fontWeight:700, fontSize:15, marginBottom:18 }}>مشاركة الإعلان</div>

        <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:12, padding:12, marginBottom:18, display:'flex', gap:10, alignItems:'center' }}>
          {listing.images?.[0]
            ? <img src={listing.images[0]} alt="" style={{ width:56, height:56, borderRadius:8, objectFit:'cover', flexShrink:0 }} />
            : <div style={{ width:56, height:56, borderRadius:8, background:'#0f172a', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28 }}>{listing.emoji}</div>
          }
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'white', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{listing.title}</div>
            <div style={{ fontSize:12, color:'#E24B4A', fontWeight:700 }}>{Number(listing.price).toLocaleString()} {listing.currency}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:2 }}>🌐 {APP_NAME}</div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, marginBottom:16 }}>
          {platforms.map(p => (
            p.href ? (
              <a key={p.label} href={p.href} target="_blank" rel="noreferrer"
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, textDecoration:'none' }}
              >
                <div style={{ width:48, height:48, borderRadius:'50%', background:p.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>{p.emoji}</div>
                <span style={{ fontSize:10, color:'rgba(255,255,255,0.6)', textAlign:'center' }}>{p.label}</span>
              </a>
            ) : (
              <button key={p.label} onClick={copyLink}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, background:'transparent', border:'none', cursor:'pointer' }}
              >
                <div style={{ width:48, height:48, borderRadius:'50%', background:p.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>{p.emoji}</div>
                <span style={{ fontSize:10, color:'rgba(255,255,255,0.6)', textAlign:'center' }}>{p.label}</span>
              </button>
            )
          ))}
        </div>

        <button onClick={onClose}
          style={{ width:'100%', background:'rgba(255,255,255,0.08)', border:'none', borderRadius:12, padding:12, color:'rgba(255,255,255,0.6)', fontSize:14, cursor:'pointer' }}
        >إلغاء</button>
      </div>
    </div>
  )
}

// ── بطاقة المشابهة ──
function SimilarCard({ item, currency, onClick }) {
  const typeInfo = TYPE_LABELS[item.type] || { ar:'أخرى', color:'#6b7280' }
  const thumb = item.images?.[0]
  return (
    <div onClick={onClick}
      style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, overflow:'hidden', cursor:'pointer', transition:'all 0.15s', minWidth:140, flex:'0 0 140px' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(226,75,74,0.4)'; e.currentTarget.style.background='rgba(226,75,74,0.08)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.background='rgba(255,255,255,0.05)' }}
    >
      <div style={{ height:70, background:'linear-gradient(135deg,#0f1f35,#1a3050)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, position:'relative', overflow:'hidden' }}>
        {thumb
          ? <img src={thumb} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', position:'absolute', inset:0 }} />
          : item.emoji
        }
        <div style={{ position:'absolute', top:6, right:6, background:typeInfo.color, color:'white', fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:20, zIndex:1 }}>
          {typeInfo.ar}
        </div>
      </div>
      <div style={{ padding:'8px 10px' }}>
        <div style={{ fontSize:11, fontWeight:600, color:'white', marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.title}</div>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>👁 {(item.views || 0).toLocaleString()}</div>
        <div style={{ fontSize:13, fontWeight:800, color:'#E24B4A' }}>
          {Number(item.price).toLocaleString()} <span style={{ fontSize:10, fontWeight:400, color:'rgba(255,255,255,0.5)' }}>{currency}</span>
        </div>
        <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', marginTop:3 }}>📍 {item.location}</div>
      </div>
    </div>
  )
}

// ── Modal الإعلان الكامل ──
function ListingModal({ listing, currency, allListings, onClose }) {
  const { lang } = useApp()
  const [liked,        setLiked]        = useState(false)
  const [showPhone,    setShowPhone]    = useState(false)
  const [showWhatsapp, setShowWhatsapp] = useState(false)
  const [current,      setCurrent]      = useState(listing)
  const [views,        setViews]        = useState(listing.views || 0)
  const [activeImg,    setActiveImg]    = useState(0)
  const [fullscreen,   setFullscreen]   = useState(false)
  const [showShare,    setShowShare]    = useState(false)

  const typeInfo = TYPE_LABELS[current.type] || { ar:'أخرى', color:'#6b7280' }
  const images   = current.images || []

  const FUEL_MAP = { petrol:'بنزين', diesel:'ديزل', hybrid:'هجين', electric:'كهربائي', gpl:'غاز' }
  const GEAR_MAP = { auto:'أوتوماتيك', manual:'مانويل', semi:'نصف أوتو' }
  const COND_MAP = { excellent:'ممتازة', very_good:'جيدة جداً', good:'جيدة', needs_repair:'تحتاج إصلاح' }
  const BODY_MAP = { sedan:'سيدان', hatch:'هاتشباك', suv:'SUV', pickup:'بيكاب', van:'فان', cabriolet:'كابريوليه', coupe:'كوبيه', estate:'ستيشن' }

  const isCarType = current.type === 'car' || current.type === 'rent'

  const similar = (allListings || [])
    .filter(l => l.type === current.type && l.id !== current.id)
    .slice(0, 6)

  useEffect(() => {
    const newViews = (current.views || 0) + 1
    setViews(newViews)
    supabase.from('listings').update({ views: newViews }).eq('id', current.id)
  }, [current.id])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && !fullscreen && !showShare) onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [fullscreen, showShare, onClose])

  const handleSimilarClick = (item) => {
    setCurrent(item)
    setViews(item.views || 0)
    setShowPhone(false); setShowWhatsapp(false)
    setLiked(false); setActiveImg(0)
    document.getElementById('listing-modal-scroll')?.scrollTo({ top:0, behavior:'smooth' })
  }

  return (
    <>
      <div
        onClick={e => e.target === e.currentTarget && onClose()}
        style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:300, padding:16 }}
      >
        <div id="listing-modal-scroll"
          style={{ background:'#1e2d42', borderRadius:20, width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto', border:'1px solid rgba(255,255,255,0.12)', direction:'rtl', position:'relative' }}
        >
          {/* ── شريط الصور ── */}
          <div style={{ position:'relative', borderRadius:'20px 20px 0 0', overflow:'hidden' }}>
            {images.length > 0 ? (
              <>
                <div style={{ position:'relative', cursor:'zoom-in' }} onClick={() => setFullscreen(true)}>
                  <img src={images[activeImg]} alt="" style={{ width:'100%', height:240, objectFit:'cover', display:'block' }} />
                  <div style={{ position:'absolute', bottom:10, right:10, background:'rgba(0,0,0,0.55)', color:'white', fontSize:11, padding:'4px 10px', borderRadius:20, display:'flex', alignItems:'center', gap:4 }}>
                    🔍 اضغط للتكبير
                  </div>
                </div>

                {images.length > 1 && (
                  <>
                    <button onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                      style={{ position:'absolute', top:'40%', left:12, transform:'translateY(-50%)', background:'rgba(0,0,0,0.5)', border:'none', borderRadius:'50%', width:36, height:36, color:'white', fontSize:18, cursor:'pointer', zIndex:2 }}>‹</button>
                    <button onClick={() => setActiveImg(i => (i + 1) % images.length)}
                      style={{ position:'absolute', top:'40%', right:12, transform:'translateY(-50%)', background:'rgba(0,0,0,0.5)', border:'none', borderRadius:'50%', width:36, height:36, color:'white', fontSize:18, cursor:'pointer', zIndex:2 }}>›</button>
                    <div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', display:'flex', gap:5, zIndex:2 }}>
                      {images.map((_, i) => (
                        <div key={i} onClick={e => { e.stopPropagation(); setActiveImg(i) }}
                          style={{ width: i===activeImg?18:7, height:7, borderRadius:4, background: i===activeImg?'white':'rgba(255,255,255,0.45)', cursor:'pointer', transition:'all 0.2s' }} />
                      ))}
                    </div>
                  </>
                )}

                {images.length > 1 && (
                  <div style={{ display:'flex', gap:6, padding:'8px 12px', background:'rgba(0,0,0,0.4)', overflowX:'auto' }}>
                    {images.map((url, i) => (
                      <img key={i} src={url} alt="" onClick={() => setActiveImg(i)}
                        style={{ width:54, height:54, objectFit:'cover', borderRadius:8, cursor:'pointer', border: i===activeImg?'2px solid #E24B4A':'2px solid transparent', flexShrink:0 }} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={{ height:220, background:'linear-gradient(135deg, #0f1f35, #1a3050)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:90 }}>
                {current.emoji}
              </div>
            )}

            <button onClick={onClose}
              style={{ position:'absolute', top:14, left:14, background:'rgba(0,0,0,0.6)', border:'1px solid rgba(255,255,255,0.25)', borderRadius:'50%', width:38, height:38, color:'white', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10 }}
            >✕</button>

            <div style={{ position:'absolute', top:14, right:14, background:typeInfo.color, color:'white', fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:20, zIndex:10 }}>{typeInfo.ar}</div>

            {current.featured && (
              <div style={{ position:'absolute', top:52, right:14, background:'#EF9F27', color:'white', fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:20, zIndex:10 }}>مميز ⭐</div>
            )}

            <button onClick={() => setLiked(!liked)}
              style={{ position:'absolute', bottom: images.length>1?72:14, left:14, background:'rgba(0,0,0,0.5)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'50%', width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:18, zIndex:10 }}
            >{liked ? '❤️' : '🤍'}</button>

            <button onClick={() => setShowShare(true)}
              style={{ position:'absolute', bottom: images.length>1?72:14, left:60, background:'rgba(0,0,0,0.5)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'50%', width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:18, zIndex:10 }}
            >📤</button>
          </div>

          {/* ── محتوى الإعلان ── */}
          <div style={{ padding:20 }}>
            <div style={{ marginBottom:16, display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                  <div style={{ fontSize:19, fontWeight:700, color:'white', lineHeight:1.4 }}>{current.title}</div>
                  {current.verified && (
                    <div title="إعلان موثق"
                      style={{ background:'linear-gradient(135deg,#3b82f6,#1d4ed8)', color:'white', fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, display:'flex', alignItems:'center', gap:4, flexShrink:0 }}
                    >✓ موثق</div>
                  )}
                </div>
                <div style={{ fontSize:26, fontWeight:800, color:'#E24B4A' }}>
                  {Number(current.price).toLocaleString()} <span style={{ fontSize:14, fontWeight:400, color:'rgba(255,255,255,0.6)' }}>{currency}</span>
                </div>
              </div>
            </div>

            <div style={{ display:'flex', gap:16, marginBottom:16, flexWrap:'wrap' }}>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.55)' }}>📍 {current.location}</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.55)' }}>🕐 {current.time}</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.55)' }}>👁 {views.toLocaleString()} مشاهدة</div>
            </div>

            {current.tags && current.tags.length > 0 && (
              <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:16 }}>
                {current.tags.map((tag, i) => (
                  <span key={i} style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.7)', fontSize:12, padding:'4px 12px', borderRadius:20 }}>{tag}</span>
                ))}
              </div>
            )}

            {isCarType && (current.car_make || current.car_year || current.car_mileage) && (
              <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:14, marginBottom:16 }}>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:10, fontWeight:600 }}>تفاصيل السيارة</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  {current.car_make      && <Detail icon="🏭" label="الماركة"     value={current.car_make} />}
                  {current.car_model     && <Detail icon="🚘" label="الموديل"     value={current.car_model} />}
                  {current.car_year      && <Detail icon="📅" label="السنة"       value={current.car_year} />}
                  {current.car_mileage   && <Detail icon="📏" label="المسافة"     value={`${Number(current.car_mileage).toLocaleString()} km`} />}
                  {current.car_fuel      && <Detail icon="⛽" label="الوقود"      value={FUEL_MAP[current.car_fuel]      || current.car_fuel} />}
                  {current.car_gearbox   && <Detail icon="⚙️" label="ناقل الحركة" value={GEAR_MAP[current.car_gearbox]   || current.car_gearbox} />}
                  {current.car_condition && <Detail icon="✨" label="الحالة"      value={COND_MAP[current.car_condition] || current.car_condition} />}
                  {current.car_body      && <Detail icon="🚗" label="الهيكل"      value={BODY_MAP[current.car_body]      || current.car_body} />}
                  {current.car_color     && <Detail icon="🎨" label="اللون"       value={current.car_color} />}
                </div>
              </div>
            )}

            {current.description && (
              <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:14, marginBottom:16 }}>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:8, fontWeight:600 }}>الوصف</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.8)', lineHeight:1.7 }}>{current.description}</div>
              </div>
            )}

            <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
              {current.phone && (
                showPhone
                  ? <a href={`tel:${current.phone}`} style={{ background:'#c0392b', color:'white', borderRadius:12, padding:'12px 16px', fontSize:16, fontWeight:700, textAlign:'center', textDecoration:'none', display:'block', letterSpacing:1 }}>📞 {current.phone}</a>
                  : <button onClick={() => setShowPhone(true)} style={{ background:'#E24B4A', color:'white', border:'none', borderRadius:12, padding:'12px 0', fontSize:14, fontWeight:600, cursor:'pointer' }}>📞 إظهار رقم الهاتف</button>
              )}
              {current.whatsapp && (
                showWhatsapp
                  ? <a href={`https://wa.me/${current.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" style={{ background:'#1ebe57', color:'white', borderRadius:12, padding:'12px 16px', fontSize:16, fontWeight:700, textAlign:'center', textDecoration:'none', display:'block', letterSpacing:1 }}>💬 {current.whatsapp}</a>
                  : <button onClick={() => setShowWhatsapp(true)} style={{ background:'#25D366', color:'white', border:'none', borderRadius:12, padding:'12px 0', fontSize:14, fontWeight:600, cursor:'pointer' }}>💬 إظهار رقم واتساب</button>
              )}
              <button onClick={() => setShowShare(true)}
                style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'white', borderRadius:12, padding:'12px 0', fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
              >📤 مشاركة الإعلان</button>
              {!current.phone && !current.whatsapp && (
                <div style={{ background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.4)', borderRadius:12, padding:'12px 0', fontSize:13, textAlign:'center' }}>لم يتم إضافة رقم تواصل</div>
              )}
            </div>

            {similar.length > 0 && (
              <div>
                <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:16, marginBottom:12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ fontSize:14, fontWeight:700, color:'white' }}>إعلانات مشابهة</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>{similar.length} إعلان</div>
                </div>
                <div style={{ display:'flex', gap:10, overflowX:'auto', paddingBottom:8 }}>
                  {similar.map(item => (
                    <SimilarCard key={item.id} item={item} currency={currency} onClick={() => handleSimilarClick(item)} />
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop:20, paddingTop:16, borderTop:'1px solid rgba(255,255,255,0.06)', textAlign:'center', fontSize:11, color:'rgba(255,255,255,0.25)' }}>
              🌟 {APP_NAME} — منصة الإعلانات المجانية
            </div>
          </div>
        </div>
      </div>

      {fullscreen && images.length > 0 && (
        <FullscreenImage images={images} startIndex={activeImg} onClose={() => setFullscreen(false)} />
      )}

      {showShare && (
        <SharePanel listing={current} onClose={() => setShowShare(false)} />
      )}
    </>
  )
}

function Detail({ icon, label, value }) {
  return (
    <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:8, padding:'8px 10px' }}>
      <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', marginBottom:3 }}>{icon} {label}</div>
      <div style={{ fontSize:13, color:'white', fontWeight:600 }}>{value}</div>
    </div>
  )
}

// ── البطاقة الرئيسية ──
export default function ListingCard({ listing, currency, allListings, onDelete }) {
  const { isAdmin } = useApp()
  const [liked,         setLiked]         = useState(false)
  const [showModal,     setShowModal]     = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const typeInfo = TYPE_LABELS[listing.type] || { ar:'أخرى', color:'#6b7280' }
  const thumb    = listing.images?.[0]

  return (
    <>
      <div onClick={() => setShowModal(true)}
        style={{ background:'linear-gradient(145deg, #1e293b, #162032)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden', cursor:'pointer', transition:'transform 0.2s, border-color 0.2s', direction:'rtl' }}
        onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.borderColor='rgba(226,75,74,0.4)' }}
        onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)';    e.currentTarget.style.borderColor='rgba(255,255,255,0.08)' }}
      >
        {/* ✅ صورة البطاقة — مصغّرة من 160 إلى 110 */}
        <div style={{ height:110, background:'linear-gradient(135deg, #0f172a, #1e293b)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', fontSize:40, overflow:'hidden' }}>
          {thumb
            ? <img src={thumb} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', position:'absolute', inset:0 }} />
            : listing.emoji
          }
          {thumb && <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.3), transparent)' }} />}

          <div style={{ position:'absolute', top:8, right:8, background:typeInfo.color, color:'white', fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:20, zIndex:1 }}>{typeInfo.ar}</div>

          {listing.featured && (
            <div style={{ position:'absolute', top:8, left:8, background:'#EF9F27', color:'white', fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:20, zIndex:1 }}>مميز ⭐</div>
          )}

          {listing.verified && (
            <div style={{ position:'absolute', bottom:8, right:8, background:'linear-gradient(135deg,#3b82f6,#1d4ed8)', color:'white', fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:20, zIndex:1, display:'flex', alignItems:'center', gap:3 }}>
              ✓ موثق
            </div>
          )}

          {listing.images?.length > 1 && (
            <div style={{ position:'absolute', bottom:8, left:8, background:'rgba(0,0,0,0.55)', color:'white', fontSize:9, padding:'2px 6px', borderRadius:20, zIndex:1 }}>📷 {listing.images.length}</div>
          )}

          <button onClick={e => { e.stopPropagation(); setLiked(!liked) }}
            style={{ position:'absolute', bottom:8, right: listing.verified ? 60 : 8, background:'rgba(0,0,0,0.4)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'50%', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:13, transition:'all 0.2s', zIndex:1 }}
          >{liked ? '❤️' : '🤍'}</button>
        </div>

        {/* ✅ محتوى البطاقة — padding مصغّر */}
        <div style={{ padding:'10px 12px' }}>
          <div style={{ fontSize:13, fontWeight:600, color:'white', marginBottom:6, lineHeight:1.4, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{listing.title}</div>
          <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'rgba(255,255,255,0.45)', marginBottom:6 }}>📍 {listing.location}</div>
          <div style={{ fontSize:16, fontWeight:800, color:'#E24B4A', marginBottom:6 }}>
            {Number(listing.price).toLocaleString()} <span style={{ fontSize:11, fontWeight:400 }}>{currency}</span>
          </div>
          <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:10 }}>
            {(listing.tags || []).map((tag, i) => (
              <span key={i} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.6)', fontSize:10, padding:'2px 8px', borderRadius:20 }}>{tag}</span>
            ))}
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:8 }}>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>🕐 {listing.time}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>👁 {(listing.views || 0).toLocaleString()}</div>
            </div>
            <div style={{ display:'flex', gap:5 }}>
              {isAdmin && (
                confirmDelete ? (
                  <div style={{ display:'flex', gap:4 }}>
                    <button onClick={e => { e.stopPropagation(); supabase.from('listings').delete().eq('id', listing.id).then(() => onDelete && onDelete(listing.id)) }}
                      style={{ background:'#dc2626', color:'white', border:'none', borderRadius:8, padding:'5px 8px', fontSize:10, fontWeight:700, cursor:'pointer' }}>✓ تأكيد</button>
                    <button onClick={e => { e.stopPropagation(); setConfirmDelete(false) }}
                      style={{ background:'#6b7280', color:'white', border:'none', borderRadius:8, padding:'5px 8px', fontSize:10, cursor:'pointer' }}>✕</button>
                  </div>
                ) : (
                  <button onClick={e => { e.stopPropagation(); setConfirmDelete(true) }}
                    style={{ background:'#dc2626', color:'white', border:'none', borderRadius:8, padding:'5px 10px', fontSize:11, fontWeight:600, cursor:'pointer' }}>🗑</button>
                )
              )}
              <button style={{ background:'#E24B4A', color:'white', border:'none', borderRadius:8, padding:'5px 12px', fontSize:11, fontWeight:600, cursor:'pointer' }}>تفاصيل</button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <ListingModal listing={listing} currency={currency} allListings={allListings} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}