'use client'
import { useEffect } from 'react'

export default function GoogleAdBanner() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {}
  }, [])

  return (
    <div style={{
      position: 'fixed',
      bottom: 65,
      left: 0,
      right: 0,
      zIndex: 98,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'white',
      borderTop: '1px solid #f0f0f0',
      minHeight: 100,
    }}>
      <ins
        className="adsbygoogle"
         style={{ display: 'block', width: '100%', height: 100 }}        data-ad-client="ca-pub-XXXXXXXXXX"
        data-ad-slot="XXXXXXXXXX"
      />
    </div>
  )
}