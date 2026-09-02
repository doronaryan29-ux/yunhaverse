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
    <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Admin Profile
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              Edit account details
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            disabled={profileLoading}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 transition motion-safe:active:scale-[0.97] hover:bg-slate-50 disabled:opacity-60"
          >
            {isEditing ? 'Stop editing' : 'Edit profile'}
          </button>
        </div>

      <form className="mt-6 space-y-4" onSubmit={onSaveProfile}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
              First name
              <input
                type="text"
                value={profileForm.firstName}
                onChange={(event) =>
                  onChangeProfile((prev) => ({ ...prev, firstName: event.target.value }))
                }
                disabled={!isEditing}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none disabled:bg-slate-50"
              />
            </label>
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
              Last name
              <input
                type="text"
                value={profileForm.lastName}
                onChange={(event) =>
                  onChangeProfile((prev) => ({ ...prev, lastName: event.target.value }))
                }
                disabled={!isEditing}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none disabled:bg-slate-50"
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
              Birthdate
              <input
                type="date"
                value={profileForm.birthdate || ''}
                onChange={(event) =>
                  onChangeProfile((prev) => ({ ...prev, birthdate: event.target.value }))
                }
                disabled={!isEditing}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none disabled:bg-slate-50"
              />
            </label>
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
              Email
              <input
                type="text"
                value={profileForm.email}
                disabled
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
              />
            </label>
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
              Role / Status
              <input
                type="text"
                value={`${profileForm.role || '-'} / ${profileForm.status || '-'}`}
                disabled
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
              />
            </label>
          </div>

          {profileFeedback.message && (
            <p
              className={`text-xs ${
                profileFeedback.type === 'success'
                  ? 'text-emerald-600'
                  : 'text-red-600'
              }`}
            >
              {profileFeedback.message}
            </p>
          )}

          {!isEditing && !profileLoading && (
            <p className="text-xs text-slate-500">
              Click "Edit profile" to enable changes.
            </p>
          )}

          {profileLoading ? (
            <p className="text-sm text-slate-500">Loading profile...</p>
          ) : (
            isEditing && (
              <button
                type="submit"
                disabled={profileSaving}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white transition motion-safe:active:scale-[0.97] hover:bg-indigo-700 disabled:opacity-70"
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
