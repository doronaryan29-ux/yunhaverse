import { useState } from 'react'

const navItems = [
  'Home',
  'Events',
  'Members Profile',
  'Gallery',
  'Blog',
  'About',
]

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {menuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <nav className="sticky top-0 z-40 border-b border-pink-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/image/logoyunha.png"
              alt="Yunha Logo"
              className="h-10 w-10 rounded-full object-cover shadow"
            />
            <span className="font-display text-lg font-semibold tracking-wide text-rose-600">
              YUNHAverse PH
            </span>
          </div>
          <div className="hidden items-center gap-6 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600 md:flex">
            {navItems.map((item, index) => (
              <a
                key={item}
                href={
                  item === 'Home'
                    ? '#home'
                    : `${item.toLowerCase().replace(/\s+/g, '')}.php`
                }
                className={
                  index === 0
                    ? 'text-rose-500'
                    : 'transition hover:text-rose-500'
                }
              >
                {item}
              </a>
            ))}
            <a
              href="/#/login"
              className="rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5"
            >
              Login
            </a>
          </div>
          <button
            type="button"
            className="flex flex-col gap-1.5 md:hidden"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="h-0.5 w-8 rounded-full bg-slate-700" />
            <span className="h-0.5 w-8 rounded-full bg-slate-700" />
            <span className="h-0.5 w-8 rounded-full bg-slate-700" />
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-pink-100 bg-white px-4 pb-6 pt-4 md:hidden">
            <div className="flex flex-col gap-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-700">
              {navItems.map((item, index) => (
                <a
                  key={item}
                  href={
                    item === 'Home'
                      ? '#home'
                      : `${item.toLowerCase().replace(/\s+/g, '')}.php`
                  }
                  className={index === 0 ? 'text-rose-500' : ''}
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <a
                href="/#/login"
                className="rounded-full bg-rose-500 px-4 py-2 text-center text-xs font-semibold tracking-[0.2em] text-white"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

export default Navbar
