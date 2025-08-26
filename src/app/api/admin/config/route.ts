import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Default system configuration
const defaultConfig = {
  clinicName: 'MediCare Private Practice',
  clinicAddress: '123 Medical Street, Healthcare City, HC 12345',
  clinicPhone: '+91 98765 43210',
  clinicEmail: 'contact@medicare.com',
  licenseNumber: 'CLINIC-2024-001',
  defaultConsultationFee: 500,
  workingHours: {
    start: '09:00',
    end: '18:00',
    breakStart: '13:00',
    breakEnd: '14:00'
  },
  appointmentSlotDuration: 30,
  taxRate: 18,
  currency: '₹',
  timezone: 'Asia/Kolkata'
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 })
    }

    // For now, return default config
    // In a real app, this would be stored in database
    return NextResponse.json(defaultConfig)
  } catch (error) {
    console.error('Error fetching system config:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate the configuration data
    const {
      clinicName,
      clinicAddress,
      clinicPhone,
      clinicEmail,
      licenseNumber,
      defaultConsultationFee,
      workingHours,
      appointmentSlotDuration,
      taxRate,
      currency,
      timezone
    } = body

    // Basic validation
    if (!clinicName || !clinicAddress || !clinicPhone || !clinicEmail) {
      return NextResponse.json({ error: 'Clinic name, address, phone, and email are required' }, { status: 400 })
    }

    // For now, we'll just return success
    // In a real app, this would be saved to database
    console.log('System configuration updated:', body)
    
    return NextResponse.json({ 
      message: 'Configuration updated successfully',
      config: body
    })
  } catch (error) {
    console.error('Error updating system config:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}