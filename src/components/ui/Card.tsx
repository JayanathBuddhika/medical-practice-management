import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'dashboard' | 'stat'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-white rounded-2xl shadow-lg shadow-blue-800/12 overflow-hidden',
      dashboard: 'bg-white rounded-2xl p-6 shadow-lg shadow-black/8 border border-slate-100',
      stat: 'bg-white rounded-2xl p-6 text-center shadow-lg shadow-black/8 border border-slate-100'
    }

    return (
      <div
        className={cn(variants[variant], className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn('flex items-center gap-3 mb-4', className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

export const CardIcon = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { bgColor?: string }>(
  ({ className, bgColor = 'bg-blue-800', children, ...props }, ref) => {
    return (
      <div
        className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center text-xl text-white',
          bgColor,
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardIcon.displayName = 'CardIcon'

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        className={cn('text-lg font-semibold text-slate-800', className)}
        ref={ref}
        {...props}
      >
        {children}
      </h3>
    )
  }
)

CardTitle.displayName = 'CardTitle'