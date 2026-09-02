// Pulsing placeholder block, sized/shaped per usage via className. Pair with
// the surrounding card wrapper so a loading section keeps the same
// silhouette as its loaded state. `tone` picks the base color: 'pink' for
// the branded public site, 'neutral' for the tenant-agnostic admin panel.
const TONE_CLASSES = {
  pink: 'bg-rose-100',
  neutral: 'bg-slate-200',
}

const Skeleton = ({ className = '', tone = 'pink' }) => (
  <div
    className={`animate-pulse rounded-xl motion-reduce:animate-none ${TONE_CLASSES[tone] || TONE_CLASSES.pink} ${className}`}
  />
)

export default Skeleton
