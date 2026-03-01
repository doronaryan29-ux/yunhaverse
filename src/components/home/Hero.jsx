import { useAppSettings } from '../../hooks/useAppSettings'

const Hero = () => {
  const { settings } = useAppSettings()

  return (
    <header
      id="home"
      className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-6 text-center scroll-mt-28"
    >
      <img
        src={settings.logoUrl}
        alt={`${settings.appName} Logo`}
        className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg"
      />
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.5em] text-rose-500">
          Fanbase Spotlight
        </p>
        <h1 className="font-display text-4xl font-bold text-slate-900 sm:text-5xl">
          {settings.homepageHeadline}
        </h1>
        <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg">
          {settings.homepageSubheadline}
        </p>
      </div>
    </header>
  )
}

export default Hero
