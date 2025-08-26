'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Patient {
  id: string
  patientId: string
  firstName: string
  lastName: string
  phone: string
  email?: string
  dateOfBirth: string
  gender: string
}

interface Appointment {
  id: string
  patientId: string
  appointmentDate: string
  timeSlot: string
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  purpose?: string
  notes?: string
  tokenNumber?: string
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  patient: Patient
}

export function AppointmentsModule() {
  const { data: session } = useSession()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showNewAppointment, setShowNewAppointment] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newAppointment, setNewAppointment] = useState({
    patientId: '',
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '09:00-09:30',
    purpose: '',
    notes: '',
    priority: 'NORMAL' as const
  })

  const timeSlots = [
    '09:00-09:30', '09:30-10:00', '10:00-10:30', '10:30-11:00',
    '11:00-11:30', '11:30-12:00', '12:00-12:30', '12:30-13:00',
    '14:00-14:30', '14:30-15:00', '15:00-15:30', '15:30-16:00',
    '16:00-16:30', '16:30-17:00', '17:00-17:30', '17:30-18:00'
  ]

  const priorityColors = {
    LOW: '#10b981',
    NORMAL: '#6b7280', 
    HIGH: '#f59e0b',
    URGENT: '#ef4444'
  }

  const statusColors = {
    SCHEDULED: '#6b7280',
    CONFIRMED: '#3b82f6',
    IN_PROGRESS: '#f59e0b',
    COMPLETED: '#10b981',
    CANCELLED: '#ef4444',
    NO_SHOW: '#ef4444'
  }

  useEffect(() => {
    fetchAppointments()
    fetchPatients()
  }, [selectedDate])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/appointments?date=${selectedDate}`)
      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients')
      if (response.ok) {
        const data = await response.json()
        setPatients(data)
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    }
  }

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newAppointment,
          appointmentDate: new Date(newAppointment.appointmentDate + 'T' + newAppointment.timeSlot.split('-')[0]).toISOString()
        }),
      })

      if (response.ok) {
        setShowNewAppointment(false)
        setNewAppointment({
          patientId: '',
          appointmentDate: new Date().toISOString().split('T')[0],
          timeSlot: '09:00-09:30',
          purpose: '',
          notes: '',
          priority: 'NORMAL'
        })
        fetchAppointments()
      }
    } catch (error) {
      console.error('Error creating appointment:', error)
    }
  }

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchAppointments()
      }
    } catch (error) {
      console.error('Error updating appointment:', error)
    }
  }

  const getAvailableSlots = () => {
    const bookedSlots = appointments.filter(apt => apt.status !== 'CANCELLED').map(apt => apt.timeSlot)
    return timeSlots.filter(slot => !bookedSlots.includes(slot))
  }

  const generateTokenNumber = () => {
    const nextToken = appointments.length + 1
    return `T${String(nextToken).padStart(3, '0')}`
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner" style={{ textAlign: 'center', padding: '40px' }}>
          <div className="spinner"></div>
          <p>Loading appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>📅 Appointment Management</h1>
          <p>Schedule and manage patient appointments for today's practice</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="form-input"
            style={{ width: 'auto' }}
          />
          <button 
            onClick={() => setShowNewAppointment(true)}
            className="btn btn-primary"
          >
            📅 Schedule New
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{appointments.length}</h3>
            <p>Total Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{appointments.filter(apt => apt.status === 'CONFIRMED').length}</h3>
            <p>Confirmed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <h3>{appointments.filter(apt => apt.status === 'IN_PROGRESS').length}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>{getAvailableSlots().length}</h3>
            <p>Available Slots</p>
          </div>
        </div>
      </div>

      {showNewAppointment && (
        <div className="overlay" onClick={() => setShowNewAppointment(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📅 Schedule New Appointment</h3>
              <button onClick={() => setShowNewAppointment(false)} className="close-btn">×</button>
            </div>
            <div className="modal-content">
              <form onSubmit={handleCreateAppointment}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Patient</label>
                    <select
                      value={newAppointment.patientId}
                      onChange={(e) => setNewAppointment({...newAppointment, patientId: e.target.value})}
                      className="form-input"
                      required
                    >
                      <option value="">Select Patient</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.firstName} {patient.lastName} - {patient.patientId}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      value={newAppointment.appointmentDate}
                      onChange={(e) => setNewAppointment({...newAppointment, appointmentDate: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Time Slot</label>
                    <select
                      value={newAppointment.timeSlot}
                      onChange={(e) => setNewAppointment({...newAppointment, timeSlot: e.target.value})}
                      className="form-input"
                      required
                    >
                      {getAvailableSlots().map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select
                      value={newAppointment.priority}
                      onChange={(e) => setNewAppointment({...newAppointment, priority: e.target.value as any})}
                      className="form-input"
                      required
                    >
                      <option value="LOW">Low</option>
                      <option value="NORMAL">Normal</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Purpose</label>
                  <input
                    type="text"
                    value={newAppointment.purpose}
                    onChange={(e) => setNewAppointment({...newAppointment, purpose: e.target.value})}
                    className="form-input"
                    placeholder="Consultation, Follow-up, Check-up..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                    className="form-input"
                    rows={3}
                    placeholder="Any special instructions or notes..."
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" onClick={() => setShowNewAppointment(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Schedule Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="data-table">
        <div className="table-header">
          <h3>📋 Today's Appointment Schedule - {new Date(selectedDate).toLocaleDateString()}</h3>
        </div>
        
        {appointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
            <h3>No appointments scheduled</h3>
            <p>Click "Schedule New" to add the first appointment for this date</p>
          </div>
        ) : (
          <div className="appointment-timeline">
            {appointments.sort((a, b) => a.timeSlot.localeCompare(b.timeSlot)).map((appointment) => (
              <div key={appointment.id} className="appointment-slot">
                <div className="appointment-time">
                  <div className="time-slot">{appointment.timeSlot}</div>
                  {appointment.tokenNumber && (
                    <div className="token-number">{appointment.tokenNumber}</div>
                  )}
                </div>
                
                <div className="appointment-details">
                  <div className="patient-info">
                    <h4>{appointment.patient.firstName} {appointment.patient.lastName}</h4>
                    <p>📞 {appointment.patient.phone} • 👤 {appointment.patient.patientId}</p>
                  </div>
                  
                  {appointment.purpose && (
                    <div className="appointment-purpose">
                      <strong>Purpose:</strong> {appointment.purpose}
                    </div>
                  )}
                  
                  {appointment.notes && (
                    <div className="appointment-notes">
                      <strong>Notes:</strong> {appointment.notes}
                    </div>
                  )}
                </div>
                
                <div className="appointment-actions">
                  <div className="status-priority">
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: statusColors[appointment.status] }}
                    >
                      {appointment.status.replace('_', ' ')}
                    </span>
                    <span 
                      className="priority-badge" 
                      style={{ color: priorityColors[appointment.priority] }}
                    >
                      {appointment.priority}
                    </span>
                  </div>
                  
                  <div className="action-buttons">
                    {appointment.status === 'SCHEDULED' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'CONFIRMED')}
                        className="btn-icon confirm"
                        title="Confirm Appointment"
                      >
                        ✅
                      </button>
                    )}
                    
                    {appointment.status === 'CONFIRMED' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'IN_PROGRESS')}
                        className="btn-icon start"
                        title="Start Consultation"
                      >
                        🏃‍♂️
                      </button>
                    )}
                    
                    {appointment.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'COMPLETED')}
                        className="btn-icon complete"
                        title="Mark Complete"
                      >
                        ✅
                      </button>
                    )}
                    
                    {(appointment.status === 'SCHEDULED' || appointment.status === 'CONFIRMED') && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'CANCELLED')}
                        className="btn-icon cancel"
                        title="Cancel Appointment"
                      >
                        ❌
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}