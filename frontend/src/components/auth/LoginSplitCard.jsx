import { useState } from 'react'
import PasswordField from './PasswordField'

// Filler hero image for the login card — swap freely later; picked to avoid
// repeating the Hero/Member Spotlight photos a member would have just seen.
const LOGIN_IMAGE = '/image/yunha28days.png'

const LoginSplitCard = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  onTogglePassword,
  loading,
  feedback,
  onSubmit,
  onGoogle,
  onSwitchToSignup,
}) => {
  const [rememberMe, setRememberMe] = useState(false)

  return (
    <div className="auth-entrance nb-surface grid overflow-hidden lg:grid-cols-2">
      <div className="relative hidden min-h-[560px] lg:block">
        <img
          src={LOGIN_IMAGE}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8">
          <h2 className="font-display text-3xl font-extrabold leading-tight text-white">
            Enter the YUNHAverse
          </h2>
          <p className="mt-2 max-w-xs text-sm text-white/80">
            Sign in to catch every update, event, and moment with UNIS&rsquo;
            Bang Yunha.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-6 p-6 sm:p-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose-500">
            Welcome Back
          </p>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Sign in to continue
          </h1>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
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

          <PasswordField
            label="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            show={showPassword}
            onToggle={onTogglePassword}
            placeholder="Your password"
            required
          />

          <div className="flex items-center justify-between gap-3 text-xs">
            <label className="flex items-center gap-2 font-bold text-slate-500">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 rounded border-2 border-[var(--nb-ink)] accent-[var(--brand-500)]"
              />
              Remember me
            </label>
            <a
              href="/#/forgot-password"
              className="font-bold uppercase tracking-[0.2em] text-rose-500"
            >
              Forgot password?
            </a>
          </div>

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
            {loading ? 'Signing in...' : 'Login'}
            {!loading && (
              <i className="fas fa-arrow-right text-xs" aria-hidden="true" />
            )}
          </button>

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

          <div className="mt-1 flex items-center gap-3">
            <span className="h-px flex-1 bg-rose-100" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
              or
            </span>
            <span className="h-px flex-1 bg-rose-100" />
          </div>

          <button
            type="button"
            onClick={onGoogle}
            className="nb-pill flex w-full items-center justify-center gap-3 bg-white px-4 py-3 text-xs uppercase tracking-[0.2em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
          >
            <i className="fab fa-google" />
            Continue with Google
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Don&rsquo;t have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="font-bold text-rose-500 transition hover:text-rose-600"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  )
}

export default LoginSplitCard
