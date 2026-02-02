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
