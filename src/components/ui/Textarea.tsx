import { TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="form-group">
        {label && (
          <label className="block text-gray-700 mb-2 font-medium text-sm">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            'w-full px-5 py-4 border-2 border-slate-200 rounded-xl text-base transition-all duration-300 bg-slate-50 font-inherit resize-y min-h-[120px]',
            'focus:outline-none focus:border-blue-800 focus:bg-white focus:shadow-[0_0_0_4px_rgba(30,58,138,0.1)]',
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'