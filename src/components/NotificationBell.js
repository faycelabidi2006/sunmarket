'use client'
import { useState, useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { supabase } from '@/lib/supabaseClient'
 
export default function NotificationBell() {
  const { user, lang } = useApp()
  const [open,   setOpen]   = useState(false)
  const [notifs, setNotifs] = useState([])
 
  useEffect(() => {
    if (!user) return
    supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => { if (data) setNotifs(data) })
 
    const channel = supabase
      .channel('notifs')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        payload => setNotifs(prev => [payload.new, ...prev])
      )
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [user])
 
  const unread = notifs.filter(n => !n.read).length
 
  const markAllRead = async () => {
    const ids = notifs.filter(n => !n.read).map(n => n.id)
    if (ids.length === 0) return
    await supabase.from('notifications').update({ read: true }).in('id', ids)
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  }
 
  if (!user) return null
 
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => { setOpen(v => !v); if (!open) markAllRead() }}
        style={{
          position: 'relative', background: 'none',
          border: '1px solid #e5e7eb', borderRadius: 8,
          padding: '6px 10px', cursor: 'pointer', fontSize: 18,
        }}
      >
        🔔
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: -6, right: -6,
            background: '#E8192C', color: 'white',
            borderRadius: '50%', width: 18, height: 18,
            fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
 
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 499 }} />
          <div style={{
            position: 'absolute', top: 44, right: 0,
            background: 'white', border: '1px solid #e5e7eb',
            borderRadius: 14, boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
            width: 300, zIndex: 500, overflow: 'hidden',
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
                🔔 {lang==='ar'?'الإشعارات':lang==='fr'?'Notifications':'Notifications'}
              </div>
              <button onClick={markAllRead} style={{ fontSize: 11, color: '#E8192C', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                {lang==='ar'?'قراءة الكل':lang==='fr'?'Tout lire':'Mark all read'}
              </button>
            </div>
            <div style={{ maxHeight: 320, overflowY: 'auto' }}>
              {notifs.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
                  {lang==='ar'?'لا توجد إشعارات':lang==='fr'?'Aucune notification':'No notifications'}
                </div>
              ) : notifs.map(n => (
                <div key={n.id} style={{
                  padding: '10px 16px', borderBottom: '1px solid #f9f9f9',
                  background: n.read ? 'white' : '#FFF5F5',
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                }}>
                  <div style={{ fontSize: 20, flexShrink: 0 }}>{n.icon || '📢'}</div>
                  <div>
                    <div style={{ fontSize: 13, color: '#111827', fontWeight: n.read ? 400 : 600 }}>{n.message}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 3 }}>
                      {new Date(n.created_at).toLocaleDateString(lang==='ar'?'ar-TN':lang==='fr'?'fr-FR':'en-US')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
 