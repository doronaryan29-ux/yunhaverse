import { useEffect, useMemo, useRef, useState } from 'react'

const AUTH_MAX_AGE_MS = 12 * 60 * 60 * 1000

const parseHashQuery = (hash) => {
  const queryIndex = hash.indexOf('?')
  if (queryIndex === -1) return {}
  const query = hash.slice(queryIndex + 1)
  return Object.fromEntries(new URLSearchParams(query))
}

const normalizeUser = (raw) => {
  if (!raw) return null
  return {
    id: raw.id,
    email: raw.email,
    role: raw.role || raw.user_role || raw.account_role,
    firstName: raw.firstName || raw.first_name,
    lastName: raw.lastName || raw.last_name,
  }
}

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

const JUST_LOGGED_IN_KEY = 'justLoggedInAt'
const JUST_LOGGED_IN_WINDOW_MS = 2 * 60 * 1000

const getJustLoggedInAt = () => {
  const raw = Number(sessionStorage.getItem(JUST_LOGGED_IN_KEY) || 0)
  if (!raw) return 0
  if (Date.now() - raw > JUST_LOGGED_IN_WINDOW_MS) {
    sessionStorage.removeItem(JUST_LOGGED_IN_KEY)
    return 0
  }
  return raw
}

const useAuthFlow = ({ apiBase, isAdminRole }) => {
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
  const authFormRef = useRef(null)
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
  const [resetOpen, setResetOpen] = useState(false)
  const [resetStep, setResetStep] = useState('request')
  const [resetEmail, setResetEmail] = useState('')
  const [resetOtp, setResetOtp] = useState('')
  const [resetOtpDigits, setResetOtpDigits] = useState(Array(6).fill(''))
  const resetOtpRefs = useRef([])
  const resetFormRef = useRef(null)
  const [resetToken, setResetToken] = useState('')
  const [resetPassword, setResetPassword] = useState('')
  const [resetConfirm, setResetConfirm] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetFeedback, setResetFeedback] = useState({ type: '', message: '' })
  const [toast, setToast] = useState(null)
  const isOtpRoute = route.startsWith('#/login/otp')
  const forceLogin = useMemo(() => {
    const query = parseHashQuery(route)
    return query.force === '1' || query.force === 'true'
  }, [route])

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
    if (forceLogin) {
      sessionStorage.removeItem(JUST_LOGGED_IN_KEY)
      window.location.replace('/#/')
      return
    }
    const justLoggedInAt = getJustLoggedInAt()
    if (justLoggedInAt) {
      sessionStorage.removeItem(JUST_LOGGED_IN_KEY)
    }
    window.location.replace(isAdminRole(user.role) ? '/#/admin' : '/#/member')
  }, [route, isOtpRoute, forceLogin])

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

  useEffect(() => {
    if (!isOtpRoute) {
      resetOtpFlow()
      resetAllFields()
    }
  }, [isOtpRoute])

  useEffect(() => {
    if (!isOtpRoute || !otpSent) return
    if (otpDigits.every((digit) => digit) && authFormRef.current && !loading) {
      authFormRef.current.requestSubmit()
    }
  }, [isOtpRoute, otpDigits, otpSent, loading])

  useEffect(() => {
    if (!resetOpen || resetStep !== 'verify') return
    if (resetOtpDigits.every((digit) => digit) && !resetLoading) {
      const nextOtp = resetOtpDigits.join('')
      setResetOtp(nextOtp)
    }
  }, [resetOpen, resetOtpDigits, resetStep, resetLoading])

  useEffect(() => {
    if (!resetOpen || resetStep !== 'verify') return
    if (resetOtpDigits.every((digit) => digit) && !resetLoading) {
      resetFormRef.current?.requestSubmit()
    }
  }, [resetOpen, resetOtpDigits, resetStep, resetLoading])

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

  const resetResetFlow = () => {
    setResetStep('request')
    setResetEmail('')
    setResetOtp('')
    setResetOtpDigits(Array(6).fill(''))
    setResetToken('')
    setResetPassword('')
    setResetConfirm('')
    setResetFeedback({ type: '', message: '' })
  }

  const openResetModal = () => {
    setResetOpen(true)
    setResetFeedback({ type: '', message: '' })
    if (email) {
      setResetEmail(email)
    }
  }

  const closeResetModal = () => {
    setResetOpen(false)
    resetResetFlow()
  }

  const passwordResetValid =
    resetPassword.length >= 8 && /[A-Z]/.test(resetPassword)
  const passwordResetMatches =
    resetPassword && resetConfirm && resetPassword === resetConfirm

  const openToast = (payload) => {
    setToast(payload)
    window.setTimeout(() => {
      setToast((current) => (current === payload ? null : current))
    }, 3500)
  }

  const handleGoogleRedirect = () => {
    window.location.href = `${apiBase}/auth/google/redirect`
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
      openToast({
        type: 'success',
        message: 'OTP sent to your email.',
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

  const handleModeSelect = (nextMode) => {
    setMode(nextMode)
    resetOtpFlow()
    window.location.hash = forceLogin ? '#/login?force=1' : '#/login'
  }

  const handleCancelOtp = async () => {
    await cancelSignup(otpEmail)
    resetOtpFlow()
    resetAllFields()
    setMode('signup')
    window.location.hash = forceLogin ? '#/login?force=1' : '#/login'
  }

  const handleAuthSubmit = async (event) => {
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
      const responseUser = normalizeUser(data?.user || data?.profile || data)
      if (responseUser?.id && responseUser?.email) {
        sessionStorage.setItem('user', JSON.stringify(responseUser))
        sessionStorage.setItem('authAt', String(Date.now()))
        sessionStorage.setItem(JUST_LOGGED_IN_KEY, String(Date.now()))
      }
      setFeedback({
        type: 'success',
        message:
          mode === 'login'
            ? 'Login successful!'
            : 'Verified! Redirecting to login...',
      })
      if (mode === 'login' && responseUser?.id) {
        openToast({
          type: 'success',
          message: 'Signed in. Redirecting...',
        })
        window.setTimeout(() => {
          window.location.replace(
            isAdminRole(responseUser.role) ? '/#/admin' : '/#/member',
          )
        }, 600)
      } else if (mode !== 'login') {
        openToast({
          type: 'success',
          message: 'Signup verified. You can log in now.',
        })
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
  }

  return {
    mode,
    setMode,
    email,
    setEmail,
    otp,
    setOtp,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    birthdate,
    setBirthdate,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    otpSent,
    feedback,
    loading,
    errorModal,
    setErrorModal,
    otpDigits,
    setOtpDigits,
    otpInputRefs,
    authFormRef,
    passwordHasUppercase,
    passwordLongEnough,
    passwordMatches,
    otpReady,
    route,
    pendingOtp,
    setPendingOtp,
    resetOpen,
    resetStep,
    setResetStep,
    resetEmail,
    setResetEmail,
    resetOtp,
    setResetOtp,
    resetOtpDigits,
    setResetOtpDigits,
    resetOtpRefs,
    resetFormRef,
    resetToken,
    setResetToken,
    resetPassword,
    setResetPassword,
    resetConfirm,
    setResetConfirm,
    resetLoading,
    setResetLoading,
    resetFeedback,
    setResetFeedback,
    toast,
    isOtpRoute,
    forceLogin,
    headline,
    otpEmail,
    openToast,
    handleGoogleRedirect,
    handleSendOtp,
    handleModeSelect,
    handleCancelOtp,
    handleAuthSubmit,
    openResetModal,
    closeResetModal,
    passwordResetValid,
    passwordResetMatches,
    resetOtpFlow,
    resetAllFields,
  }
}

export default useAuthFlow
