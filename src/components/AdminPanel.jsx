'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useApp } from '@/context/AppContext'

const ADMIN_EMAIL = 'faycelabidi2006@gmail.com'

const TYPE_COLORS = {
  car: '#3b82f6', rent: '#8b5cf6', electronics: '#f59e0b',
  real: '#10b981', parts: '#ef4444',
}
const TYPE_LABELS = {
  car: '🚗 سيارات', rent: '🔑 تأجير', electronics: '💻 إلكترونيات',
  real: '🏠 عقارات', parts: '🔧 قطع غيار',
}

const DATE_FILTERS = [
  { key: 'today', label: 'اليوم' },
  { key: 'week',  label: 'هذا الأسبوع' },
  { key: 'month', label: 'هذا الشهر' },
  { key: 'all',   label: 'الكل' },
]

export default function AdminPanel({ onClose }) {
  const { user } = useApp()

  // ── 1. كل الـ hooks أولاً ──
  const [tab,        setTab]        = useState('listings')
  const [listings,   setListings]   = useState([])
  const [users,      setUsers]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [dateFilter, setDateFilter] = useState('today')
  const [typeFilter, setTypeFilter] = useState('all')

  // ── 2. fetchAll قبل useEffect ──
  const fetchAll = async () => {
    setLoading(true)
    const { data: listData } = await supabase
      .from('listings').select('*')
      .order('created_at', { ascending: false })
    const { data: userData } = await supabase
      .from('profiles').select('*')
      .order('created_at', { ascending: false })
    setListings(listData || [])
    setUsers(userData || [])
    setLoading(false)
  }

  // ── 3. useEffect بعد fetchAll ──
  useEffect(() => { fetchAll() }, [])

  // ── 4. الشرط بعد كل الـ hooks ──
  if (!user || user.email !== ADMIN_EMAIL) return null

  // ── 5. باقي الكود ──
  const deleteListing = async (id) => {
    await supabase.from('listings').delete().eq('id', id)
    setListings(prev => prev.filter(l => l.id !== id))
  }

  const deleteUser = async (id) => {
    await supabase.from('profiles').delete().eq('id', id)
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  const filterByDate = (items) => {
    const now = new Date()
    return items.filter(item => {
      const created = new Date(item.created_at)
      if (dateFilter === 'today') return created.toDateString() === now.toDateString()
      if (dateFilter === 'week')  { const w = new Date(now); w.setDate(now.getDate()-7); return created >= w }
      if (dateFilter === 'month') return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
      return true
    })
  }

  const filteredListings = filterByDate(listings)
    .filter(l => typeFilter === 'all' || l.type === typeFilter)
    .filter(l => l.title?.toLowerCase().includes(search.toLowerCase()) || l.location?.includes(search))

  const filteredUsers = filterByDate(users)
    .filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))

  const todayListings = listings.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString())

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <div style={{ background: '#0f172a', borderRadius: 20, width: '100%', maxWidth: 720, maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)', direction: 'rtl' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#0f172a', zIndex: 10 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>⚙️ لوحة التحكم</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
              اليوم: {todayListings.length} إعلان جديد — الإجمالي: {listings.length}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 10, width: 36, height: 36, color: 'white', fontSize: 18, cursor: 'pointer' }}>✕</button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, padding: '16px 24px' }}>
          {[
            { label: 'إعلانات اليوم',    value: todayListings.length,                                              icon: '📅', color: '#E8192C' },
            { label: 'إجمالي الإعلانات', value: listings.length,                                                   icon: '📋', color: '#3b82f6' },
            { label: 'المستخدمون',        value: users.length,                                                      icon: '👥', color: '#10b981' },
            { label: 'إجمالي المشاهدات', value: listings.reduce((a,l) => a+(l.views||0), 0).toLocaleString(),     icon: '👁', color: '#f59e0b' },
          ].map((stat, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '12px 14px', border: `1px solid ${stat.color}33` }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{stat.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, padding: '0 24px', marginBottom: 14 }}>
          {[
            { key: 'listings', label: '📋 الإعلانات' },
            { key: 'users',    label: '👥 المستخدمون' },
          ].map(tb => (
            <button key={tb.key} onClick={() => { setTab(tb.key); setSearch('') }}
              style={{ padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: 'none', background: tab===tb.key?'#E8192C':'rgba(255,255,255,0.08)', color: 'white' }}
            >{tb.label}</button>
          ))}
        </div>

        {/* فلتر التاريخ */}
        <div style={{ display: 'flex', gap: 6, padding: '0 24px', marginBottom: 12, flexWrap: 'wrap' }}>
          {DATE_FILTERS.map(f => (
            <button key={f.key} onClick={() => setDateFilter(f.key)}
              style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', border: 'none', background: dateFilter===f.key?'#1d6fa8':'rgba(255,255,255,0.08)', color: 'white', fontWeight: dateFilter===f.key?700:400 }}
            >{f.label}</button>
          ))}
        </div>

        {/* فلتر النوع */}
        {tab === 'listings' && (
          <div style={{ display: 'flex', gap: 6, padding: '0 24px', marginBottom: 14, flexWrap: 'wrap' }}>
            <button onClick={() => setTypeFilter('all')}
              style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', border: 'none', background: typeFilter==='all'?'#6b7280':'rgba(255,255,255,0.08)', color: 'white', fontWeight: typeFilter==='all'?700:400 }}
            >الكل</button>
            {Object.entries(TYPE_LABELS).map(([key, label]) => (
              <button key={key} onClick={() => setTypeFilter(key)}
                style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', border: 'none', background: typeFilter===key?TYPE_COLORS[key]:'rgba(255,255,255,0.08)', color: 'white', fontWeight: typeFilter===key?700:400 }}
              >{label}</button>
            ))}
          </div>
        )}

        {/* Search */}
        <div style={{ padding: '0 24px', marginBottom: 16 }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={tab==='listings'?'ابحث عن إعلان...':'ابحث عن مستخدم...'}
            style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'white', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
          />
        </div>

        {/* عدد النتائج */}
        <div style={{ padding: '0 24px', marginBottom: 10, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          {tab==='listings' ? `${filteredListings.length} إعلان` : `${filteredUsers.length} مستخدم`}
        </div>

        {/* Content */}
        <div style={{ padding: '0 24px 24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.4)' }}>⏳ جاري التحميل...</div>
          ) : tab === 'listings' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredListings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.4)' }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
                  لا توجد إعلانات في هذه الفترة
                </div>
              ) : filteredListings.map(l => (
                <div key={l.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ fontSize: 28, flexShrink: 0 }}>{l.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'white', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>📍 {l.location}</span>
                      <span style={{ fontSize: 11, color: '#E24B4A', fontWeight: 700 }}>{Number(l.price).toLocaleString()}</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>👁 {l.views||0}</span>
                      <span style={{ fontSize: 11, background: (TYPE_COLORS[l.type]||'#666')+'33', color: TYPE_COLORS[l.type]||'#fff', padding: '1px 8px', borderRadius: 20 }}>{TYPE_LABELS[l.type]||l.type}</span>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{new Date(l.created_at).toLocaleDateString('ar')}</span>
                    </div>
                  </div>
                  <button onClick={() => deleteListing(l.id)}
                    style={{ background: '#E8192C', border: 'none', borderRadius: 8, padding: '8px 14px', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
                  >🗑 حذف</button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredUsers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.4)' }}>لا يوجد مستخدمون</div>
              ) : filteredUsers.map(u => (
                <div key={u.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#E8192C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    {u.name?.[0] || '👤'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'white', marginBottom: 4 }}>{u.name||'بدون اسم'}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{u.email||u.id}</div>
                  </div>
                  {u.is_admin && (
                    <span style={{ fontSize: 11, background: '#EF9F2733', color: '#EF9F27', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>أدمن ⭐</span>
                  )}
                  <button onClick={() => deleteUser(u.id)}
                    style={{ background: '#E8192C', border: 'none', borderRadius: 8, padding: '8px 14px', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
                  >🗑 حذف</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}