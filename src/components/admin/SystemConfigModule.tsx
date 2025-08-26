'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface SystemConfig {
  clinicName: string
  clinicAddress: string
  clinicPhone: string
  clinicEmail: string
  licenseNumber: string
  defaultConsultationFee: number
  workingHours: {
    start: string
    end: string
    breakStart: string
    breakEnd: string
  }
  appointmentSlotDuration: number
  taxRate: number
  currency: string
  timezone: string
}

export function SystemConfigModule() {
  const { data: session } = useSession()
  const [config, setConfig] = useState<SystemConfig>({
    clinicName: 'MediCare Private Practice',
    clinicAddress: '123 Medical Street, Healthcare City, HC 12345',
    clinicPhone: '+91 98765 43210',
    clinicEmail: 'contact@medicare.com',
    licenseNumber: 'CLINIC-2024-001',
    defaultConsultationFee: 500,
    workingHours: {
      start: '09:00',
      end: '18:00',
      breakStart: '13:00',
      breakEnd: '14:00'
    },
    appointmentSlotDuration: 30,
    taxRate: 18,
    currency: '₹',
    timezone: 'Asia/Kolkata'
  })
  
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      loadSystemConfig()
    }
  }, [session])

  const loadSystemConfig = async () => {
    try {
      const response = await fetch('/api/admin/config')
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      }
    } catch (error) {
      console.error('Error loading config:', error)
    }
  }

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSaved(false)

    try {
      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Error saving config:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBackupDatabase = async () => {
    if (!confirm('Create a backup of the database?')) return

    try {
      const response = await fetch('/api/admin/backup', {
        method: 'POST'
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `medicare-backup-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        alert('Database backup created successfully!')
      }
    } catch (error) {
      console.error('Error creating backup:', error)
      alert('Failed to create backup')
    }
  }

  const handleClearData = async (dataType: string) => {
    const confirmMessage = `Are you sure you want to clear all ${dataType}? This action cannot be undone.`
    if (!confirm(confirmMessage)) return

    try {
      const response = await fetch(`/api/admin/clear/${dataType}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert(`${dataType} cleared successfully`)
        if (dataType === 'appointments') {
          // Refresh if on appointments page
          window.location.reload()
        }
      }
    } catch (error) {
      console.error(`Error clearing ${dataType}:`, error)
      alert(`Failed to clear ${dataType}`)
    }
  }

  // Check if current user is admin
  if (session?.user?.role !== 'ADMIN') {
    return (
      <div className="dashboard-container">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
          <h3>Access Restricted</h3>
          <p>Only administrators can access system configuration.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>⚙️ System Configuration</h1>
          <p>Configure clinic settings, working hours, and system preferences</p>
        </div>
        {saved && (
          <div style={{ 
            background: '#d1fae5', 
            color: '#065f46', 
            padding: '8px 16px', 
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            ✅ Settings saved successfully!
          </div>
        )}
      </div>

      <div className="main-content">
        <div className="form-section" style={{ flex: '2' }}>
          <form onSubmit={handleSaveConfig}>
            <div className="form-card">
              <h3>🏥 Clinic Information</h3>
              
              <div className="form-group">
                <label className="form-label">Clinic Name</label>
                <input
                  type="text"
                  value={config.clinicName}
                  onChange={(e) => setConfig({...config, clinicName: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea
                  value={config.clinicAddress}
                  onChange={(e) => setConfig({...config, clinicAddress: e.target.value})}
                  className="form-input"
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    value={config.clinicPhone}
                    onChange={(e) => setConfig({...config, clinicPhone: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={config.clinicEmail}
                    onChange={(e) => setConfig({...config, clinicEmail: e.target.value})}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">License Number</label>
                <input
                  type="text"
                  value={config.licenseNumber}
                  onChange={(e) => setConfig({...config, licenseNumber: e.target.value})}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-card">
              <h3>⏰ Working Hours</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input
                    type="time"
                    value={config.workingHours.start}
                    onChange={(e) => setConfig({
                      ...config, 
                      workingHours: {...config.workingHours, start: e.target.value}
                    })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <input
                    type="time"
                    value={config.workingHours.end}
                    onChange={(e) => setConfig({
                      ...config, 
                      workingHours: {...config.workingHours, end: e.target.value}
                    })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Break Start</label>
                  <input
                    type="time"
                    value={config.workingHours.breakStart}
                    onChange={(e) => setConfig({
                      ...config, 
                      workingHours: {...config.workingHours, breakStart: e.target.value}
                    })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Break End</label>
                  <input
                    type="time"
                    value={config.workingHours.breakEnd}
                    onChange={(e) => setConfig({
                      ...config, 
                      workingHours: {...config.workingHours, breakEnd: e.target.value}
                    })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Appointment Slot Duration (minutes)</label>
                <select
                  value={config.appointmentSlotDuration}
                  onChange={(e) => setConfig({...config, appointmentSlotDuration: parseInt(e.target.value)})}
                  className="form-input"
                >
                  <option value={15}>15 minutes</option>
                  <option value={20}>20 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>
            </div>

            <div className="form-card">
              <h3>💰 Financial Settings</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Default Consultation Fee</label>
                  <input
                    type="number"
                    value={config.defaultConsultationFee}
                    onChange={(e) => setConfig({...config, defaultConsultationFee: parseInt(e.target.value) || 0})}
                    className="form-input"
                    min="0"
                    step="50"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={config.taxRate}
                    onChange={(e) => setConfig({...config, taxRate: parseFloat(e.target.value) || 0})}
                    className="form-input"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Currency</label>
                  <select
                    value={config.currency}
                    onChange={(e) => setConfig({...config, currency: e.target.value})}
                    className="form-input"
                  >
                    <option value="₹">₹ (Indian Rupee)</option>
                    <option value="$">$ (US Dollar)</option>
                    <option value="€">€ (Euro)</option>
                    <option value="£">£ (British Pound)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Timezone</label>
                  <select
                    value={config.timezone}
                    onChange={(e) => setConfig({...config, timezone: e.target.value})}
                    className="form-input"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : '💾 Save Configuration'}
            </button>
          </form>
        </div>

        <div className="sidebar" style={{ flex: '1' }}>
          <div className="form-card">
            <h3>🔧 System Actions</h3>
            
            <div className="action-group">
              <h4>📋 Database Management</h4>
              <button
                onClick={handleBackupDatabase}
                className="btn btn-secondary btn-full"
              >
                💾 Backup Database
              </button>
              <p className="help-text">Create a complete backup of all system data</p>
            </div>

            <div className="action-group">
              <h4>🗑️ Clear Data</h4>
              <button
                onClick={() => handleClearData('appointments')}
                className="btn btn-warning btn-full"
              >
                📅 Clear All Appointments
              </button>
              <button
                onClick={() => handleClearData('consultations')}
                className="btn btn-warning btn-full"
              >
                🩺 Clear All Consultations
              </button>
              <button
                onClick={() => handleClearData('bills')}
                className="btn btn-warning btn-full"
              >
                💰 Clear All Bills
              </button>
              <p className="help-text">⚠️ These actions cannot be undone</p>
            </div>

            <div className="action-group">
              <h4>📊 System Info</h4>
              <div className="info-grid">
                <div className="info-item">
                  <span>Version:</span>
                  <strong>v1.0.0</strong>
                </div>
                <div className="info-item">
                  <span>Database:</span>
                  <strong>SQLite</strong>
                </div>
                <div className="info-item">
                  <span>Environment:</span>
                  <strong>Development</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}