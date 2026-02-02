const Hero = () => (
  <header id="home" className="flex flex-col items-center gap-6 text-center">
    <img
      src="/image/logoyunha.png"
      alt="Yunha Logo"
      className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg"
    />
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.5em] text-rose-500">
        Fanbase Spotlight
      </p>
      <h1 className="font-display text-4xl font-bold text-slate-900 sm:text-5xl">
        YUNHAverse Philippines
      </h1>
      <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg">
        Annyeong! We are <span className="font-semibold text-rose-500">YUNHAverse PH</span>,
        a fanbase dedicated for UNIS 유니스 All-Rounder Puppy Bang Yunha 방윤하 🍞🐶
      </p>
    </div>
  </header>
)

export default Hero
