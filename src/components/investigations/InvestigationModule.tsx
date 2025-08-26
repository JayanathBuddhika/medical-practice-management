'use client'

import { useState, useEffect } from 'react'

interface Investigation {
  id: string
  patientName: string
  patientId: string
  testName: string
  testType: 'LAB' | 'IMAGING' | 'CARDIOLOGY' | 'PULMONARY'
  labName: string
  status: 'ORDERED' | 'SAMPLE_COLLECTED' | 'IN_PROGRESS' | 'COMPLETED'
  orderedDate: string
  resultDate?: string
  findings?: string
  reportUrl?: string
  doctorNotes?: string
  urgency: 'ROUTINE' | 'URGENT' | 'STAT'
}

const testCategories = {
  LAB: [
    'Complete Blood Count (CBC)',
    'Blood Sugar (Fasting)',
    'Blood Sugar (Random)',
    'HbA1c',
    'Lipid Profile',
    'Liver Function Test (LFT)',
    'Kidney Function Test (KFT)',
    'Thyroid Function Test (TFT)',
    'Urine Routine',
    'ESR',
    'CRP',
    'Vitamin D',
    'Vitamin B12'
  ],
  IMAGING: [
    'Chest X-Ray',
    'Abdominal X-Ray',
    'CT Scan - Head',
    'CT Scan - Chest',
    'CT Scan - Abdomen',
    'MRI - Brain',
    'MRI - Spine',
    'Ultrasound - Abdomen',
    'Ultrasound - Pelvis',
    'Mammography',
    'DEXA Scan'
  ],
  CARDIOLOGY: [
    'ECG (Electrocardiogram)',
    'Echocardiogram',
    '24-Hour Holter Monitor',
    'Stress Test',
    'Angiography'
  ],
  PULMONARY: [
    'Pulmonary Function Test',
    'Arterial Blood Gas',
    'Sleep Study'
  ]
}

const labPartners = [
  'PathLab Diagnostics',
  'Dr. Lal Labs',
  'Thyrocare',
  'SRL Diagnostics',
  'Metropolis Healthcare'
]

