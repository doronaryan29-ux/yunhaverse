export const auditLogActionMap = {
  'auth.login_success': { icon: 'fa-right-to-bracket', label: 'logged in', tag: 'Success', tone: 'success' },
  'auth.login_failed': { icon: 'fa-triangle-exclamation', label: 'had a failed login attempt', tag: 'Failed', tone: 'danger' },
  'auth.google_login_success': { icon: 'fa-right-to-bracket', label: 'logged in with Google', tag: 'Success', tone: 'success' },
  'auth.google_login_failed': { icon: 'fa-triangle-exclamation', label: 'had a failed Google login attempt', tag: 'Failed', tone: 'danger' },
  'auth.otp_verify_success': { icon: 'fa-shield-halved', label: 'verified their code', tag: 'Verified', tone: 'success' },
  'auth.otp_verify_failed': { icon: 'fa-triangle-exclamation', label: 'entered a wrong verification code', tag: 'Failed', tone: 'danger' },
  'auth.password_reset': { icon: 'fa-key', label: 'reset their password', tag: 'Updated', tone: 'info' },
  'auth.reset_otp_sent': { icon: 'fa-paper-plane', label: 'requested a password reset code', tag: 'Sent', tone: 'neutral' },
  'auth.reset_otp_verified': { icon: 'fa-shield-halved', label: 'verified a reset code', tag: 'Verified', tone: 'success' },
  'auth.reset_otp_failed': { icon: 'fa-triangle-exclamation', label: 'entered a wrong reset code', tag: 'Failed', tone: 'danger' },
  'audit_flag.opened': { icon: 'fa-flag', label: 'flagged an issue', tag: 'Flagged', tone: 'warning' },
  'audit_flag.resolved': { icon: 'fa-circle-check', label: 'resolved a flag', tag: 'Resolved', tone: 'success' },
  'notification.created': { icon: 'fa-bullhorn', label: 'sent a notice', tag: 'Sent', tone: 'neutral' },
  'notification.read': { icon: 'fa-envelope-open', label: 'read a notification', tag: 'Read', tone: 'neutral' },
  'user.profile_updated': { icon: 'fa-user-pen', label: 'updated their profile', tag: 'Updated', tone: 'info' },
}

export const toneClasses = {
  success: 'bg-emerald-50 text-emerald-700',
  danger: 'bg-red-50 text-red-600',
  warning: 'bg-amber-50 text-amber-700',
  info: 'bg-sky-50 text-sky-700',
  neutral: 'bg-slate-100 text-slate-600',
}

export const getAuditLogDisplay = (action) =>
  auditLogActionMap[action] || {
    icon: 'fa-circle-info',
    label: action || 'did something',
    tag: 'Activity',
    tone: 'neutral',
  }
