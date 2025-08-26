import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'medium', fullWidth, children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 border-none rounded-xl font-semibold cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
      primary: 'bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-lg shadow-blue-800/30 hover:shadow-blue-800/40 hover:-translate-y-0.5',
      secondary: 'bg-slate-100 text-slate-600 hover:bg-slate-200',
      success: 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:-translate-y-0.5',
      warning: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40 hover:-translate-y-0.5',
      danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-600/30 hover:shadow-red-600/40 hover:-translate-y-0.5'
    }
    
    const sizes = {
      small: 'px-4 py-2 text-sm',
      medium: 'px-6 py-4 text-base',
      large: 'px-8 py-5 text-lg'
    }

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'