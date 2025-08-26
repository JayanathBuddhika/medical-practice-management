'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { UserAndRoleManagement } from './UserAndRoleManagement'
import { SystemConfigModule } from './SystemConfigModule'

export function AdminModule() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('users')

  // Check if current user is admin
  if (session?.user?.role !== 'ADMIN') {
    return (
      <div className="dashboard-container">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
          <h3>Access Restricted</h3>
          <p>Only administrators can access the admin panel.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Admin Navigation */}
      <div className="admin-tabs">
        <button
          onClick={() => setActiveTab('users')}
          className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
        >
          👥 User Management
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`admin-tab-btn ${activeTab === 'config' ? 'active' : ''}`}
        >
          ⚙️ System Configuration
        </button>
      </div>

      {/* Admin Content */}
      {activeTab === 'users' && <UserAndRoleManagement />}
      {activeTab === 'config' && <SystemConfigModule />}
    </div>
  )
}