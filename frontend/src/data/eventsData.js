export const latestEvents = [
  {
    id: 1,
    slug: 'abbangtasy-fancon-2025',
    image: '/image/event_1.jpg',
    title: 'aBBANGtasy Come True: FanCon Projects 2025',
    date: '2025',
    location: 'Manila, PH',
    summary:
      'A heartfelt thank-you to everyone who joined our FanCon freebie distribution — from our generous sponsors to the dedicated staff team who made the day unforgettable for UNIS fans.',
    isPlaceholder: false,
  },
  {
    id: 2,
    slug: 'placeholder-event-2',
    image: '/image/event_2.jpg',
    title: '[Placeholder] Sample Event Title 2',
    date: 'TBA',
    location: 'TBA',
    summary:
      'Placeholder description — replace with real event details when available.',
    isPlaceholder: true,
  },
  {
    id: 3,
    slug: 'placeholder-event-3',
    image: '/image/event_3.jpg',
    title: '[Placeholder] Sample Event Title 3',
    date: 'TBA',
    location: 'TBA',
    summary:
      'Placeholder description — replace with real event details when available.',
    isPlaceholder: true,
  },
]

export const getEventById = (id) =>
  latestEvents.find((event) => String(event.id) === String(id))
