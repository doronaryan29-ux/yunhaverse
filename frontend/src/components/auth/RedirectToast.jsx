import { useEffect, useState } from 'react'

// toast.duration drives both the visible progress-bar animation and the
// caller's redirect timer, so the bar can never finish before/after the
// actual navigation happens.
const RedirectToast = ({ toast }) => {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (!toast) return undefined
    setProgress(100)
    const frame = window.requestAnimationFrame(() => setProgress(0))
    return () => window.cancelAnimationFrame(frame)
  }, [toast])

  if (!toast) return null

  const isError = toast.type === 'error'

  return (
    <div className="pointer-events-none fixed left-1/2 top-6 z-50 w-[92%] max-w-sm -translate-x-1/2">
      <div className="nb-chip overflow-hidden bg-white px-5 py-4">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--nb-ink)] text-sm ${
              isError ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
            }`}
          >
            <i className={`fas ${isError ? 'fa-xmark' : 'fa-check'}`} />
          </span>
          <p className="text-sm font-bold text-slate-800">{toast.message}</p>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-rose-100">
          <div
            className={`h-full rounded-full ${isError ? 'bg-rose-500' : 'bg-emerald-500'}`}
            style={{
              width: `${progress}%`,
              transition: `width ${toast.duration}ms linear`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default RedirectToast