export function InvestigationModule() {
  const [activeView, setActiveView] = useState<'new' | 'pending' | 'completed'>('new')
  const [investigations, setInvestigations] = useState<Investigation[]>([])
  const [newInvestigation, setNewInvestigation] = useState({
    patientName: '',
    patientId: '',
    testName: '',
    testType: 'LAB' as const,
    labName: '',
    urgency: 'ROUTINE' as const,
    clinicalNotes: ''
  })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Load sample investigations
    const sampleInvestigations: Investigation[] = [
      {
        id: '1',
        patientName: 'Rajesh Kumar',
        patientId: 'PT2025001',
        testName: 'Complete Blood Count (CBC)',
        testType: 'LAB',
        labName: 'PathLab Diagnostics',
        status: 'COMPLETED',
        orderedDate: '2025-01-20',
        resultDate: '2025-01-21',
        urgency: 'ROUTINE',
        findings: 'Hemoglobin: 12.5 g/dL (Normal), WBC: 7,200/μL (Normal), Platelets: 2,50,000/μL (Normal)',
        doctorNotes: 'All parameters within normal limits'
      },
      {
        id: '2',
        patientName: 'Priya Sharma',
        patientId: 'PT2025002',
        testName: 'Chest X-Ray',
        testType: 'IMAGING',
        labName: 'SRL Diagnostics',
        status: 'IN_PROGRESS',
        orderedDate: '2025-01-22',
        urgency: 'URGENT'
      },
      {
        id: '3',
        patientName: 'Ahmed Ali',
        patientId: 'PT2025003',
        testName: 'Thyroid Function Test (TFT)',
        testType: 'LAB',
        labName: 'Thyrocare',
        status: 'SAMPLE_COLLECTED',
        orderedDate: '2025-01-22',
        urgency: 'ROUTINE'
      }
    ]
    setInvestigations(sampleInvestigations)
  }, [])

  const orderInvestigation = () => {
    const investigation: Investigation = {
      id: Date.now().toString(),
      ...newInvestigation,
      status: 'ORDERED',
      orderedDate: new Date().toISOString().split('T')[0]
    }
    setInvestigations(prev => [investigation, ...prev])
    setNewInvestigation({
      patientName: '',
      patientId: '',
      testName: '',
      testType: 'LAB',
      labName: '',
      urgency: 'ROUTINE',
      clinicalNotes: ''
    })
  }

  const updateInvestigationStatus = (id: string, status: Investigation['status'], findings?: string, doctorNotes?: string) => {
    setInvestigations(prev => prev.map(inv => 
      inv.id === id 
        ? { 
            ...inv, 
            status,
            resultDate: status === 'COMPLETED' ? new Date().toISOString().split('T')[0] : inv.resultDate,
            findings: findings || inv.findings,
            doctorNotes: doctorNotes || inv.doctorNotes
          }
        : inv
    ))
  }

  const getStatusColor = (status: Investigation['status']) => {
    switch (status) {
      case 'ORDERED': return '#fbbf24'
      case 'SAMPLE_COLLECTED': return '#3b82f6'
      case 'IN_PROGRESS': return '#8b5cf6'
      case 'COMPLETED': return '#10b981'
    }
  }

  const getUrgencyColor = (urgency: Investigation['urgency']) => {
    switch (urgency) {
      case 'ROUTINE': return '#64748b'
      case 'URGENT': return '#f59e0b'
      case 'STAT': return '#ef4444'
    }
  }

  const filteredInvestigations = investigations.filter(inv => {
    const matchesSearch = inv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inv.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inv.testName.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (activeView === 'pending') {
      return matchesSearch && inv.status !== 'COMPLETED'
    } else if (activeView === 'completed') {
      return matchesSearch && inv.status === 'COMPLETED'
    }
    return matchesSearch
  })

  const renderNewInvestigation = () => (
    <div>
      <h3 style={{ color: '#1e3a8a', marginBottom: '24px' }}>Order New Investigation</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Patient Name</label>
          <input
            type="text"
            className="form-input"
            value={newInvestigation.patientName}
            onChange={(e) => setNewInvestigation(prev => ({ ...prev, patientName: e.target.value }))}
            placeholder="Enter patient name"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Patient ID</label>
          <input
            type="text"
            className="form-input"
            value={newInvestigation.patientId}
            onChange={(e) => setNewInvestigation(prev => ({ ...prev, patientId: e.target.value }))}
            placeholder="Enter patient ID"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Test Category</label>
          <select
            className="form-select"
            value={newInvestigation.testType}
            onChange={(e) => setNewInvestigation(prev => ({ ...prev, testType: e.target.value as any, testName: '' }))}
          >
            <option value="LAB">Laboratory Tests</option>
            <option value="IMAGING">Imaging Studies</option>
            <option value="CARDIOLOGY">Cardiology Tests</option>
            <option value="PULMONARY">Pulmonary Tests</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Test Name</label>
          <select
            className="form-select"
            value={newInvestigation.testName}
            onChange={(e) => setNewInvestigation(prev => ({ ...prev, testName: e.target.value }))}
          >
            <option value="">Select test</option>
            {testCategories[newInvestigation.testType].map(test => (
              <option key={test} value={test}>{test}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Lab/Center</label>
          <select
            className="form-select"
            value={newInvestigation.labName}
            onChange={(e) => setNewInvestigation(prev => ({ ...prev, labName: e.target.value }))}
          >
            <option value="">Select lab</option>
            {labPartners.map(lab => (
              <option key={lab} value={lab}>{lab}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Urgency</label>
          <select
            className="form-select"
            value={newInvestigation.urgency}
            onChange={(e) => setNewInvestigation(prev => ({ ...prev, urgency: e.target.value as any }))}
          >
            <option value="ROUTINE">Routine</option>
            <option value="URGENT">Urgent</option>
            <option value="STAT">STAT</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Clinical Notes</label>
        <textarea
          className="form-textarea"
          value={newInvestigation.clinicalNotes}
          onChange={(e) => setNewInvestigation(prev => ({ ...prev, clinicalNotes: e.target.value }))}
          placeholder="Clinical indication and notes for the lab..."
        />
      </div>

      <button className="btn btn-primary" onClick={orderInvestigation}>
        Order Investigation
      </button>
    </div>
  )

  const renderInvestigationList = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ color: '#1e3a8a' }}>
          {activeView === 'pending' ? 'Pending Investigations' : 'Completed Investigations'}
        </h3>
        <input
          type="text"
          className="form-input"
          placeholder="Search investigations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {filteredInvestigations.map(investigation => (
          <div key={investigation.id} className="dashboard-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h4 style={{ color: '#1e3a8a', marginBottom: '4px' }}>{investigation.patientName}</h4>
                <p style={{ color: '#64748b', fontSize: '14px' }}>ID: {investigation.patientId}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span 
                  className="status-badge"
                  style={{ 
                    background: getStatusColor(investigation.status) + '20',
                    color: getStatusColor(investigation.status),
                    border: `1px solid ${getStatusColor(investigation.status)}40`
                  }}
                >
                  {investigation.status.replace('_', ' ')}
                </span>
                <span 
                  style={{ 
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: getUrgencyColor(investigation.urgency) + '20',
                    color: getUrgencyColor(investigation.urgency)
                  }}
                >
                  {investigation.urgency}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                {investigation.testName}
              </div>
              <div style={{ color: '#64748b', fontSize: '14px' }}>
                {investigation.labName} • Ordered: {investigation.orderedDate}
                {investigation.resultDate && ` • Result: ${investigation.resultDate}`}
              </div>
            </div>

            {investigation.findings && (
              <div style={{ 
                padding: '12px', 
                background: '#f0f9ff', 
                borderRadius: '8px',
                marginBottom: '12px'
              }}>
                <div style={{ fontWeight: '600', color: '#1e3a8a', marginBottom: '4px' }}>Findings:</div>
                <div style={{ fontSize: '14px', color: '#374151' }}>{investigation.findings}</div>
              </div>
            )}

            {investigation.doctorNotes && (
              <div style={{ 
                padding: '12px', 
                background: '#f8fafc', 
                borderRadius: '8px',
                marginBottom: '12px'
              }}>
                <div style={{ fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Doctor's Notes:</div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>{investigation.doctorNotes}</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              {investigation.status !== 'COMPLETED' && (
                <>
                  <button 
                    className="btn btn-primary btn-small"
                    onClick={() => updateInvestigationStatus(investigation.id, 'SAMPLE_COLLECTED')}
                  >
                    Mark Collected
                  </button>
                  <button 
                    className="btn btn-warning btn-small"
                    onClick={() => updateInvestigationStatus(investigation.id, 'IN_PROGRESS')}
                  >
                    In Progress
                  </button>
                  <button 
                    className="btn btn-success btn-small"
                    onClick={() => updateInvestigationStatus(
                      investigation.id, 
                      'COMPLETED',
                      'Results available - please review',
                      'Results reviewed and documented'
                    )}
                  >
                    Complete
                  </button>
                </>
              )}
              {investigation.status === 'COMPLETED' && (
                <button className="btn btn-secondary btn-small">
                  View Report
                </button>
              )}
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
          🔬 Order New
        </button>
        <button
          className={`tab-btn ${activeView === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveView('pending')}
        >
          ⏳ Pending ({investigations.filter(i => i.status !== 'COMPLETED').length})
        </button>
        <button
          className={`tab-btn ${activeView === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveView('completed')}
        >
          ✅ Completed ({investigations.filter(i => i.status === 'COMPLETED').length})
        </button>
      </div>

      {/* Content */}
      {activeView === 'new' ? renderNewInvestigation() : renderInvestigationList()}
    </div>
  )
}