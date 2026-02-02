import { useEffect, useState } from 'react'

const getTimeLeft = (dateString) => {
  const target = new Date(dateString).getTime()
  const now = Date.now()
  const diff = Math.max(target - now, 0)

  const seconds = Math.floor(diff / 1000)
  const days = Math.floor(seconds / (60 * 60 * 24))
  const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60))
  const minutes = Math.floor((seconds % (60 * 60)) / 60)
  const secs = seconds % 60

  return { days, hours, minutes, secs, isOver: target - now <= 0 }
}

const useCountdown = (dateString) => {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(dateString))

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeLeft(dateString))
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [dateString])

  return timeLeft
}

export default useCountdown
