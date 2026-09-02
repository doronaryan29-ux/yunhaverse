import { memo, useMemo, useState } from 'react'
import AuditLogsHeader from './AuditLogsHeader'
import AuditLogsSearch from './AuditLogsSearch'
import AuditLogsTable from './AuditLogsTable'

const AuditLogsPage = ({ auditItems = [], loading = false }) => {
  const [search, setSearch] = useState('')
  const items = Array.isArray(auditItems) ? auditItems : []
  const filteredItems = useMemo(() => {
    const needle = search.trim().toLowerCase()
    if (!needle) return items
    return items.filter((item) => {
      const haystack = [
        item.action,
        item.entity_type,
        item.actor_email,
        item.actor_role,
        item.ip_address,
        item.user_agent,
        item.entity_id,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(needle)
    })
  }, [items, search])

  return (
    <section className="space-y-6">
      <AuditLogsHeader count={filteredItems.length} />

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <AuditLogsSearch value={search} onChange={(event) => setSearch(event.target.value)} />
        <AuditLogsTable items={filteredItems} loading={loading} />
      </section>
    </section>
  )
}

export default memo(AuditLogsPage)
