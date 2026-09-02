import { useState } from 'react'

// Persisted across the 3 reset-password pages (and a reload/re-visit within
// the same browser session) so the flow is resumable rather than living in
// one component's memory the way the old modal did.
const RESET_FLOW_KEY = 'passwordResetFlow'
const DEFAULT_TOAST_DURATION_MS = 3500

const readStoredFlow = () => {
  try {
    return JSON.parse(sessionStorage.getItem(RESET_FLOW_KEY) || 'null') || {}
  } catch {
    return {}
  }
}

const writeStoredFlow = (next) => {
  sessionStorage.setItem(RESET_FLOW_KEY, JSON.stringify(next))
}

export const clearResetFlow = () => {
  sessionStorage.removeItem(RESET_FLOW_KEY)
}

const parseJsonSafe = async (response) => {
  const raw = await response.text()
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return { message: raw.slice(0, 200) }
  }
}

const useResetPasswordFlow = ({ apiBase }) => {
  const [storedFlow, setStoredFlow] = useState(() => readStoredFlow())
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const [toast, setToast] = useState(null)

  const openToast = (payload) => {
    const duration = payload.duration || DEFAULT_TOAST_DURATION_MS
    const next = { ...payload, duration }
    setToast(next)
    window.setTimeout(() => {
      setToast((current) => (current === next ? null : current))
    }, duration)
  }

  const postJson = async (path, body) => {
    const response = await fetch(`${apiBase}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await parseJsonSafe(response)
    if (!response.ok) {
      throw new Error(data?.message || 'Something went wrong.')
    }
    return data
  }

  const requestCode = async (email) => {
    setFeedback({ type: '', message: '' })
    setLoading(true)
    try {
      await postJson('/auth/forgot-password', { email })
      const next = { email }
      writeStoredFlow(next)
      setStoredFlow(next)
      openToast({ type: 'success', message: 'Reset code sent to your email.' })
      return true
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message || 'Failed to send code.',
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const verifyCode = async (email, otp) => {
    setFeedback({ type: '', message: '' })
    setLoading(true)
    try {
      const data = await postJson('/auth/verify-reset-otp', { email, otp })
      const next = { email, token: data.resetToken || '' }
      writeStoredFlow(next)
      setStoredFlow(next)
      openToast({ type: 'success', message: 'Code verified. Set your new password.' })
      return true
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message || 'Invalid code.',
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const confirmNewPassword = async (email, token, password) => {
    setFeedback({ type: '', message: '' })
    setLoading(true)
    try {
      await postJson('/auth/reset-password', { email, resetToken: token, password })
      clearResetFlow()
      setStoredFlow({})
      openToast({ type: 'success', message: 'Password reset. You can log in now.' })
      return true
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message || 'Failed to reset password.',
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    storedEmail: storedFlow.email || '',
    storedToken: storedFlow.token || '',
    loading,
    feedback,
    setFeedback,
    toast,
    requestCode,
    verifyCode,
    confirmNewPassword,
  }
}

export default useResetPasswordFlow
