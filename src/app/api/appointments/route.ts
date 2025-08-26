import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    
    let where: any = {}
    
    if (date) {
      const startDate = new Date(date + 'T00:00:00.000Z')
      const endDate = new Date(date + 'T23:59:59.999Z')
      
      where.appointmentDate = {
        gte: startDate,
        lte: endDate
      }
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: true,
        doctor: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        appointmentDate: 'asc'
      }
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      patientId, 
      appointmentDate, 
      timeSlot, 
      purpose, 
      notes, 
      priority = 'NORMAL',
      doctorId 
    } = body

    // Generate token number
    const todayStart = new Date(appointmentDate)
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date(appointmentDate)
    todayEnd.setHours(23, 59, 59, 999)

    const existingAppointments = await prisma.appointment.count({
      where: {
        appointmentDate: {
          gte: todayStart,
          lte: todayEnd
        }
      }
    })

    const tokenNumber = `T${String(existingAppointments + 1).padStart(3, '0')}`

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId: doctorId || null,
        appointmentDate: new Date(appointmentDate),
        timeSlot,
        purpose,
        notes,
        priority,
        tokenNumber,
        createdById: session.user.id,
        status: 'SCHEDULED'
      },
      include: {
        patient: true,
        doctor: {
          include: {
            user: true
          }
        }
      }
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}