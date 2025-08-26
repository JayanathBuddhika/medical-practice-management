import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 })
    }

    const body = await request.json()
    const { isActive, name, phone, email } = body

    // Prevent admin from deactivating themselves if they're the only admin
    if (isActive === false && session.user.id === params.id) {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN', isActive: true }
      })
      
      if (adminCount === 1) {
        return NextResponse.json({ error: 'Cannot deactivate the last admin user' }, { status: 400 })
      }
    }

    const user = await prisma.user.update({
      where: {
        id: params.id
      },
      data: {
        ...(isActive !== undefined && { isActive }),
        ...(name && { name }),
        ...(phone && { phone }),
        ...(email && { email })
      },
      include: {
        doctorProfile: true
      }
    })

    return NextResponse.json({
      ...user,
      password: undefined
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 })
    }

    // Prevent admin from deleting themselves if they're the only admin
    const user = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.role === 'ADMIN') {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN', isActive: true }
      })
      
      if (adminCount === 1) {
        return NextResponse.json({ error: 'Cannot delete the last admin user' }, { status: 400 })
      }
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}