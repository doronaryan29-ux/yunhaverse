import { useState } from 'react'
import { useAppSettings } from '../../hooks/useAppSettings'
import { Tooltip } from '../common'

const navigationLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'Gallery', href: '/#/gallery' },
  { label: 'Countdown', href: '/#countdown' },
  { label: 'Events', href: '/#/calendar' },
]

const supportLinks = [
  { label: 'Contact Us', href: 'mailto:bangyunhaph@gmail.com' },
  { label: 'Member Login', href: '/#/login' },
  { label: 'Report an Issue', href: 'mailto:bangyunhaph@gmail.com' },
]

const Footer = () => {
  const { settings } = useAppSettings()
  const currentYear = new Date().getFullYear()
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletterSubmit = (event) => {
    event.preventDefault()
    if (!newsletterEmail) return
    // UI-only for now — no newsletter backend/endpoint exists yet.
    setSubscribed(true)
    setNewsletterEmail('')
  }

  return (
    <footer className="border-t-[var(--nb-border-w)] border-[var(--nb-ink)] bg-white py-14">
      <div
        id="footer-contact"
        className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 scroll-mt-24 sm:px-6 lg:px-10"
      >
        <div className="grid grid-cols-1 gap-10 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-4">
          <div className="flex flex-col items-center gap-4 sm:items-start">
            <div className="flex items-center gap-2">
              <img
                src={settings.logoUrl}
                alt={`${settings.appName} Logo`}
                className="h-9 w-9 rounded-full border-2 border-[var(--nb-ink)] object-cover"
              />
              <span className="font-display text-lg font-extrabold text-rose-600">
                {settings.appName}
              </span>
            </div>
            <p className="text-sm text-slate-500">
              The official Filipino fanbase celebrating and supporting UNIS'
              Bang Yunha.
            </p>
            <div className="flex gap-3 text-lg text-rose-500">
              <Tooltip label="Follow on Facebook">
                <a
                  href="https://www.facebook.com/yunhaverseph"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Follow on Facebook"
                  className="nb-pill flex h-10 w-10 items-center justify-center bg-white transition hover:-translate-y-0.5 hover:bg-rose-50"
                >
                  <i className="fab fa-facebook-f" />
                </a>
              </Tooltip>
              <Tooltip label="Follow on Twitter/X">
                <a
                  href="https://x.com/YunhaversePH"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Follow on Twitter/X"
                  className="nb-pill flex h-10 w-10 items-center justify-center bg-white transition hover:-translate-y-0.5 hover:bg-rose-50"
                >
                  <i className="fab fa-twitter" />
                </a>
              </Tooltip>
              <Tooltip label="Follow on Instagram">
                <a
                  href="https://www.instagram.com/yunhaverseph"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Follow on Instagram"
                  className="nb-pill flex h-10 w-10 items-center justify-center bg-white transition hover:-translate-y-0.5 hover:bg-rose-50"
                >
                  <i className="fab fa-instagram" />
                </a>
              </Tooltip>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 sm:items-start">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
              Navigation
            </p>
            <ul className="flex flex-col items-center gap-2 text-sm font-semibold text-slate-600 sm:items-start">
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="transition hover:text-rose-500">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center gap-3 sm:items-start">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
              Support
            </p>
            <ul className="flex flex-col items-center gap-2 text-sm font-semibold text-slate-600 sm:items-start">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="transition hover:text-rose-500">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center gap-3 sm:items-start">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
              Newsletter
            </p>
            <p className="text-sm text-slate-500">
              Get the latest updates delivered to your inbox.
            </p>
            {subscribed ? (
              <p className="nb-chip bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
                Thanks! You're on the list.
              </p>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex w-full max-w-xs flex-col gap-2 sm:max-w-none"
              >
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(event) => setNewsletterEmail(event.target.value)}
                  placeholder="you@email.com"
                  className="nb-input w-full px-4 py-2 text-sm text-slate-700"
                />
                <button
                  type="submit"
                  className="nb-btn bg-rose-500 px-4 py-2 text-xs tracking-[0.16em] text-white hover:-translate-y-0.5"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 border-t-[var(--nb-border-w)] border-[var(--nb-ink)] pt-6 text-xs text-slate-400 sm:flex-row sm:justify-between">
          <p>
            &copy; {currentYear} {settings.appName}. All rights reserved.
            {' '}Made with love by the {settings.appName} Team.
          </p>
          <div className="flex items-center gap-4 font-semibold">
            <a href="#" className="hover:text-rose-500">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-rose-500">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
