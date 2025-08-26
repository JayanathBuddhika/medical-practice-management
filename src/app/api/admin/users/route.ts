import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 })
    }

    const users = await prisma.user.findMany({
      include: {
        doctorProfile: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Remove passwords from response
    const sanitizedUsers = users.map(user => ({
      ...user,
      password: undefined
    }))

    return NextResponse.json(sanitizedUsers)
  } catch (error) {
    console.error('Error fetching users:', error)
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
    const { 
      email, 
      name, 
      role, 
      phone, 
      password,
      // Doctor specific fields
      licenseNumber,
      specialization,
      qualification,
      experience,
      consultationFee
    } = body

    // Validate required fields
    if (!email || !name || !role || !password) {
      return NextResponse.json({ error: 'Email, name, role, and password are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 })
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role,
        phone,
        password: hashedPassword,
        isActive: true
      }
    })

    // If it's a doctor, create doctor profile
    if (role === 'DOCTOR') {
      if (!licenseNumber || !specialization || !qualification || experience === undefined) {
        // Delete the created user if doctor profile creation fails
        await prisma.user.delete({ where: { id: user.id } })
        return NextResponse.json({ 
          error: 'License number, specialization, qualification, and experience are required for doctors' 
        }, { status: 400 })
      }

      await prisma.doctor.create({
        data: {
          userId: user.id,
          licenseNumber,
          specialization,
          qualification,
          experience: parseInt(experience),
          consultationFee: consultationFee || 500
        }
      })
    }

    // Fetch the created user with doctor profile if applicable
    const createdUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        doctorProfile: true
      }
    })

    return NextResponse.json({
      ...createdUser,
      password: undefined
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}