export const toISODate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const buildCalendarDays = (monthDate) => {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  const startDay = firstOfMonth.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()
  const totalCells = 42

  return Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - startDay + 1
    if (dayNumber < 1) {
      return {
        date: new Date(year, month - 1, daysInPrevMonth + dayNumber),
        inMonth: false,
      }
    }

    if (dayNumber > daysInMonth) {
      return {
        date: new Date(year, month + 1, dayNumber - daysInMonth),
        inMonth: false,
      }
    }

    return { date: new Date(year, month, dayNumber), inMonth: true }
  })
}

export const MANILA_TIME_ZONE = 'Asia/Manila'

const coerceDateInManila = (value) => {
  if (value instanceof Date) return value
  if (typeof value !== 'string') return new Date(value)

  const trimmed = value.trim()
  const hasTimeZone = /([zZ]|[+-]\\d{2}:?\\d{2})$/.test(trimmed)
  if (hasTimeZone) return new Date(trimmed)

  const isoLike = trimmed.replace(' ', 'T')
  return new Date(`${isoLike}Z`)
}

export const formatDateInManila = (value, options = {}) =>
  coerceDateInManila(value).toLocaleDateString('en-US', {
    timeZone: MANILA_TIME_ZONE,
    ...options,
  })

export const formatDateTimeInManila = (value, options = {}) =>
  coerceDateInManila(value).toLocaleString('en-US', {
    timeZone: MANILA_TIME_ZONE,
    ...options,
  })

export const getManilaYearMonth = (value) => {
  const date = coerceDateInManila(value)
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: MANILA_TIME_ZONE,
    year: 'numeric',
    month: 'numeric',
  }).formatToParts(date)
  const year = Number(parts.find((part) => part.type === 'year')?.value || 0)
  const month = Number(parts.find((part) => part.type === 'month')?.value || 0)
  return { year, month }
}
