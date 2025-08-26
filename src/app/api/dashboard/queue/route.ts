import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { formatTime, calculateAge } from '@/lib/utils'

export async function GET() {
  try {
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    const consultations = await prisma.consultation.findMany({
      where: {
        scheduledTime: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: {
          in: ['WAITING', 'IN_PROGRESS']
        }
      },
      include: {
        patient: true
      },
      orderBy: {
        scheduledTime: 'asc'
      }
    })

    const queue = consultations.map(consultation => ({
      id: consultation.id,
      tokenNumber: consultation.tokenNumber,
      time: formatTime(consultation.scheduledTime),
      patientName: `${consultation.patient.firstName} ${consultation.patient.lastName}`,
      age: calculateAge(consultation.patient.dateOfBirth),
      gender: consultation.patient.gender === 'MALE' ? 'M' : consultation.patient.gender === 'FEMALE' ? 'F' : 'O',
      visitType: consultation.visitType.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
      status: consultation.status
    }))

    return NextResponse.json(queue)
  } catch (error) {
    console.error('Queue error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch queue' },
      { status: 500 }
    )
  }
}