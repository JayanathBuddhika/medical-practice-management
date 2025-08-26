interface QueueItem {
  id: string
  tokenNumber: string
  time: string
  patientName: string
  age: number
  gender: string
  visitType: string
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED'
}

interface PatientQueueProps {
  queue: QueueItem[]
  onStartConsultation: (patient: QueueItem) => void
  onContinueConsultation: (patient: QueueItem) => void
}

export function PatientQueue({ queue, onStartConsultation, onContinueConsultation }: PatientQueueProps) {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return 'status-badge status-in-progress'
      case 'COMPLETED': return 'status-badge status-completed'
      case 'WAITING': return 'status-badge status-pending'
      default: return 'status-badge'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return 'In Consultation'
      case 'COMPLETED': return 'Completed'
      case 'WAITING': return 'Waiting'
      default: return status
    }
  }

  return (
    <>
      <h2 style={{color: '#1e3a8a', margin: '32px 0 24px'}}>Current Queue</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Time</th>
            <th>Patient</th>
            <th>Age/Gender</th>
            <th>Visit Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {queue.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.tokenNumber}</td>
              <td>{patient.time}</td>
              <td>{patient.patientName}</td>
              <td>{patient.age}/{patient.gender}</td>
              <td>{patient.visitType}</td>
              <td>
                <span className={getStatusClass(patient.status)}>
                  {getStatusLabel(patient.status)}
                </span>
              </td>
              <td>
                {patient.status === 'IN_PROGRESS' ? (
                  <button
                    className="btn btn-primary btn-small"
                    onClick={() => onContinueConsultation(patient)}
                  >
                    Continue
                  </button>
                ) : patient.status === 'WAITING' ? (
                  <button
                    className="btn btn-success btn-small"
                    onClick={() => onStartConsultation(patient)}
                  >
                    Start
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}