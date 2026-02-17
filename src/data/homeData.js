export const carouselItems = [
  {
    src: '/image/hbdyunha.png',
    alt: 'Happy Birthday Yunha',
    caption: 'Happy Birthday Yunha',
  },
  {
    src: '/image/yunha28days.png',
    alt: 'Yunha 28 Days',
    caption: 'Yunha 28 Days',
  },
  {
    src: '/image/yunhacse.png',
    alt: 'Yunha CSE',
    caption: 'Yunha CSE',
  },
]

export const fanartItems = [
  {
    src: '/image/hbdyunha.png',
    alt: 'Happy Birthday Yunha Fanart',
    title: 'Happy Birthday Yunha',
    artist: 'YunhaLover123',
  },
  {
    src: '/image/yunha28days.png',
    alt: 'Yunha 28 Days Fanart',
    title: 'Yunha 28 Days',
    artist: 'YunhaArtist99',
  },
  {
    src: '/image/yunhacse.png',
    alt: 'Yunha CSE Fanart',
    title: 'Yunha CSE',
    artist: 'YunhaFanArtPH',
  },
  {
    src: '/image/hbdyunha.png',
    alt: 'Yunha Drawing',
    title: 'Yunha Portrait',
    artist: 'YunhaCreative',
  },
  {
    src: '/image/yunha28days.png',
    alt: 'Yunha Digital Art',
    title: 'Digital Yunha',
    artist: 'DigitalYunhaArt',
  },
  {
    src: '/image/yunhacse.png',
    alt: 'Yunha Sketch',
    title: 'Yunha Sketch',
    artist: 'YunhaSketchMaster',
  },
]

const MANILA_TIME_ZONE = 'Asia/Manila'

const getManilaTodayMonthDay = () => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: MANILA_TIME_ZONE,
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(new Date())
  const month = Number(parts.find((part) => part.type === 'month')?.value || 1)
  const day = Number(parts.find((part) => part.type === 'day')?.value || 1)
  return { month, day }
}

const getNextOccurrenceIso = (month, day) => {
  const now = new Date()
  const year = Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: MANILA_TIME_ZONE,
      year: 'numeric',
    }).format(now),
  )
  const today = getManilaTodayMonthDay()
  const isPastThisYear = month < today.month || (month === today.month && day < today.day)
  const nextYear = isPastThisYear ? year + 1 : year
  const mm = String(month).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${nextYear}-${mm}-${dd}T00:00:00+08:00`
}

export const countdownEvents = [
  {
    title: "Yunha's Birthday",
    date: '2026-02-28T00:00:00+08:00',
    icon: 'fa-birthday-cake',
  },
  {
    title: 'UNIS Comeback',
    date: getNextOccurrenceIso(7, 15),
    icon: 'fa-music',
  },
  {
    title: 'UNIS Fan Concert in Manila',
    date: getNextOccurrenceIso(6, 10),
    icon: 'fa-users',
  },
]
