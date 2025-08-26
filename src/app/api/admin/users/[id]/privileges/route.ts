import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { privileges } = body

    if (!Array.isArray(privileges)) {
      return NextResponse.json(
        { error: 'Invalid privileges array' },
        { status: 400 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id },
      include: { userPrivileges: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Delete all existing privileges for the user
    await prisma.userPrivilege.deleteMany({
      where: { userId: id }
    })

    // Create new privileges
    if (privileges.length > 0) {
      await prisma.userPrivilege.createMany({
        data: privileges.map((privilege: string) => ({
          userId: id,
          privilege,
          granted: true,
          grantedBy: session.user.id
        }))
      })
    }

    // Fetch updated user with privileges
    const updatedUser = await prisma.user.findUnique({
      where: { id },
      include: { userPrivileges: true }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user privileges:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}