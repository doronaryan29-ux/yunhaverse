const sampleUsers = [
  {
    name: 'Yuna Park',
    email: 'yuna.park@yunhaverse.ph',
    role: 'Admin',
    status: 'Active',
    joined: 'Jan 12, 2026',
  },
  {
    name: 'Minji Kwon',
    email: 'minji.kwon@yunhaverse.ph',
    role: 'Member',
    status: 'Active',
    joined: 'Dec 03, 2025',
  },
  {
    name: 'Hana Seo',
    email: 'hana.seo@yunhaverse.ph',
    role: 'Member',
    status: 'Pending',
    joined: 'Nov 24, 2025',
  },
]

const navItems = [
  { label: 'Users', active: true },
  { label: 'Events', active: false },
  { label: 'Roles', active: false },
  { label: 'Settings', active: false },
]

const Admin = () => (
  <main className="min-h-screen bg-linear-to-br from-rose-50 via-white to-amber-50 text-slate-800">
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
      <div className="absolute right-0 top-72 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-rose-200/30 blur-3xl" />
    </div>

    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 lg:flex-row lg:gap-6">
      <aside className="w-full shrink-0 lg:w-72">
        <div className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100 lg:sticky lg:top-8">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-200">
              <span className="text-lg font-semibold">YA</span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                Admin Console
              </p>
              <h1 className="font-display text-xl font-semibold text-slate-900">
                YUNHAverse
              </h1>
            </div>
          </div>

          <nav className="mt-8 flex flex-col gap-3">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] transition ${
                  item.active
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                    : 'border border-rose-100 text-slate-500 hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-50'
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`text-[10px] ${
                    item.active ? 'text-white/80' : 'text-rose-400'
                  }`}
                >
                  {item.active ? 'Live' : 'Soon'}
                </span>
              </button>
            ))}
          </nav>

          <div className="mt-10 rounded-2xl border border-rose-100 bg-rose-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
              Quick note
            </p>
            <p className="mt-2 text-sm text-slate-600">
              You are viewing the Users workspace. Events and Roles will open
              next.
            </p>
          </div>
        </div>
      </aside>

      <section className="mt-8 flex-1 lg:mt-0">
        <header className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-500">
                Admin / Users
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">
                Add new users
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Create accounts, assign roles, and keep the fanbase organized.
              </p>
            </div>
            <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
              Role gate: Admin
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <form className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-semibold text-slate-900">
                New user details
              </h3>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Add users
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                First name
                <input
                  type="text"
                  placeholder="First name"
                  className="mt-2 w-full rounded-2xl border border-rose-100 bg-white px-4 py-3 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                />
              </label>
              <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Last name
                <input
                  type="text"
                  placeholder="Last name"
                  className="mt-2 w-full rounded-2xl border border-rose-100 bg-white px-4 py-3 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                />
              </label>
            </div>

            <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Email address
              <input
                type="email"
                placeholder="name@email.com"
                className="mt-2 w-full rounded-2xl border border-rose-100 bg-white px-4 py-3 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
              />
            </label>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Role
                <select className="mt-2 w-full rounded-2xl border border-rose-100 bg-white px-4 py-3 text-sm text-slate-700 focus:border-rose-400 focus:outline-none">
                  <option>Member</option>
                  <option>Moderator</option>
                </select>
              </label>
              <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Status
                <select className="mt-2 w-full rounded-2xl border border-rose-100 bg-white px-4 py-3 text-sm text-slate-700 focus:border-rose-400 focus:outline-none">
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Suspended</option>
                </select>
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="rounded-2xl bg-rose-500 px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5"
              >
                Create user
              </button>
              <button
                type="button"
                className="rounded-2xl border border-rose-200 px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
              >
                Clear form
              </button>
            </div>
          </form>

          <div className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
            <h3 className="font-display text-xl font-semibold text-slate-900">
              Users overview
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Track the most recent additions and their roles.
            </p>

            <div className="mt-4 grid gap-3">
              {sampleUsers.map((user) => (
                <div
                  key={user.email}
                  className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">
                        {user.role}
                      </p>
                      <p className="text-xs text-slate-500">{user.status}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    Joined {user.joined}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-6 rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-xl font-semibold text-slate-900">
                Pending invites
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Keep track of users waiting for activation.
              </p>
            </div>
            <button
              type="button"
              className="rounded-2xl border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
            >
              View all
            </button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {['Olivia Han', 'Sora Lim', 'Mina Choi'].map((name) => (
              <div
                key={name}
                className="rounded-2xl border border-rose-100 bg-white p-4"
              >
                <p className="text-sm font-semibold text-slate-900">{name}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Invite sent • awaiting confirmation
                </p>
                <button
                  type="button"
                  className="mt-3 rounded-full bg-rose-500 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-white"
                >
                  Resend
                </button>
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  </main>
)

export default Admin
