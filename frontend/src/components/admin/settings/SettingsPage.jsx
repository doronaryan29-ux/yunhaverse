import { memo, useMemo, useState, useEffect } from 'react'
import AuditSettingsSection from './AuditSettingsSection'
import BrandingSection from './BrandingSection'
import RolesSection from './RolesSection'
import SettingsActions from './SettingsActions'
import SettingsHeader from './SettingsHeader'

const DEFAULT_SETTINGS = {
  appName: 'YunhaVerse',
  logoUrl: '',
  homepageHeadline: 'Welcome to YunhaVerse',
  homepageSubheadline: 'The official Filipino fanbase celebrating and supporting UNIS’ Bang Yunha.',
  primaryColor: '#0f172a',
}

const DEFAULT_ROLES = [
  {
    id: 'member',
    label: 'Member',
    permissions: ['members_view'],
  },
  {
    id: 'creative',
    label: 'Creative Staff',
    permissions: ['creative_view', 'creative_manage'],
  },
  {
    id: 'copywriter',
    label: 'Copywriter',
    permissions: ['copywriter_view', 'copywriter_manage'],
  },
  {
    id: 'sns',
    label: 'SNS Updater',
    permissions: ['sns_view', 'sns_manage'],
  },
]

const PERMISSION_OPTIONS = [
  { id: 'members_view', label: 'Members: View' },
  { id: 'members_manage', label: 'Members: Manage' },
  { id: 'creative_view', label: 'Creative Staff: View' },
  { id: 'creative_manage', label: 'Creative Staff: Manage' },
  { id: 'copywriter_view', label: 'Copywriter: View' },
  { id: 'copywriter_manage', label: 'Copywriter: Manage' },
  { id: 'sns_view', label: 'SNS Updater: View' },
  { id: 'sns_manage', label: 'SNS Updater: Manage' },
]

const COLOR_PRESETS = [
  '#e11d48',
  '#f97316',
  '#f59e0b',
  '#10b981',
  '#14b8a6',
  '#0ea5e9',
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#111827',
]

const SettingsPage = ({ apiBase, requesterRole, userId, onSaved }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [roles, setRoles] = useState(DEFAULT_ROLES)
  const [auditSettings, setAuditSettings] = useState({
    requireReason: true,
    autoArchiveDays: 30,
    notifyOnFlag: true,
  })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  useEffect(() => {
    let isMounted = true
    const loadSettings = async () => {
      if (!apiBase) return
      setLoading(true)
      setFeedback({ type: '', message: '' })
      try {
        const params = new URLSearchParams({
          requesterRole: requesterRole || 'admin',
        })
        const response = await fetch(`${apiBase}/admin/settings?${params.toString()}`)
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data?.message || 'Failed to load settings.')
        }
        if (!isMounted) return
        setSettings((prev) => ({
          ...prev,
          appName: data.app_name ?? prev.appName,
          logoUrl: data.logo_url ?? prev.logoUrl,
          homepageHeadline: data.homepage_headline ?? prev.homepageHeadline,
          homepageSubheadline: data.homepage_subheadline ?? prev.homepageSubheadline,
          primaryColor: data.primary_color ?? prev.primaryColor,
        }))
        if (Array.isArray(data.roles) && data.roles.length > 0) {
          setRoles(data.roles)
        }
        if (data.audit_settings && typeof data.audit_settings === 'object') {
          setAuditSettings((prev) => ({ ...prev, ...data.audit_settings }))
        }
      } catch (error) {
        if (!isMounted) return
        setFeedback({
          type: 'error',
          message: error.message || 'Failed to load settings.',
        })
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadSettings()
    return () => {
      isMounted = false
    }
  }, [apiBase, requesterRole])

  const permissionMap = useMemo(() => {
    const map = {}
    PERMISSION_OPTIONS.forEach((option) => {
      map[option.id] = option.label
    })
    return map
  }, [])

  const handleSettingChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleAuditChange = (field, value) => {
    setAuditSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      if (result) handleSettingChange('logoUrl', result)
    }
    reader.readAsDataURL(file)
  }

  const toggleRolePermission = (roleId, permissionId) => {
    setRoles((prev) =>
      prev.map((role) => {
        if (role.id !== roleId) return role
        const currentPermissions = role.permissions || []
        const hasPermission = currentPermissions.includes(permissionId)
        const nextPermissions = hasPermission
          ? currentPermissions.filter((permission) => permission !== permissionId)
          : [...currentPermissions, permissionId]
        return { ...role, permissions: nextPermissions }
      }),
    )
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setFeedback({ type: '', message: '' })

    try {
      const response = await fetch(`${apiBase}/admin/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterRole: requesterRole || 'admin',
          updatedBy: userId || null,
          app_name: settings.appName,
          logo_url: settings.logoUrl,
          homepage_headline: settings.homepageHeadline,
          homepage_subheadline: settings.homepageSubheadline,
          primary_color: settings.primaryColor,
          roles,
          auditSettings,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to save settings.')
      }
      document.title = settings.appName || document.title
      setFeedback({ type: 'success', message: 'Settings saved.' })
      window.dispatchEvent(
        new CustomEvent('app-settings-updated', {
          detail: {
            app_name: settings.appName,
            logo_url: settings.logoUrl,
            homepage_headline: settings.homepageHeadline,
            homepage_subheadline: settings.homepageSubheadline,
            primary_color: settings.primaryColor,
          },
        }),
      )
      if (onSaved) onSaved({ settings, roles, auditSettings })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error?.message || 'Failed to save settings.',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-8">
      <SettingsHeader />

      <form onSubmit={handleSave} className="space-y-8">
        <BrandingSection
          settings={settings}
          loading={loading}
          colorPresets={COLOR_PRESETS}
          onSettingChange={handleSettingChange}
          onLogoUpload={handleLogoUpload}
        />
        <RolesSection
          roles={roles}
          permissions={PERMISSION_OPTIONS}
          permissionMap={permissionMap}
          toggleRolePermission={toggleRolePermission}
        />
        <AuditSettingsSection
          auditSettings={auditSettings}
          onAuditChange={handleAuditChange}
        />
        <SettingsActions saving={saving} loading={loading} feedback={feedback} />
      </form>
    </section>
  )
}

export default memo(SettingsPage)
