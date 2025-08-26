'use client'

import { useSession, signOut } from 'next-auth/react'
import { formatDate } from '@/lib/utils'
import { LogOut, Settings, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function Header() {
  const { data: session } = useSession()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' })
  }

  return (
    <div className="bg-gradient-to-r from-blue-800 to-blue-900 border-b border-blue-700 px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-lg md:text-xl font-bold text-white">
          {session?.user?.doctorProfile 
            ? `Dr. ${session.user.name} - Private Practice`
            : 'MediCare Private Practice'
          }
        </h1>
        <p className="text-blue-100 text-sm">
          {formatDate(new Date())}
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 text-blue-100 bg-blue-800/50 px-3 py-2 rounded-lg">
          <div className="bg-blue-600 p-1.5 rounded-full">
            <User size={16} className="text-white" />
          </div>
          <div>
            <span className="text-sm font-medium text-white">{session?.user?.name || 'Demo User'}</span>
            <div className="text-xs bg-blue-600 px-2 py-0.5 rounded-full text-blue-100 mt-1">
              {session?.user?.role || 'DOCTOR'}
            </div>
          </div>
        </div>
        
        <Button
          variant="secondary"
          size="small"
          onClick={handleSignOut}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20"
        >
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </div>
  )
}