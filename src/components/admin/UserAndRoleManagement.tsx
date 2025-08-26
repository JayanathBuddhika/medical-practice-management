'use client'

import { useState } from 'react'
import { UserManagementModule } from './UserManagementModule'
import { RoleManagementModule } from './RoleManagementModule'

type TabType = 'users' | 'roles'

export function UserAndRoleManagement() {
  const [activeTab, setActiveTab] = useState<TabType>('users')

  return (
    <div className="user-role-management-container">
      <div className="management-tabs">
        <div className="tab-list">
          <button
            onClick={() => setActiveTab('users')}
            className={`tab-button ${activeTab === 'users' ? 'tab-active' : ''}`}
          >
            <span className="tab-icon">👥</span>
            <span className="tab-label">User Management</span>
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`tab-button ${activeTab === 'roles' ? 'tab-active' : ''}`}
          >
            <span className="tab-icon">🎭</span>
            <span className="tab-label">Role Management</span>
          </button>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 'users' && <UserManagementModule />}
        {activeTab === 'roles' && <RoleManagementModule />}
      </div>
    </div>
  )
}