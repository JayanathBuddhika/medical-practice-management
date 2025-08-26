import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 })
    }

    // Create a comprehensive backup of all data
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      data: {
        users: await prisma.user.findMany({
          include: {
            doctorProfile: true
          }
        }),
        patients: await prisma.patient.findMany(),
        consultations: await prisma.consultation.findMany({
          include: {
            vitals: true
          }
        }),
        appointments: await prisma.appointment.findMany(),
        prescriptions: await prisma.prescription.findMany({
          include: {
            items: true
          }
        }),
        investigations: await prisma.investigation.findMany(),
        bills: await prisma.bill.findMany(),
        prescriptionTemplates: await prisma.prescriptionTemplate.findMany({
          include: {
            items: true
          }
        })
      }
    }

    // Remove sensitive information
    backup.data.users = backup.data.users.map(user => ({
      ...user,
      password: '[REDACTED]'
    }))

    // Convert to JSON string
    const backupJson = JSON.stringify(backup, null, 2)
    
    // Return as downloadable file
    return new NextResponse(backupJson, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="medicare-backup-${new Date().toISOString().split('T')[0]}.json"`,
      },
    })
  } catch (error) {
    console.error('Error creating backup:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}