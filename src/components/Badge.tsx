import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full font-medium',
          {
            'px-2 py-1 text-xs': size === 'sm',
            'px-2.5 py-1 text-sm': size === 'md',
          },
          {
            'bg-gray-100 text-gray-800': variant === 'default',
            'bg-success-light text-success': variant === 'success',
            'bg-warning-light text-warning': variant === 'warning',
            'bg-error-light text-error': variant === 'error',
            'bg-info-light text-info': variant === 'info',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }