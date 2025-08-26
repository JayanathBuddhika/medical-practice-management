import { SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="form-group">
        {label && (
          <label className="block text-gray-700 mb-2 font-medium text-sm">
            {label}
          </label>
        )}
        <select
          className={cn(
            'w-full px-5 py-4 border-2 border-slate-200 rounded-xl text-base transition-all duration-300 bg-slate-50 font-inherit',
            'focus:outline-none focus:border-blue-800 focus:bg-white focus:shadow-[0_0_0_4px_rgba(30,58,138,0.1)]',
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'