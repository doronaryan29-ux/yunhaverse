import { useState } from 'react'
import ResetPasswordShell from '../components/auth/ResetPasswordShell'
import useResetPasswordFlow from '../hooks/useResetPasswordFlow'
import { API_BASE } from '../utils/apiBase'

const ForgotPassword = () => {
  const { storedEmail, loading, feedback, toast, requestCode } =
    useResetPasswordFlow({ apiBase: API_BASE })
  const [email, setEmail] = useState(storedEmail)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!email) return
    const ok = await requestCode(email)
    if (ok) {
      window.location.hash = '#/forgot-password/verify'
    }
  }

  return (
    <ResetPasswordShell
      eyebrow="Password Reset"
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset code."
      toast={toast}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="block">
          <span className="field-label">Email Address</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@email.com"
            className="nb-input w-full px-4 py-3 text-sm text-slate-700"
            required
          />
        </label>

        {feedback.message && (
          <p
            className={`text-xs font-semibold ${
              feedback.type === 'success' ? 'text-emerald-600' : 'text-rose-500'
            }`}
            role={feedback.type === 'error' ? 'alert' : undefined}
          >
            {feedback.message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="nb-btn mt-2 w-full bg-rose-500 px-6 py-3 text-sm tracking-[0.2em] text-white hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {loading && (
            <span
              aria-hidden="true"
              className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
          )}
          {loading ? 'Sending Code...' : 'Send Code'}
        </button>

        <a
          href="/#/login"
          className="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400 transition hover:text-rose-500"
        >
          Cancel
        </a>
      </form>
    </ResetPasswordShell>
  )
}

export default ForgotPassword
