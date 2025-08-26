import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'completed' | 'pending' | 'in-progress' | 'cancelled' | 'default'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      completed: 'bg-emerald-100 text-emerald-800',
      pending: 'bg-amber-100 text-amber-800', 
      'in-progress': 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      default: 'bg-slate-100 text-slate-800'
    }

    return (
      <span
        className={cn(
          'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide',
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'