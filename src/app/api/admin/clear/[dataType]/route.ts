import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { dataType: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 })
    }

    const { dataType } = params

    switch (dataType) {
      case 'appointments':
        await prisma.appointment.deleteMany()
        return NextResponse.json({ message: 'All appointments cleared successfully' })
      
      case 'consultations':
        // Delete in order due to foreign key constraints
        await prisma.bill.deleteMany()
        await prisma.investigation.deleteMany()
        await prisma.prescriptionItem.deleteMany()
        await prisma.prescription.deleteMany()
        await prisma.vitals.deleteMany()
        await prisma.consultation.deleteMany()
        return NextResponse.json({ message: 'All consultations and related data cleared successfully' })
      
      case 'bills':
        await prisma.bill.deleteMany()
        return NextResponse.json({ message: 'All bills cleared successfully' })
      
      case 'investigations':
        await prisma.investigation.deleteMany()
        return NextResponse.json({ message: 'All investigations cleared successfully' })
      
      case 'prescriptions':
        await prisma.prescriptionItem.deleteMany()
        await prisma.prescription.deleteMany()
        return NextResponse.json({ message: 'All prescriptions cleared successfully' })
      
      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 })
    }
  } catch (error) {
    console.error(`Error clearing ${params.dataType}:`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}