'use client'

import { useState, useEffect } from 'react'

interface Patient {
  id: string
  patientId: string
  firstName: string
  lastName: string
  dateOfBirth: string
  age: number
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  phone: string
  email: string
  address: string
  bloodGroup: string
  allergies?: string
  emergency?: string
  registrationDate: string
  consultations: ConsultationRecord[]
  prescriptions: PrescriptionRecord[]
  investigations: InvestigationRecord[]
  lastVisit?: string
}

interface ConsultationRecord {
  id: string
  date: string
  diagnosis: string
  notes: string
}

interface PrescriptionRecord {
  id: string
  date: string
  medications: string[]
}

interface InvestigationRecord {
  id: string
  date: string
  tests: string[]
  status: string
}

const samplePatients: Patient[] = [
  {
    id: '1',
    patientId: 'PT2025001',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    dateOfBirth: '1978-05-15',
    age: 46,
    gender: 'MALE',
    phone: '+91 98765 11111',
    email: 'rajesh.kumar@email.com',
    address: '123 Main Street, Andheri West, Mumbai - 400058',
    bloodGroup: 'B+',
    allergies: 'Penicillin, Sulfa drugs',
    emergency: 'Wife: Sunita Kumar, +91 98765 11112',
    registrationDate: '2024-12-15',
    lastVisit: '2025-01-22',
    consultations: [
      { id: '1', date: '2025-01-22', diagnosis: 'Upper Respiratory Infection', notes: 'Persistent cough and fever' },
      { id: '2', date: '2024-12-20', diagnosis: 'Hypertension', notes: 'Regular monitoring required' }
    ],
    prescriptions: [
      { id: '1', date: '2025-01-22', medications: ['Paracetamol 500mg', 'Azithromycin 500mg'] },
      { id: '2', date: '2024-12-20', medications: ['Amlodipine 5mg', 'Atorvastatin 20mg'] }
    ],
    investigations: [
      { id: '1', date: '2025-01-20', tests: ['CBC', 'Thyroid Profile'], status: 'Completed' },
      { id: '2', date: '2024-12-18', tests: ['Lipid Profile', 'ECG'], status: 'Completed' }
    ]
  },
  {
    id: '2',
    patientId: 'PT2025002',
    firstName: 'Priya',
    lastName: 'Sharma',
    dateOfBirth: '1991-08-22',
    age: 33,
    gender: 'FEMALE',
    phone: '+91 98765 22222',
    email: 'priya.sharma@email.com',
    address: '456 Park Avenue, Karol Bagh, Delhi - 110005',
    bloodGroup: 'O+',
    allergies: 'None known',
    emergency: 'Husband: Amit Sharma, +91 98765 22223',
    registrationDate: '2024-11-10',
    lastVisit: '2025-01-21',
    consultations: [
      { id: '1', date: '2025-01-21', diagnosis: 'Gastritis', notes: 'Stomach pain and acidity' }
    ],
    prescriptions: [
      { id: '1', date: '2025-01-21', medications: ['Omeprazole 20mg', 'Antacid syrup'] }
    ],
    investigations: [
      { id: '1', date: '2025-01-19', tests: ['H. Pylori test'], status: 'Completed' }
    ]
  }
]

