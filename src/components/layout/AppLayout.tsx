'use client'

import { ReactNode } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()
  const userRole = session?.user?.role || 'DOCTOR'
  const roleInfo = roleLabels[userRole as keyof typeof roleLabels] || roleLabels.DOCTOR

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      try {
        await signOut({ redirect: false })
        router.push('/auth/signin')
        router.refresh()
      } catch (error) {
        console.error('Logout error:', error)
        // Fallback: force navigation to login page
        window.location.href = '/auth/signin'
      }
    }
  }

  return (
    <div className="app-container">
      <div className="header">
        <div className="header-main">
          <div className="header-title">
            <h1>🏥 MediCare Private Practice</h1>
            <p>Complete Clinical Management System</p>
          </div>
          <div className="header-user">
            <div className="user-info">
              <div className="user-avatar" style={{ backgroundColor: roleInfo.color }}>
                <span className="user-icon">{roleInfo.icon}</span>
              </div>
              <div className="user-details">
                <span className="user-name">{session?.user?.name}</span>
                <span className="user-role">{roleInfo.label}</span>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="logout-btn"
              title="Logout"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}