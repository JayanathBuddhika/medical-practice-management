'use client'

import { useState, useEffect } from 'react'

interface ReportData {
  dailyStats: {
    date: string
    patients: number
    revenue: number
    consultations: number
  }[]
  monthlyRevenue: {
    month: string
    amount: number
  }[]
  topDiagnoses: {
    diagnosis: string
    count: number
    percentage: number
  }[]
  ageDistribution: {
    ageGroup: string
    count: number
    percentage: number
  }[]
  paymentMethods: {
    method: string
    amount: number
    percentage: number
  }[]
}

const sampleReportData: ReportData = {
  dailyStats: [
    { date: '2025-01-22', patients: 12, revenue: 18500, consultations: 15 },
    { date: '2025-01-21', patients: 10, revenue: 15200, consultations: 12 },
    { date: '2025-01-20', patients: 14, revenue: 21300, consultations: 16 },
    { date: '2025-01-19', patients: 8, revenue: 12400, consultations: 10 },
    { date: '2025-01-18', patients: 11, revenue: 16800, consultations: 13 }
  ],
  monthlyRevenue: [
    { month: 'Jan 2025', amount: 245000 },
    { month: 'Dec 2024', amount: 198000 },
    { month: 'Nov 2024', amount: 221000 },
    { month: 'Oct 2024', amount: 187000 },
    { month: 'Sep 2024', amount: 203000 },
    { month: 'Aug 2024', amount: 178000 }
  ],
  topDiagnoses: [
    { diagnosis: 'Upper Respiratory Infection', count: 45, percentage: 18.2 },
    { diagnosis: 'Hypertension', count: 38, percentage: 15.4 },
    { diagnosis: 'Diabetes Mellitus', count: 32, percentage: 12.9 },
    { diagnosis: 'Gastritis', count: 28, percentage: 11.3 },
    { diagnosis: 'Migraine', count: 22, percentage: 8.9 },
    { diagnosis: 'Arthritis', count: 18, percentage: 7.3 }
  ],
  ageDistribution: [
    { ageGroup: '0-18 years', count: 28, percentage: 12.6 },
    { ageGroup: '19-35 years', count: 67, percentage: 30.2 },
    { ageGroup: '36-50 years', count: 78, percentage: 35.1 },
    { ageGroup: '51-65 years', count: 36, percentage: 16.2 },
    { ageGroup: '65+ years', count: 13, percentage: 5.9 }
  ],
  paymentMethods: [
    { method: 'UPI', amount: 145000, percentage: 45.2 },
    { method: 'Cash', amount: 98000, percentage: 30.5 },
    { method: 'Card', amount: 56000, percentage: 17.4 },
    { method: 'Bank Transfer', amount: 22000, percentage: 6.9 }
  ]
}

