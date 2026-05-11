'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useApp } from '@/context/AppContext'

export default function AuthModal({ onClose }) {
  const { lang } = useApp()

  // mode: 'login' | 'register' | 'forgot' | 'forgot_sent'
  const [mode,          setMode]          = useState('login')
  const [email,         setEmail]         = useState('')
  const [password,      setPassword]      = useState('')
  const [name,          setName]          = useState('')
  const [loading,       setLoading]       = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [error,         setError]         = useState('')
  const [showEye,       setShowEye]       = useState(false)

  const isLogin    = mode === 'login'
  const isForgot   = mode === 'forgot'
  const isSent     = mode === 'forgot_sent'
  const isRegister = mode === 'register'

  // ── تسجيل دخول / إنشاء حساب ──
  const handleSubmit = async () => {
    setLoading(true); setError('')
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        onClose()
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        if (data.user) {
          await supabase.from('profiles').insert({ id: data.user.id, name })
          onClose()
        }
      }
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  // ── Google ──
  const handleGoogle = async () => {
    setLoadingGoogle(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    setLoadingGoogle(false)
  }

  // ── نسيت كلمة المرور ──
  const handleForgot = async () => {
    if (!email) { setError(lang==='ar'?'أدخل بريدك الإلكتروني':'Entrez votre email'); return }
    setLoading(true); setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    setMode('forgot_sent')
  }

  const reset = () => { setError(''); setEmail(''); setPassword(''); setName('') }

  const inputStyle = {
    width: '100%', border: '0.5px solid #e5e7eb', borderRadius: 8,
    padding: '10px 12px', fontSize: 14, outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box',
  }

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: 16, boxSizing: 'border-box' }}
    >
      <div style={{ background: 'white', borderRadius: 16, padding: 24, width: '100%', maxWidth: 380, boxSizing: 'border-box' }}>

        {/* ── تم إرسال الإيميل ── */}
        {isSent && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>📧</div>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: '#111' }}>
              {lang==='ar' ? 'تم إرسال الرابط!' : lang==='fr' ? 'Lien envoyé !' : 'Link Sent!'}
            </div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 20, lineHeight: 1.6 }}>
              {lang==='ar'
                ? `تم إرسال رابط إعادة تعيين كلمة المرور إلى ${email}`
                : lang==='fr'
                ? `Un lien a été envoyé à ${email}`
                : `A reset link was sent to ${email}`}
            </div>
            <button onClick={() => { reset(); setMode('login') }}
              style={{ background: '#E8192C', color: 'white', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              {lang==='ar' ? 'العودة لتسجيل الدخول' : lang==='fr' ? 'Retour connexion' : 'Back to Login'}
            </button>
          </div>
        )}

        {/* ── نسيت كلمة المرور ── */}
        {isForgot && (
          <>
            <button onClick={() => { reset(); setMode('login') }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 4, padding: 0, fontFamily: 'inherit' }}>
              ← {lang==='ar' ? 'رجوع' : lang==='fr' ? 'Retour' : 'Back'}
            </button>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔑</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: '#111' }}>
              {lang==='ar' ? 'نسيت كلمة المرور؟' : lang==='fr' ? 'Mot de passe oublié ?' : 'Forgot Password?'}
            </div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>
              {lang==='ar' ? 'أدخل بريدك وسنرسل لك رابط إعادة التعيين' : lang==='fr' ? 'Entrez votre email pour recevoir un lien' : 'Enter your email to receive a reset link'}
            </div>

            {error && (
              <div style={{ background: '#FEE2E2', border: '0.5px solid #FCA5A5', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#DC2626', marginBottom: 14 }}>
                ⚠️ {error}
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 6 }}>
                {lang==='ar' ? 'البريد الإلكتروني' : lang==='fr' ? 'Email' : 'Email'}
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleForgot()}
                style={inputStyle} placeholder="example@email.com" autoFocus />
            </div>

            <button onClick={handleForgot} disabled={loading}
              style={{ width: '100%', background: loading ? '#fca5a5' : '#E8192C', color: 'white', border: 'none', borderRadius: 8, padding: '12px', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxSizing: 'border-box' }}>
              {loading ? '⏳ ...' : lang==='ar' ? 'إرسال رابط التعيين' : lang==='fr' ? 'Envoyer le lien' : 'Send Reset Link'}
            </button>
          </>
        )}

        {/* ── تسجيل دخول / إنشاء حساب ── */}
        {(isLogin || isRegister) && (
          <>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
              {isLogin ? '🔑 تسجيل الدخول' : '✨ إنشاء حساب'}
            </div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>
              {isLogin ? 'مرحباً بعودتك!' : 'انضم لسن ماركت مجاناً'}
            </div>

            {error && (
              <div style={{ background: '#FEE2E2', border: '0.5px solid #FCA5A5', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#DC2626', marginBottom: 14, boxSizing: 'border-box' }}>
                {error}
              </div>
            )}

            {/* زر Google */}
            <button onClick={handleGoogle} disabled={loadingGoogle}
              style={{ width: '100%', background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '11px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16, color: '#374151', boxSizing: 'border-box' }}>
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              {loadingGoogle ? '⏳ جاري...' : lang==='ar' ? 'تسجيل بحساب Google' : lang==='fr' ? 'Connexion avec Google' : 'Sign in with Google'}
            </button>

            {/* فاصل */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
              <span style={{ fontSize: 12, color: '#9ca3af' }}>{lang==='ar' ? 'أو' : 'ou'}</span>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            </div>

            {isRegister && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 6 }}>الاسم الكامل</label>
                <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} placeholder="مثال: محمد الحمادي" />
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 6 }}>البريد الإلكتروني</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="example@email.com" />
            </div>

            <div style={{ marginBottom: isLogin ? 8 : 20 }}>
              <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 6 }}>كلمة المرور</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showEye ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  style={{ ...inputStyle, padding: '10px 40px 10px 12px' }}
                  placeholder="6 أحرف على الأقل"
                />
                <button type="button" onClick={() => setShowEye(!showEye)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center' }}>
                  {showEye ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* ✅ نسيت كلمة المرور — تظهر فقط في وضع تسجيل الدخول */}
            {isLogin && (
              <div style={{ textAlign: 'left', marginBottom: 20 }}>
                <span
                  onClick={() => { reset(); setMode('forgot') }}
                  style={{ fontSize: 12, color: '#E8192C', cursor: 'pointer', fontWeight: 600 }}
                >
                  {lang==='ar' ? 'نسيت كلمة المرور؟' : lang==='fr' ? 'Mot de passe oublié ?' : 'Forgot password?'}
                </span>
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading}
              style={{ width: '100%', background: '#E24B4A', color: 'white', border: 'none', borderRadius: 8, padding: '12px', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1, boxSizing: 'border-box' }}>
              {loading ? '⏳ جاري...' : isLogin ? 'دخول' : 'إنشاء حساب'}
            </button>

            <div style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: '#6b7280' }}>
              {isLogin ? 'ما عندكش حساب؟' : 'عندك حساب؟'}
              <span onClick={() => { reset(); setMode(isLogin ? 'register' : 'login') }}
                style={{ color: '#E24B4A', cursor: 'pointer', fontWeight: 600, marginRight: 4 }}>
                {isLogin ? ' سجّل الآن' : ' سجّل دخول'}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}