'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface RolePrivileges {
  [role: string]: string[]
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
  'VIEW_REPORTS': 'View system reports',
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

const ROLE_DESCRIPTIONS = {
  'ADMIN': 'System administrator with full access',
  'DOCTOR': 'Medical practitioner with patient care access',
  'NURSE': 'Healthcare professional with patient support access',
  'RECEPTIONIST': 'Front desk staff with appointment and billing access'
}

const ROLE_ICONS = {
  'ADMIN': '👑',
  'DOCTOR': '👨‍⚕️',
  'NURSE': '👩‍⚕️',
  'RECEPTIONIST': '🏥'
}

export function RoleManagementModule() {
  const { data: session } = useSession()
  const [rolePrivileges, setRolePrivileges] = useState<RolePrivileges>({})
  const [selectedRole, setSelectedRole] = useState<string>('DOCTOR')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [showPrivilegeModal, setShowPrivilegeModal] = useState(false)

  useEffect(() => {
    fetchRolePrivileges()
  }, [])

  const fetchRolePrivileges = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/roles')
      if (response.ok) {
        const data = await response.json()
        setRolePrivileges(data)
      }
    } catch (error) {
      console.error('Error fetching role privileges:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRolePrivileges = async (role: string, privileges: string[]) => {
    setActionLoading(true)

    try {
      const response = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role, privileges }),
      })

      if (response.ok) {
        setShowPrivilegeModal(false)
        fetchRolePrivileges()
        alert(`${role} role privileges updated successfully. All users with this role have been updated.`)
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error updating role privileges:', error)
      alert('Error updating role privileges')
    } finally {
      setActionLoading(false)
    }
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

  const getAllPrivileges = () => {
    return Object.values(PRIVILEGE_CATEGORIES).flat()
  }

  if (loading) {
    return (
      <div className="role-management-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading role configurations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="role-management-container">
      <div className="role-management-header">
        <div className="header-content">
          <h1 className="role-management-title">🎭 Role Management</h1>
          <p className="role-management-subtitle">Configure default privileges for each role type</p>
        </div>
      </div>

      <div className="role-stats-grid">
        {Object.keys(ROLE_DESCRIPTIONS).map(role => (
          <div key={role} className="role-stat-card">
            <div className="stat-icon-wrapper">
              <div className="stat-icon">{ROLE_ICONS[role as keyof typeof ROLE_ICONS]}</div>
            </div>
            <div className="stat-info">
              <div className="stat-number">{rolePrivileges[role]?.length || 0}</div>
              <div className="stat-label">Privileges</div>
              <div className="stat-role-name">{role}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="roles-grid">
        {Object.keys(ROLE_DESCRIPTIONS).map(role => (
          <div key={role} className="role-card">
            <div className="role-card-header">
              <div className="role-icon" style={{ backgroundColor: getRoleColor(role) }}>
                {ROLE_ICONS[role as keyof typeof ROLE_ICONS]}
              </div>
              <div className="role-info">
                <h3 className="role-name">{role}</h3>
                <p className="role-description">
                  {ROLE_DESCRIPTIONS[role as keyof typeof ROLE_DESCRIPTIONS]}
                </p>
              </div>
            </div>

            <div className="role-privileges-summary">
              <div className="privileges-count">
                <span className="count-number">{rolePrivileges[role]?.length || 0}</span>
                <span className="count-label">Privileges Assigned</span>
              </div>
              
              {rolePrivileges[role]?.length > 0 && (
                <div className="privilege-categories-preview">
                  {Object.entries(PRIVILEGE_CATEGORIES).map(([category, categoryPrivileges]) => {
                    const assignedInCategory = categoryPrivileges.filter(p => 
                      rolePrivileges[role]?.includes(p)
                    ).length
                    
                    if (assignedInCategory === 0) return null
                    
                    return (
                      <div key={category} className="category-preview">
                        <span className="category-name">{category}</span>
                        <span className="category-count">{assignedInCategory}/{categoryPrivileges.length}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="role-card-actions">
              <button
                onClick={() => {
                  setSelectedRole(role)
                  setShowPrivilegeModal(true)
                }}
                className="btn btn-primary configure-role-btn"
                disabled={actionLoading}
              >
                🔧 Configure Privileges
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Privilege Configuration Modal */}
      {showPrivilegeModal && selectedRole && (
        <div className="privilege-modal-overlay" onClick={() => setShowPrivilegeModal(false)}>
          <div className="privilege-modal role-privilege-modal" onClick={(e) => e.stopPropagation()}>
            <div className="privilege-modal-header">
              <h3 className="modal-title">
                🔧 Configure {selectedRole} Role Privileges
              </h3>
              <button onClick={() => setShowPrivilegeModal(false)} className="modal-close-btn">×</button>
            </div>
            <div className="privilege-modal-content">
              <div className="role-privilege-info">
                <div className="role-icon-large" style={{ backgroundColor: getRoleColor(selectedRole) }}>
                  {ROLE_ICONS[selectedRole as keyof typeof ROLE_ICONS]}
                </div>
                <div>
                  <h4 className="role-name-large">{selectedRole}</h4>
                  <p className="role-description-large">
                    {ROLE_DESCRIPTIONS[selectedRole as keyof typeof ROLE_DESCRIPTIONS]}
                  </p>
                  <p className="role-privilege-note">
                    <strong>Note:</strong> Changes will apply to all existing and new users with this role.
                  </p>
                </div>
              </div>
              
              <RolePrivilegeEditor
                role={selectedRole}
                currentPrivileges={rolePrivileges[selectedRole] || []}
                onSave={(privileges) => handleUpdateRolePrivileges(selectedRole, privileges)}
                isLoading={actionLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function RolePrivilegeEditor({ 
  role, 
  currentPrivileges,
  onSave, 
  isLoading 
}: { 
  role: string
  currentPrivileges: string[]
  onSave: (privileges: string[]) => void
  isLoading: boolean 
}) {
  const [selectedPrivileges, setSelectedPrivileges] = useState<string[]>(currentPrivileges)

  const togglePrivilege = (privilege: string) => {
    setSelectedPrivileges(prev => 
      prev.includes(privilege) 
        ? prev.filter(p => p !== privilege)
        : [...prev, privilege]
    )
  }

  const toggleCategory = (category: string) => {
    const categoryPrivileges = PRIVILEGE_CATEGORIES[category as keyof typeof PRIVILEGE_CATEGORIES]
    const allSelected = categoryPrivileges.every(p => selectedPrivileges.includes(p))
    
    if (allSelected) {
      // Remove all category privileges
      setSelectedPrivileges(prev => prev.filter(p => !categoryPrivileges.includes(p)))
    } else {
      // Add all category privileges
      setSelectedPrivileges(prev => [...new Set([...prev, ...categoryPrivileges])])
    }
  }

  const selectAllPrivileges = () => {
    const allPrivileges = Object.values(PRIVILEGE_CATEGORIES).flat()
    setSelectedPrivileges(allPrivileges)
  }

  const clearAllPrivileges = () => {
    setSelectedPrivileges([])
  }

  return (
    <div className="role-privilege-editor">
      <div className="privilege-editor-controls">
        <div className="control-buttons">
          <button
            onClick={selectAllPrivileges}
            className="btn btn-secondary select-all-btn"
            disabled={isLoading}
          >
            ✅ Select All
          </button>
          <button
            onClick={clearAllPrivileges}
            className="btn btn-secondary clear-all-btn"
            disabled={isLoading}
          >
            ❌ Clear All
          </button>
        </div>
        <div className="selected-count">
          {selectedPrivileges.length} of {Object.values(PRIVILEGE_CATEGORIES).flat().length} privileges selected
        </div>
      </div>

      <div className="privilege-categories">
        {Object.entries(PRIVILEGE_CATEGORIES).map(([category, privileges]) => {
          const selectedInCategory = privileges.filter(p => selectedPrivileges.includes(p)).length
          const allSelected = selectedInCategory === privileges.length
          const someSelected = selectedInCategory > 0 && selectedInCategory < privileges.length
          
          return (
            <div key={category} className="privilege-category">
              <div className="category-header">
                <label className="category-checkbox-label">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected
                    }}
                    onChange={() => toggleCategory(category)}
                    className="category-checkbox"
                  />
                  <h4 className="category-title">{category}</h4>
                  <span className="category-count">({selectedInCategory}/{privileges.length})</span>
                </label>
              </div>
              
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
                      <div className="privilege-content">
                        <span className="privilege-name">{privilege.replace(/_/g, ' ')}</span>
                        <span className="privilege-description">
                          {PRIVILEGE_DESCRIPTIONS[privilege as keyof typeof PRIVILEGE_DESCRIPTIONS]}
                        </span>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="privilege-editor-footer">
        <div className="privilege-summary">
          <span className="selected-count-large">
            {selectedPrivileges.length} privileges will be assigned to all {role} users
          </span>
        </div>
        <button
          onClick={() => onSave(selectedPrivileges)}
          className="btn btn-primary save-role-privileges-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Updating Role...' : `Update ${role} Role`}
        </button>
      </div>
    </div>
  )
}