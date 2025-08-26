interface QuickActionsProps {
  todaySummary: {
    newPatients: number
    followUps: number
    avgConsultationTime: string
  }
  recentPrescriptions: {
    patientName: string
    medications: string
    time: string
  }[]
  pendingReports: {
    patientName: string
    tests: string
    dueDate: string
  }[]
}

export function QuickActions({ todaySummary, recentPrescriptions, pendingReports }: QuickActionsProps) {
  return (
    <>
      <h2 style={{color: '#1e3a8a', margin: '32px 0 24px'}}>Quick Actions</h2>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-icon" style={{background: 'linear-gradient(135deg, #059669, #10b981)'}}>📋</div>
            <h3 className="card-title">Today's Summary</h3>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span>New Patients</span>
              <strong>{todaySummary.newPatients}</strong>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span>Follow-ups</span>
              <strong>{todaySummary.followUps}</strong>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span>Avg. Consultation Time</span>
              <strong>{todaySummary.avgConsultationTime}</strong>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-icon" style={{background: 'linear-gradient(135deg, #f59e0b, #fbbf24)'}}>💊</div>
            <h3 className="card-title">Recent Prescriptions</h3>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            {recentPrescriptions.map((prescription, index) => (
              <div key={index} style={{padding: '8px', background: '#f8fafc', borderRadius: '8px'}}>
                <div style={{fontWeight: 600}}>{prescription.patientName}</div>
                <div style={{color: '#64748b', fontSize: '0.85rem'}}>{prescription.medications} - {prescription.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-icon" style={{background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)'}}>🔬</div>
            <h3 className="card-title">Pending Lab Reports</h3>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            {pendingReports.map((report, index) => (
              <div key={index} style={{padding: '8px', background: '#f8fafc', borderRadius: '8px'}}>
                <div style={{fontWeight: 600}}>{report.patientName}</div>
                <div style={{color: '#64748b', fontSize: '0.85rem'}}>{report.tests} - {report.dueDate}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}