export function PatientRecordsModule() {
  const [activeView, setActiveView] = useState<'search' | 'register' | 'profile'>('search')
  const [patients, setPatients] = useState<Patient[]>(samplePatients)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'MALE' as const,
    phone: '',
    email: '',
    address: '',
    bloodGroup: '',
    allergies: '',
    emergency: ''
  })

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birth = new Date(dateOfBirth)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const registerPatient = () => {
    const patient: Patient = {
      id: Date.now().toString(),
      patientId: `PT${Date.now().toString().slice(-6)}`,
      ...newPatient,
      age: calculateAge(newPatient.dateOfBirth),
      registrationDate: new Date().toISOString().split('T')[0],
      consultations: [],
      prescriptions: [],
      investigations: []
    }
    
    setPatients(prev => [patient, ...prev])
    setNewPatient({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'MALE',
      phone: '',
      email: '',
      address: '',
      bloodGroup: '',
      allergies: '',
      emergency: ''
    })
    setActiveView('search')
  }

  const filteredPatients = patients.filter(patient =>
    patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  )

  const renderSearch = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ color: '#1e3a8a' }}>Patient Records</h3>
        <input
          type="text"
          className="form-input"
          placeholder="Search by name, ID, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {filteredPatients.map(patient => (
          <div key={patient.id} className="dashboard-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ color: '#1e3a8a', marginBottom: '4px' }}>
                  {patient.firstName} {patient.lastName}
                </h4>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>
                  ID: {patient.patientId} • {patient.age} years • {patient.gender}
                </p>
                <p style={{ color: '#64748b', fontSize: '14px' }}>
                  📞 {patient.phone} • 🩸 {patient.bloodGroup}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button 
                  className="btn btn-primary btn-small"
                  onClick={() => {
                    setSelectedPatient(patient)
                    setActiveView('profile')
                  }}
                >
                  View Profile
                </button>
                <span style={{ 
                  fontSize: '12px', 
                  color: '#64748b',
                  textAlign: 'right'
                }}>
                  Last visit: {patient.lastVisit || 'Never'}
                </span>
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
              gap: '12px',
              padding: '12px',
              background: '#f8fafc',
              borderRadius: '8px'
            }}>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Consultations</div>
                <div style={{ fontWeight: '600', color: '#1e3a8a' }}>{patient.consultations.length}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Prescriptions</div>
                <div style={{ fontWeight: '600', color: '#1e3a8a' }}>{patient.prescriptions.length}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Tests</div>
                <div style={{ fontWeight: '600', color: '#1e3a8a' }}>{patient.investigations.length}</div>
              </div>
            </div>

            {patient.allergies && (
              <div style={{ 
                marginTop: '12px',
                padding: '8px 12px',
                background: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: '6px',
                fontSize: '14px'
              }}>
                ⚠️ <strong>Allergies:</strong> {patient.allergies}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderRegister = () => (
    <div>
      <h3 style={{ color: '#1e3a8a', marginBottom: '24px' }}>Register New Patient</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">First Name *</label>
          <input
            type="text"
            className="form-input"
            value={newPatient.firstName}
            onChange={(e) => setNewPatient(prev => ({ ...prev, firstName: e.target.value }))}
            placeholder="Enter first name"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Last Name *</label>
          <input
            type="text"
            className="form-input"
            value={newPatient.lastName}
            onChange={(e) => setNewPatient(prev => ({ ...prev, lastName: e.target.value }))}
            placeholder="Enter last name"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Date of Birth *</label>
          <input
            type="date"
            className="form-input"
            value={newPatient.dateOfBirth}
            onChange={(e) => setNewPatient(prev => ({ ...prev, dateOfBirth: e.target.value }))}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Gender *</label>
          <select
            className="form-select"
            value={newPatient.gender}
            onChange={(e) => setNewPatient(prev => ({ ...prev, gender: e.target.value as any }))}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Blood Group</label>
          <select
            className="form-select"
            value={newPatient.bloodGroup}
            onChange={(e) => setNewPatient(prev => ({ ...prev, bloodGroup: e.target.value }))}
          >
            <option value="">Select blood group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Phone Number *</label>
          <input
            type="tel"
            className="form-input"
            value={newPatient.phone}
            onChange={(e) => setNewPatient(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="+91 98765 43210"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            value={newPatient.email}
            onChange={(e) => setNewPatient(prev => ({ ...prev, email: e.target.value }))}
            placeholder="patient@email.com"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Address</label>
        <textarea
          className="form-textarea"
          value={newPatient.address}
          onChange={(e) => setNewPatient(prev => ({ ...prev, address: e.target.value }))}
          placeholder="Complete address with pin code"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Known Allergies</label>
        <input
          type="text"
          className="form-input"
          value={newPatient.allergies}
          onChange={(e) => setNewPatient(prev => ({ ...prev, allergies: e.target.value }))}
          placeholder="Drug allergies, food allergies, etc."
        />
      </div>

      <div className="form-group">
        <label className="form-label">Emergency Contact</label>
        <input
          type="text"
          className="form-input"
          value={newPatient.emergency}
          onChange={(e) => setNewPatient(prev => ({ ...prev, emergency: e.target.value }))}
          placeholder="Name and phone number of emergency contact"
        />
      </div>

      <div className="btn-group">
        <button className="btn btn-secondary" onClick={() => setActiveView('search')}>
          Cancel
        </button>
        <button className="btn btn-success" onClick={registerPatient}>
          Register Patient
        </button>
      </div>
    </div>
  )

  const renderProfile = () => {
    if (!selectedPatient) return null

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ color: '#1e3a8a' }}>Patient Profile</h3>
          <button className="btn btn-secondary btn-small" onClick={() => setActiveView('search')}>
            Back to Search
          </button>
        </div>

        {/* Patient Info Card */}
        <div className="dashboard-card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            <div>
              <h4 style={{ color: '#1e3a8a', marginBottom: '12px', fontSize: '24px' }}>
                {selectedPatient.firstName} {selectedPatient.lastName}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '14px' }}>
                <div><strong>Patient ID:</strong> {selectedPatient.patientId}</div>
                <div><strong>Age:</strong> {selectedPatient.age} years</div>
                <div><strong>Gender:</strong> {selectedPatient.gender}</div>
                <div><strong>Blood Group:</strong> {selectedPatient.bloodGroup}</div>
                <div><strong>Phone:</strong> {selectedPatient.phone}</div>
                <div><strong>Email:</strong> {selectedPatient.email}</div>
              </div>
              <div style={{ marginTop: '12px' }}>
                <strong>Address:</strong> {selectedPatient.address}
              </div>
            </div>
            <div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr',
                gap: '12px',
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Total Consultations</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e3a8a' }}>
                    {selectedPatient.consultations.length}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Last Visit</div>
                  <div style={{ fontWeight: '600' }}>
                    {selectedPatient.lastVisit || 'Never'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Registered</div>
                  <div style={{ fontWeight: '600' }}>
                    {selectedPatient.registrationDate}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {selectedPatient.allergies && (
            <div style={{ 
              marginTop: '16px',
              padding: '12px',
              background: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '8px'
            }}>
              <strong>⚠️ Allergies:</strong> {selectedPatient.allergies}
            </div>
          )}

          {selectedPatient.emergency && (
            <div style={{ 
              marginTop: '8px',
              padding: '12px',
              background: '#fecaca',
              border: '1px solid #dc2626',
              borderRadius: '8px'
            }}>
              <strong>🚨 Emergency Contact:</strong> {selectedPatient.emergency}
            </div>
          )}
        </div>

        {/* Medical History */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
          {/* Consultations */}
          <div className="dashboard-card">
            <h4 style={{ color: '#1e3a8a', marginBottom: '16px' }}>Recent Consultations</h4>
            {selectedPatient.consultations.length > 0 ? (
              selectedPatient.consultations.map(consultation => (
                <div key={consultation.id} style={{ 
                  padding: '12px',
                  marginBottom: '8px',
                  background: '#f0f9ff',
                  borderRadius: '8px',
                  borderLeft: '4px solid #1e3a8a'
                }}>
                  <div style={{ fontWeight: '600', color: '#1e3a8a' }}>{consultation.diagnosis}</div>
                  <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
                    {consultation.date} • {consultation.notes}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#64748b', fontStyle: 'italic' }}>No consultations recorded</p>
            )}
          </div>

          {/* Prescriptions */}
          <div className="dashboard-card">
            <h4 style={{ color: '#1e3a8a', marginBottom: '16px' }}>Recent Prescriptions</h4>
            {selectedPatient.prescriptions.length > 0 ? (
              selectedPatient.prescriptions.map(prescription => (
                <div key={prescription.id} style={{ 
                  padding: '12px',
                  marginBottom: '8px',
                  background: '#f0fdf4',
                  borderRadius: '8px',
                  borderLeft: '4px solid #10b981'
                }}>
                  <div style={{ fontWeight: '600', color: '#10b981', marginBottom: '4px' }}>
                    {prescription.date}
                  </div>
                  {prescription.medications.map((med, index) => (
                    <div key={index} style={{ fontSize: '14px', color: '#64748b' }}>
                      • {med}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p style={{ color: '#64748b', fontStyle: 'italic' }}>No prescriptions recorded</p>
            )}
          </div>

          {/* Investigations */}
          <div className="dashboard-card">
            <h4 style={{ color: '#1e3a8a', marginBottom: '16px' }}>Recent Investigations</h4>
            {selectedPatient.investigations.length > 0 ? (
              selectedPatient.investigations.map(investigation => (
                <div key={investigation.id} style={{ 
                  padding: '12px',
                  marginBottom: '8px',
                  background: '#fef3c7',
                  borderRadius: '8px',
                  borderLeft: '4px solid #f59e0b'
                }}>
                  <div style={{ fontWeight: '600', color: '#f59e0b', marginBottom: '4px' }}>
                    {investigation.date} • {investigation.status}
                  </div>
                  {investigation.tests.map((test, index) => (
                    <div key={index} style={{ fontSize: '14px', color: '#64748b' }}>
                      • {test}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p style={{ color: '#64748b', fontStyle: 'italic' }}>No investigations recorded</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="screen-content">
      {/* Navigation Tabs */}
      {activeView !== 'profile' && (
        <div className="screen-tabs" style={{ marginBottom: '24px' }}>
          <button
            className={`tab-btn ${activeView === 'search' ? 'active' : ''}`}
            onClick={() => setActiveView('search')}
          >
            🔍 Search Patients
          </button>
          <button
            className={`tab-btn ${activeView === 'register' ? 'active' : ''}`}
            onClick={() => setActiveView('register')}
          >
            👤 Register New
          </button>
        </div>
      )}

      {/* Content */}
      {activeView === 'search' && renderSearch()}
      {activeView === 'register' && renderRegister()}
      {activeView === 'profile' && renderProfile()}
    </div>
  )
}