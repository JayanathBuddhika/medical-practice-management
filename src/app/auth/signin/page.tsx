'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SignIn() {
  const [email, setEmail] = useState('doctor@medicare.com')
  const [password, setPassword] = useState('password123')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password. Please check your credentials.')
      } else if (result?.ok) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (role: string) => {
    switch (role) {
      case 'doctor':
        setEmail('doctor@medicare.com')
        setPassword('password123')
        break
      case 'admin':
        setEmail('admin@medicare.com')
        setPassword('password123')
        break
      case 'nurse':
        setEmail('nurse@medicare.com')
        setPassword('password123')
        break
      case 'receptionist':
        setEmail('receptionist@medicare.com')
        setPassword('password123')
        break
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🏥</div>
          <h1 className="login-title">MediCare Private Practice</h1>
          <p className="login-subtitle">Complete Clinical Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                Signing in...
              </div>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>

        <div className="demo-accounts">
          <h3 className="demo-title">🎯 Demo Accounts</h3>
          
          <div className="demo-grid">
            <div className="demo-account doctor">
              <div className="account-info">
                <div className="account-role">👨‍⚕️ Doctor</div>
                <div className="account-desc">Full access to all modules</div>
              </div>
              <button
                type="button"
                onClick={() => handleDemoLogin('doctor')}
                className="demo-btn doctor-btn"
              >
                Use Account
              </button>
            </div>

            <div className="demo-account admin">
              <div className="account-info">
                <div className="account-role">👑 Admin</div>
                <div className="account-desc">System administration & reports</div>
              </div>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="demo-btn admin-btn"
              >
                Use Account
              </button>
            </div>

            <div className="demo-account nurse">
              <div className="account-info">
                <div className="account-role">👩‍⚕️ Nurse</div>
                <div className="account-desc">Patient care & vitals</div>
              </div>
              <button
                type="button"
                onClick={() => handleDemoLogin('nurse')}
                className="demo-btn nurse-btn"
              >
                Use Account
              </button>
            </div>

            <div className="demo-account receptionist">
              <div className="account-info">
                <div className="account-role">🏢 Receptionist</div>
                <div className="account-desc">Appointments & billing</div>
              </div>
              <button
                type="button"
                onClick={() => handleDemoLogin('receptionist')}
                className="demo-btn receptionist-btn"
              >
                Use Account
              </button>
            </div>
          </div>

          <div className="demo-note">
            💡 <strong>All accounts use password:</strong> password123
          </div>
        </div>
      </div>
    </div>
  )
}