'use client'
import { useApp } from '@/context/AppContext'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ChangePasswordModal from './ChangePasswordModal'

export default function BottomNav({ onPostClick, onCategoryChange, onLoginClick }) {
  const { lang, user } = useApp()
  const [active, setActive]             = useState('home')
  const [showPassModal, setShowPass]    = useState(false)
  const [showChangePass, setShowChange] = useState(false)
  const [emailInput, setEmailInput]     = useState('')
  const [passInput, setPassInput]       = useState('')
  const [passErr, setPassErr]           = useState('')

  const handleClick = (key, category) => {
    setActive(key)
    if (category && onCategoryChange) {
      onCategoryChange(category)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const onProfileClick = () => {
    handleClick('profile', null)
    if (user) {
      // مسجل → فتح ProfileModal عبر page.js
      if (onLoginClick) onLoginClick()
    } else {
      // غير مسجل → فتح modal تسجيل الدخول المحلي بعد تصفير الحقول
      setEmailInput('')
      setPassInput('')
      setPassErr('')
      setShowPass(true)
    }
  }

  const handleLogin = async () => {
    setPassErr('')
    if (!emailInput) {
      setPassErr(lang==='ar'?'أدخل البريد الإلكتروني':lang==='fr'?'Entrez votre email':'Enter your email')
      return
    }
    if (!passInput) {
      setPassErr(lang==='ar'?'أدخل كلمة المرور':lang==='fr'?'Entrez le mot de passe':'Enter password')
      return
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInput,
        password: passInput,
      })
      if (error || !data.user) {
        setPassErr(lang==='ar'?'البريد الإلكتروني أو كلمة المرور غير صحيحة':lang==='fr'?'Email ou mot de passe incorrect':'Incorrect email or password')
        setPassInput('')
        return
      }
      // نجح الدخول → أغلق المودال وافتح ProfileModal
      setShowPass(false)
      setEmailInput('')
      setPassInput('')
      if (onLoginClick) onLoginClick()
    } catch {
      setPassErr(lang==='ar'?'حدث خطأ، حاول مرة أخرى':lang==='fr'?"Une erreur s'est produite":'An error occurred')
    }
  }

  const items = [
    {
      key: 'home',
      label: lang==='ar'?'الرئيسية':lang==='fr'?'Accueil':'Home',
      onClick: () => handleClick('home', 'all'),
      icon: (color) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z" fill={color} />
        </svg>
      ),
    },
    {
      key: 'myads',
      label: lang==='ar'?'إعلاناتي':lang==='fr'?'Mes annonces':'My Ads',
      onClick: () => handleClick('myads', null),
      icon: (color) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="3" width="16" height="18" rx="2" stroke={color} strokeWidth="2" fill="none"/>
          <line x1="8" y1="8" x2="16" y2="8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          <line x1="8" y1="12" x2="16" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          <line x1="8" y1="16" x2="12" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      key: 'post',
      label: lang==='ar'?'نشر':lang==='fr'?'Publier':'Post',
      isPost: true,
    },
    {
      key: 'favourites',
      label: lang==='ar'?'المحفوظات':lang==='fr'?'Favoris':'Saved',
      onClick: () => handleClick('favourites', null),
      icon: (color) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z"
            fill={color==='#E8192C'?'#E8192C':'none'}
            stroke={color} strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      key: 'profile',
      label: lang==='ar'?'حسابي':lang==='fr'?'Profil':'Profile',
      onClick: onProfileClick,
      icon: (color) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" fill="none"/>
          <path d="M4 20C4 17 7.58 14 12 14C16.42 14 20 17 20 20" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
        </svg>
      ),
    },
  ]

  const overlayStyle = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
    zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
  }
  const sheetStyle = {
    background: 'white', borderRadius: '20px 20px 0 0',
    padding: '24px 20px 44px', width: '100%', maxWidth: 480,
    direction: lang==='ar'?'rtl':'ltr',
  }
  const inputStyle = {
    width: '100%', height: 46, borderRadius: 10, border: '1px solid #e5e7eb',
    padding: '0 14px', fontSize: 15, background: '#f9fafb', color: '#111',
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
    direction: lang==='ar'?'rtl':'ltr',
  }
  const passInputStyle = {
    ...inputStyle,
    padding: lang==='ar'?'0 14px 0 44px':'0 44px 0 14px',
  }

  return (
    <>
      {/* ── شريط التنقل ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'white', borderTop: '1px solid #f0f0f0',
        display: 'flex', justifyContent: 'space-evenly', alignItems: 'center',
        padding: '8px 0 14px', zIndex: 99, boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
      }}>
        {items.map((item, i) => {
          const isActive = active === item.key
          const color = isActive ? '#E8192C' : '#9ca3af'

          if (item.isPost) return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <button
                onClick={onPostClick}
                style={{
                  width: 50, height: 50, background: '#E8192C', borderRadius: '50%',
                  border: '3px solid white', boxShadow: '0 4px 14px rgba(232,25,44,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, color: 'white', cursor: 'pointer', marginTop: -20,
                  fontFamily: 'inherit', lineHeight: 1,
                }}
              >+</button>
              <div style={{ fontSize: 10, color: '#E8192C', fontWeight: 700, marginTop: 2 }}>{item.label}</div>
            </div>
          )

          return (
            <div key={i} onClick={item.onClick} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, cursor: 'pointer', padding: '0 4px', minWidth: 0,
            }}>
              {item.icon(color)}
              <div style={{ fontSize: 10, color, fontWeight: isActive?700:400, transition: 'color 0.2s' }}>
                {item.label}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── مودال تسجيل الدخول (غير مسجل فقط) ── */}
      {showPassModal && (
        <div style={overlayStyle} onClick={e => e.target===e.currentTarget && setShowPass(false)}>
          <div style={sheetStyle}>
            <div style={{ width: 36, height: 4, background: '#e5e7eb', borderRadius: 99, margin: '0 auto 22px' }} />

            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 44, marginBottom: 8 }}>🔒</div>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: '#111', marginBottom: 4 }}>
                {lang==='ar'?'تسجيل الدخول':lang==='fr'?'Connexion':'Login'}
              </h3>
              <p style={{ fontSize: 13, color: '#6b7280' }}>
                {lang==='ar'?'أدخل بياناتك للوصول إلى حسابك':lang==='fr'?'Entrez vos informations':'Enter your details'}
              </p>
            </div>

            {/* إيميل */}
            <div style={{ marginBottom: 10 }}>
              <input
                type="email" value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                onKeyDown={e => e.key==='Enter' && handleLogin()}
                placeholder={lang==='ar'?'البريد الإلكتروني':lang==='fr'?'Email':'Email'}
                autoFocus style={inputStyle}
              />
            </div>

            {/* كلمة المرور — مخفية دائماً بدون زر إظهار */}
            <div style={{ marginBottom: 12 }}>
              <input
                type="password"
                value={passInput}
                onChange={e => setPassInput(e.target.value)}
                onKeyDown={e => e.key==='Enter' && handleLogin()}
                placeholder="••••••••"
                style={inputStyle}
                autoComplete="current-password"
              />
            </div>

            {passErr && (
              <div style={{ background: '#fff1f1', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#E24B4A', marginBottom: 12 }}>
                ⚠️ {passErr}
              </div>
            )}

            <button onClick={handleLogin} style={{
              width: '100%', height: 46, background: '#E8192C', color: 'white',
              border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600,
              cursor: 'pointer', marginBottom: 10, fontFamily: 'inherit',
            }}>
              {lang==='ar'?'دخول':lang==='fr'?'Se connecter':'Login'}
            </button>

            <button onClick={() => setShowPass(false)} style={{
              width: '100%', height: 42, background: 'none', border: '1px solid #e5e7eb',
              borderRadius: 10, fontSize: 14, color: '#6b7280', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {lang==='ar'?'إلغاء':lang==='fr'?'Annuler':'Cancel'}
            </button>

            <button onClick={() => { setShowPass(false); setShowChange(true) }} style={{
              width: '100%', marginTop: 10, background: 'none', border: 'none',
              fontSize: 13, color: '#E8192C', cursor: 'pointer', fontFamily: 'inherit', padding: '6px 0',
            }}>
              {lang==='ar'?'نسيت كلمة المرور؟':lang==='fr'?'Mot de passe oublié?':'Forgot password?'}
            </button>
          </div>
        </div>
      )}

      {showChangePass && (
        <ChangePasswordModal
          lang={lang}
          onClose={() => {
            setShowChange(false)
            // لا نفتح أي شيء — نرجع للصفحة الرئيسية فقط
            setShowPass(false)
            setEmailInput('')
            setPassInput('')
            setPassErr('')
          }}
        />
      )}
    </>
  )
}