'use client'
import { useState } from 'react'

export default function ChangePasswordModal({ onClose, lang }) {
  const [oldPass, setOldPass]     = useState('')
  const [newPass, setNewPass]     = useState('')
  const [confirmPass, setConfirm] = useState('')
  const [err, setErr]             = useState('')
  const [success, setSuccess]     = useState(false)
  const [showOld, setShowOld]     = useState(false)
  const [showNew, setShowNew]     = useState(false)
  const [showCf, setShowCf]       = useState(false)
  const [loading, setLoading]     = useState(false)

  const t = (ar, fr, en) =>
    lang === 'ar' ? ar : lang === 'fr' ? fr : en

  const getStrength = (val) => {
    let s = 0
    if (val.length >= 6) s++
    if (val.length >= 10) s++
    if (/[A-Z]/.test(val) || /[a-z]/.test(val)) s++
    if (/[0-9]/.test(val)) s++
    if (/[^A-Za-z0-9]/.test(val)) s++
    return s
  }

  const strengthColors = ['#E24B4A', '#EF9F27', '#BA7517', '#1D9E75', '#0F6E56']
  const strengthLabels = [
    t('ضعيفة جداً', 'Très faible', 'Very weak'),
    t('ضعيفة', 'Faible', 'Weak'),
    t('متوسطة', 'Moyenne', 'Medium'),
    t('قوية', 'Forte', 'Strong'),
    t('قوية جداً ✓', 'Très forte ✓', 'Very strong ✓'),
  ]

  const strength = newPass ? Math.max(1, getStrength(newPass)) : 0

  const handleSave = async () => {
    setErr('')

    if (!oldPass || !newPass || !confirmPass) {
      setErr(t('يرجى ملء جميع الحقول', 'Veuillez remplir tous les champs', 'Please fill all fields'))
      return
    }
    if (newPass.length < 6) {
      setErr(t('كلمة المرور الجديدة قصيرة جداً (6 أحرف على الأقل)', 'Mot de passe trop court (6 caractères min)', 'Password too short (min 6 chars)'))
      return
    }
    if (newPass !== confirmPass) {
      setErr(t('كلمتا المرور غير متطابقتين', 'Les mots de passe ne correspondent pas', 'Passwords do not match'))
      return
    }
    if (newPass === oldPass) {
      setErr(t('كلمة المرور الجديدة مطابقة للقديمة', 'Le nouveau mot de passe est identique à l\'ancien', 'New password same as old'))
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass }),
      })
      const data = await res.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(onClose, 2500)
      } else {
        setErr(data.message || t('كلمة المرور الحالية غير صحيحة', 'Mot de passe actuel incorrect', 'Current password is incorrect'))
      }
    } catch {
      setErr(t('حدث خطأ، حاول مرة أخرى', 'Une erreur s\'est produite', 'An error occurred, try again'))
    } finally {
      setLoading(false)
    }
  }

  const EyeToggle = ({ show, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      style={{
        position: 'absolute',
        left: 12,
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        color: '#9ca3af',
        display: 'flex',
        alignItems: 'center',
      }}
    >
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

  const inputStyle = {
    width: '100%',
    height: 46,
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    padding: lang === 'ar' ? '0 14px 0 40px' : '0 40px 0 14px',
    fontSize: 14,
    background: '#f9fafb',
    color: '#111',
    outline: 'none',
    direction: lang === 'ar' ? 'rtl' : 'ltr',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
    display: 'block',
    textAlign: lang === 'ar' ? 'right' : 'left',
  }

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        zIndex: 300,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '20px 20px 0 0',
          padding: '24px 20px 40px',
          width: '100%',
          maxWidth: 480,
          direction: lang === 'ar' ? 'rtl' : 'ltr',
        }}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: '#e5e7eb', borderRadius: 99, margin: '0 auto 20px' }} />

        {success ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
            <p style={{ fontSize: 16, fontWeight: 500, color: '#0F6E56' }}>
              {t('تم تغيير كلمة المرور بنجاح', 'Mot de passe modifié avec succès', 'Password changed successfully')}
            </p>
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>
              {t('سيتم إغلاق هذه النافذة تلقائياً...', 'Fermeture automatique...', 'Closing automatically...')}
            </p>
          </div>
        ) : (
          <>
            <h3 style={{ textAlign: 'center', fontSize: 16, fontWeight: 600, marginBottom: 6, color: '#111' }}>
              🔑 {t('تغيير كلمة المرور', 'Changer le mot de passe', 'Change Password')}
            </h3>
            <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', marginBottom: 24 }}>
              {t('أدخل كلمة المرور الحالية ثم الجديدة', 'Entrez votre mot de passe actuel puis le nouveau', 'Enter your current password then the new one')}
            </p>

            {/* كلمة المرور الحالية */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>
                {t('كلمة المرور الحالية', 'Mot de passe actuel', 'Current Password')}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showOld ? 'text' : 'password'}
                  value={oldPass}
                  onChange={e => setOldPass(e.target.value)}
                  placeholder="••••••••"
                  style={inputStyle}
                  autoFocus
                />
                <EyeToggle show={showOld} onToggle={() => setShowOld(!showOld)} />
              </div>
            </div>

            {/* كلمة المرور الجديدة */}
            <div style={{ marginBottom: 8 }}>
              <label style={labelStyle}>
                {t('كلمة المرور الجديدة', 'Nouveau mot de passe', 'New Password')}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  placeholder="••••••••"
                  style={inputStyle}
                />
                <EyeToggle show={showNew} onToggle={() => setShowNew(!showNew)} />
              </div>
            </div>

            {/* مؤشر قوة كلمة المرور */}
            {newPass.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ height: 4, background: '#e5e7eb', borderRadius: 99, overflow: 'hidden', marginBottom: 4 }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(strength / 5) * 100}%`,
                      background: strengthColors[strength - 1],
                      borderRadius: 99,
                      transition: 'width 0.3s, background 0.3s',
                    }}
                  />
                </div>
                <span style={{ fontSize: 11, color: strengthColors[strength - 1] }}>
                  {strengthLabels[strength - 1]}
                </span>
              </div>
            )}

            {/* تأكيد كلمة المرور */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>
                {t('تأكيد كلمة المرور الجديدة', 'Confirmer le nouveau mot de passe', 'Confirm New Password')}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCf ? 'text' : 'password'}
                  value={confirmPass}
                  onChange={e => setConfirm(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSave()}
                  placeholder="••••••••"
                  style={{
                    ...inputStyle,
                    borderColor: confirmPass && confirmPass !== newPass ? '#E24B4A' : '#e5e7eb',
                  }}
                />
                <EyeToggle show={showCf} onToggle={() => setShowCf(!showCf)} />
              </div>
              {confirmPass && confirmPass !== newPass && (
                <span style={{ fontSize: 11, color: '#E24B4A', marginTop: 4, display: 'block' }}>
                  {t('كلمتا المرور غير متطابقتين', 'Les mots de passe ne correspondent pas', 'Passwords do not match')}
                </span>
              )}
            </div>

            {/* رسالة الخطأ */}
            {err && (
              <div style={{
                background: '#fff1f1',
                border: '1px solid #fecaca',
                borderRadius: 8,
                padding: '10px 14px',
                fontSize: 13,
                color: '#E24B4A',
                marginBottom: 16,
                textAlign: lang === 'ar' ? 'right' : 'left',
              }}>
                ⚠️ {err}
              </div>
            )}

            {/* زر الحفظ */}
            <button
              onClick={handleSave}
              disabled={loading}
              style={{
                width: '100%',
                height: 46,
                background: loading ? '#f87171' : '#E8192C',
                color: 'white',
                border: 'none',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: 10,
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'background 0.2s',
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: 16, height: 16, border: '2px solid white',
                    borderTopColor: 'transparent', borderRadius: '50%',
                    display: 'inline-block', animation: 'spin 0.7s linear infinite',
                  }} />
                  {t('جاري الحفظ...', 'Enregistrement...', 'Saving...')}
                </>
              ) : (
                t('حفظ كلمة المرور', 'Enregistrer', 'Save Password')
              )}
            </button>

            {/* زر الإلغاء */}
            <button
              onClick={onClose}
              style={{
                width: '100%',
                height: 42,
                background: 'none',
                border: '1px solid #e5e7eb',
                borderRadius: 10,
                fontSize: 14,
                color: '#6b7280',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {t('إلغاء', 'Annuler', 'Cancel')}
            </button>
          </>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}