export function ReportsModule() {
  const [activeReport, setActiveReport] = useState<'overview' | 'financial' | 'clinical' | 'operational'>('overview')
  const [reportData, setReportData] = useState<ReportData>(sampleReportData)
  const [dateRange, setDateRange] = useState({
    startDate: '2025-01-01',
    endDate: '2025-01-31'
  })

  const renderOverview = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ color: '#1e3a8a' }}>Practice Overview</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="date"
            className="form-input"
            value={dateRange.startDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            style={{ width: 'auto' }}
          />
          <input
            type="date"
            className="form-input"
            value={dateRange.endDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            style={{ width: 'auto' }}
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="stats-grid" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-number">247</div>
          <div className="stat-label">Total Patients</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">₹3.21L</div>
          <div className="stat-label">Monthly Revenue</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">312</div>
          <div className="stat-label">Consultations</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">89%</div>
          <div className="stat-label">Payment Collection</div>
        </div>
      </div>

      {/* Recent Performance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div className="dashboard-card">
          <h4 style={{ color: '#1e3a8a', marginBottom: '16px' }}>Daily Performance (Last 5 Days)</h4>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Patients</th>
                  <th>Revenue</th>
                  <th>Avg/Patient</th>
                </tr>
              </thead>
              <tbody>
                {reportData.dailyStats.map(day => (
                  <tr key={day.date}>
                    <td>{day.date}</td>
                    <td>{day.patients}</td>
                    <td>₹{day.revenue.toLocaleString()}</td>
                    <td>₹{Math.round(day.revenue / day.patients).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-card">
          <h4 style={{ color: '#1e3a8a', marginBottom: '16px' }}>Top Diagnoses This Month</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {reportData.topDiagnoses.slice(0, 5).map((diagnosis, index) => (
              <div key={diagnosis.diagnosis} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                background: index === 0 ? '#f0f9ff' : '#f8fafc',
                borderRadius: '8px',
                borderLeft: `4px solid ${index === 0 ? '#1e3a8a' : '#e2e8f0'}`
              }}>
                <div>
                  <div style={{ fontWeight: '600', color: '#374151' }}>{diagnosis.diagnosis}</div>
                  <div style={{ fontSize: '14px', color: '#64748b' }}>{diagnosis.count} cases</div>
                </div>
                <div style={{ 
                  fontWeight: '700', 
                  color: index === 0 ? '#1e3a8a' : '#64748b' 
                }}>
                  {diagnosis.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderFinancial = () => (
    <div>
      <h3 style={{ color: '#1e3a8a', marginBottom: '24px' }}>Financial Reports</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Monthly Revenue Trend */}
        <div className="dashboard-card">
          <h4 style={{ color: '#1e3a8a', marginBottom: '16px' }}>Monthly Revenue Trend</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {reportData.monthlyRevenue.map((month, index) => (
              <div key={month.month} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                background: index === 0 ? '#f0f9ff' : '#f8fafc',
                borderRadius: '6px'
              }}>
                <span style={{ fontWeight: '500' }}>{month.month}</span>
                <span style={{ fontWeight: '600', color: '#1e3a8a' }}>
                  ₹{(month.amount / 1000).toFixed(0)}K
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="dashboard-card">
          <h4 style={{ color: '#1e3a8a', marginBottom: '16px' }}>Payment Methods</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {reportData.paymentMethods.map(payment => (
              <div key={payment.method} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '500' }}>{payment.method}</span>
                  <span style={{ fontWeight: '600' }}>₹{(payment.amount / 1000).toFixed(0)}K</span>
                </div>
                <div style={{ 
                  height: '8px', 
                  background: '#e2e8f0', 
                  borderRadius: '4px', 
                  overflow: 'hidden' 
                }}>
                  <div style={{
                    height: '100%',
                    width: `${payment.percentage}%`,
                    background: '#1e3a8a',
                    borderRadius: '4px'
                  }} />
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  {payment.percentage}% of total
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Outstanding Payments */}
        <div className="dashboard-card">
          <h4 style={{ color: '#1e3a8a', marginBottom: '16px' }}>Outstanding Payments</h4>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ 
              padding: '16px', 
              background: '#fef3c7', 
              borderRadius: '8px',
              border: '1px solid #f59e0b'
            }}>
              <div style={{ fontWeight: '600', color: '#92400e' }}>Pending</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#92400e' }}>₹45,600</div>
              <div style={{ fontSize: '14px', color: '#92400e' }}>12 invoices</div>
            </div>
            <div style={{ 
              padding: '16px', 
              background: '#fee2e2', 
              borderRadius: '8px',
              border: '1px solid #dc2626'
            }}>
              <div style={{ fontWeight: '600', color: '#dc2626' }}>Overdue (&gt;30 days)</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#dc2626' }}>₹12,300</div>
              <div style={{ fontSize: '14px', color: '#dc2626' }}>3 invoices</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderClinical = () => (
    <div>
      <h3 style={{ color: '#1e3a8a', marginBottom: '24px' }}>Clinical Reports</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        {/* Diagnosis Distribution */}
        <div className="dashboard-card">
          <h4 style={{ color: '#1e3a8a', marginBottom: '16px' }}>Diagnosis Distribution</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {reportData.topDiagnoses.map((diagnosis, index) => (
              <div key={diagnosis.diagnosis} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '500', fontSize: '14px' }}>{diagnosis.diagnosis}</span>
                  <span style={{ fontWeight: '600' }}>{diagnosis.count} cases</span>
                </div>
                <div style={{ 
                  height: '6px', 
                  background: '#e2e8f0', 
                  borderRadius: '3px', 
                  overflow: 'hidden' 
                }}>
                  <div style={{
                    height: '100%',
                    width: `${diagnosis.percentage}%`,
                    background: `hsl(${220 - index * 20}, 70%, 50%)`,
                    borderRadius: '3px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Age Distribution */}
        <div className="dashboard-card">
          <h4 style={{ color: '#1e3a8a', marginBottom: '16px' }}>Patient Age Distribution</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {reportData.ageDistribution.map((age, index) => (
              <div key={age.ageGroup} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                background: '#f8fafc',
                borderRadius: '6px'
              }}>
                <span style={{ fontWeight: '500' }}>{age.ageGroup}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: '600' }}>{age.count}</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>({age.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Treatment Outcomes */}
        <div className="dashboard-card">
          <h4 style={{ color: '#1e3a8a', marginBottom: '16px' }}>Treatment Outcomes</h4>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ 
              padding: '12px', 
              background: '#dcfce7', 
              borderRadius: '8px',
              border: '1px solid #16a34a'
            }}>
              <div style={{ fontWeight: '600', color: '#15803d' }}>Successful Treatment</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#15803d' }}>89.2%</div>
              <div style={{ fontSize: '14px', color: '#15803d' }}>278 out of 312 cases</div>
            </div>
            <div style={{ 
              padding: '12px', 
              background: '#fef3c7', 
              borderRadius: '8px',
              border: '1px solid #f59e0b'
            }}>
              <div style={{ fontWeight: '600', color: '#92400e' }}>Follow-up Required</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#92400e' }}>8.3%</div>
              <div style={{ fontSize: '14px', color: '#92400e' }}>26 cases</div>
            </div>
            <div style={{ 
              padding: '12px', 
              background: '#fee2e2', 
              borderRadius: '8px',
              border: '1px solid #dc2626'
            }}>
              <div style={{ fontWeight: '600', color: '#dc2626' }}>Referred to Specialist</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#dc2626' }}>2.5%</div>
              <div style={{ fontSize: '14px', color: '#dc2626' }}>8 cases</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderOperational = () => (
    <div>
      <h3 style={{ color: '#1e3a8a', marginBottom: '24px' }}>Operational Reports</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Appointment Statistics */}
        <div className="dashboard-card">
          <h4 style={{ color: '#1e3a8a', marginBottom: '16px' }}>Appointment Statistics</h4>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Total Scheduled</span>
              <span style={{ fontWeight: '600', color: '#1e3a8a' }}>312</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Completed</span>
              <span style={{ fontWeight: '600', color: '#10b981' }}>298 (95.5%)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>No-shows</span>
              <span style={{ fontWeight: '600', color: '#ef4444' }}>8 (2.6%)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Cancelled</span>
              <span style={{ fontWeight: '600', color: '#f59e0b' }}>6 (1.9%)</span>
            </div>
            <div style={{ height: '1px', background: '#e2e8f0', margin: '8px 0' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Avg. Consultation Time</span>
              <span style={{ fontWeight: '600', color: '#1e3a8a' }}>12 mins</span>
            </div>
          </div>
        </div>

        {/* Peak Hours */}
        <div className="dashboard-card">
          <h4 style={{ color: '#1e3a8a', marginBottom: '16px' }}>Peak Hours Analysis</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { time: '10:00 - 12:00 PM', patients: 45, percentage: 35 },
              { time: '4:00 - 6:00 PM', patients: 38, percentage: 30 },
              { time: '6:00 - 8:00 PM', patients: 28, percentage: 22 },
              { time: '8:00 - 10:00 AM', patients: 16, percentage: 13 }
            ].map(slot => (
              <div key={slot.time} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '500', fontSize: '14px' }}>{slot.time}</span>
                  <span style={{ fontWeight: '600' }}>{slot.patients} patients</span>
                </div>
                <div style={{ 
                  height: '6px', 
                  background: '#e2e8f0', 
                  borderRadius: '3px', 
                  overflow: 'hidden' 
                }}>
                  <div style={{
                    height: '100%',
                    width: `${slot.percentage}%`,
                    background: '#1e3a8a',
                    borderRadius: '3px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Performance */}
        <div className="dashboard-card">
          <h4 style={{ color: '#1e3a8a', marginBottom: '16px' }}>Practice Efficiency</h4>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ 
              padding: '12px', 
              background: '#f0f9ff', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e3a8a' }}>4.8/5</div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Average Patient Rating</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>On-time Performance</span>
              <span style={{ fontWeight: '600', color: '#10b981' }}>92%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Patient Wait Time</span>
              <span style={{ fontWeight: '600', color: '#1e3a8a' }}>8 mins avg</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Follow-up Rate</span>
              <span style={{ fontWeight: '600', color: '#10b981' }}>78%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="screen-content">
      {/* Navigation Tabs */}
      <div className="screen-tabs" style={{ marginBottom: '24px' }}>
        <button
          className={`tab-btn ${activeReport === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveReport('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab-btn ${activeReport === 'financial' ? 'active' : ''}`}
          onClick={() => setActiveReport('financial')}
        >
          💰 Financial
        </button>
        <button
          className={`tab-btn ${activeReport === 'clinical' ? 'active' : ''}`}
          onClick={() => setActiveReport('clinical')}
        >
          🩺 Clinical
        </button>
        <button
          className={`tab-btn ${activeReport === 'operational' ? 'active' : ''}`}
          onClick={() => setActiveReport('operational')}
        >
          ⚙️ Operational
        </button>
      </div>

      {/* Content */}
      {activeReport === 'overview' && renderOverview()}
      {activeReport === 'financial' && renderFinancial()}
      {activeReport === 'clinical' && renderClinical()}
      {activeReport === 'operational' && renderOperational()}
    </div>
  )
}