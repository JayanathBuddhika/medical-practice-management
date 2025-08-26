'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Navigation } from '@/components/layout/Navigation'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { ConsultationWorkflow } from '@/components/consultation/ConsultationWorkflow'
import { PrescriptionModule } from '@/components/prescriptions/PrescriptionModule'
import { InvestigationModule } from '@/components/investigations/InvestigationModule'
import { BillingModule } from '@/components/billing/BillingModule'
import { PatientRecordsModule } from '@/components/patients/PatientRecordsModule'
import { ReportsModule } from '@/components/reports/ReportsModule'
import { AppointmentsModule } from '@/components/appointments/AppointmentsModule'
import { AdminModule } from '@/components/admin/AdminModule'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [currentPatient, setCurrentPatient] = useState<any>(null)

  const handleStartConsultation = (patient: any) => {
    setCurrentPatient(patient)
    setActiveTab('consultation')
  }

  const handleEndConsultation = () => {
    setCurrentPatient(null)
    setActiveTab('dashboard')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onStartConsultation={handleStartConsultation} />
      case 'admin':
        return <AdminModule />
      case 'appointments':
        return <AppointmentsModule />
      case 'consultation':
        return <ConsultationWorkflow patient={currentPatient} onClose={handleEndConsultation} />
      case 'prescriptions':
        return <PrescriptionModule />
      case 'investigations':
        return <InvestigationModule />
      case 'billing':
        return <BillingModule />
      case 'patients':
        return <PatientRecordsModule />
      case 'reports':
        return <ReportsModule />
      default:
        return <Dashboard onStartConsultation={handleStartConsultation} />
    }
  }

  return (
    <AppLayout>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div className={`screen ${activeTab ? 'active' : ''}`}>
        {renderContent()}
      </div>
    </AppLayout>
  )
}