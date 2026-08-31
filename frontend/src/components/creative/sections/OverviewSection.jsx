import { memo } from 'react'
import { StatCard } from '../../workflow-shared/StaffCards'

const OverviewSection = ({
  assignedCount,
  openCount,
  dueSoonCount,
  pendingReviewCount,
  teamCount,
}) => (
  <section id="overview" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    {[
      {
        label: 'Assigned Tasks',
        value: assignedCount,
        hint: `${openCount} active`,
      },
      {
        label: 'Due This Week',
        value: dueSoonCount,
        hint: 'Next 7 days',
      },
      {
        label: 'Pending Reviews',
        value: pendingReviewCount,
        hint: 'Awaiting admin review',
      },
      {
        label: 'Team Signals',
        value: teamCount || '--',
        hint: 'Creative staff visible',
      },
    ].map((card) => (
      <StatCard key={card.label} label={card.label} value={card.value} hint={card.hint} />
    ))}
  </section>
)

export default memo(OverviewSection)
