'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
const AppContext = createContext()

const COUNTRY_CODE_MAP = {
  TN: 'tn', DZ: 'dz', LY: 'ly', MA: 'ma',
}

export function AppProvider({ children }) {
  const [lang,     setLangState]    = useState('ar')
  const [user,     setUser]         = useState(null)
  const [favorites, setFavorites]   = useState([])
  const [country,  setCountryState] = useState(null)
  const [region,   setRegionState]  = useState(null)
  const [loading,  setLoading]      = useState(true)
  const [darkMode, setDarkMode]     = useState(false)

  useEffect(() => {
    const savedCountry  = localStorage.getItem('tm_country')
    const savedLang     = localStorage.getItem('tm_lang')
    const savedRegion   = localStorage.getItem('tm_region')
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'

    if (savedLang)    setLangState(savedLang)
    if (savedDarkMode) setDarkMode(savedDarkMode)

    if (savedCountry) {
      setCountryState(savedCountry.toLowerCase())
      if (savedRegion) setRegionState(savedRegion)
      setLoading(false)
    } else {
      detectCountry()
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
    document.body.style.background = darkMode ? '#0f172a' : '#f8f9fa'
  }, [darkMode])
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null)
  })

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null)
  })

  return () => subscription.unsubscribe()
}, [])
  const detectCountry = async () => {
    try {
      const res  = await fetch('https://ipapi.co/json/')
      const data = await res.json()
      const code = COUNTRY_CODE_MAP[data.country_code]
      if (code) {
        setCountryState(code)
        localStorage.setItem('tm_country', code)
      }
    } catch {
      // فشل الكشف
    } finally {
      setLoading(false)
    }
  }

  const setCountry = (code) => {
    const lower = code.toLowerCase()
    localStorage.setItem('tm_country', lower)
    setCountryState(lower)
  }

  const setRegion = (r) => {
    localStorage.setItem('tm_region', r)
    setRegionState(r)
  }

  const setCountryAndRegion = (code, r) => {
    const lower = code.toLowerCase()
    localStorage.setItem('tm_country', lower)
    localStorage.setItem('tm_region', r)
    setCountryState(lower)
    setRegionState(r)
  }

  const resetCountry = () => {
    localStorage.removeItem('tm_country')
    localStorage.removeItem('tm_region')
    setCountryState(null)
    setRegionState(null)
  }

  const setLang = (l) => {
    localStorage.setItem('tm_lang', l)
    setLangState(l)
  }

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }
  const ADMIN_EMAILS = [
  'faycelabidi2024@gmail.com',
  'faycelabidi2006@gmail.com',
  'faycelabidi2016@gmail.com',
  'wafasaned@gmail.com'
]
     const isAdmin = ADMIN_EMAILS.includes(user?.email?.toLowerCase())

  return (
     <AppContext.Provider value={{
      lang, setLang,
      user, setUser,
      favorites, toggleFavorite,
      country, setCountry, resetCountry,
      region, setRegion,
      setCountryAndRegion,
      loading,
      darkMode, setDarkMode,
      isAdmin,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}