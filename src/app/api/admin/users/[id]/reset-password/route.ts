import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 })
    }

    // Default password
    const defaultPassword = 'password123'
    const hashedPassword = await bcrypt.hash(defaultPassword, 12)

    const user = await prisma.user.update({
      where: {
        id: params.id
      },
      data: {
        password: hashedPassword
      }
    })

    return NextResponse.json({ 
      message: 'Password reset successfully',
      newPassword: defaultPassword
    })
  } catch (error) {
    console.error('Error resetting password:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}