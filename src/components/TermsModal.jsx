'use client'
import { useState, useEffect } from 'react'

const TERMS = {
  ar: {
    title: 'الشروط والأحكام',
    subtitle: 'يرجى قراءة الشروط والأحكام بعناية قبل استخدام المنصة',
    sections: [
      {
        title: '1. طبيعة المنصة',
        content: 'SUN MARKET هي منصة إلكترونية توفر فضاءً للإعلان فقط، وتتيح للمستخدمين نشر إعلاناتهم والتواصل فيما بينهم. المنصة ليست طرفاً في أي صفقة أو عملية بيع أو شراء أو تأجير تتم بين المستخدمين.',
      },
      {
        title: '2. إخلاء المسؤولية',
        content: 'لا تتحمل SUN MARKET أي مسؤولية قانونية أو مدنية أو جزائية عن أي غش، تدليس، احتيال، تزوير، أو أي تصرف مخالف للقانون يصدر من أي مستخدم. المسؤولية الكاملة تقع على عاتق الأطراف المتعاملة فيما بينها.',
      },
      {
        title: '3. صحة المعلومات',
        content: 'المستخدم وحده مسؤول عن صحة ودقة المعلومات التي ينشرها. تحتفظ المنصة بحق حذف أي إعلان يخالف الشروط أو القوانين المعمول بها دون إشعار مسبق.',
      },
      {
        title: '4. المحتوى المحظور',
        content: 'يُحظر نشر أي محتوى مخالف للقانون، أو مواد مسروقة، أو منتجات محظورة، أو أي محتوى يمس النظام العام أو الآداب العامة. كل مخالفة تقع المسؤوليتها الكاملة على المستخدم وحده.',
      },
      {
        title: '5. التواصل بين المستخدمين',
        content: 'SUN MARKET لا تتدخل في أي نزاع ينشأ بين المستخدمين، ولا تضمن هوية أي طرف أو مصداقيته. ننصح بالتحقق الشخصي من المنتج والبائع قبل إتمام أي صفقة.',
      },
      {
        title: '6. الملكية الفكرية',
        content: 'جميع حقوق الملكية الفكرية للمنصة محفوظة لـ SUN MARKET. يُحظر نسخ أو استنساخ أي محتوى من المنصة دون إذن كتابي مسبق.',
      },
      {
        title: '7. تعديل الشروط',
        content: 'تحتفظ SUN MARKET بحق تعديل هذه الشروط في أي وقت. الاستمرار في استخدام المنصة بعد التعديل يُعدّ قبولاً ضمنياً للشروط الجديدة.',
      },
      {
        title: '8. القانون المطبق',
        content: 'تخضع هذه الشروط للقوانين المعمول بها في بلد المستخدم. في حال أي نزاع، يكون الاختصاص القضائي للمحاكم المختصة في بلد المستخدم، ولا يحق لأي طرف مقاضاة المنصة أو إدارتها عن أفعال المستخدمين.',
      },
    ],
    accept: 'أوافق على الشروط والأحكام',
    decline: 'لا أوافق',
    warning: 'يجب الموافقة على الشروط والأحكام لاستخدام المنصة',
    scroll: 'يرجى قراءة جميع الشروط قبل الموافقة',
  },
  fr: {
    title: 'Conditions d\'utilisation',
    subtitle: 'Veuillez lire attentivement les conditions avant d\'utiliser la plateforme',
    sections: [
      {
        title: '1. Nature de la plateforme',
        content: 'SUN MARKET est une plateforme d\'annonces en ligne permettant aux utilisateurs de publier et consulter des annonces. La plateforme n\'est partie à aucune transaction entre utilisateurs.',
      },
      {
        title: '2. Limitation de responsabilité',
        content: 'SUN MARKET décline toute responsabilité légale ou civile pour tout acte de fraude, tromperie ou comportement illégal commis par un utilisateur. La responsabilité incombe entièrement aux parties concernées.',
      },
      {
        title: '3. Exactitude des informations',
        content: 'L\'utilisateur est seul responsable de l\'exactitude des informations publiées. La plateforme se réserve le droit de supprimer toute annonce non conforme sans préavis.',
      },
      {
        title: '4. Contenu interdit',
        content: 'Il est interdit de publier tout contenu illégal, produits volés ou contrefaits, ou tout contenu contraire à l\'ordre public. Toute violation relève de la seule responsabilité de l\'utilisateur.',
      },
      {
        title: '5. Communication entre utilisateurs',
        content: 'SUN MARKET n\'intervient pas dans les litiges entre utilisateurs et ne garantit pas l\'identité des parties. Nous recommandons de vérifier personnellement le produit avant toute transaction.',
      },
      {
        title: '6. Propriété intellectuelle',
        content: 'Tous les droits de propriété intellectuelle de la plateforme appartiennent à SUN MARKET. Toute reproduction sans autorisation écrite est interdite.',
      },
      {
        title: '7. Modification des conditions',
        content: 'SUN MARKET se réserve le droit de modifier ces conditions à tout moment. La poursuite de l\'utilisation vaut acceptation des nouvelles conditions.',
      },
      {
        title: '8. Loi applicable',
        content: 'Ces conditions sont régies par les lois du pays de l\'utilisateur. Aucune action en justice ne peut être dirigée contre la plateforme ou son administration pour les actes des utilisateurs.',
      },
    ],
    accept: 'J\'accepte les conditions',
    decline: 'Je refuse',
    warning: 'Vous devez accepter les conditions pour utiliser la plateforme',
    scroll: 'Veuillez lire toutes les conditions avant d\'accepter',
  },
  en: {
    title: 'Terms & Conditions',
    subtitle: 'Please read the terms carefully before using the platform',
    sections: [
      {
        title: '1. Nature of the Platform',
        content: 'SUN MARKET is an online advertising platform that allows users to post and browse listings. The platform is not a party to any transaction between users.',
      },
      {
        title: '2. Disclaimer of Liability',
        content: 'SUN MARKET bears no legal or civil responsibility for any fraud, deception, or illegal act committed by any user. Full responsibility lies with the parties involved.',
      },
      {
        title: '3. Accuracy of Information',
        content: 'The user is solely responsible for the accuracy of posted information. The platform reserves the right to remove any non-compliant listing without prior notice.',
      },
      {
        title: '4. Prohibited Content',
        content: 'Publishing illegal content, stolen goods, or anything contrary to public order is strictly prohibited. Any violation is the sole responsibility of the user.',
      },
      {
        title: '5. User Communication',
        content: 'SUN MARKET does not intervene in disputes between users and does not guarantee anyone\'s identity. We advise personally verifying the product before any transaction.',
      },
      {
        title: '6. Intellectual Property',
        content: 'All intellectual property rights belong to SUN MARKET. Reproduction without written permission is prohibited.',
      },
      {
        title: '7. Changes to Terms',
        content: 'SUN MARKET reserves the right to modify these terms at any time. Continued use of the platform constitutes acceptance of updated terms.',
      },
      {
        title: '8. Governing Law',
        content: 'These terms are governed by the laws of the user\'s country. No legal action may be taken against the platform or its management for the acts of users.',
      },
    ],
    accept: 'I agree to the Terms',
    decline: 'I decline',
    warning: 'You must accept the terms to use the platform',
    scroll: 'Please read all terms before accepting',
  },
}

