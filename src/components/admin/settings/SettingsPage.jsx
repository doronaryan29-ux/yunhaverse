import { memo, useMemo, useState, useEffect } from 'react'

const DEFAULT_SETTINGS = {
  appName: 'YunhaVerse',
  logoUrl: '',
  homepageHeadline: 'Welcome to YunhaVerse',
  homepageSubheadline: 'A place for creators to thrive.',
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
]

const PERMISSION_OPTIONS = [
  { id: 'members_view', label: 'Members: View' },
  { id: 'members_manage', label: 'Members: Manage' },
  { id: 'creative_view', label: 'Creative Staff: View' },
  { id: 'creative_manage', label: 'Creative Staff: Manage' },
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
        const hasPermission = role.permissions.includes(permissionId)
        const nextPermissions = hasPermission
          ? role.permissions.filter((permission) => permission !== permissionId)
          : [...role.permissions, permissionId]
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
      <header className="rounded-3xl border border-rose-100 bg-white/80 p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Settings</h2>
        <p className="mt-2 text-sm text-slate-600">
          Admin-only settings for branding, roles, and audit behavior.
        </p>
      </header>

      <form onSubmit={handleSave} className="space-y-8">
        <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Branding</h3>
          <p className="mt-1 text-sm text-slate-600">
            Customize what members see on the homepage.
          </p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span className="font-medium text-slate-700">App name</span>
                <input
                  type="text"
                  value={settings.appName}
                  onChange={(event) => handleSettingChange('appName', event.target.value)}
                  disabled={loading}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
                />
              </label>
              <div className="space-y-2 text-sm">
                <span className="font-medium text-slate-700">Upload logo</span>
                <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-rose-200 bg-rose-50/60 p-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-rose-200 bg-white shadow-sm">
                    {settings.logoUrl ? (
                      <img
                        src={settings.logoUrl}
                        alt="Logo preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] font-semibold text-rose-400">
                        No logo
                      </span>
                    )}
                  </div>
                  <div className="min-w-[160px] flex-1 space-y-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={loading}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
                    />
                    <span className="text-xs text-slate-500">
                      Stored as a data URL for the homepage, navbar, and login.
                    </span>
                  </div>
                </div>
              </div>
              <label className="space-y-1 text-sm md:col-span-2">
                <span className="font-medium text-slate-700">Homepage headline</span>
                <input
                  type="text"
                  value={settings.homepageHeadline}
                  onChange={(event) =>
                    handleSettingChange('homepageHeadline', event.target.value)
                  }
                  disabled={loading}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
                />
              </label>
              <label className="space-y-1 text-sm md:col-span-2">
                <span className="font-medium text-slate-700">Homepage subheadline</span>
                <input
                  type="text"
                  value={settings.homepageSubheadline}
                  onChange={(event) =>
                    handleSettingChange('homepageSubheadline', event.target.value)
                  }
                  disabled={loading}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
                />
              </label>
            </div>

            <div className="rounded-3xl border border-rose-100 bg-rose-50/60 p-4 shadow-sm lg:-ml-2">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-2 text-sm">
                  <span className="font-medium text-slate-700">Primary color</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {COLOR_PRESETS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleSettingChange('primaryColor', color)}
                        className="h-8 w-8 rounded-full border border-slate-200 transition hover:scale-105"
                        style={{
                          backgroundColor: color,
                          boxShadow:
                            settings.primaryColor === color
                              ? '0 0 0 3px rgba(15, 23, 42, 0.2)'
                              : 'none',
                        }}
                        aria-label={`Select ${color}`}
                      />
                    ))}
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(event) =>
                        handleSettingChange('primaryColor', event.target.value)
                      }
                      disabled={loading}
                      className="h-10 w-16 rounded-full border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                    Homepage Preview
                  </p>
                  <div className="mt-3 space-y-3 rounded-2xl border border-white/70 bg-white/80 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full border border-rose-100 bg-white">
                        {settings.logoUrl ? (
                          <img
                            src={settings.logoUrl}
                            alt="Logo preview"
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {settings.appName || 'App Name'}
                        </p>
                        <p className="text-[11px] text-slate-500">Fanbase Spotlight</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {settings.homepageHeadline || 'Homepage headline'}
                      </p>
                      <p className="text-xs text-slate-600">
                        {settings.homepageSubheadline || 'Homepage subheadline'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                        style={{ backgroundColor: settings.primaryColor }}
                      >
                        Join Now
                      </button>
                      <span className="text-[11px] text-slate-500">Preview only</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Users</h3>
          <p className="mt-1 text-sm text-slate-600">
            Manage permissions for members and creative staff.
          </p>
          <div className="mt-4 space-y-6">
            {roles.map((role) => (
              <div
                key={role.id}
                className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {role.label}
                    </p>
                    <p className="text-xs text-slate-500">{role.id}</p>
                  </div>
                </div>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {PERMISSION_OPTIONS.map((permission) => (
                    <label
                      key={`${role.id}-${permission.id}`}
                      className="flex items-center gap-2 text-sm text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={role.permissions.includes(permission.id)}
                        onChange={() => toggleRolePermission(role.id, permission.id)}
                        className="h-4 w-4 rounded border-slate-300"
                      />
                      {permissionMap[permission.id]}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Audit Settings</h3>
          <p className="mt-1 text-sm text-slate-600">
            Configure audit review requirements.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={auditSettings.requireReason}
                onChange={(event) =>
                  handleAuditChange('requireReason', event.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300"
              />
              Require reason when resolving audit flags
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={auditSettings.notifyOnFlag}
                onChange={(event) =>
                  handleAuditChange('notifyOnFlag', event.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300"
              />
              Notify admins on new audit flags
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-slate-700">Auto-archive flags (days)</span>
              <input
                type="number"
                min={0}
                value={auditSettings.autoArchiveDays}
                onChange={(event) =>
                  handleAuditChange('autoArchiveDays', Number(event.target.value))
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
              />
            </label>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={saving || loading}
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? 'Saving...' : loading ? 'Loading...' : 'Save settings'}
          </button>
          {feedback.message ? (
            <p
              className={`text-sm ${
                feedback.type === 'error' ? 'text-rose-500' : 'text-emerald-600'
              }`}
            >
              {feedback.message}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  )
}

export default memo(SettingsPage)
