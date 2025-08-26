import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/roles - Get all role privileges
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 })
    }

    const rolePrivileges = await prisma.rolePrivilege.findMany({
      orderBy: {
        role: 'asc'
      }
    })

    // Group privileges by role
    const rolesWithPrivileges = rolePrivileges.reduce((acc, rp) => {
      if (!acc[rp.role]) {
        acc[rp.role] = []
      }
      acc[rp.role].push(rp.privilege)
      return acc
    }, {} as Record<string, string[]>)

    // Include default roles even if no privileges are set
    const allRoles = ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST']
    allRoles.forEach(role => {
      if (!rolesWithPrivileges[role]) {
        rolesWithPrivileges[role] = []
      }
    })

    return NextResponse.json(rolesWithPrivileges)
  } catch (error) {
    console.error('Error fetching role privileges:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/roles - Update role privileges
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 })
    }

    const body = await request.json()
    const { role, privileges } = body

    if (!role || !Array.isArray(privileges)) {
      return NextResponse.json({ error: 'Role and privileges array are required' }, { status: 400 })
    }

    // Validate role
    const validRoles = ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST']
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Delete existing role privileges
    await prisma.rolePrivilege.deleteMany({
      where: { role }
    })

    // Create new role privileges
    if (privileges.length > 0) {
      await prisma.rolePrivilege.createMany({
        data: privileges.map((privilege: string) => ({
          role,
          privilege,
          isDefault: true
        }))
      })
    }

    // Update existing users with this role to have the new default privileges
    const usersWithRole = await prisma.user.findMany({
      where: { role },
      include: { userPrivileges: true }
    })

    for (const user of usersWithRole) {
      // Delete existing privileges for this user
      await prisma.userPrivilege.deleteMany({
        where: { userId: user.id }
      })

      // Add new default privileges
      if (privileges.length > 0) {
        await prisma.userPrivilege.createMany({
          data: privileges.map((privilege: string) => ({
            userId: user.id,
            privilege,
            granted: true,
            grantedBy: session.user.id
          }))
        })
      }
    }

    return NextResponse.json({ message: 'Role privileges updated successfully' })
  } catch (error) {
    console.error('Error updating role privileges:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}