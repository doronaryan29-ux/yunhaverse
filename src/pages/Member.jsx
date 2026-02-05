import { useEffect, useState } from 'react'

const getRoute = () => window.location.hash || '#/member'
const AUTH_MAX_AGE_MS = 12 * 60 * 60 * 1000
const redirectTo = (hashRoute) => window.location.replace(`/${hashRoute}`)
const getStoredUser = () => {
  try {
    const user = JSON.parse(sessionStorage.getItem('user') || 'null')
    const authAt = Number(sessionStorage.getItem('authAt') || 0)
    if (!user || !authAt || Date.now() - authAt > AUTH_MAX_AGE_MS) {
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('authAt')
      return null
    }
    return user
  } catch {
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('authAt')
    return null
  }
}

const Member = () => {
  const [route, setRoute] = useState(getRoute())
  const user = getStoredUser()
  const profileName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email

  useEffect(() => {
    const handleRouteChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', handleRouteChange)
    return () => window.removeEventListener('hashchange', handleRouteChange)
  }, [])

  if (!user) {
    redirectTo('#/login?force=1')
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 text-slate-800">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute right-0 top-72 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-500">
              Member Portal
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-slate-900">
              Welcome, {profileName || 'Member'}
            </h1>
          </div>
          <button
            type="button"
            className="rounded-full border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
            onClick={() => {
              sessionStorage.removeItem('user')
              sessionStorage.removeItem('authAt')
              redirectTo('#/login?force=1')
            }}
          >
            Sign out
          </button>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
            <h2 className="font-display text-2xl font-semibold text-slate-900">
              Member Highlights
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Quick access to your perks, RSVPs, and upcoming moments.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: 'Upcoming Events',
                  value: '2',
                  hint: 'Scheduled this month',
                },
                {
                  label: 'RSVP Status',
                  value: 'Pending',
                  hint: 'Awaiting confirmation',
                },
                {
                  label: 'Member Rank',
                  value: 'Core',
                  hint: 'Active supporter',
                },
                {
                  label: 'Rewards Balance',
                  value: '120 pts',
                  hint: 'Redeem in store',
                },
              ].map((card) => (
                <article
                  key={card.label}
                  className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    {card.label}
                  </p>
                  <p className="mt-3 font-display text-2xl font-semibold text-slate-900">
                    {card.value}
                  </p>
                  <p className="mt-2 text-xs text-rose-500">{card.hint}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
              <h3 className="font-display text-xl font-semibold text-slate-900">
                Quick Actions
              </h3>
              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  className="rounded-2xl bg-rose-500 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5"
                >
                  View Events
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-rose-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
                >
                  Update Profile
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-rose-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
                >
                  Contact Support
                </button>
              </div>
            </section>

            <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
              <h3 className="font-display text-xl font-semibold text-slate-900">
                Member Notes
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                We will notify you about ticket drops, exclusive livestreams, and
                merch updates here.
              </p>
              <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50/70 p-4 text-sm text-slate-600">
                Keep an eye on your inbox for the next Yunha fan meet update.
              </div>
            </section>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
          <h3 className="font-display text-xl font-semibold text-slate-900">
            Activity Snapshot
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              'Signed in using password',
              'OTP verified for signup',
              'Viewed upcoming events',
            ].map((activity, index) => (
              <div
                key={`${activity}-${index}`}
                className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-slate-600"
              >
                {activity}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default Member
