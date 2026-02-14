import { memo, useEffect, useState } from 'react'

const ProfileSection = ({
  profileForm,
  profileFeedback,
  profileLoading,
  profileSaving,
  onChangeProfile,
  onSaveProfile,
}) => {
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (profileFeedback.type === 'success') {
      setIsEditing(false)
    }
  }, [profileFeedback.type])

  return (
    <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-rose-500">
              Admin Profile
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900">
              Edit account details
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            disabled={profileLoading}
            className="rounded-2xl border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50 disabled:opacity-60"
          >
            {isEditing ? 'Stop editing' : 'Edit profile'}
          </button>
        </div>

      <form className="mt-6 space-y-4" onSubmit={onSaveProfile}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              First name
              <input
                type="text"
                value={profileForm.firstName}
                onChange={(event) =>
                  onChangeProfile((prev) => ({ ...prev, firstName: event.target.value }))
                }
                disabled={!isEditing}
                className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none disabled:bg-slate-50"
              />
            </label>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Last name
              <input
                type="text"
                value={profileForm.lastName}
                onChange={(event) =>
                  onChangeProfile((prev) => ({ ...prev, lastName: event.target.value }))
                }
                disabled={!isEditing}
                className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none disabled:bg-slate-50"
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Birthdate
              <input
                type="date"
                value={profileForm.birthdate || ''}
                onChange={(event) =>
                  onChangeProfile((prev) => ({ ...prev, birthdate: event.target.value }))
                }
                disabled={!isEditing}
                className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none disabled:bg-slate-50"
              />
            </label>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Email
              <input
                type="text"
                value={profileForm.email}
                disabled
                className="mt-1 w-full rounded-xl border border-rose-100 bg-slate-50 px-3 py-2 text-sm text-slate-500"
              />
            </label>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Role / Status
              <input
                type="text"
                value={`${profileForm.role || '-'} / ${profileForm.status || '-'}`}
                disabled
                className="mt-1 w-full rounded-xl border border-rose-100 bg-slate-50 px-3 py-2 text-sm text-slate-500"
              />
            </label>
          </div>

          {profileFeedback.message && (
            <p
              className={`text-xs ${
                profileFeedback.type === 'success'
                  ? 'text-emerald-600'
                  : 'text-rose-500'
              }`}
            >
              {profileFeedback.message}
            </p>
          )}

          {!isEditing && !profileLoading && (
            <p className="text-xs text-slate-500">
              Click “Edit profile” to enable changes.
            </p>
          )}

          {profileLoading ? (
            <p className="text-sm text-slate-500">Loading profile...</p>
          ) : (
            isEditing && (
              <button
                type="submit"
                disabled={profileSaving}
                className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 disabled:opacity-70"
              >
                {profileSaving ? 'Saving...' : 'Save changes'}
              </button>
            )
          )}
        </form>
    </section>
  )
}

export default memo(ProfileSection)
