import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Table = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => {
    return (
      <table
        className={cn(
          'w-full border-collapse bg-white rounded-xl overflow-hidden shadow-lg shadow-black/8',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Table.displayName = 'Table'

export const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => {
    return (
      <thead
        className={cn('', className)}
        ref={ref}
        {...props}
      />
    )
  }
)

TableHeader.displayName = 'TableHeader'

export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => {
    return (
      <tbody
        className={cn('', className)}
        ref={ref}
        {...props}
      />
    )
  }
)

TableBody.displayName = 'TableBody'

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => {
    return (
      <tr
        className={cn('hover:bg-slate-50 transition-colors', className)}
        ref={ref}
        {...props}
      />
    )
  }
)

TableRow.displayName = 'TableRow'

export const TableHead = forwardRef<HTMLTableCellElement, HTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => {
    return (
      <th
        className={cn(
          'bg-slate-50 text-gray-700 px-5 py-4 text-left font-semibold text-sm border-b border-slate-200',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

TableHead.displayName = 'TableHead'

export const TableCell = forwardRef<HTMLTableCellElement, HTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => {
    return (
      <td
        className={cn('px-5 py-4 border-b border-slate-100', className)}
        ref={ref}
        {...props}
      />
    )
  }
)

TableCell.displayName = 'TableCell'