'use client'

import { ReactNode } from 'react'
import { useSession, signOut } from 'next-auth/react'

interface AppLayoutProps {
  children: ReactNode
}

const roleLabels = {
  DOCTOR: { label: 'Doctor', icon: '👨‍⚕️', color: '#1e3a8a' },
  ADMIN: { label: 'Administrator', icon: '👑', color: '#dc2626' },
  NURSE: { label: 'Nurse', icon: '👩‍⚕️', color: '#059669' },
  RECEPTIONIST: { label: 'Receptionist', icon: '🏢', color: '#7c2d12' }
}

export function AppLayout({ children }: AppLayoutProps) {
  const { data: session } = useSession()
  const userRole = session?.user?.role || 'DOCTOR'
  const roleInfo = roleLabels[userRole as keyof typeof roleLabels] || roleLabels.DOCTOR

  return (
    <div className="app-container">
      <div className="header">
        <h1>🏥 MediCare Private Practice</h1>
        <p>Complete Clinical Management System</p>
      </div>
      {children}
    </div>
  )
}