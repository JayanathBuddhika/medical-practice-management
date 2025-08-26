'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { DashboardStats } from './DashboardStats'
import { PatientQueue } from './PatientQueue'
import { QuickActions } from './QuickActions'

interface DashboardProps {
  onStartConsultation: (patient: any) => void
}

interface StatsData {
  todayPatients: number
  completed: number
  remaining: number
  revenue: number
}

interface QueueItem {
  id: string
  tokenNumber: string
  time: string
  patientName: string
  age: number
  gender: string
  visitType: string
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED'
}

interface QuickActionsData {
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

export function Dashboard({ onStartConsultation }: DashboardProps) {
  const { data: session } = useSession()
  const [stats, setStats] = useState<StatsData>({ todayPatients: 0, completed: 0, remaining: 0, revenue: 0 })
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [quickActions, setQuickActions] = useState<QuickActionsData>({
    todaySummary: { newPatients: 0, followUps: 0, avgConsultationTime: '0 mins' },
    recentPrescriptions: [],
    pendingReports: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, queueRes, quickActionsRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/dashboard/queue'),
          fetch('/api/dashboard/quick-actions')
        ])

        const [statsData, queueData, quickActionsData] = await Promise.all([
          statsRes.json(),
          queueRes.json(),
          quickActionsRes.json()
        ])

        setStats(statsData)
        setQueue(queueData)
        setQuickActions(quickActionsData)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleStartConsultation = (patient: QueueItem) => {
    console.log('Starting consultation for:', patient)
    onStartConsultation(patient)
  }

  const handleContinueConsultation = (patient: QueueItem) => {
    console.log('Continuing consultation for:', patient)
    onStartConsultation(patient)
  }

  if (loading) {
    return (
      <div className="screen-content">
        <div className="dashboard-stats-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="loading-skeleton dashboard-stat-card-skeleton"></div>
          ))}
        </div>
        <div className="loading-skeleton queue-skeleton"></div>
        <div className="quick-actions-grid">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="loading-skeleton quick-action-skeleton"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="screen active">
      <div className="navbar">
        <div className="navbar-brand">Dr. {session?.user?.name || 'Sarah Smith'} - Private Practice</div>
        <div style={{color: '#64748b'}}>Monday, January 26, 2025</div>
      </div>
      
      <div className="screen-content">
        <DashboardStats stats={stats} />
        
        <PatientQueue 
          queue={queue}
          onStartConsultation={handleStartConsultation}
          onContinueConsultation={handleContinueConsultation}
        />
        
        <QuickActions 
          todaySummary={quickActions.todaySummary}
          recentPrescriptions={quickActions.recentPrescriptions}
          pendingReports={quickActions.pendingReports}
        />
      </div>
    </div>
  )
}