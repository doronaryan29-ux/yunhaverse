import { useEffect, useMemo, useState } from 'react'

const getRouteFromHash = () => window.location.hash || '#/admin'

export const useAdminRoute = () => {
  const [route, setRoute] = useState(getRouteFromHash())

  useEffect(() => {
    const onHashChange = () => setRoute(getRouteFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const routeInfo = useMemo(() => {
    const isProfileRoute = route.startsWith('#/admin/profile')
    const isMembersRoute = route.startsWith('#/admin/members')
    const isCreativesRoute = route.startsWith('#/admin/creatives')
    const isFundsRoute = route.startsWith('#/admin/funds')
    const isEventsRoute = route.startsWith('#/admin/events')
    const isAuditLogsRoute = route.startsWith('#/admin/audit-logs')
    const isSettingsRoute = route.startsWith('#/admin/settings')

    const activeNavItem = isMembersRoute
      ? 'Members'
      : isCreativesRoute
        ? 'Creative Staff'
        : isFundsRoute
          ? 'Funds & Donations'
          : isEventsRoute
            ? 'Events'
            : isAuditLogsRoute
              ? 'Audit Logs'
            : isSettingsRoute
              ? 'Settings'
            : 'Dashboard'

    return {
      route,
      isProfileRoute,
      isMembersRoute,
      isCreativesRoute,
      isFundsRoute,
      isEventsRoute,
      isAuditLogsRoute,
      isSettingsRoute,
      activeNavItem,
    }
  }, [route])

  return routeInfo
}
