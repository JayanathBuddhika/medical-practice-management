# 🏥 MediCare Private Practice Management System

A comprehensive clinical management system built with Next.js 15, featuring role-based access control, patient management, consultations, prescriptions, billing, and more.

## 🌐 Live Demo

**🔗 [View Live Application](https://medical-practice-management-ten.vercel.app/)**

## 🎯 Demo Accounts

All demo accounts use the password: **`password123`**

| Role | Email | Access Level |
|------|-------|--------------|
| 👑 **Admin** | `admin@medicare.com` | Full system access, user management, role configuration |
| 👨‍⚕️ **Doctor** | `doctor@medicare.com` | Patient care, consultations, prescriptions, investigations |
| 👩‍⚕️ **Nurse** | `nurse@medicare.com` | Patient support, vitals, lab reports |
| 🏢 **Receptionist** | `receptionist@medicare.com` | Appointments, patient registration, billing |

## ✨ Key Features

### 🔐 Advanced Role Management
- **Custom Role Configuration**: Admin can assign specific privileges to each role
- **Granular Permissions**: 40+ fine-grained privileges across all modules
- **Dynamic Access Control**: Real-time privilege enforcement
- **User Management**: Create, edit, and manage users with role-specific access

### 👥 Patient Management
- Complete patient profiles with medical history
- Emergency contact information
- Blood group and allergy tracking
- Comprehensive patient search and filtering

### 📅 Appointment System
- Interactive appointment scheduling
- Multiple time slot management
- Priority-based booking (Normal, High, Urgent)
- Real-time appointment status tracking

### 🩺 Consultation Workflow
- Token-based patient queue management
- Comprehensive clinical documentation
- Chief complaints and examination records
- Provisional and final diagnosis tracking
- ICD-10 code integration

### 💊 Prescription Management
- Digital prescription creation
- Medicine dosage and duration tracking
- Prescription templates for common conditions
- Print-ready prescription format

### 🔬 Investigation Management
- Lab test ordering and tracking
- Multiple investigation types (Blood, Urine, Imaging, ECG)
- Result management and report storage
- Integration with external labs

### 💰 Billing & Finance
- Automated bill generation
- Multiple payment modes (Cash, UPI, Card, Online)
- Payment status tracking
- Consultation fee management

### 📊 Analytics & Reports
- Real-time dashboard with key metrics
- Patient visit analytics
- Revenue tracking
- Investigation status reports

## 🚀 Features

### Core Functionality
- **User Authentication** - Role-based access control (Doctor, Admin, Nurse, Receptionist)
- **Doctor Dashboard** - Real-time patient queue management and statistics
- **Consultation Management** - Complete consultation workflow with patient context
- **Prescription Management** - Digital prescriptions with templates and print functionality
- **Investigation Reports** - Lab report management with upload and tracking
- **Billing System** - Automated billing with multiple payment modes
- **Patient Records** - Comprehensive patient database with search
- **Reports & Analytics** - Practice insights and performance metrics

### Technical Features
- **Mobile Responsive** - Optimized for all device sizes
- **Print-Ready** - Prescription and report printing
- **Real-time Updates** - Live queue status and notifications
- **Data Security** - Encrypted passwords and secure sessions
- **Backup & Recovery** - PostgreSQL with automated backups
- **Scalable Architecture** - Containerized deployment on AWS

## 🛠 Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **React Hook Form** - Form validation and management

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **NextAuth.js** - Authentication and session management
- **Prisma ORM** - Database operations and migrations
- **PostgreSQL** - Primary database
- **bcryptjs** - Password hashing

### Infrastructure
- **Docker** - Containerization
- **AWS ECS Fargate** - Container orchestration
- **AWS RDS** - Managed PostgreSQL database
- **AWS ALB** - Application load balancer
- **AWS ECR** - Container registry
- **GitHub Actions** - CI/CD pipeline

## 📋 Prerequisites

- Node.js 18 or later
- PostgreSQL 15 or later
- Docker and Docker Compose
- AWS CLI (for deployment)
- Git

## 🚦 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/medical-practice.git
cd medical-practice
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file and update the values:
```bash
cp .env.example .env
```

Update `.env` with your database credentials:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/medical_practice?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
JWT_SECRET="your-jwt-secret-here"
```

### 4. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Optional: Open Prisma Studio
npm run db:studio
```

### 5. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

### 6. Demo Login
```
Email: doctor@medicare.com
Password: password123
```

## 🐳 Docker Development

### Using Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

## 🚀 Deployment

### AWS Infrastructure Setup

1. **Deploy CloudFormation Stack**
```bash
aws cloudformation deploy \
  --template-file aws/cloudformation.yml \
  --stack-name medical-practice-infrastructure \
  --parameter-overrides VpcId=vpc-xxxxx SubnetIds=subnet-xxxxx,subnet-yyyyy DatabasePassword=SecurePassword123 \
  --capabilities CAPABILITY_IAM
```

2. **Build and Push Docker Image**
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and push
docker build -t medical-practice .
docker tag medical-practice:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/medical-practice:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/medical-practice:latest
```

3. **Deploy ECS Service**
```bash
aws ecs create-service --cli-input-json file://aws/service-definition.json
```

### GitHub Actions CI/CD

Set up the following secrets in your GitHub repository:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `SUBNET_IDS`
- `SECURITY_GROUP_ID`

The pipeline will automatically:
- Run tests and linting
- Build and push Docker images
- Deploy to ECS on main branch pushes

## 🏗 Project Structure

```
medical-practice/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Main dashboard
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── layout/           # Layout components
│   │   └── dashboard/        # Dashboard components
│   ├── lib/                  # Utility libraries
│   └── types/                # TypeScript types
├── prisma/                   # Database schema and migrations
├── aws/                      # AWS deployment configurations
├── .github/workflows/        # GitHub Actions
├── docker-compose.yml        # Docker development setup
├── Dockerfile               # Production container
└── README.md
```

## 🔐 Security Features

- **Password Hashing** - bcrypt with salt rounds
- **Session Management** - Secure JWT tokens
- **Role-Based Access** - Granular permissions
- **Input Validation** - Zod schema validation
- **SQL Injection Prevention** - Prisma ORM protection
- **HTTPS Enforcement** - SSL/TLS in production

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones
- Touch interfaces

## 🖨 Printing Support

Built-in print optimization for:
- Prescription forms
- Patient reports
- Lab results
- Billing receipts

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests (when implemented)
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Documentation: Project Wiki

## 🗺 Roadmap

- [ ] Telemedicine integration
- [ ] Mobile app development
- [ ] AI-powered diagnostics
- [ ] Multi-language support
- [ ] Voice-to-text notes
- [ ] Appointment scheduling
- [ ] Patient portal
- [ ] Insurance integration

---

**Built with ❤️ for healthcare professionals**
