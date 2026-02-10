import { memo } from 'react'

export const StatCard = memo(({ label, value, hint }) => (
  <article className="rounded-3xl border border-rose-100 bg-white/90 p-5 shadow-lg shadow-rose-100">
    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
      {label}
    </p>
    <p className="mt-3 font-display text-3xl font-semibold text-slate-900">
      {value}
    </p>
    <p className="mt-2 text-xs text-rose-500">{hint}</p>
  </article>
))

export const AssignmentCard = memo(
  ({
    title,
    priority,
    description,
    status,
    dueLabel,
    requestedBy,
    referenceLabel,
    referenceUrl,
    active,
    onClick,
  }) => (
    <article
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        if (!onClick) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
        }
      }}
      className={`rounded-2xl border p-4 transition ${
        active
          ? 'border-rose-400 bg-rose-50/80 shadow-md shadow-rose-100'
          : 'border-rose-100 bg-white'
      } ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <span className="rounded-full bg-rose-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-500">
          {priority}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      {referenceLabel ? (
        <p className="mt-2 text-xs text-slate-500">
          Reference:{' '}
          <span className="font-semibold text-slate-700">
            {referenceUrl || referenceLabel}
          </span>
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
        <span>
          Status: <strong className="text-slate-700">{status}</strong>
        </span>
        <span>
          Due: <strong className="text-slate-700">{dueLabel}</strong>
        </span>
        <span>
          Requested by: <strong className="text-slate-700">{requestedBy}</strong>
        </span>
      </div>
    </article>
  ),
)

export const TeamMemberRow = memo(({ name, email, role }) => (
  <div className="flex items-center justify-between rounded-2xl border border-rose-100 bg-white px-4 py-3 text-sm">
    <div>
      <p className="font-semibold text-slate-900">{name}</p>
      <p className="text-xs text-slate-500">{email}</p>
    </div>
    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">
      {role}
    </span>
  </div>
))

export const SubmissionCard = memo(
  ({ title, status, notes, linkLabel, requestLabel, active, onClick }) => (
    <article
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        if (!onClick) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
        }
      }}
      className={`rounded-2xl border p-4 transition ${
        active
          ? 'border-rose-400 bg-rose-50/80 shadow-md shadow-rose-100'
          : 'border-rose-100 bg-white'
      } ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''}`}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <span className="rounded-full bg-rose-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-500">
          {status}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-600">{notes}</p>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
        <span>
          Link: <strong className="text-slate-700">{linkLabel}</strong>
        </span>
        <span>
          Request: <strong className="text-slate-700">{requestLabel}</strong>
        </span>
      </div>
    </article>
  ),
)
