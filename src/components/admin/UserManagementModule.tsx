'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: 'ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST'
  isActive: boolean
  createdAt: string
  updatedAt: string
  userPrivileges: UserPrivilege[]
}

interface UserPrivilege {
  id: string
  privilege: string
  granted: boolean
  grantedAt: string
}

interface Privilege {
  name: string
  description: string
  category: string
}

const PRIVILEGE_CATEGORIES = {
  'Dashboard': ['VIEW_DASHBOARD'],
  'Patient Management': [
    'VIEW_PATIENTS', 'CREATE_PATIENTS', 'EDIT_PATIENTS', 'DELETE_PATIENTS'
  ],
  'Appointment Management': [
    'VIEW_APPOINTMENTS', 'CREATE_APPOINTMENTS', 'EDIT_APPOINTMENTS', 
    'DELETE_APPOINTMENTS', 'CANCEL_APPOINTMENTS'
  ],
  'Consultation Management': [
    'VIEW_CONSULTATIONS', 'START_CONSULTATION', 'COMPLETE_CONSULTATION', 'EDIT_CONSULTATIONS'
  ],
  'Prescription Management': [
    'VIEW_PRESCRIPTIONS', 'CREATE_PRESCRIPTIONS', 'EDIT_PRESCRIPTIONS', 
    'DELETE_PRESCRIPTIONS', 'PRINT_PRESCRIPTIONS'
  ],
  'Investigation Management': [
    'VIEW_INVESTIGATIONS', 'ORDER_INVESTIGATIONS', 'EDIT_INVESTIGATIONS', 
    'VIEW_LAB_REPORTS', 'UPLOAD_REPORTS'
  ],
  'Billing Management': [
    'VIEW_BILLS', 'CREATE_BILLS', 'EDIT_BILLS', 'PROCESS_PAYMENTS', 'VIEW_REVENUE_REPORTS'
  ],
  'Reports and Analytics': [
    'VIEW_REPORTS', 'EXPORT_DATA', 'VIEW_ANALYTICS'
  ],
  'User Management': [
    'VIEW_USERS', 'CREATE_USERS', 'EDIT_USERS', 'DELETE_USERS', 
    'MANAGE_PRIVILEGES', 'RESET_PASSWORDS'
  ],
  'System Administration': [
    'BACKUP_DATA', 'RESTORE_DATA', 'SYSTEM_SETTINGS', 'VIEW_AUDIT_LOGS'
  ]
}

const PRIVILEGE_DESCRIPTIONS = {
  'VIEW_DASHBOARD': 'Access to main dashboard',
  'VIEW_PATIENTS': 'View patient records',
  'CREATE_PATIENTS': 'Add new patients',
  'EDIT_PATIENTS': 'Modify patient information',
  'DELETE_PATIENTS': 'Remove patient records',
  'VIEW_APPOINTMENTS': 'View appointments',
  'CREATE_APPOINTMENTS': 'Schedule appointments',
  'EDIT_APPOINTMENTS': 'Modify appointments',
  'DELETE_APPOINTMENTS': 'Remove appointments',
  'CANCEL_APPOINTMENTS': 'Cancel appointments',
  'VIEW_CONSULTATIONS': 'View consultation records',
  'START_CONSULTATION': 'Start patient consultations',
  'COMPLETE_CONSULTATION': 'Complete consultations',
  'EDIT_CONSULTATIONS': 'Modify consultation records',
  'VIEW_PRESCRIPTIONS': 'View prescriptions',
  'CREATE_PRESCRIPTIONS': 'Create prescriptions',
  'EDIT_PRESCRIPTIONS': 'Modify prescriptions',
  'DELETE_PRESCRIPTIONS': 'Remove prescriptions',
  'PRINT_PRESCRIPTIONS': 'Print prescriptions',
  'VIEW_INVESTIGATIONS': 'View investigation orders',
  'ORDER_INVESTIGATIONS': 'Order lab tests',
  'EDIT_INVESTIGATIONS': 'Modify investigations',
  'VIEW_LAB_REPORTS': 'View lab reports',
  'UPLOAD_REPORTS': 'Upload lab reports',
  'VIEW_BILLS': 'View billing information',
  'CREATE_BILLS': 'Generate bills',
  'EDIT_BILLS': 'Modify bills',
  'PROCESS_PAYMENTS': 'Process payments',
  'VIEW_REVENUE_REPORTS': 'View revenue reports',
  'EXPORT_DATA': 'Export system data',
  'VIEW_ANALYTICS': 'View analytics dashboard',
  'VIEW_USERS': 'View user accounts',
  'CREATE_USERS': 'Add new users',
  'EDIT_USERS': 'Modify user accounts',
  'DELETE_USERS': 'Remove user accounts',
  'MANAGE_PRIVILEGES': 'Manage user privileges',
  'RESET_PASSWORDS': 'Reset user passwords',
  'BACKUP_DATA': 'Create system backups',
  'RESTORE_DATA': 'Restore from backups',
  'SYSTEM_SETTINGS': 'Modify system settings',
  'VIEW_AUDIT_LOGS': 'View audit logs'
}

