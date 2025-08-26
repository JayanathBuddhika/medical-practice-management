import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.bill.deleteMany()
  await prisma.investigation.deleteMany()
  await prisma.prescriptionItem.deleteMany()
  await prisma.prescription.deleteMany()
  await prisma.vitals.deleteMany()
  await prisma.consultation.deleteMany()
  await prisma.patient.deleteMany()
  await prisma.doctor.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  console.log('🧹 Cleared existing data')

  // Create demo users
  const hashedPassword = await bcrypt.hash('password123', 12)

  const doctorUser = await prisma.user.create({
    data: {
      email: 'doctor@medicare.com',
      password: hashedPassword,
      name: 'Dr. Sarah Smith',
      role: 'DOCTOR',
      phone: '+91 98765 43210'
    }
  })

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@medicare.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      phone: '+91 98765 43211'
    }
  })

  const nurseUser = await prisma.user.create({
    data: {
      email: 'nurse@medicare.com',
      password: hashedPassword,
      name: 'Nurse Mary Johnson',
      role: 'NURSE',
      phone: '+91 98765 43212'
    }
  })

  const receptionistUser = await prisma.user.create({
    data: {
      email: 'receptionist@medicare.com',
      password: hashedPassword,
      name: 'Receptionist John Smith',
      role: 'RECEPTIONIST',
      phone: '+91 98765 43213'
    }
  })

  console.log('👥 Created demo users')

  // Create doctor profile
  const doctor = await prisma.doctor.create({
    data: {
      userId: doctorUser.id,
      licenseNumber: 'MED123456',
      specialization: 'General Medicine',
      qualification: 'MBBS, MD',
      experience: 15,
      consultationFee: 500
    }
  })

  console.log('👨‍⚕️ Created doctor profile')

  // Create sample patients with more comprehensive data
  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        patientId: 'PT2025001',
        firstName: 'Rajesh',
        lastName: 'Kumar',
        dateOfBirth: new Date('1978-05-15'),
        gender: 'MALE',
        phone: '+91 98765 11111',
        email: 'rajesh.kumar@email.com',
        address: '123 Main Street, Andheri West, Mumbai - 400058',
        bloodGroup: 'B_POSITIVE',
        allergies: 'Penicillin, Sulfa drugs',
        emergency: 'Wife: Sunita Kumar, +91 98765 11112',
        createdById: doctorUser.id
      }
    }),
    prisma.patient.create({
      data: {
        patientId: 'PT2025002',
        firstName: 'Priya',
        lastName: 'Sharma',
        dateOfBirth: new Date('1991-08-22'),
        gender: 'FEMALE',
        phone: '+91 98765 22222',
        email: 'priya.sharma@email.com',
        address: '456 Park Avenue, Karol Bagh, Delhi - 110005',
        bloodGroup: 'O_POSITIVE',
        allergies: 'None known',
        emergency: 'Husband: Amit Sharma, +91 98765 22223',
        createdById: doctorUser.id
      }
    }),
    prisma.patient.create({
      data: {
        patientId: 'PT2025003',
        firstName: 'Ahmed',
        lastName: 'Ali',
        dateOfBirth: new Date('1995-03-10'),
        gender: 'MALE',
        phone: '+91 98765 33333',
        email: 'ahmed.ali@email.com',
        address: '789 Lake View, Whitefield, Bangalore - 560066',
        bloodGroup: 'A_POSITIVE',
        allergies: 'Dust mites, Pollen, Shellfish',
        emergency: 'Father: Rashid Ali, +91 98765 33334',
        createdById: doctorUser.id
      }
    }),
    prisma.patient.create({
      data: {
        patientId: 'PT2025004',
        firstName: 'Sarah',
        lastName: 'Johnson',
        dateOfBirth: new Date('1985-12-05'),
        gender: 'FEMALE',
        phone: '+91 98765 44444',
        email: 'sarah.johnson@email.com',
        address: '321 Hill Road, T Nagar, Chennai - 600017',
        bloodGroup: 'AB_POSITIVE',
        allergies: 'Latex, Iodine contrast',
        emergency: 'Sister: Mary Johnson, +91 98765 44445',
        createdById: doctorUser.id
      }
    }),
    prisma.patient.create({
      data: {
        patientId: 'PT2025005',
        firstName: 'Michael',
        lastName: 'Brown',
        dateOfBirth: new Date('1970-07-18'),
        gender: 'MALE',
        phone: '+91 98765 55555',
        email: 'michael.brown@email.com',
        address: '654 Garden Street, Koregaon Park, Pune - 411001',
        bloodGroup: 'O_NEGATIVE',
        allergies: 'Shellfish, Aspirin',
        emergency: 'Wife: Linda Brown, +91 98765 55556',
        createdById: doctorUser.id
      }
    }),
    // Additional patients for more realistic data
    prisma.patient.create({
      data: {
        patientId: 'PT2025006',
        firstName: 'Anita',
        lastName: 'Patel',
        dateOfBirth: new Date('1988-11-30'),
        gender: 'FEMALE',
        phone: '+91 98765 66666',
        email: 'anita.patel@email.com',
        address: '88 Commerce Street, Navrangpura, Ahmedabad - 380009',
        bloodGroup: 'B_NEGATIVE',
        allergies: 'Egg proteins, Milk products',
        emergency: 'Mother: Kiran Patel, +91 98765 66667',
        createdById: doctorUser.id
      }
    }),
    prisma.patient.create({
      data: {
        patientId: 'PT2025007',
        firstName: 'Ravi',
        lastName: 'Gupta',
        dateOfBirth: new Date('1982-04-12'),
        gender: 'MALE',
        phone: '+91 98765 77777',
        email: 'ravi.gupta@email.com',
        address: '234 Industrial Area, Sector 18, Gurgaon - 122015',
        bloodGroup: 'A_NEGATIVE',
        allergies: 'Codeine, Morphine derivatives',
        emergency: 'Brother: Suresh Gupta, +91 98765 77778',
        createdById: doctorUser.id
      }
    }),
    prisma.patient.create({
      data: {
        patientId: 'PT2025008',
        firstName: 'Deepika',
        lastName: 'Singh',
        dateOfBirth: new Date('1993-09-25'),
        gender: 'FEMALE',
        phone: '+91 98765 88888',
        email: 'deepika.singh@email.com',
        address: '567 University Road, Rajajinagar, Bangalore - 560010',
        bloodGroup: 'O_POSITIVE',
        allergies: 'Bee stings, Peanuts',
        emergency: 'Husband: Vikram Singh, +91 98765 88889',
        createdById: doctorUser.id
      }
    })
  ])

  console.log('👥 Created sample patients')

  // Create consultations with more realistic scheduling
  const today = new Date()
  const consultations = await Promise.all([
    // In-progress consultation
    prisma.consultation.create({
      data: {
        patientId: patients[0].id,
        doctorId: doctor.id,
        tokenNumber: '#15',
        visitType: 'FOLLOW_UP',
        status: 'IN_PROGRESS',
        scheduledTime: new Date(today.setHours(11, 0, 0, 0)),
        startTime: new Date(today.setHours(11, 5, 0, 0)),
        chiefComplaints: 'Persistent cough and fever for 3 days',
        historyPresent: 'Patient complains of dry cough, low-grade fever, and fatigue. Symptoms started 3 days ago after exposure to cold weather.',
        provisionalDiagnosis: 'Upper Respiratory Tract Infection',
        finalDiagnosis: 'Viral Upper Respiratory Tract Infection',
        generalAdvice: 'Rest, adequate hydration, steam inhalation. Avoid cold drinks and foods.'
      }
    }),
    // Waiting consultations
    prisma.consultation.create({
      data: {
        patientId: patients[1].id,
        doctorId: doctor.id,
        tokenNumber: '#16',
        visitType: 'NEW_VISIT',
        status: 'WAITING',
        scheduledTime: new Date(today.setHours(11, 15, 0, 0))
      }
    }),
    prisma.consultation.create({
      data: {
        patientId: patients[2].id,
        doctorId: doctor.id,
        tokenNumber: '#17',
        visitType: 'REVIEW',
        status: 'WAITING',
        scheduledTime: new Date(today.setHours(11, 30, 0, 0))
      }
    }),
    prisma.consultation.create({
      data: {
        patientId: patients[5].id,
        doctorId: doctor.id,
        tokenNumber: '#18',
        visitType: 'NEW_VISIT',
        status: 'WAITING',
        scheduledTime: new Date(today.setHours(11, 45, 0, 0))
      }
    }),
    prisma.consultation.create({
      data: {
        patientId: patients[6].id,
        doctorId: doctor.id,
        tokenNumber: '#19',
        visitType: 'FOLLOW_UP',
        status: 'WAITING',
        scheduledTime: new Date(today.setHours(12, 0, 0, 0))
      }
    }),
    // Completed consultations
    prisma.consultation.create({
      data: {
        patientId: patients[3].id,
        doctorId: doctor.id,
        tokenNumber: '#13',
        visitType: 'NEW_VISIT',
        status: 'COMPLETED',
        scheduledTime: new Date(today.setHours(10, 0, 0, 0)),
        startTime: new Date(today.setHours(10, 5, 0, 0)),
        endTime: new Date(today.setHours(10, 20, 0, 0)),
        chiefComplaints: 'Routine health checkup',
        provisionalDiagnosis: 'General health assessment',
        finalDiagnosis: 'Healthy individual'
      }
    })
  ])

  console.log('🩺 Created consultations')

  // Create vitals for consultations
  await Promise.all([
    prisma.vitals.create({
      data: {
        consultationId: consultations[0].id,
        patientId: patients[0].id,
        bloodPressure: '130/85',
        pulseRate: 88,
        temperature: 99.2,
        weight: 75,
        height: 172,
        spo2: 98
      }
    }),
    prisma.vitals.create({
      data: {
        consultationId: consultations[3].id,
        patientId: patients[3].id,
        bloodPressure: '120/80',
        pulseRate: 72,
        temperature: 98.6,
        weight: 65,
        height: 165,
        spo2: 99
      }
    })
  ])

  console.log('📊 Created vitals')

  // Create prescriptions
  const prescriptions = await Promise.all([
    prisma.prescription.create({
      data: {
        consultationId: consultations[0].id,
        patientId: patients[0].id,
        doctorId: doctor.id
      }
    }),
    prisma.prescription.create({
      data: {
        consultationId: consultations[3].id,
        patientId: patients[3].id,
        doctorId: doctor.id
      }
    })
  ])

  // Create prescription items
  await Promise.all([
    prisma.prescriptionItem.create({
      data: {
        prescriptionId: prescriptions[0].id,
        drugName: 'Amoxicillin 500mg',
        dosage: '1-0-1',
        duration: '7 days',
        instructions: 'After food'
      }
    }),
    prisma.prescriptionItem.create({
      data: {
        prescriptionId: prescriptions[0].id,
        drugName: 'Paracetamol 650mg',
        dosage: '1-1-1',
        duration: '5 days',
        instructions: 'After food, SOS for fever'
      }
    }),
    prisma.prescriptionItem.create({
      data: {
        prescriptionId: prescriptions[0].id,
        drugName: 'Cetirizine 10mg',
        dosage: '0-0-1',
        duration: '5 days',
        instructions: 'After dinner'
      }
    }),
    prisma.prescriptionItem.create({
      data: {
        prescriptionId: prescriptions[1].id,
        drugName: 'Vitamin D3 60000 IU',
        dosage: '1-0-0',
        duration: '4 weeks',
        instructions: 'Once weekly with milk'
      }
    })
  ])

  console.log('💊 Created prescriptions')

  // Create investigations
  await Promise.all([
    prisma.investigation.create({
      data: {
        consultationId: consultations[1].id,
        patientId: patients[1].id,
        testName: 'Complete Blood Count',
        testType: 'BLOOD_TEST',
        labName: 'City Lab',
        status: 'PENDING'
      }
    }),
    prisma.investigation.create({
      data: {
        consultationId: consultations[1].id,
        patientId: patients[1].id,
        testName: 'Thyroid Profile',
        testType: 'BLOOD_TEST',
        labName: 'City Lab',
        status: 'PENDING'
      }
    }),
    prisma.investigation.create({
      data: {
        consultationId: consultations[2].id,
        patientId: patients[2].id,
        testName: 'Lipid Profile',
        testType: 'BLOOD_TEST',
        labName: 'Metro Diagnostics',
        status: 'PROCESSING'
      }
    }),
    prisma.investigation.create({
      data: {
        consultationId: consultations[3].id,
        patientId: patients[3].id,
        testName: 'Complete Blood Count',
        testType: 'BLOOD_TEST',
        labName: 'Central Lab',
        status: 'COMPLETED',
        resultDate: new Date(),
        findings: 'Hemoglobin: 13.5 g/dL (Normal), WBC: 7500/μL (Normal), Platelets: 280000/μL (Normal)'
      }
    })
  ])

  console.log('🔬 Created investigations')

  // Create bills
  await Promise.all([
    prisma.bill.create({
      data: {
        billNumber: 'BL25001',
        consultationId: consultations[3].id,
        patientId: patients[3].id,
        consultationFee: 500,
        procedureCharges: 0,
        otherCharges: 200,
        discount: 50,
        totalAmount: 650,
        paidAmount: 650,
        paymentMode: 'UPI',
        paymentStatus: 'PAID'
      }
    }),
    prisma.bill.create({
      data: {
        billNumber: 'BL25002',
        consultationId: consultations[0].id,
        patientId: patients[0].id,
        consultationFee: 500,
        procedureCharges: 0,
        otherCharges: 0,
        discount: 0,
        totalAmount: 500,
        paidAmount: 0,
        paymentStatus: 'PENDING'
      }
    })
  ])

  console.log('💰 Created bills')

  // Create prescription templates
  const templates = await Promise.all([
    prisma.prescriptionTemplate.create({
      data: {
        name: 'Common Cold',
        description: 'Standard treatment for common cold and flu symptoms'
      }
    }),
    prisma.prescriptionTemplate.create({
      data: {
        name: 'Gastritis',
        description: 'Treatment for gastritis and acid reflux'
      }
    }),
    prisma.prescriptionTemplate.create({
      data: {
        name: 'UTI',
        description: 'Urinary tract infection treatment'
      }
    })
  ])

  // Create prescription template items
  await Promise.all([
    // Common Cold template
    prisma.prescriptionTemplateItem.create({
      data: {
        templateId: templates[0].id,
        drugName: 'Paracetamol 650mg',
        dosage: '1-1-1',
        duration: '5 days',
        instructions: 'After food, SOS for fever'
      }
    }),
    prisma.prescriptionTemplateItem.create({
      data: {
        templateId: templates[0].id,
        drugName: 'Cetirizine 10mg',
        dosage: '0-0-1',
        duration: '5 days',
        instructions: 'After dinner'
      }
    }),
    prisma.prescriptionTemplateItem.create({
      data: {
        templateId: templates[0].id,
        drugName: 'Vitamin C 500mg',
        dosage: '1-0-1',
        duration: '7 days',
        instructions: 'After meals'
      }
    }),

    // Gastritis template
    prisma.prescriptionTemplateItem.create({
      data: {
        templateId: templates[1].id,
        drugName: 'Pantoprazole 40mg',
        dosage: '1-0-1',
        duration: '14 days',
        instructions: 'Before meals'
      }
    }),
    prisma.prescriptionTemplateItem.create({
      data: {
        templateId: templates[1].id,
        drugName: 'Domperidone 10mg',
        dosage: '1-1-1',
        duration: '7 days',
        instructions: 'Before meals'
      }
    }),
    prisma.prescriptionTemplateItem.create({
      data: {
        templateId: templates[1].id,
        drugName: 'Antacid Syrup',
        dosage: '2 tsf',
        duration: '10 days',
        instructions: 'After meals and at bedtime'
      }
    }),

    // UTI template
    prisma.prescriptionTemplateItem.create({
      data: {
        templateId: templates[2].id,
        drugName: 'Norfloxacin 400mg',
        dosage: '1-0-1',
        duration: '7 days',
        instructions: 'After meals'
      }
    }),
    prisma.prescriptionTemplateItem.create({
      data: {
        templateId: templates[2].id,
        drugName: 'Urine Alkalizer',
        dosage: '1-1-1',
        duration: '7 days',
        instructions: 'After meals with water'
      }
    }),
    prisma.prescriptionTemplateItem.create({
      data: {
        templateId: templates[2].id,
        drugName: 'Dicyclomine 20mg',
        dosage: '1-1-1',
        duration: '5 days',
        instructions: 'Before meals, SOS for pain'
      }
    })
  ])

  console.log('📋 Created prescription templates')

  console.log('✅ Database seeded successfully!')
  console.log('\n🎯 Demo Credentials (All use password: password123):')
  console.log('👨‍⚕️ Doctor: doctor@medicare.com')
  console.log('👑 Admin: admin@medicare.com')
  console.log('👩‍⚕️ Nurse: nurse@medicare.com')
  console.log('🏢 Receptionist: receptionist@medicare.com')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })