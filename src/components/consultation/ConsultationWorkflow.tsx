'use client'

import { useState } from 'react'

interface Patient {
  patientName: string
  age: number
  gender: string
  tokenNumber: string
}

interface ConsultationWorkflowProps {
  patient: Patient | null
  onClose: () => void
}

const consultationSections = [
  { id: 'vitals', label: 'Vitals', icon: '🩺' },
  { id: 'symptoms', label: 'Symptoms & History', icon: '📋' },
  { id: 'examination', label: 'Examination', icon: '🔍' },
  { id: 'diagnosis', label: 'Diagnosis', icon: '🎯' },
  { id: 'treatment', label: 'Treatment Plan', icon: '💊' }
]

export function ConsultationWorkflow({ patient, onClose }: ConsultationWorkflowProps) {
  const [activeSection, setActiveSection] = useState('vitals')
  const [formData, setFormData] = useState({
    // Vitals
    bloodPressure: '120/80',
    pulse: '72',
    temperature: '98.6',
    weight: '70',
    height: '170',
    spo2: '98',
    
    // Symptoms
    chiefComplaints: '',
    historyPresent: '',
    historyPast: '',
    allergies: '',
    
    // Examination
    generalExamination: '',
    systemicExamination: '',
    localExamination: '',
    
    // Diagnosis
    provisionalDiagnosis: '',
    differentialDiagnosis: '',
    finalDiagnosis: '',
    icdCode: '',
    
    // Treatment
    medications: '',
    investigations: '',
    followupAfter: '7',
    generalAdvice: '',
    redFlagSymptoms: ''
  })

  if (!patient) return null

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const renderVitals = () => (
    <div>
      <h3 style={{ color: '#1e3a8a', marginBottom: '24px' }}>Vital Signs</h3>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Blood Pressure (mmHg)</label>
          <input
            type="text"
            className="form-input"
            value={formData.bloodPressure}
            onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
            placeholder="120/80"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Pulse Rate (bpm)</label>
          <input
            type="number"
            className="form-input"
            value={formData.pulse}
            onChange={(e) => handleInputChange('pulse', e.target.value)}
            placeholder="72"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Temperature (°F)</label>
          <input
            type="number"
            className="form-input"
            value={formData.temperature}
            onChange={(e) => handleInputChange('temperature', e.target.value)}
            placeholder="98.6"
            step="0.1"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Weight (kg)</label>
          <input
            type="number"
            className="form-input"
            value={formData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            placeholder="70"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Height (cm)</label>
          <input
            type="number"
            className="form-input"
            value={formData.height}
            onChange={(e) => handleInputChange('height', e.target.value)}
            placeholder="170"
          />
        </div>
        <div className="form-group">
          <label className="form-label">SpO2 (%)</label>
          <input
            type="number"
            className="form-input"
            value={formData.spo2}
            onChange={(e) => handleInputChange('spo2', e.target.value)}
            placeholder="98"
          />
        </div>
      </div>
      <button className="btn btn-primary">Save Vitals</button>
    </div>
  )

  const renderSymptoms = () => (
    <div>
      <h3 style={{ color: '#1e3a8a', marginBottom: '24px' }}>Chief Complaints & History</h3>
      <div className="form-group">
        <label className="form-label">Chief Complaints</label>
        <textarea
          className="form-textarea"
          value={formData.chiefComplaints}
          onChange={(e) => handleInputChange('chiefComplaints', e.target.value)}
          placeholder="Enter patient's main complaints..."
        />
      </div>
      <div className="form-group">
        <label className="form-label">History of Present Illness</label>
        <textarea
          className="form-textarea"
          value={formData.historyPresent}
          onChange={(e) => handleInputChange('historyPresent', e.target.value)}
          placeholder="Describe the history of current illness..."
        />
      </div>
      <div className="form-group">
        <label className="form-label">Past Medical History</label>
        <textarea
          className="form-textarea"
          value={formData.historyPast}
          onChange={(e) => handleInputChange('historyPast', e.target.value)}
          placeholder="Any significant past medical history..."
        />
      </div>
      <div className="form-group">
        <label className="form-label">Allergies</label>
        <input
          type="text"
          className="form-input"
          value={formData.allergies}
          onChange={(e) => handleInputChange('allergies', e.target.value)}
          placeholder="Drug allergies, food allergies, etc."
        />
      </div>
      <button className="btn btn-primary">Save History</button>
    </div>
  )

  const renderExamination = () => (
    <div>
      <h3 style={{ color: '#1e3a8a', marginBottom: '24px' }}>Physical Examination</h3>
      <div className="form-group">
        <label className="form-label">General Examination</label>
        <textarea
          className="form-textarea"
          value={formData.generalExamination}
          onChange={(e) => handleInputChange('generalExamination', e.target.value)}
          placeholder="General appearance, consciousness level, etc."
        />
      </div>
      <div className="form-group">
        <label className="form-label">Systemic Examination</label>
        <textarea
          className="form-textarea"
          value={formData.systemicExamination}
          onChange={(e) => handleInputChange('systemicExamination', e.target.value)}
          placeholder="CVS, RS, CNS, Abdomen findings..."
        />
      </div>
      <div className="form-group">
        <label className="form-label">Local Examination (if applicable)</label>
        <textarea
          className="form-textarea"
          value={formData.localExamination}
          onChange={(e) => handleInputChange('localExamination', e.target.value)}
          placeholder="Specific area examination findings..."
        />
      </div>
      <button className="btn btn-primary">Save Examination</button>
    </div>
  )

  const renderDiagnosis = () => (
    <div>
      <h3 style={{ color: '#1e3a8a', marginBottom: '24px' }}>Diagnosis</h3>
      <div className="form-group">
        <label className="form-label">Provisional Diagnosis</label>
        <input
          type="text"
          className="form-input"
          value={formData.provisionalDiagnosis}
          onChange={(e) => handleInputChange('provisionalDiagnosis', e.target.value)}
          placeholder="Enter provisional diagnosis"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Differential Diagnosis</label>
        <textarea
          className="form-textarea"
          value={formData.differentialDiagnosis}
          onChange={(e) => handleInputChange('differentialDiagnosis', e.target.value)}
          placeholder="List possible differential diagnoses..."
        />
      </div>
      <div className="form-group">
        <label className="form-label">Final Diagnosis</label>
        <input
          type="text"
          className="form-input"
          value={formData.finalDiagnosis}
          onChange={(e) => handleInputChange('finalDiagnosis', e.target.value)}
          placeholder="Enter final diagnosis"
        />
      </div>
      <div className="form-group">
        <label className="form-label">ICD-10 Code</label>
        <input
          type="text"
          className="form-input"
          value={formData.icdCode}
          onChange={(e) => handleInputChange('icdCode', e.target.value)}
          placeholder="Enter ICD-10 code"
        />
      </div>
      <button className="btn btn-primary">Save Diagnosis</button>
    </div>
  )

  const renderTreatment = () => (
    <div>
      <h3 style={{ color: '#1e3a8a', marginBottom: '24px' }}>Treatment Plan</h3>
      <div className="form-group">
        <label className="form-label">Medications</label>
        <textarea
          className="form-textarea"
          value={formData.medications}
          onChange={(e) => handleInputChange('medications', e.target.value)}
          placeholder="Prescribe medications with dosage..."
        />
      </div>
      <div className="form-group">
        <label className="form-label">Investigations</label>
        <textarea
          className="form-textarea"
          value={formData.investigations}
          onChange={(e) => handleInputChange('investigations', e.target.value)}
          placeholder="Order lab tests, imaging, etc..."
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Follow-up After (days)</label>
          <input
            type="number"
            className="form-input"
            value={formData.followupAfter}
            onChange={(e) => handleInputChange('followupAfter', e.target.value)}
            placeholder="7"
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">General Advice</label>
        <textarea
          className="form-textarea"
          value={formData.generalAdvice}
          onChange={(e) => handleInputChange('generalAdvice', e.target.value)}
          placeholder="General advice and lifestyle recommendations..."
        />
      </div>
      <div className="form-group">
        <label className="form-label">Red Flag Symptoms to Watch</label>
        <textarea
          className="form-textarea"
          value={formData.redFlagSymptoms}
          onChange={(e) => handleInputChange('redFlagSymptoms', e.target.value)}
          placeholder="Warning signs to watch for..."
        />
      </div>
      <div className="btn-group">
        <button className="btn btn-success">Complete Consultation</button>
        <button className="btn btn-primary">Save & Continue Later</button>
      </div>
    </div>
  )

  const renderSection = () => {
    switch (activeSection) {
      case 'vitals': return renderVitals()
      case 'symptoms': return renderSymptoms()
      case 'examination': return renderExamination()
      case 'diagnosis': return renderDiagnosis()
      case 'treatment': return renderTreatment()
      default: return renderVitals()
    }
  }

  return (
    <div className="screen-content">
      <div style={{
        background: '#f0f9ff',
        padding: '16px',
        borderRadius: '12px',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ color: '#1e3a8a', marginBottom: '4px' }}>
              Current Patient: <span>{patient.patientName}</span>
            </h3>
            <span style={{ color: '#64748b' }}>
              Age: {patient.age} | Gender: {patient.gender} | Token: {patient.tokenNumber}
            </span>
          </div>
          <button className="btn btn-danger btn-small" onClick={onClose}>
            End Consultation
          </button>
        </div>
      </div>

      {/* Consultation Navigation */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        overflowX: 'auto'
      }}>
        {consultationSections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`consultation-nav-btn ${activeSection === section.id ? 'active' : ''}`}
            style={{
              padding: '12px 20px',
              border: activeSection === section.id ? '2px solid #1e3a8a' : '2px solid #e2e8f0',
              borderRadius: '8px',
              background: activeSection === section.id ? '#f0f9ff' : 'white',
              color: activeSection === section.id ? '#1e3a8a' : '#64748b',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {section.icon} {section.label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      {renderSection()}
    </div>
  )
}