import { useAppSettings } from '../../hooks/useAppSettings'

const Hero = () => {
  const { settings } = useAppSettings()

  return (
    <header
      id="home"
      className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 pt-6 scroll-mt-28 sm:pt-10 lg:grid-cols-2 lg:gap-16"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-2 right-6 text-2xl text-rose-400 sm:right-12"
      >
        ✦
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-4 left-2 text-xl text-rose-400 sm:left-8"
      >
        ♡
      </span>

      <div className="flex flex-col items-center gap-7 text-center lg:items-start lg:text-left">
        <div className="nb-pill inline-flex items-center gap-2 bg-rose-100 px-4 py-1.5">
          <img
            src={settings.logoUrl}
            alt={`${settings.appName} Logo`}
            className="h-6 w-6 rounded-full border-2 border-[var(--nb-ink)] object-cover"
          />
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-600">
            Fanbase Spotlight
          </span>
        </div>

        <h1 className="font-display text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
          {settings.homepageHeadline}
        </h1>

        <p className="max-w-2xl text-base font-medium text-slate-600 sm:text-lg">
          {settings.homepageSubheadline}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
          <button
            type="button"
            className="nb-btn inline-flex items-center gap-2 bg-rose-500 px-7 py-3 text-sm tracking-[0.2em] text-white hover:-translate-y-0.5"
          >
            Start Journey
            <i className="fas fa-arrow-right text-xs" aria-hidden="true" />
          </button>
          <a
            href="/#/gallery"
            className="nb-pill inline-flex items-center bg-white px-7 py-3 text-sm tracking-[0.2em] text-rose-500 hover:-translate-y-0.5 hover:bg-rose-50"
          >
            Gallery
          </a>
        </div>
      </div>

      <div className="mx-auto w-full max-w-sm lg:max-w-none">
        <div className="nb-surface overflow-hidden">
          <img
            src="/image/yunha_home_pic.jpg"
            alt="Yunha"
            className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[520px]"
          />
        </div>
      </div>
    </header>
  )
}

export default Hero
