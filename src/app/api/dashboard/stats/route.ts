import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    // Get today's consultations
    const todayConsultations = await prisma.consultation.findMany({
      where: {
        scheduledTime: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    })

    // Get completed consultations today
    const completedToday = todayConsultations.filter(c => c.status === 'COMPLETED').length
    const remainingToday = todayConsultations.filter(c => c.status !== 'COMPLETED').length

    // Get today's revenue from bills
    const todayBills = await prisma.bill.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        },
        paymentStatus: 'PAID'
      }
    })

    const todayRevenue = todayBills.reduce((sum, bill) => sum + bill.paidAmount, 0)

    const stats = {
      todayPatients: todayConsultations.length,
      completed: completedToday,
      remaining: remainingToday,
      revenue: todayRevenue
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}