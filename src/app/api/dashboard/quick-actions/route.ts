import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { formatTime } from '@/lib/utils'

export async function GET() {
  try {
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    // Get today's consultations for summary
    const todayConsultations = await prisma.consultation.findMany({
      where: {
        scheduledTime: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      include: {
        patient: true
      }
    })

    const newPatients = todayConsultations.filter(c => c.visitType === 'NEW_VISIT').length
    const followUps = todayConsultations.filter(c => c.visitType === 'FOLLOW_UP').length

    // Calculate average consultation time (mock for now)
    const avgConsultationTime = '12 mins'

    // Get recent prescriptions
    const recentPrescriptions = await prisma.prescription.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      include: {
        patient: true,
        items: {
          take: 2
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 2
    })

    const prescriptions = recentPrescriptions.map(prescription => ({
      patientName: `${prescription.patient.firstName} ${prescription.patient.lastName}`,
      medications: prescription.items.map(item => item.drugName.split(' ')[0]).join(', '),
      time: formatTime(prescription.createdAt)
    }))

    // Get pending reports
    const pendingReports = await prisma.investigation.findMany({
      where: {
        status: {
          in: ['PENDING', 'PROCESSING']
        }
      },
      include: {
        patient: true
      },
      orderBy: {
        orderedAt: 'desc'
      },
      take: 2
    })

    const reports = pendingReports.map(report => ({
      patientName: `${report.patient.firstName} ${report.patient.lastName}`,
      tests: report.testName,
      dueDate: report.status === 'PENDING' ? 'Due Today' : 'Processing'
    }))

    const quickActions = {
      todaySummary: {
        newPatients,
        followUps,
        avgConsultationTime
      },
      recentPrescriptions: prescriptions,
      pendingReports: reports
    }

    return NextResponse.json(quickActions)
  } catch (error) {
    console.error('Quick actions error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quick actions data' },
      { status: 500 }
    )
  }
}