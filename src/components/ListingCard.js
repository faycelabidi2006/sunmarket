'use client'
import { useState, useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { supabase } from '@/lib/supabaseClient'

const TYPE_LABELS = {
  car:         { ar:'سيارات',        color:'#3b82f6' },
  rent:        { ar:'تأجير',         color:'#8b5cf6' },
  electronics: { ar:'إلكترونيات',    color:'#f59e0b' },
  real:        { ar:'عقارات',        color:'#10b981' },
  parts:       { ar:'قطع غيار',      color:'#ef4444' },
}

function SimilarCard({ item, currency, onClick }) {
  const typeInfo = TYPE_LABELS[item.type] || { ar:'أخرى', color:'#6b7280' }
  const thumb = item.images?.[0]
  return (
    <div
      onClick={onClick}
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
        <div style={{ fontSize:11, fontWeight:600, color:'white', marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {item.title}
        </div>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>👁 {(item.views || 0).toLocaleString()}</div>
        <div style={{ fontSize:13, fontWeight:800, color:'#E24B4A' }}>
          {Number(item.price).toLocaleString()} <span style={{ fontSize:10, fontWeight:400, color:'rgba(255,255,255,0.5)' }}>{currency}</span>
        </div>
        <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', marginTop:3 }}>📍 {item.location}</div>
      </div>
    </div>
  )
}

function ListingModal({ listing, currency, allListings, onClose }) {
  const { lang } = useApp()
  const [liked,        setLiked]        = useState(false)
  const [showPhone,    setShowPhone]    = useState(false)
  const [showWhatsapp, setShowWhatsapp] = useState(false)
  const [current,      setCurrent]      = useState(listing)
  const [views,        setViews]        = useState(listing.views || 0)
  const [activeImg,    setActiveImg]    = useState(0)

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
    const incrementViews = async () => {
      const newViews = (current.views || 0) + 1
      setViews(newViews)
      await supabase.from('listings').update({ views: newViews }).eq('id', current.id)
    }
    incrementViews()
  }, [current.id])

  const handleSimilarClick = (item) => {
    setCurrent(item)
    setViews(item.views || 0)
    setShowPhone(false)
    setShowWhatsapp(false)
    setLiked(false)
    setActiveImg(0)
    document.getElementById('listing-modal-scroll')?.scrollTo({ top:0, behavior:'smooth' })
  }

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:300, padding:16 }}
    >
      <div
        id="listing-modal-scroll"
        style={{ background:'#1e2d42', borderRadius:20, width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto', border:'1px solid rgba(255,255,255,0.12)', direction:'rtl' }}
      >
        <div style={{ position:'relative', borderRadius:'20px 20px 0 0', overflow:'hidden' }}>
          {images.length > 0 ? (
            <>
              <img src={images[activeImg]} alt="" style={{ width:'100%', height:240, objectFit:'cover', display:'block' }} />
              {images.length > 1 && (
                <>
                  <button onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)} style={{ position:'absolute', top:'50%', left:12, transform:'translateY(-50%)', background:'rgba(0,0,0,0.5)', border:'none', borderRadius:'50%', width:36, height:36, color:'white', fontSize:18, cursor:'pointer' }}>‹</button>
                  <button onClick={() => setActiveImg(i => (i + 1) % images.length)} style={{ position:'absolute', top:'50%', right:12, transform:'translateY(-50%)', background:'rgba(0,0,0,0.5)', border:'none', borderRadius:'50%', width:36, height:36, color:'white', fontSize:18, cursor:'pointer' }}>›</button>
                  <div style={{ position:'absolute', bottom:10, left:'50%', transform:'translateX(-50%)', display:'flex', gap:5 }}>
                    {images.map((_, i) => (
                      <div key={i} onClick={() => setActiveImg(i)} style={{ width: i === activeImg ? 18 : 7, height:7, borderRadius:4, background: i === activeImg ? 'white' : 'rgba(255,255,255,0.45)', cursor:'pointer', transition:'all 0.2s' }} />
                    ))}
                  </div>
                </>
              )}
              {images.length > 1 && (
                <div style={{ display:'flex', gap:6, padding:'8px 12px', background:'rgba(0,0,0,0.4)', overflowX:'auto' }}>
                  {images.map((url, i) => (
                    <img key={i} src={url} alt="" onClick={() => setActiveImg(i)} style={{ width:54, height:54, objectFit:'cover', borderRadius:8, cursor:'pointer', border: i === activeImg ? '2px solid #E24B4A' : '2px solid transparent', flexShrink:0 }} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{ height:220, background:'linear-gradient(135deg, #0f1f35, #1a3050)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:90 }}>
              {current.emoji}
            </div>
          )}
          <button onClick={onClose} style={{ position:'absolute', top:14, left:14, background:'rgba(0,0,0,0.5)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'50%', width:36, height:36, color:'white', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2 }}>✕</button>
          <div style={{ position:'absolute', top:14, right:14, background:typeInfo.color, color:'white', fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:20, zIndex:2 }}>{typeInfo.ar}</div>
          {current.featured && (
            <div style={{ position:'absolute', bottom: images.length > 1 ? 60 : 14, right:14, background:'#EF9F27', color:'white', fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:20, zIndex:2 }}>مميز ⭐</div>
          )}
          <button onClick={() => setLiked(!liked)} style={{ position:'absolute', bottom: images.length > 1 ? 60 : 14, left:14, background:'rgba(0,0,0,0.5)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'50%', width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:18, zIndex:2 }}>
            {liked ? '❤️' : '🤍'}
          </button>
        </div>

        <div style={{ padding:20 }}>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:20, fontWeight:700, color:'white', marginBottom:8, lineHeight:1.4 }}>{current.title}</div>
            <div style={{ fontSize:26, fontWeight:800, color:'#E24B4A' }}>
              {Number(current.price).toLocaleString()} <span style={{ fontSize:14, fontWeight:400, color:'rgba(255,255,255,0.6)' }}>{currency}</span>
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
              showPhone ? (
                <a href={`tel:${current.phone}`} style={{ background:'#c0392b', color:'white', borderRadius:12, padding:'12px 16px', fontSize:16, fontWeight:700, textAlign:'center', textDecoration:'none', display:'block', letterSpacing:1 }}>📞 {current.phone}</a>
              ) : (
                <button onClick={() => setShowPhone(true)} style={{ background:'#E24B4A', color:'white', border:'none', borderRadius:12, padding:'12px 0', fontSize:14, fontWeight:600, cursor:'pointer' }}>📞 إظهار رقم الهاتف</button>
              )
            )}
            {current.whatsapp && (
              showWhatsapp ? (
                <a href={`https://wa.me/${current.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" style={{ background:'#1ebe57', color:'white', borderRadius:12, padding:'12px 16px', fontSize:16, fontWeight:700, textAlign:'center', textDecoration:'none', display:'block', letterSpacing:1 }}>💬 {current.whatsapp}</a>
              ) : (
                <button onClick={() => setShowWhatsapp(true)} style={{ background:'#25D366', color:'white', border:'none', borderRadius:12, padding:'12px 0', fontSize:14, fontWeight:600, cursor:'pointer' }}>💬 إظهار رقم واتساب</button>
              )
            )}
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
        </div>
      </div>
    </div>
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

export default function ListingCard({ listing, currency, allListings, onDelete }) {
  const { isAdmin } = useApp()
  const [liked,         setLiked]         = useState(false)
  const [showModal,     setShowModal]     = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const typeInfo = TYPE_LABELS[listing.type] || { ar:'أخرى', color:'#6b7280' }
  const thumb = listing.images?.[0]

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        style={{ background:'linear-gradient(145deg, #1e293b, #162032)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden', cursor:'pointer', transition:'transform 0.2s, border-color 0.2s', direction:'rtl' }}
        onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.borderColor='rgba(226,75,74,0.4)' }}
        onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)';    e.currentTarget.style.borderColor='rgba(255,255,255,0.08)' }}
      >
        <div style={{ height:160, background:'linear-gradient(135deg, #0f172a, #1e293b)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', fontSize:64, overflow:'hidden' }}>
          {thumb
            ? <img src={thumb} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', position:'absolute', inset:0 }} />
            : listing.emoji
          }
          {thumb && <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.3), transparent)' }} />}
          <div style={{ position:'absolute', top:12, right:12, background:typeInfo.color, color:'white', fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20, zIndex:1 }}>{typeInfo.ar}</div>
          {listing.featured && (
            <div style={{ position:'absolute', top:12, left:12, background:'#EF9F27', color:'white', fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20, zIndex:1 }}>مميز ⭐</div>
          )}
          {listing.images?.length > 1 && (
            <div style={{ position:'absolute', bottom:10, left:10, background:'rgba(0,0,0,0.55)', color:'white', fontSize:10, padding:'2px 8px', borderRadius:20, zIndex:1 }}>📷 {listing.images.length}</div>
          )}
          <button onClick={e => { e.stopPropagation(); setLiked(!liked) }} style={{ position:'absolute', bottom:12, right:12, background:'rgba(0,0,0,0.4)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'50%', width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:16, transition:'all 0.2s', zIndex:1 }}>
            {liked ? '❤️' : '🤍'}
          </button>
        </div>

        <div style={{ padding:'14px 16px' }}>
          <div style={{ fontSize:14, fontWeight:600, color:'white', marginBottom:10, lineHeight:1.4, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{listing.title}</div>
          <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'rgba(255,255,255,0.45)', marginBottom:10 }}>📍 {listing.location}</div>
          <div style={{ fontSize:20, fontWeight:800, color:'#E24B4A', marginBottom:10 }}>
            {Number(listing.price).toLocaleString()} <span style={{ fontSize:12, fontWeight:400 }}>{currency}</span>
          </div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:14 }}>
            {(listing.tags || []).map((tag, i) => (
              <span key={i} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.6)', fontSize:11, padding:'3px 10px', borderRadius:20 }}>{tag}</span>
            ))}
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:12 }}>
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>🕐 {listing.time}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>👁 {(listing.views || 0).toLocaleString()}</div>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              {isAdmin && (
                confirmDelete ? (
                  <div style={{ display:'flex', gap:4 }}>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        supabase.from('listings').delete().eq('id', listing.id)
                          .then(() => onDelete && onDelete(listing.id))
                      }}
                      style={{ background:'#dc2626', color:'white', border:'none', borderRadius:8, padding:'7px 10px', fontSize:11, fontWeight:700, cursor:'pointer' }}
                    >
                      ✓ تأكيد
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); setConfirmDelete(false) }}
                      style={{ background:'#6b7280', color:'white', border:'none', borderRadius:8, padding:'7px 10px', fontSize:11, cursor:'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={e => { e.stopPropagation(); setConfirmDelete(true) }}
                    style={{ background:'#dc2626', color:'white', border:'none', borderRadius:8, padding:'7px 12px', fontSize:12, fontWeight:600, cursor:'pointer' }}
                  >
                    🗑
                  </button>
                )
              )}
              <button style={{ background:'#E24B4A', color:'white', border:'none', borderRadius:8, padding:'7px 16px', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                تفاصيل
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <ListingModal
          listing={listing}
          currency={currency}
          allListings={allListings}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}