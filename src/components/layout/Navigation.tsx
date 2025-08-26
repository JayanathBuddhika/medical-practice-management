'use client'

import { useSession } from 'next-auth/react'

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const roleBasedTabs = {
  DOCTOR: [
    { id: 'dashboard', label: '🩺 Doctor Dashboard' },
    { id: 'appointments', label: '📅 Appointments' },
    { id: 'consultation', label: '👤 Consultation' },
    { id: 'prescriptions', label: '💊 Prescriptions' },
    { id: 'investigations', label: '🔬 Investigations' },
    { id: 'billing', label: '💰 Billing' },
    { id: 'patients', label: '👥 Patient Records' },
    { id: 'reports', label: '📊 Reports' },
  ],
  ADMIN: [
    { id: 'dashboard', label: '👑 Admin Dashboard' },
    { id: 'admin', label: '⚙️ Admin Panel' },
    { id: 'appointments', label: '📅 Appointment Management' },
    { id: 'patients', label: '👥 Patient Records' },
    { id: 'billing', label: '💰 Billing & Finance' },
    { id: 'reports', label: '📊 Reports & Analytics' },
    { id: 'investigations', label: '🔬 Lab Management' },
  ],
  NURSE: [
    { id: 'dashboard', label: '👩‍⚕️ Nurse Dashboard' },
    { id: 'appointments', label: '📅 Patient Schedule' },
    { id: 'patients', label: '👥 Patient Care' },
    { id: 'consultation', label: '📋 Vitals & Notes' },
    { id: 'investigations', label: '🔬 Lab Reports' },
  ],
  RECEPTIONIST: [
    { id: 'dashboard', label: '🏢 Reception Dashboard' },
    { id: 'appointments', label: '📅 Schedule Appointments' },
    { id: 'patients', label: '👥 Patient Registration' },
    { id: 'billing', label: '💰 Billing & Payments' },
    { id: 'investigations', label: '🔬 Lab Scheduling' },
  ]
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { data: session } = useSession()
  const userRole = session?.user?.role || 'DOCTOR'
  const tabs = roleBasedTabs[userRole as keyof typeof roleBasedTabs] || roleBasedTabs.DOCTOR

  return (
    <div className="screen-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}