import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        className={cn(
          'rounded-xl bg-neutral-900 p-8 shadow-lg border border-neutral-800/50 backdrop-blur-sm',
          'transition-all duration-300 hover:shadow-2xl hover:shadow-black/40',
          {
            'shadow-sm border-neutral-800/30': variant === 'default',
            'shadow-xl border-neutral-800/50': variant === 'elevated',
            'border-2 border-neutral-700/50 bg-neutral-900/60': variant === 'outlined',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

export { Card }