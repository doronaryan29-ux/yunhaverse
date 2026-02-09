import { useCallback, useEffect, useState } from 'react'

export const useAdminProfile = ({
  apiBase,
  profileRoleNormalized,
  user,
  isProfileRoute,
  onSaved,
}) => {
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileFeedback, setProfileFeedback] = useState({ type: '', message: '' })
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    birthdate: '',
    email: '',
    role: '',
    status: '',
  })

  useEffect(() => {
    if (!isProfileRoute || !user?.id) return
    let isMounted = true
    const loadProfile = async () => {
      setProfileLoading(true)
      setProfileFeedback({ type: '', message: '' })
      try {
        const params = new URLSearchParams({
          requesterRole: profileRoleNormalized,
          requesterId: String(user.id),
        })
        const response = await fetch(
          `${apiBase}/users/${user.id}/profile?${params.toString()}`,
        )
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data?.message || 'Failed to load profile.')
        }
        if (!isMounted) return
        setProfileForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          birthdate: data.birthdate || '',
          email: data.email || '',
          role: data.role || '',
          status: data.status || '',
        })
      } catch (error) {
        if (!isMounted) return
        setProfileFeedback({
          type: 'error',
          message: error.message || 'Failed to load profile.',
        })
      } finally {
        if (isMounted) setProfileLoading(false)
      }
    }

    loadProfile()
    return () => {
      isMounted = false
    }
  }, [apiBase, isProfileRoute, profileRoleNormalized, user?.id])

  const saveProfile = useCallback(
    async (event) => {
      event.preventDefault()
      if (!user?.id) return
      if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) {
        setProfileFeedback({ type: 'error', message: 'First and last name are required.' })
        return
      }
      setProfileSaving(true)
      setProfileFeedback({ type: '', message: '' })
      try {
        const response = await fetch(`${apiBase}/users/${user.id}/profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requesterRole: profileRoleNormalized,
            requesterId: user.id,
            firstName: profileForm.firstName.trim(),
            lastName: profileForm.lastName.trim(),
            birthdate: profileForm.birthdate || null,
          }),
        })
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data?.message || 'Failed to save profile.')
        }
        const nextUser = {
          ...user,
          firstName: profileForm.firstName.trim(),
          lastName: profileForm.lastName.trim(),
        }
        sessionStorage.setItem('user', JSON.stringify(nextUser))
        setProfileFeedback({ type: 'success', message: 'Profile saved.' })
        if (onSaved) onSaved()
      } catch (error) {
        setProfileFeedback({
          type: 'error',
          message: error.message || 'Failed to save profile.',
        })
      } finally {
        setProfileSaving(false)
      }
    },
    [apiBase, onSaved, profileForm, profileRoleNormalized, user],
  )

  return {
    profileForm,
    setProfileForm,
    profileLoading,
    profileSaving,
    profileFeedback,
    saveProfile,
  }
}
