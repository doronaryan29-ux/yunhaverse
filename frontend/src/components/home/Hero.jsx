import { useAppSettings } from '../../hooks/useAppSettings'

const Hero = () => {
  const { settings } = useAppSettings()

  return (
    <header
      id="home"
      className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-7 px-6 pt-6 text-center scroll-mt-28 sm:pt-10"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-2 right-6 text-2xl text-rose-200 sm:right-12"
      >
        ✦
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-4 left-2 text-xl text-rose-200 sm:left-8"
      >
        ♡
      </span>

      <div className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white px-4 py-1.5 shadow-sm">
        <img
          src={settings.logoUrl}
          alt={`${settings.appName} Logo`}
          className="h-6 w-6 rounded-full object-cover"
        />
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
          Fanbase Spotlight
        </span>
      </div>

      <h1 className="font-display text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
        {settings.homepageHeadline}
      </h1>

      <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
        {settings.homepageSubheadline}
      </p>
    </header>
  )
}

export default Hero