export function UserManagementModule() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showPrivilegeModal, setShowPrivilegeModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    phone: '',
    role: 'DOCTOR' as const,
    password: ''
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

      if (response.ok) {
        setShowUserModal(false)
        setNewUser({
          email: '',
          name: '',
          phone: '',
          role: 'DOCTOR',
          password: ''
        })
        fetchUsers()
      }
    } catch (error) {
      console.error('Error creating user:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateUserStatus = async (userId: string, isActive: boolean) => {
    setActionLoading(true)

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      })

      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Error updating user status:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleResetPassword = async (userId: string) => {
    if (!confirm('Are you sure you want to reset this user\'s password? They will need to set a new password on next login.')) {
      return
    }

    setActionLoading(true)

    try {
      const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
      })

      if (response.ok) {
        alert('Password reset successfully. User will be prompted to set a new password.')
      }
    } catch (error) {
      console.error('Error resetting password:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdatePrivileges = async (userId: string, privileges: string[]) => {
    setActionLoading(true)

    try {
      const response = await fetch(`/api/admin/users/${userId}/privileges`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ privileges }),
      })

      if (response.ok) {
        setShowPrivilegeModal(false)
        setSelectedUser(null)
        fetchUsers()
      }
    } catch (error) {
      console.error('Error updating privileges:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const getUserPrivileges = (user: User) => {
    return user.userPrivileges
      .filter(p => p.granted)
      .map(p => p.privilege)
  }

  const getRoleColor = (role: string) => {
    const colors = {
      ADMIN: '#dc2626',
      DOCTOR: '#059669',
      NURSE: '#8b5cf6',
      RECEPTIONIST: '#f59e0b'
    }
    return colors[role as keyof typeof colors] || '#6b7280'
  }


  if (loading) {
    return (
      <div className="user-management-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <div className="header-content">
          <h1 className="user-management-title">👥 User Management</h1>
          <p className="user-management-subtitle">Manage users and their privileges in the system</p>
        </div>
        <div className="header-actions">
          <button 
            onClick={() => setShowUserModal(true)}
            className="btn btn-primary create-user-btn"
            disabled={actionLoading}
          >
            👤 Create New User
          </button>
        </div>
      </div>

      <div className="user-stats-grid">
        <div className="user-stat-card">
          <div className="stat-icon-wrapper">
            <div className="stat-icon">👥</div>
          </div>
          <div className="stat-info">
            <div className="stat-number">{users.length}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>
        <div className="user-stat-card">
          <div className="stat-icon-wrapper">
            <div className="stat-icon">✅</div>
          </div>
          <div className="stat-info">
            <div className="stat-number">{users.filter(u => u.isActive).length}</div>
            <div className="stat-label">Active Users</div>
          </div>
        </div>
        <div className="user-stat-card">
          <div className="stat-icon-wrapper">
            <div className="stat-icon">👑</div>
          </div>
          <div className="stat-info">
            <div className="stat-number">{users.filter(u => u.role === 'ADMIN').length}</div>
            <div className="stat-label">Administrators</div>
          </div>
        </div>
        <div className="user-stat-card">
          <div className="stat-icon-wrapper">
            <div className="stat-icon">👨‍⚕️</div>
          </div>
          <div className="stat-info">
            <div className="stat-number">{users.filter(u => u.role === 'DOCTOR').length}</div>
            <div className="stat-label">Doctors</div>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showUserModal && (
        <div className="user-modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="user-modal-header">
              <h3 className="modal-title">👤 Create New User</h3>
              <button onClick={() => setShowUserModal(false)} className="modal-close-btn">×</button>
            </div>
            <div className="user-modal-content">
              <form onSubmit={handleCreateUser} className="user-form">
                <div className="user-form-row">
                  <div className="user-form-group">
                    <label className="user-form-label">Full Name</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      className="user-form-input"
                      required
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="user-form-group">
                    <label className="user-form-label">Email Address</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="user-form-input"
                      required
                      placeholder="user@example.com"
                    />
                  </div>
                </div>

                <div className="user-form-row">
                  <div className="user-form-group">
                    <label className="user-form-label">Phone Number</label>
                    <input
                      type="tel"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                      className="user-form-input"
                      placeholder="+1234567890"
                    />
                  </div>
                  <div className="user-form-group">
                    <label className="user-form-label">Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                      className="user-form-select"
                      required
                    >
                      <option value="DOCTOR">Doctor</option>
                      <option value="NURSE">Nurse</option>
                      <option value="RECEPTIONIST">Receptionist</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </div>
                </div>

                <div className="user-form-group">
                  <label className="user-form-label">Initial Password</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    className="user-form-input"
                    required
                    placeholder="Enter initial password"
                    minLength={6}
                  />
                  <p className="form-helper-text">User will be prompted to change password on first login</p>
                </div>

                <div className="user-modal-footer">
                  <button 
                    type="button" 
                    onClick={() => setShowUserModal(false)} 
                    className="btn btn-secondary modal-cancel-btn"
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary modal-submit-btn"
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Creating...' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Privilege Management Modal */}
      {showPrivilegeModal && selectedUser && (
        <div className="privilege-modal-overlay" onClick={() => setShowPrivilegeModal(false)}>
          <div className="privilege-modal" onClick={(e) => e.stopPropagation()}>
            <div className="privilege-modal-header">
              <h3 className="modal-title">🔐 Manage Privileges - {selectedUser.name}</h3>
              <button onClick={() => setShowPrivilegeModal(false)} className="modal-close-btn">×</button>
            </div>
            <div className="privilege-modal-content">
              <PrivilegeEditor
                user={selectedUser}
                onSave={(privileges) => handleUpdatePrivileges(selectedUser.id, privileges)}
                isLoading={actionLoading}
              />
            </div>
          </div>
        </div>
      )}

      <div className="users-table-container">
        <div className="users-table-header">
          <h3 className="table-title">System Users</h3>
        </div>
        
        <div className="users-table">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Privileges</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar" style={{ backgroundColor: getRoleColor(user.role) }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-details">
                        <div className="user-name">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                        {user.phone && <div className="user-phone">{user.phone}</div>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span 
                      className="role-badge" 
                      style={{ backgroundColor: getRoleColor(user.role), color: 'white' }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.isActive ? 'status-active' : 'status-inactive'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="privileges-summary">
                      <span className="privilege-count">
                        {getUserPrivileges(user).length} privileges
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="date-text">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <div className="user-actions">
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          setShowPrivilegeModal(true)
                        }}
                        className="action-btn privileges-btn"
                        title="Manage Privileges"
                        disabled={actionLoading}
                      >
                        🔐
                      </button>
                      <button
                        onClick={() => handleResetPassword(user.id)}
                        className="action-btn reset-password-btn"
                        title="Reset Password"
                        disabled={actionLoading}
                      >
                        🔑
                      </button>
                      <button
                        onClick={() => handleUpdateUserStatus(user.id, !user.isActive)}
                        className={`action-btn ${user.isActive ? 'deactivate-btn' : 'activate-btn'}`}
                        title={user.isActive ? 'Deactivate User' : 'Activate User'}
                        disabled={actionLoading || user.id === session?.user?.id}
                      >
                        {user.isActive ? '🚫' : '✅'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function PrivilegeEditor({ 
  user, 
  onSave, 
  isLoading 
}: { 
  user: User
  onSave: (privileges: string[]) => void
  isLoading: boolean 
}) {
  const [selectedPrivileges, setSelectedPrivileges] = useState<string[]>(
    user.userPrivileges.filter(p => p.granted).map(p => p.privilege)
  )

  const togglePrivilege = (privilege: string) => {
    setSelectedPrivileges(prev => 
      prev.includes(privilege) 
        ? prev.filter(p => p !== privilege)
        : [...prev, privilege]
    )
  }

  return (
    <div className="privilege-editor">
      <div className="privilege-categories">
        {Object.entries(PRIVILEGE_CATEGORIES).map(([category, privileges]) => (
          <div key={category} className="privilege-category">
            <h4 className="category-title">{category}</h4>
            <div className="privilege-list">
              {privileges.map(privilege => (
                <div key={privilege} className="privilege-item">
                  <label className="privilege-checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedPrivileges.includes(privilege)}
                      onChange={() => togglePrivilege(privilege)}
                      className="privilege-checkbox"
                    />
                    <span className="privilege-name">{privilege.replace(/_/g, ' ')}</span>
                    <span className="privilege-description">
                      {PRIVILEGE_DESCRIPTIONS[privilege as keyof typeof PRIVILEGE_DESCRIPTIONS]}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="privilege-editor-footer">
        <div className="privilege-summary">
          <span className="selected-count">
            {selectedPrivileges.length} privileges selected
          </span>
        </div>
        <button
          onClick={() => onSave(selectedPrivileges)}
          className="btn btn-primary save-privileges-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Privileges'}
        </button>
      </div>
    </div>
  )
}