import { memo } from 'react'
import { formatDateInManila } from '../../../utils/date'

const SubmissionsSection = ({
  submissionItems,
  loadingSubmissions,
  getSubmissionEdit,
  isSubmissionDirty,
  setSubmissionEdits,
  submissionStatusOptions,
  canSubmit,
  submitting,
  updateSubmission,
  setDeleteModal,
}) => (
  <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h3 className="font-display text-xl font-semibold text-slate-900">
        Submissions Review
      </h3>
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        {submissionItems.length} items
      </span>
    </div>

    <div className="mt-4 grid gap-3">
      {loadingSubmissions && (
        <p className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-slate-500">
          Loading submissions...
        </p>
      )}
      {!loadingSubmissions && submissionItems.length === 0 && (
        <p className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-slate-500">
          No submissions yet.
        </p>
      )}
      {!loadingSubmissions &&
        submissionItems.map((item) => {
          const edit = getSubmissionEdit(item)
          const isDirty = isSubmissionDirty(item, edit)
          return (
            <article
              key={item.id}
              className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Submitted by {item.submitted_by_name || '—'}
                    {item.created_at ? ` • ${formatDateInManila(item.created_at)}` : ''}
                  </p>
                  {item.request_title && (
                    <p className="mt-1 text-xs text-slate-400">
                      Request: {item.request_title}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500">
                    {item.status || 'Pending_Review'}
                  </span>
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-600">
                    {item.stage || 'creative'}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={edit.status}
                    onChange={(event) =>
                      setSubmissionEdits((prev) => ({
                        ...prev,
                        [item.id]: { status: event.target.value },
                      }))
                    }
                    className="rounded-full border border-rose-200 bg-white px-3 py-1 text-[11px] text-slate-600"
                  >
                    {submissionStatusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!canSubmit || submitting || !isDirty}
                    onClick={() => updateSubmission(item.id, { status: edit.status })}
                    className="rounded-full border border-rose-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500 disabled:opacity-60"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    disabled={!canSubmit || submitting}
                    onClick={() =>
                      setDeleteModal({
                        type: 'submission',
                        id: item.id,
                        title: item.title,
                      })
                    }
                    className="rounded-full border border-rose-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          )
        })}
    </div>
  </section>
)

export default memo(SubmissionsSection)
