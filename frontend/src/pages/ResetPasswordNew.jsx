import { useEffect, useState } from 'react'
import PasswordField from '../components/auth/PasswordField'
import ResetPasswordShell from '../components/auth/ResetPasswordShell'
import useResetPasswordFlow, { clearResetFlow } from '../hooks/useResetPasswordFlow'
import { API_BASE } from '../utils/apiBase'

const RESET_REDIRECT_DELAY_MS = 900

const ResetPasswordNew = () => {
  const { storedEmail, storedToken, loading, feedback, setFeedback, toast, confirmNewPassword } =
    useResetPasswordFlow({ apiBase: API_BASE })
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (!storedEmail || !storedToken) {
      window.location.hash = '#/forgot-password'
    }
  }, [storedEmail, storedToken])

  const passwordValid = password.length >= 8 && /[A-Z]/.test(password)
  const passwordsMatch = password && confirmPassword && password === confirmPassword

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!passwordValid) {
      setFeedback({
        type: 'error',
        message: 'Password must be at least 8 characters and include 1 uppercase letter.',
      })
      return
    }
    if (!passwordsMatch) {
      setFeedback({ type: 'error', message: 'Passwords do not match.' })
      return
    }
    const ok = await confirmNewPassword(storedEmail, storedToken, password)
    if (ok) {
      window.setTimeout(() => {
        window.location.hash = '#/login'
      }, RESET_REDIRECT_DELAY_MS)
    }
  }

  const handleCancel = () => {
    clearResetFlow()
    window.location.hash = '#/login'
  }

  if (!storedEmail || !storedToken) {
    return null
  }

  return (
    <ResetPasswordShell
      eyebrow="Password Reset"
      title="Set a new password"
      subtitle="Choose a strong password for your account."
      toast={toast}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <PasswordField
          label="New Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          show={showPassword}
          onToggle={() => setShowPassword((prev) => !prev)}
          placeholder="Create a new password"
          required
        />
        <PasswordField
          label="Confirm Password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          show={showConfirmPassword}
          onToggle={() => setShowConfirmPassword((prev) => !prev)}
          placeholder="Re-enter password"
          required
        />
        <p className="-mt-2 text-xs text-slate-500">
          Password must be at least 8 characters and include 1 uppercase letter.
        </p>

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
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>

        <button
          type="button"
          onClick={handleCancel}
          className="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400 transition hover:text-rose-500"
        >
          Cancel
        </button>
      </form>
    </ResetPasswordShell>
  )
}

export default ResetPasswordNew
