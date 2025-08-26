interface StatsData {
  todayPatients: number
  completed: number
  remaining: number
  revenue: number
}

interface DashboardStatsProps {
  stats: StatsData
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-number">{stats.todayPatients}</div>
        <div className="stat-label">Today's Patients</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.completed}</div>
        <div className="stat-label">Completed</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.remaining}</div>
        <div className="stat-label">Remaining</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">₹{stats.revenue.toLocaleString()}</div>
        <div className="stat-label">Today's Revenue</div>
      </div>
    </div>
  )
}