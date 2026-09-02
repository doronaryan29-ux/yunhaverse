import { useEffect, useState } from 'react'
import { API_BASE } from '../utils/apiBase'
import { SettingsContext } from './settingsContextInstance'

const DEFAULT_SETTINGS = {
  appName: 'YUNHAverse PH',
  logoUrl: '/image/logoyunha.png',
  homepageHeadline: 'YUNHAverse Philippines',
  homepageSubheadline:
    'Annyeong! We are YUNHAverse PH, a fanbase dedicated for UNIS 유니스 All-Rounder Puppy Bang Yunha 방윤하 🍞🐶',
  primaryColor: '#e11d48',
}

// 5-minute safety-net poll: real-time updates already come from the
// 'app-settings-updated' event fired on save (see SettingsPage.jsx), this
// interval just covers the case where a change happened outside this tab.
const SAFETY_NET_POLL_MS = 5 * 60 * 1000

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const apiBase = API_BASE

    const mixColors = (colorA, colorB, amount) => {
      const parse = (hex) => {
        const normalized = hex.replace('#', '')
        const bigint = parseInt(normalized.length === 3
          ? normalized.split('').map((c) => c + c).join('')
          : normalized, 16)
        return {
          r: (bigint >> 16) & 255,
          g: (bigint >> 8) & 255,
          b: bigint & 255,
        }
      }
      const a = parse(colorA)
      const b = parse(colorB)
      const mix = (channel) => Math.round(a[channel] + (b[channel] - a[channel]) * amount)
      const toHex = (value) => value.toString(16).padStart(2, '0')
      return `#${toHex(mix('r'))}${toHex(mix('g'))}${toHex(mix('b'))}`
    }

    const applyBranding = (nextSettings) => {
      if (!nextSettings) return
      if (nextSettings.appName) {
        document.title = nextSettings.appName
      }
      const iconHref = nextSettings.logoUrl
      if (iconHref) {
        let icon = document.querySelector('link[rel="icon"]')
        if (!icon) {
          icon = document.createElement('link')
          icon.rel = 'icon'
          document.head.appendChild(icon)
        }
        icon.href = iconHref
      }

      const base = nextSettings.primaryColor || DEFAULT_SETTINGS.primaryColor
      const root = document.documentElement
      root.style.setProperty('--brand-50', mixColors(base, '#ffffff', 0.92))
      root.style.setProperty('--brand-100', mixColors(base, '#ffffff', 0.84))
      root.style.setProperty('--brand-200', mixColors(base, '#ffffff', 0.7))
      root.style.setProperty('--brand-300', mixColors(base, '#ffffff', 0.5))
      root.style.setProperty('--brand-400', mixColors(base, '#ffffff', 0.3))
      root.style.setProperty('--brand-500', base)
      root.style.setProperty('--brand-600', mixColors(base, '#000000', 0.15))
      root.style.setProperty('--brand-700', mixColors(base, '#000000', 0.3))
    }

    const loadSettings = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${apiBase}/settings`)
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data?.message || 'Failed to load settings.')
        }
        if (!isMounted) return
        const base = DEFAULT_SETTINGS
        const nextSettings = {
          ...base,
          appName: data.app_name ?? base.appName,
          logoUrl: data.logo_url || base.logoUrl,
          homepageHeadline: data.homepage_headline ?? base.homepageHeadline,
          homepageSubheadline: data.homepage_subheadline ?? base.homepageSubheadline,
          primaryColor: data.primary_color ?? base.primaryColor,
        }
        setSettings(nextSettings)
        applyBranding(nextSettings)
      } catch {
        if (!isMounted) return
        setSettings(DEFAULT_SETTINGS)
        applyBranding(DEFAULT_SETTINGS)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    const handleUpdate = (event) => {
      if (!event?.detail || !isMounted) return
      const next = event.detail
      setSettings((prev) => {
        const nextSettings = {
          ...prev,
          appName: next.app_name ?? prev.appName,
          logoUrl: next.logo_url || prev.logoUrl,
          homepageHeadline: next.homepage_headline ?? prev.homepageHeadline,
          homepageSubheadline: next.homepage_subheadline ?? prev.homepageSubheadline,
          primaryColor: next.primary_color ?? prev.primaryColor,
        }
        applyBranding(nextSettings)
        return nextSettings
      })
    }

    applyBranding(DEFAULT_SETTINGS)
    loadSettings()
    const intervalId = window.setInterval(loadSettings, SAFETY_NET_POLL_MS)
    window.addEventListener('app-settings-updated', handleUpdate)
    return () => {
      isMounted = false
      window.clearInterval(intervalId)
      window.removeEventListener('app-settings-updated', handleUpdate)
    }
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  )
}
