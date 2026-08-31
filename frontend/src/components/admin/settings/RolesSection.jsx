import { memo } from 'react'

const RolesSection = ({ roles, permissions, permissionMap, toggleRolePermission }) => (
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
              <p className="text-sm font-semibold text-slate-900">{role.label}</p>
              <p className="text-xs text-slate-500">{role.id}</p>
            </div>
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {permissions.map((permission) => (
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
)

export default memo(RolesSection)
