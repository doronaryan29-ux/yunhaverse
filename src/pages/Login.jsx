import { useEffect, useMemo, useRef, useState } from 'react'

const benefits = [
  'Early access to ticket drops and preregistration slots.',
  'Members-only merch and fanart spotlight features.',
  'Priority RSVP confirmations for Yunha gatherings.',
  'Direct updates delivered straight to your inbox.',
]
const isAdminRole = (role) => String(role || '').trim().toLowerCase() === 'admin'
const AUTH_MAX_AGE_MS = 12 * 60 * 60 * 1000
const getValidSessionUser = () => {
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

const Login = () => {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [errorModal, setErrorModal] = useState('')
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''))
  const otpInputRefs = useRef([])
  const apiBase = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'
  const passwordHasUppercase = /[A-Z]/.test(password)
  const passwordLongEnough = password.length >= 8
  const passwordMatches = password && confirmPassword && password === confirmPassword
  const otpReady = otpDigits.every((digit) => digit)
  const [route, setRoute] = useState(window.location.hash || '#/login')
  const [pendingOtp, setPendingOtp] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('pendingOtp') || 'null')
    } catch {
      return null
    }
  })
  const isOtpRoute = route.startsWith('#/login/otp')

  useEffect(() => {
    const handleRouteChange = () =>
      setRoute(window.location.hash || '#/login')
    window.addEventListener('hashchange', handleRouteChange)
    return () => window.removeEventListener('hashchange', handleRouteChange)
  }, [])

  useEffect(() => {
    if (isOtpRoute && !pendingOtp?.email) {
      window.location.hash = '#/login'
    }
  }, [isOtpRoute, pendingOtp])

  useEffect(() => {
    if (!route.startsWith('#/login') || isOtpRoute) return
    const user = getValidSessionUser()
    if (!user) return
    window.location.replace(isAdminRole(user.role) ? '/#/admin' : '/#/')
  }, [route, isOtpRoute])

  useEffect(() => {
    if (isOtpRoute && pendingOtp?.email) {
      setOtpSent(true)
    }
  }, [isOtpRoute, pendingOtp])

  useEffect(() => {
    if (pendingOtp?.email && !email) {
      setEmail(pendingOtp.email)
    }
    if (pendingOtp?.mode) {
      setMode(pendingOtp.mode)
    }
  }, [pendingOtp, email])

  useEffect(() => {
    if (isOtpRoute) {
      const firstInput = otpInputRefs.current[0]
      if (firstInput) {
        firstInput.focus()
      }
    }
  }, [isOtpRoute, otpSent])

  const handleGoogleRedirect = () => {
    window.location.href = `${apiBase}/auth/google/redirect`
  }

  useEffect(() => {
    if (!isOtpRoute) {
      resetOtpFlow()
      resetAllFields()
    }
  }, [isOtpRoute])

  const headline = useMemo(
    () =>
      mode === 'login'
        ? 'Welcome back, YUNHAverse member.'
        : 'Join the members-only circle.',
    [mode],
  )
  const otpEmail = pendingOtp?.email || email

  const resetOtpFlow = () => {
    setOtpSent(false)
    setOtpDigits(Array(6).fill(''))
    setPendingOtp(null)
    sessionStorage.removeItem('pendingOtp')
  }

  const resetSignupFields = () => {
    setFirstName('')
    setLastName('')
    setBirthdate('')
    setPassword('')
    setConfirmPassword('')
  }

  const resetAllFields = () => {
    setEmail('')
    setOtp('')
    setFeedback({ type: '', message: '' })
    resetSignupFields()
    setOtpDigits(Array(6).fill(''))
  }

  const cancelSignup = async (emailToCancel) => {
    if (!emailToCancel) return
    try {
      await fetch(`${apiBase}/auth/cancel-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToCancel }),
      })
    } catch {
      // Best-effort cleanup; ignore errors
    }
  }

  const handleSendOtp = async () => {
    if (!email) {
      setFeedback({ type: 'error', message: 'Enter your email.' })
      return
    }
    if (mode === 'signup') {
      if (!passwordHasUppercase || !passwordLongEnough) {
        setErrorModal(
          'Password must be at least 8 characters and include 1 uppercase letter.',
        )
        return
      }
      if (!passwordMatches) {
        setErrorModal('Passwords do not match.')
        return
      }
    }
    setFeedback({ type: '', message: '' })
    setLoading(true)
    try {
      const response = await fetch(`${apiBase}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          mode,
          password: mode === 'signup' ? password : undefined,
          firstName: mode === 'signup' ? firstName : undefined,
          lastName: mode === 'signup' ? lastName : undefined,
          birthdate: mode === 'signup' ? birthdate : undefined,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to send OTP.')
      }
      const nextPending = { email, mode }
      sessionStorage.setItem('pendingOtp', JSON.stringify(nextPending))
      setPendingOtp(nextPending)
      setOtpSent(true)
      setOtpDigits(Array(6).fill(''))
      window.location.hash = '#/login/otp'
      setFeedback({
        type: 'success',
        message: 'OTP sent! Check your email.',
      })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message || 'Failed to send OTP.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/image/logoyunha.png"
              alt="Yunha Logo"
              className="h-11 w-11 rounded-full object-cover shadow"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-500">
                General Access
              </p>
              <h1 className="font-display text-2xl font-semibold text-slate-900">
                YUNHAverse Portal
              </h1>
            </div>
          </div>
          <a
            href="/#/"
            className="rounded-full border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
          >
            Back to home
          </a>
        </header>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <section className="flex flex-col justify-between rounded-[32px] border border-rose-100 bg-white/70 p-8 shadow-xl shadow-rose-100">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-500">
                General Access
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-slate-900">
                {headline}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Sign in with your password or register with a quick email OTP.
                Every account is verified to keep the community safe and exclusive.
              </p>
              <div className="mt-8 space-y-4">
                {benefits.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-white px-4 py-3"
                  >
                    <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                      <i className="fas fa-star" />
                    </span>
                    <p className="text-sm text-slate-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-xs text-rose-700">
              Use the same email every time to keep your member perks synced.
            </div>
          </section>

          <section className="rounded-[32px] border border-rose-100 bg-white p-8 shadow-2xl shadow-rose-100">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-500">
                  {isOtpRoute
                    ? 'OTP Verification'
                    : mode === 'login'
                      ? 'General Login'
                      : 'General Signup'}
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900">
                  {isOtpRoute
                    ? 'Enter the code we emailed you.'
                    : mode === 'login'
                      ? 'Sign in to continue.'
                      : 'Create your member access.'}
                </h2>
              </div>
              {!isOtpRoute && (
                <div className="flex w-full items-center gap-1 rounded-full bg-rose-50 p-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-rose-500 sm:w-auto sm:text-xs sm:tracking-[0.2em]">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login')
                      resetOtpFlow()
                      window.location.hash = '#/login'
                    }}
                    className={`flex-1 whitespace-nowrap rounded-full px-4 py-2 transition ${
                      mode === 'login'
                        ? 'bg-rose-500 text-white shadow'
                        : 'text-rose-500'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup')
                      resetOtpFlow()
                      window.location.hash = '#/login'
                    }}
                    className={`flex-1 whitespace-nowrap rounded-full px-4 py-2 transition ${
                      mode === 'signup'
                        ? 'bg-rose-500 text-white shadow'
                        : 'text-rose-500'
                    }`}
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>

            <form
              className="mt-6 space-y-4"
              onSubmit={async (event) => {
                event.preventDefault()
                if (mode === 'signup' && !isOtpRoute) {
                  if (!passwordHasUppercase || !passwordLongEnough) {
                    setFeedback({
                      type: 'error',
                      message:
                        'Password must be at least 8 characters and include 1 uppercase letter.',
                    })
                    return
                  }
                  if (!passwordMatches) {
                    setFeedback({
                      type: 'error',
                      message: 'Passwords do not match.',
                    })
                    return
                  }
                }
                setFeedback({ type: '', message: '' })
                setLoading(true)
                try {
                  let response
                  if (mode === 'login' && !isOtpRoute) {
                    response = await fetch(`${apiBase}/auth/login`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email, password }),
                    })
                  } else {
                    const otpValue = otpDigits.join('')
                    const otpEmail = pendingOtp?.email || email
                    response = await fetch(`${apiBase}/auth/verify-otp`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: otpEmail, otp: otpValue || otp }),
                    })
                  }
                  const data = await response.json()
                  if (!response.ok) {
                    throw new Error(data?.message || 'Verification failed.')
                  }
                  if (mode === 'login' && data?.user) {
                    sessionStorage.setItem('user', JSON.stringify(data.user))
                    sessionStorage.setItem('authAt', String(Date.now()))
                    if (isAdminRole(data.user.role)) {
                      window.location.replace('/#/admin')
                    } else {
                      window.location.replace('/#/')
                    }
                  }
                  setFeedback({
                    type: 'success',
                    message:
                      mode === 'login'
                        ? 'Login successful!'
                        : 'Verified! Redirecting to login...',
                  })
                  if (mode !== 'login') {
                    resetOtpFlow()
                    resetAllFields()
                    setMode('login')
                    window.location.hash = '#/login'
                  }
                } catch (error) {
                  setFeedback({
                    type: 'error',
                    message: error.message || 'Verification failed.',
                  })
                } finally {
                  setLoading(false)
                }
              }}
            >
              <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Email address
                <input
                  type="email"
                  value={isOtpRoute ? otpEmail : email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@email.com"
                  disabled={isOtpRoute}
                  className="mt-2 w-full rounded-2xl border border-rose-100 bg-white px-4 py-3 text-sm text-slate-700 focus:border-rose-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
                  required
                />
              </label>
              {isOtpRoute && (
                <button
                  type="button"
                  className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500"
                  onClick={async () => {
                    await cancelSignup(otpEmail)
                    resetOtpFlow()
                    resetAllFields()
                    setMode('signup')
                    window.location.hash = '#/login'
                  }}
                >
                  Not your email? Go back
                </button>
              )}

              {!isOtpRoute && mode === 'login' && (
                <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Password
                  <div className="relative mt-2">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Your password"
                      className="w-full rounded-2xl border border-rose-100 bg-white px-4 py-3 pr-12 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400 transition hover:text-rose-500"
                    >
                      {showPassword ? (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M17.94 17.94A10.92 10.92 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.07-2.95 3.05-5.36 5.6-6.74" />
                          <path d="M9.9 4.24A10.5 10.5 0 0 1 12 4c5 0 9.27 3.11 11 8a11.05 11.05 0 0 1-2.6 4.03" />
                          <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88" />
                          <path d="M1 1l22 22" />
                        </svg>
                      ) : (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </label>
              )}

              {!isOtpRoute && mode === 'signup' && (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      First name
                      <input
                        type="text"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        placeholder="First name"
                        className="mt-2 w-full rounded-2xl border border-rose-100 bg-white px-4 py-3 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                        required
                      />
                    </label>
                    <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      Last name
                      <input
                        type="text"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        placeholder="Last name"
                        className="mt-2 w-full rounded-2xl border border-rose-100 bg-white px-4 py-3 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                        required
                      />
                    </label>
                  </div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Birthdate
                    <input
                      type="date"
                      value={birthdate}
                      onChange={(event) => setBirthdate(event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-rose-100 bg-white px-4 py-3 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                      required
                    />
                  </label>
                  <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Password
                    <div className="relative mt-2">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Create a password"
                        className="w-full rounded-2xl border border-rose-100 bg-white px-4 py-3 pr-12 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400 transition hover:text-rose-500"
                      >
                        {showPassword ? (
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M17.94 17.94A10.92 10.92 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.07-2.95 3.05-5.36 5.6-6.74" />
                            <path d="M9.9 4.24A10.5 10.5 0 0 1 12 4c5 0 9.27 3.11 11 8a11.05 11.05 0 0 1-2.6 4.03" />
                            <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88" />
                            <path d="M1 1l22 22" />
                          </svg>
                        ) : (
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </label>
                  <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Confirm password
                    <div className="relative mt-2">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Re-enter password"
                        className="w-full rounded-2xl border border-rose-100 bg-white px-4 py-3 pr-12 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label={
                          showConfirmPassword
                            ? 'Hide confirm password'
                            : 'Show confirm password'
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400 transition hover:text-rose-500"
                      >
                        {showConfirmPassword ? (
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M17.94 17.94A10.92 10.92 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.07-2.95 3.05-5.36 5.6-6.74" />
                            <path d="M9.9 4.24A10.5 10.5 0 0 1 12 4c5 0 9.27 3.11 11 8a11.05 11.05 0 0 1-2.6 4.03" />
                            <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88" />
                            <path d="M1 1l22 22" />
                          </svg>
                        ) : (
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </label>
                  <p className="text-xs text-slate-500">
                    Password must be at least 8 characters and include 1 uppercase
                    letter.
                  </p>
                </>
              )}

              {isOtpRoute && otpSent && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    One-time code
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {otpDigits.map((value, index) => (
                      <input
                        key={`otp-${index}`}
                        type="text"
                        inputMode="text"
                        maxLength={1}
                        value={value}
                        ref={(el) => {
                          otpInputRefs.current[index] = el
                        }}
                        onChange={(event) => {
                          const next = event.target.value
                            .replace(/[^a-zA-Z0-9]/g, '')
                            .toUpperCase()
                          const updated = [...otpDigits]
                          updated[index] = next
                          setOtpDigits(updated)
                          if (next && otpInputRefs.current[index + 1]) {
                            otpInputRefs.current[index + 1].focus()
                          }
                        }}
                        onPaste={(event) => {
                          const pasted = event.clipboardData
                            .getData('text')
                            .replace(/[^a-zA-Z0-9]/g, '')
                            .toUpperCase()
                          if (!pasted) return
                          event.preventDefault()
                          const updated = [...otpDigits]
                          for (let i = 0; i < updated.length; i += 1) {
                            updated[i] = pasted[i] || ''
                          }
                          setOtpDigits(updated)
                          const nextIndex = Math.min(
                            pasted.length,
                            updated.length - 1,
                          )
                          const nextInput = otpInputRefs.current[nextIndex]
                          if (nextInput) {
                            nextInput.focus()
                          }
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Backspace' && !otpDigits[index]) {
                            const prev = otpInputRefs.current[index - 1]
                            if (prev) {
                              prev.focus()
                            }
                          }
                        }}
                        className="h-12 w-12 rounded-2xl border border-rose-100 bg-white text-center text-lg font-semibold text-slate-700 focus:border-rose-400 focus:outline-none"
                        required
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">
                    Use the 6-character code we emailed you.
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {mode === 'login' && !isOtpRoute ? (
                  <button
                    type="submit"
                    className="flex-1 rounded-2xl bg-rose-500 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={loading}
                  >
                    {loading ? 'Working...' : 'Login'}
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="flex-1 rounded-2xl border border-rose-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
                      onClick={handleSendOtp}
                      disabled={loading}
                    >
                      {isOtpRoute ? 'Resend code' : 'Register'}
                    </button>
                    {isOtpRoute && (
                      <button
                        type="submit"
                        className="flex-1 rounded-2xl bg-rose-500 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                        disabled={loading || !otpSent || !otpReady}
                      >
                        {loading ? 'Working...' : 'Verify & login'}
                      </button>
                    )}
                  </>
                )}
              </div>
              {feedback.message && (
                <p
                  className={`text-xs ${feedback.type === 'success' ? 'text-emerald-600' : 'text-rose-500'}`}
                >
                  {feedback.message}
                </p>
              )}

              {!isOtpRoute && (
                <>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="h-px flex-1 bg-rose-100" />
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      or
                    </span>
                    <span className="h-px flex-1 bg-rose-100" />
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleRedirect}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 transition hover:-translate-y-0.5 hover:bg-slate-50"
                  >
                    <span className="text-base">
                      <i className="fab fa-google" />
                    </span>
                    Continue with Google
                  </button>

                  <p className="text-xs text-slate-500">
                    Google sign-in is optional, but it keeps logins fast and reduces
                    OTP spam for returning members.
                  </p>
                </>
              )}
            </form>
          </section>
        </div>
      </div>
      {errorModal && (
        <>
          <button
            type="button"
            aria-label="Close error"
            className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur"
            onClick={() => setErrorModal('')}
          />
          <div
            role="alertdialog"
            aria-modal="true"
            className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-rose-100 bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-500">
                  Password issue
                </p>
                <h3 className="font-display text-xl font-semibold text-slate-900">
                  Fix your password
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-100 text-rose-500"
                onClick={() => setErrorModal('')}
              >
                <i className="fas fa-times" />
              </button>
            </div>
            <p className="mt-4 text-sm text-slate-600">{errorModal}</p>
            <button
              type="button"
              className="mt-6 w-full rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5"
              onClick={() => setErrorModal('')}
            >
              Got it
            </button>
          </div>
        </>
      )}
    </main>
  )
}

export default Login
