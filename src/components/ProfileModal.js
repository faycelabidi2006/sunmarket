'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useApp } from '@/context/AppContext'

export default function ProfileModal({ onClose }) {
  const { lang, user, setUser } = useApp()

  const [step, setStep]             = useState('init')
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [showPass, setShowPass]     = useState(false)
  const [oldPass, setOldPass]       = useState('')
  const [newPass, setNewPass]       = useState('')
  const [confirmPass, setConfirm]   = useState('')
  const [showOld, setShowOld]       = useState(false)
  const [showNew, setShowNew]       = useState(false)
  const [showCf, setShowCf]         = useState(false)
  const [error, setError]           = useState('')
  const [passErr, setPassErr]       = useState('')
  const [passOk, setPassOk]         = useState(false)
  const [loading, setLoading]       = useState(false)
  const [forgotSent, setForgotSent] = useState(false)
  const [forgotOldSent, setForgotOldSent] = useState(false) // ✅ جديد

  useEffect(() => {
    setPassword(''); setEmail(''); setOldPass(''); setNewPass(''); setConfirm('')
    setShowPass(false); setShowOld(false); setShowNew(false); setShowCf(false)
    setError(''); setPassErr(''); setPassOk(false); setLoading(false)
    setForgotSent(false); setForgotOldSent(false)
    setStep(user ? 'verify' : 'login')
  }, [])

  const t = (ar, fr, en) => lang === 'ar' ? ar : lang === 'fr' ? fr : en

  const handleLogin = async () => {
    setError('')
    if (!email.trim() || !password) { setError(t('أدخل البريد الإلكتروني وكلمة المرور', 'Remplissez tous les champs', 'Fill all fields')); return }
    setLoading(true)
    const { data, error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setLoading(false)
    if (err) { setError(t('البريد أو كلمة المرور غير صحيحة', 'Email ou mot de passe incorrect', 'Incorrect email or password')); return }
    setUser(data.user)
    goTo('profile')
  }

  const handleVerify = async () => {
    setError('')
    if (!password) { setError(t('أدخل كلمة المرور', 'Entrez le mot de passe', 'Enter password')); return }
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email: user.email, password })
    setLoading(false)
    if (err) { setError(t('كلمة المرور غير صحيحة', 'Mot de passe incorrect', 'Incorrect password')); return }
    goTo('profile')
  }

  const handleForgotPass = async () => {
    setError('')
    setLoading(true)
    const { error: err } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    if (err) { setError(t('حدث خطأ، حاول مرة أخرى', "Une erreur s'est produite", 'An error occurred')); return }
    setForgotSent(true)
  }

  // ✅ نسيت كلمة المرور القديمة من شاشة التغيير
  const handleForgotOldPass = async () => {
    setPassErr('')
    setLoading(true)
    const { error: err } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    if (err) { setPassErr(t('حدث خطأ، حاول مرة أخرى', "Une erreur s'est produite", 'An error occurred')); return }
    setForgotOldSent(true)
  }

  const handleChangePass = async () => {
    setPassErr('')
    if (!oldPass || !newPass || !confirmPass) { setPassErr(t('يرجى ملء جميع الحقول', 'Remplissez tous les champs', 'Fill all fields')); return }
    if (newPass.length < 6) { setPassErr(t('كلمة المرور الجديدة قصيرة جداً', 'Mot de passe trop court', 'Password too short')); return }
    if (newPass !== confirmPass) { setPassErr(t('كلمتا المرور غير متطابقتين', 'Les mots de passe ne correspondent pas', 'Passwords do not match')); return }
    setLoading(true)
    const { error: verifyErr } = await supabase.auth.signInWithPassword({ email: user.email, password: oldPass })
    if (verifyErr) { setPassErr(t('كلمة المرور الحالية غير صحيحة', 'Mot de passe actuel incorrect', 'Current password incorrect')); setLoading(false); return }
    const { error: updateErr } = await supabase.auth.updateUser({ password: newPass })
    setLoading(false)
    if (updateErr) { setPassErr(t('حدث خطأ، حاول مرة أخرى', "Une erreur s'est produite", 'An error occurred')); return }
    setPassOk(true)
    setTimeout(() => { setPassOk(false); goTo('profile') }, 2000)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    onClose()
    window.location.href = '/'
  }

  const goTo = (target) => {
    setError(''); setPassErr(''); setPassword(''); setOldPass(''); setNewPass(''); setConfirm('')
    setShowPass(false); setShowOld(false); setShowNew(false); setShowCf(false)
    setForgotSent(false); setForgotOldSent(false); setStep(target)
  }

  const isRtl = lang === 'ar'
  const dir   = isRtl ? 'rtl' : 'ltr'

  const overlayStyle = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 300,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 16px',
  }
  const sheetStyle = {
    background: 'white', borderRadius: 20, padding: '24px 20px 32px',
    width: '100%', maxWidth: 440, direction: dir,
    boxSizing: 'border-box', maxHeight: 'calc(100vh - 40px)', overflowY: 'auto',
  }
  const inputBase = {
    width: '100%', height: 46, borderRadius: 10, border: '1px solid #e5e7eb',
    padding: '0 14px', fontSize: 15, background: '#f9fafb', color: '#111',
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', direction: dir,
  }
  const passInputStyle = { ...inputBase, padding: isRtl ? '0 14px 0 44px' : '0 44px 0 14px' }
  const labelStyle = { fontSize: 12, color: '#6b7280', marginBottom: 6, display: 'block', textAlign: isRtl ? 'right' : 'left' }

  const Handle = () => <div style={{ width: 36, height: 4, background: '#e5e7eb', borderRadius: 99, margin: '0 auto 22px' }} />

  const ErrBox = ({ msg }) => !msg ? null : (
    <div style={{ background: '#fff1f1', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#E24B4A', marginBottom: 12 }}>⚠️ {msg}</div>
  )

  const PrimaryBtn = ({ label, onClick }) => (
    <button onClick={onClick} disabled={loading} style={{ width: '100%', height: 46, background: loading ? '#fca5a5' : '#E8192C', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 10, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      {loading && <span style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />}
      {label}
    </button>
  )

  const SecondaryBtn = ({ label, onClick }) => (
    <button onClick={onClick} style={{ width: '100%', height: 46, background: 'none', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 15, color: '#6b7280', cursor: 'pointer', marginBottom: 10, fontFamily: 'inherit' }}>{label}</button>
  )

  const EyeBtn = ({ show, onToggle }) => (
    <button type="button" onClick={onToggle} style={{ position: 'absolute', [isRtl ? 'left' : 'right']: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', padding: 0 }}>
      {show ? (
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
  )

  const PassField = ({ label, value, onChange, onEnter, show, onToggle, autoFocus, borderOverride }) => (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={{ position: 'relative' }}>
        <input type={show ? 'text' : 'password'} value={value} onChange={onChange}
          onKeyDown={e => e.key === 'Enter' && onEnter?.()} placeholder="••••••••"
          autoFocus={autoFocus} autoComplete="new-password"
          style={{ ...passInputStyle, ...(borderOverride ? { borderColor: borderOverride } : {}) }} />
        <EyeBtn show={show} onToggle={onToggle} />
      </div>
    </div>
  )

  const Spin = () => <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

  if (step === 'init') return null

  // ── تسجيل الدخول ──
  if (step === 'login') return (
    <div style={overlayStyle} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={sheetStyle}>
        <Handle />
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🔒</div>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: '#111', marginBottom: 4 }}>{t('تسجيل الدخول', 'Connexion', 'Login')}</h3>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={labelStyle}>{t('البريد الإلكتروني', 'Email', 'Email')}</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="example@email.com" autoFocus autoComplete="email" style={inputBase} />
        </div>
        <PassField label={t('كلمة المرور', 'Mot de passe', 'Password')} value={password} onChange={e => setPassword(e.target.value)} onEnter={handleLogin} show={showPass} onToggle={() => setShowPass(p => !p)} />
        <ErrBox msg={error} />
        <PrimaryBtn label={t('دخول', 'Se connecter', 'Login')} onClick={handleLogin} />
        <SecondaryBtn label={t('إلغاء', 'Annuler', 'Cancel')} onClick={onClose} />
      </div>
      <Spin />
    </div>
  )

  // ── تأكيد الهوية ──
  if (step === 'verify') return (
    <div style={overlayStyle} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={sheetStyle}>
        <Handle />
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🔐</div>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: '#111', marginBottom: 4 }}>{t('تأكيد الهوية', "Confirmer l'identité", 'Confirm Identity')}</h3>
          <p style={{ fontSize: 13, color: '#6b7280' }}>{t('أدخل كلمة المرور للوصول إلى حسابك', 'Entrez votre mot de passe', 'Enter your password')}</p>
          <p style={{ fontSize: 12, color: '#E8192C', marginTop: 4 }}>{user?.email}</p>
        </div>
        <PassField value={password} onChange={e => setPassword(e.target.value)} onEnter={handleVerify} show={showPass} onToggle={() => setShowPass(p => !p)} autoFocus />
        <ErrBox msg={error} />
        <PrimaryBtn label={t('تأكيد', 'Confirmer', 'Confirm')} onClick={handleVerify} />
        <SecondaryBtn label={t('إلغاء', 'Annuler', 'Cancel')} onClick={onClose} />

        {forgotSent ? (
          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#16a34a', textAlign: 'center', marginTop: 8 }}>
            ✅ {t(`تم إرسال رابط على ${user?.email}`, `Lien envoyé à ${user?.email}`, `Link sent to ${user?.email}`)}
          </div>
        ) : (
          <button onClick={handleForgotPass} disabled={loading} style={{ width: '100%', marginTop: 4, background: 'none', border: 'none', fontSize: 13, color: '#E8192C', cursor: 'pointer', fontFamily: 'inherit', padding: '6px 0' }}>
            {t('نسيت كلمة المرور؟', 'Mot de passe oublié?', 'Forgot password?')}
          </button>
        )}
      </div>
      <Spin />
    </div>
  )

  // ── الملف الشخصي ──
  if (step === 'profile') return (
    <div style={overlayStyle} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={sheetStyle}>
        <Handle />
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#E8192C,#c0392b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 12px' }}>👤</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>{user?.user_metadata?.name || t('مستخدم', 'Utilisateur', 'User')}</div>
          <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{user?.email}</div>
        </div>
        <div style={{ background: '#f9fafb', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 12, fontWeight: 600 }}>{t('معلومات الحساب', 'Informations du compte', 'Account Info')}</div>
          {[
            [t('البريد الإلكتروني', 'Email', 'Email'), user?.email],
            [t('تاريخ التسجيل', "Date d'inscription", 'Joined'), user?.created_at ? new Date(user.created_at).toLocaleDateString(isRtl ? 'ar-TN' : lang === 'fr' ? 'fr-FR' : 'en-US') : '—'],
          ].map(([label, val], i, arr) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
              <span style={{ fontSize: 13, color: '#6b7280' }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{val}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
            <span style={{ fontSize: 13, color: '#6b7280' }}>{t('حالة الحساب', 'Statut', 'Status')}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#0F6E56', background: '#d1fae5', padding: '2px 10px', borderRadius: 20 }}>✓ {t('مفعّل', 'Actif', 'Active')}</span>
          </div>
        </div>
        <button onClick={() => goTo('changePass')} style={{ width: '100%', height: 46, background: 'none', border: '1.5px solid #E8192C', borderRadius: 10, fontSize: 14, color: '#E8192C', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, marginBottom: 10 }}>
          🔑 {t('تغيير كلمة المرور', 'Changer le mot de passe', 'Change Password')}
        </button>
        <button onClick={handleLogout} style={{ width: '100%', height: 46, background: 'none', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, color: '#6b7280', cursor: 'pointer', fontFamily: 'inherit' }}>
          🚪 {t('تسجيل الخروج', 'Se déconnecter', 'Log Out')}
        </button>
      </div>
    </div>
  )

  // ── تغيير كلمة المرور ──
  if (step === 'changePass') return (
    <div style={overlayStyle} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={sheetStyle}>
        <Handle />
        {passOk ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
            <p style={{ fontSize: 16, fontWeight: 500, color: '#0F6E56' }}>{t('تم تغيير كلمة المرور بنجاح', 'Mot de passe modifié avec succès', 'Password changed successfully')}</p>
          </div>
        ) : (
          <>
            <h3 style={{ textAlign: 'center', fontSize: 16, fontWeight: 600, marginBottom: 20, color: '#111' }}>
              🔑 {t('تغيير كلمة المرور', 'Changer le mot de passe', 'Change Password')}
            </h3>

            {/* كلمة المرور الحالية + رابط "نسيت" */}
            <div style={{ marginBottom: 4 }}>
              <label style={labelStyle}>{t('كلمة المرور الحالية', 'Mot de passe actuel', 'Current Password')}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showOld ? 'text' : 'password'} value={oldPass}
                  onChange={e => setOldPass(e.target.value)} placeholder="••••••••"
                  autoFocus autoComplete="new-password"
                  style={passInputStyle}
                />
                <EyeBtn show={showOld} onToggle={() => setShowOld(p => !p)} />
              </div>
            </div>

            {/* ✅ رابط "نسيت كلمة المرور القديمة؟" */}
            <div style={{ textAlign: isRtl ? 'left' : 'right', marginBottom: 14 }}>
              {forgotOldSent ? (
                <span style={{ fontSize: 12, color: '#16a34a' }}>
                  ✅ {t(`تم إرسال رابط على ${user?.email}`, `Lien envoyé à ${user?.email}`, `Link sent to ${user?.email}`)}
                </span>
              ) : (
                <button
                  onClick={handleForgotOldPass}
                  disabled={loading}
                  style={{ background: 'none', border: 'none', fontSize: 12, color: '#E8192C', cursor: 'pointer', fontFamily: 'inherit', padding: 0, textDecoration: 'underline' }}
                >
                  {t('نسيت كلمة المرور القديمة؟', 'Mot de passe oublié?', 'Forgot current password?')}
                </button>
              )}
            </div>

            <PassField
              label={t('كلمة المرور الجديدة', 'Nouveau mot de passe', 'New Password')}
              value={newPass} onChange={e => setNewPass(e.target.value)}
              show={showNew} onToggle={() => setShowNew(p => !p)}
            />
            <PassField
              label={t('تأكيد كلمة المرور الجديدة', 'Confirmer le nouveau mot de passe', 'Confirm New Password')}
              value={confirmPass} onChange={e => setConfirm(e.target.value)}
              onEnter={handleChangePass} show={showCf} onToggle={() => setShowCf(p => !p)}
              borderOverride={confirmPass && confirmPass !== newPass ? '#E24B4A' : undefined}
            />

            <ErrBox msg={passErr} />
            <PrimaryBtn label={t('حفظ كلمة المرور', 'Enregistrer', 'Save Password')} onClick={handleChangePass} />
            <button onClick={() => goTo(user ? 'profile' : 'login')} style={{ width: '100%', height: 42, background: 'none', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, color: '#6b7280', cursor: 'pointer', fontFamily: 'inherit' }}>
              {t('رجوع', 'Retour', 'Back')}
            </button>
          </>
        )}
      </div>
      <Spin />
    </div>
  )

  return null
}