export default function TermsModal({ lang = 'ar', onAccept }) {
  const [scrolled, setScrolled] = useState(false)
  const [declined, setDeclined] = useState(false)
  const terms = TERMS[lang] || TERMS.ar
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target
    if (scrollTop + clientHeight >= scrollHeight - 40) setScrolled(true)
  }

  const handleAccept = () => {
    localStorage.setItem('sm_terms_accepted', 'true')
    onAccept()
  }

  const handleDecline = () => setDeclined(true)

  if (declined) return (
    <div style={{ position: 'fixed', inset: 0, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 24 }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🚫</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{terms.warning}</div>
        <button
          onClick={() => setDeclined(false)}
          style={{ marginTop: 20, background: '#E8192C', color: 'white', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          {lang === 'ar' ? 'رجوع' : lang === 'fr' ? 'Retour' : 'Go Back'}
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16 }}>
      <div style={{ background: '#0f172a', borderRadius: 20, width: '100%', maxWidth: 520, border: '1px solid rgba(255,255,255,0.1)', direction: dir, display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>📋</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'white', marginBottom: 4 }}>{terms.title}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{terms.subtitle}</div>
        </div>

        {/* Scrollable content */}
        <div
          onScroll={handleScroll}
          style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}
        >
          {terms.sections.map((s, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#E8192C', marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>{s.content}</div>
            </div>
          ))}
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
            © 2026 SUN MARKET — All Rights Reserved
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {!scrolled && (
            <div style={{ fontSize: 11, color: '#f59e0b', textAlign: 'center', marginBottom: 10 }}>
              ⬇ {terms.scroll}
            </div>
          )}
          <button
            onClick={handleAccept}
            disabled={!scrolled}
            style={{
              width: '100%', padding: '13px', borderRadius: 10, border: 'none',
              background: scrolled ? '#E8192C' : 'rgba(255,255,255,0.1)',
              color: scrolled ? 'white' : 'rgba(255,255,255,0.3)',
              fontSize: 14, fontWeight: 700, cursor: scrolled ? 'pointer' : 'not-allowed',
              marginBottom: 8, fontFamily: 'inherit',
            }}
          >✅ {terms.accept}</button>
          <button
            onClick={handleDecline}
            style={{ width: '100%', padding: '11px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
          >🚫 {terms.decline}</button>
        </div>
      </div>
    </div>
  )
}