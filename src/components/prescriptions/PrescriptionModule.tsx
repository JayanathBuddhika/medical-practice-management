'use client'

import { useState, useEffect } from 'react'

interface Prescription {
  id: string
  patientName: string
  patientId: string
  date: string
  medications: {
    drugName: string
    dosage: string
    duration: string
    instructions: string
  }[]
  consultationId?: string
}

const drugDatabase = [
  { name: 'Paracetamol', commonDosages: ['500mg', '650mg', '1000mg'] },
  { name: 'Ibuprofen', commonDosages: ['200mg', '400mg', '600mg'] },
  { name: 'Amoxicillin', commonDosages: ['250mg', '500mg', '875mg'] },
  { name: 'Azithromycin', commonDosages: ['250mg', '500mg'] },
  { name: 'Omeprazole', commonDosages: ['20mg', '40mg'] },
  { name: 'Metformin', commonDosages: ['500mg', '850mg', '1000mg'] },
  { name: 'Atorvastatin', commonDosages: ['10mg', '20mg', '40mg'] },
  { name: 'Amlodipine', commonDosages: ['2.5mg', '5mg', '10mg'] },
  { name: 'Levothyroxine', commonDosages: ['25mcg', '50mcg', '75mcg', '100mcg'] },
  { name: 'Salbutamol', commonDosages: ['100mcg/puff', '200mcg/puff'] }
]

const prescriptionTemplates = [
  {
    name: 'Upper Respiratory Infection',
    medications: [
      { drugName: 'Paracetamol', dosage: '500mg', duration: '5 days', instructions: 'Twice daily after meals' },
      { drugName: 'Azithromycin', dosage: '500mg', duration: '3 days', instructions: 'Once daily before meals' }
    ]
  },
  {
    name: 'Hypertension',
    medications: [
      { drugName: 'Amlodipine', dosage: '5mg', duration: '30 days', instructions: 'Once daily in the morning' },
      { drugName: 'Atorvastatin', dosage: '20mg', duration: '30 days', instructions: 'Once daily at bedtime' }
    ]
  },
  {
    name: 'Diabetes Management',
    medications: [
      { drugName: 'Metformin', dosage: '500mg', duration: '30 days', instructions: 'Twice daily with meals' }
    ]
  }
]

