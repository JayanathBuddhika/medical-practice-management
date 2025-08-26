'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST'
  phone?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  doctorProfile?: {
    licenseNumber: string
    specialization: string
    qualification: string
    experience: number
    consultationFee: number
  }
}

export function UserManagementModule() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    role: 'RECEPTIONIST' as const,
    phone: '',
    password: '',
    // Doctor specific fields
    licenseNumber: '',
    specialization: '',
    qualification: '',
    experience: 0,
    consultationFee: 500
  })

  const roleLabels = {
    ADMIN: { label: 'Administrator', icon: '👑', color: '#dc2626' },
    DOCTOR: { label: 'Doctor', icon: '👨‍⚕️', color: '#1e3a8a' },
    NURSE: { label: 'Nurse', icon: '👩‍⚕️', color: '#059669' },
    RECEPTIONIST: { label: 'Receptionist', icon: '🏢', color: '#7c2d12' }
  }

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchUsers()
    }
  }, [session])

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
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

      if (response.ok) {
        setShowCreateUser(false)
        setNewUser({
          email: '',
          name: '',
          role: 'RECEPTIONIST',
          phone: '',
          password: '',
          licenseNumber: '',
          specialization: '',
          qualification: '',
          experience: 0,
          consultationFee: 500
        })
        fetchUsers()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create user')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Failed to create user')
    }
  }

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Error updating user status:', error)
    }
  }

  const resetUserPassword = async (userId: string) => {
    if (!confirm('Reset password to "password123" for this user?')) return

    try {
      const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST'
      })

      if (response.ok) {
        alert('Password reset successfully. New password: password123')
      }
    } catch (error) {
      console.error('Error resetting password:', error)
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  // Check if current user is admin
  if (session?.user?.role !== 'ADMIN') {
    return (
      <div className="dashboard-container">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
          <h3>Access Restricted</h3>
          <p>Only administrators can access user management.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner" style={{ textAlign: 'center', padding: '40px' }}>
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>👥 User Management</h1>
          <p>Manage system users, roles, and permissions</p>
        </div>
        <button 
          onClick={() => setShowCreateUser(true)}
          className="btn btn-primary"
        >
          👤 Create New User
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{users.filter(u => u.isActive).length}</h3>
            <p>Active Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍⚕️</div>
          <div className="stat-content">
            <h3>{users.filter(u => u.role === 'DOCTOR').length}</h3>
            <p>Doctors</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👑</div>
          <div className="stat-content">
            <h3>{users.filter(u => u.role === 'ADMIN').length}</h3>
            <p>Administrators</p>
          </div>
        </div>
      </div>

      {showCreateUser && (
        <div className="overlay" onClick={() => setShowCreateUser(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>👤 Create New User</h3>
              <button onClick={() => setShowCreateUser(false)} className="close-btn">×</button>
            </div>
            <div className="modal-content">
              <form onSubmit={handleCreateUser}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="form-input"
                      required
                      placeholder="user@medicare.com"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      className="form-input"
                      required
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Role *</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                      className="form-input"
                      required
                    >
                      <option value="RECEPTIONIST">Receptionist</option>
                      <option value="NURSE">Nurse</option>
                      <option value="DOCTOR">Doctor</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                      className="form-input"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    className="form-input"
                    required
                    placeholder="Minimum 6 characters"
                    minLength={6}
                  />
                </div>

                {newUser.role === 'DOCTOR' && (
                  <>
                    <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
                    <h4 style={{ marginBottom: '16px', color: '#1e3a8a' }}>👨‍⚕️ Doctor Profile</h4>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">License Number *</label>
                        <input
                          type="text"
                          value={newUser.licenseNumber}
                          onChange={(e) => setNewUser({...newUser, licenseNumber: e.target.value})}
                          className="form-input"
                          required={newUser.role === 'DOCTOR'}
                          placeholder="DOC-2024-001"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Specialization *</label>
                        <input
                          type="text"
                          value={newUser.specialization}
                          onChange={(e) => setNewUser({...newUser, specialization: e.target.value})}
                          className="form-input"
                          required={newUser.role === 'DOCTOR'}
                          placeholder="General Medicine, Cardiology, etc."
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Qualification *</label>
                        <input
                          type="text"
                          value={newUser.qualification}
                          onChange={(e) => setNewUser({...newUser, qualification: e.target.value})}
                          className="form-input"
                          required={newUser.role === 'DOCTOR'}
                          placeholder="MBBS, MD, etc."
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Experience (years) *</label>
                        <input
                          type="number"
                          value={newUser.experience}
                          onChange={(e) => setNewUser({...newUser, experience: parseInt(e.target.value) || 0})}
                          className="form-input"
                          required={newUser.role === 'DOCTOR'}
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Consultation Fee (₹)</label>
                      <input
                        type="number"
                        value={newUser.consultationFee}
                        onChange={(e) => setNewUser({...newUser, consultationFee: parseInt(e.target.value) || 500})}
                        className="form-input"
                        min="0"
                        step="50"
                      />
                    </div>
                  </>
                )}

                <div className="modal-footer">
                  <button type="button" onClick={() => setShowCreateUser(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="data-table">
        <div className="table-header">
          <h3>👥 System Users</h3>
        </div>
        
        <div className="user-list">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <div className="user-avatar" style={{ color: roleLabels[user.role].color }}>
                  {roleLabels[user.role].icon}
                </div>
                <div className="user-details">
                  <h4>{user.name}</h4>
                  <p>📧 {user.email}</p>
                  {user.phone && <p>📞 {user.phone}</p>}
                  <div className="user-meta">
                    <span 
                      className="role-badge"
                      style={{ backgroundColor: roleLabels[user.role].color }}
                    >
                      {roleLabels[user.role].label}
                    </span>
                    <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {user.doctorProfile && (
                    <div className="doctor-info">
                      <p><strong>License:</strong> {user.doctorProfile.licenseNumber}</p>
                      <p><strong>Specialization:</strong> {user.doctorProfile.specialization}</p>
                      <p><strong>Experience:</strong> {user.doctorProfile.experience} years</p>
                      <p><strong>Fee:</strong> ₹{user.doctorProfile.consultationFee}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="user-actions">
                <button
                  onClick={() => toggleUserStatus(user.id, user.isActive)}
                  className={`btn-icon ${user.isActive ? 'deactivate' : 'activate'}`}
                  title={user.isActive ? 'Deactivate User' : 'Activate User'}
                >
                  {user.isActive ? '🔒' : '🔓'}
                </button>
                
                <button
                  onClick={() => resetUserPassword(user.id)}
                  className="btn-icon reset"
                  title="Reset Password"
                >
                  🔑
                </button>
                
                <button
                  onClick={() => deleteUser(user.id)}
                  className="btn-icon delete"
                  title="Delete User"
                  disabled={user.role === 'ADMIN' && users.filter(u => u.role === 'ADMIN').length === 1}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}