export function PrescriptionModule() {
  const [activeView, setActiveView] = useState<'new' | 'existing' | 'templates'>('new')
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [currentPrescription, setCurrentPrescription] = useState({
    patientName: '',
    patientId: '',
    medications: [{ drugName: '', dosage: '', duration: '', instructions: '' }]
  })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Load existing prescriptions
    const samplePrescriptions: Prescription[] = [
      {
        id: '1',
        patientName: 'Rajesh Kumar',
        patientId: 'PT2025001',
        date: new Date().toLocaleDateString(),
        medications: [
          { drugName: 'Paracetamol', dosage: '500mg', duration: '5 days', instructions: 'Twice daily after meals' },
          { drugName: 'Azithromycin', dosage: '500mg', duration: '3 days', instructions: 'Once daily before meals' }
        ]
      },
      {
        id: '2',
        patientName: 'Priya Sharma',
        patientId: 'PT2025002',
        date: new Date(Date.now() - 86400000).toLocaleDateString(),
        medications: [
          { drugName: 'Omeprazole', dosage: '20mg', duration: '14 days', instructions: 'Once daily before breakfast' }
        ]
      }
    ]
    setPrescriptions(samplePrescriptions)
  }, [])

  const addMedication = () => {
    setCurrentPrescription(prev => ({
      ...prev,
      medications: [...prev.medications, { drugName: '', dosage: '', duration: '', instructions: '' }]
    }))
  }

  const removeMedication = (index: number) => {
    setCurrentPrescription(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }))
  }

  const updateMedication = (index: number, field: string, value: string) => {
    setCurrentPrescription(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }))
  }

  const savePrescription = () => {
    const newPrescription: Prescription = {
      id: Date.now().toString(),
      ...currentPrescription,
      date: new Date().toLocaleDateString()
    }
    setPrescriptions(prev => [newPrescription, ...prev])
    setCurrentPrescription({
      patientName: '',
      patientId: '',
      medications: [{ drugName: '', dosage: '', duration: '', instructions: '' }]
    })
  }

  const applyTemplate = (template: typeof prescriptionTemplates[0]) => {
    setCurrentPrescription(prev => ({
      ...prev,
      medications: template.medications
    }))
  }

  const filteredPrescriptions = prescriptions.filter(p => 
    p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderNewPrescription = () => (
    <div>
      <h3 style={{ color: '#1e3a8a', marginBottom: '24px' }}>Create New Prescription</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Patient Name</label>
          <input
            type="text"
            className="form-input"
            value={currentPrescription.patientName}
            onChange={(e) => setCurrentPrescription(prev => ({ ...prev, patientName: e.target.value }))}
            placeholder="Enter patient name"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Patient ID</label>
          <input
            type="text"
            className="form-input"
            value={currentPrescription.patientId}
            onChange={(e) => setCurrentPrescription(prev => ({ ...prev, patientId: e.target.value }))}
            placeholder="Enter patient ID"
          />
        </div>
      </div>

      <h4 style={{ color: '#1e3a8a', margin: '32px 0 16px' }}>Medications</h4>
      
      {currentPrescription.medications.map((medication, index) => (
        <div key={index} style={{ marginBottom: '24px', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Drug Name</label>
              <select
                className="form-select"
                value={medication.drugName}
                onChange={(e) => updateMedication(index, 'drugName', e.target.value)}
              >
                <option value="">Select drug</option>
                {drugDatabase.map(drug => (
                  <option key={drug.name} value={drug.name}>{drug.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Dosage</label>
              <select
                className="form-select"
                value={medication.dosage}
                onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
              >
                <option value="">Select dosage</option>
                {medication.drugName && drugDatabase.find(d => d.name === medication.drugName)?.commonDosages.map(dosage => (
                  <option key={dosage} value={dosage}>{dosage}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Duration</label>
              <input
                type="text"
                className="form-input"
                value={medication.duration}
                onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                placeholder="e.g., 5 days"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Instructions</label>
            <input
              type="text"
              className="form-input"
              value={medication.instructions}
              onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
              placeholder="e.g., Twice daily after meals"
            />
          </div>
          {currentPrescription.medications.length > 1 && (
            <button
              type="button"
              className="btn btn-danger btn-small"
              onClick={() => removeMedication(index)}
              style={{ marginTop: '12px' }}
            >
              Remove Medication
            </button>
          )}
        </div>
      ))}

      <div className="btn-group">
        <button type="button" className="btn btn-secondary" onClick={addMedication}>
          Add Another Medication
        </button>
        <button type="button" className="btn btn-success" onClick={savePrescription}>
          Save Prescription
        </button>
      </div>
    </div>
  )

  const renderExistingPrescriptions = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ color: '#1e3a8a' }}>Prescription History</h3>
        <input
          type="text"
          className="form-input"
          placeholder="Search by patient name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {filteredPrescriptions.map(prescription => (
          <div key={prescription.id} className="dashboard-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h4 style={{ color: '#1e3a8a', marginBottom: '4px' }}>{prescription.patientName}</h4>
                <p style={{ color: '#64748b', fontSize: '14px' }}>ID: {prescription.patientId} | Date: {prescription.date}</p>
              </div>
              <div>
                <button className="btn btn-primary btn-small">Print</button>
              </div>
            </div>
            
            <div>
              <h5 style={{ color: '#374151', marginBottom: '12px' }}>Medications:</h5>
              {prescription.medications.map((med, index) => (
                <div key={index} style={{ 
                  padding: '12px', 
                  background: '#f8fafc', 
                  borderRadius: '8px', 
                  marginBottom: '8px',
                  borderLeft: '4px solid #1e3a8a'
                }}>
                  <div style={{ fontWeight: '600', color: '#1e3a8a' }}>{med.drugName} - {med.dosage}</div>
                  <div style={{ fontSize: '14px', color: '#64748b' }}>{med.instructions} for {med.duration}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderTemplates = () => (
    <div>
      <h3 style={{ color: '#1e3a8a', marginBottom: '24px' }}>Prescription Templates</h3>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        {prescriptionTemplates.map((template, index) => (
          <div key={index} className="dashboard-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ color: '#1e3a8a' }}>{template.name}</h4>
              <button 
                className="btn btn-primary btn-small"
                onClick={() => applyTemplate(template)}
              >
                Use Template
              </button>
            </div>
            
            <div>
              {template.medications.map((med, medIndex) => (
                <div key={medIndex} style={{ 
                  padding: '8px 0', 
                  borderBottom: medIndex < template.medications.length - 1 ? '1px solid #f1f5f9' : 'none'
                }}>
                  <span style={{ fontWeight: '500' }}>{med.drugName} {med.dosage}</span>
                  <span style={{ color: '#64748b', marginLeft: '12px' }}>{med.instructions} for {med.duration}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="screen-content">
      {/* Navigation Tabs */}
      <div className="screen-tabs" style={{ marginBottom: '24px' }}>
        <button
          className={`tab-btn ${activeView === 'new' ? 'active' : ''}`}
          onClick={() => setActiveView('new')}
        >
          📝 New Prescription
        </button>
        <button
          className={`tab-btn ${activeView === 'existing' ? 'active' : ''}`}
          onClick={() => setActiveView('existing')}
        >
          📋 Prescription History
        </button>
        <button
          className={`tab-btn ${activeView === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveView('templates')}
        >
          📄 Templates
        </button>
      </div>

      {/* Content */}
      {activeView === 'new' && renderNewPrescription()}
      {activeView === 'existing' && renderExistingPrescriptions()}
      {activeView === 'templates' && renderTemplates()}
    </div>
  )
}