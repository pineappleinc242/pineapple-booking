import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'premium'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, asChild = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    if (asChild) {
      return (
        <Comp
          className={cn(
            // Base styles
            'inline-flex items-center justify-center rounded-md font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            'disabled:pointer-events-none disabled:opacity-50',

            // Size variants
            {
              'h-8 px-3 text-sm': size === 'sm',
              'h-10 px-4 text-base': size === 'md',
              'h-12 px-6 text-lg': size === 'lg',
            },

            // Color variants
            {
              // Primary: keep as a strong CTA (white on black background)
              'bg-white text-black hover:bg-neutral-100 focus-visible:ring-primary': variant === 'primary',
              // Secondary: use accent/secondary colour
              'bg-secondary text-white hover:bg-secondary-dark focus-visible:ring-secondary': variant === 'secondary',
              // Outline: transparent dark border
              'border border-neutral-700 bg-transparent text-white hover:bg-neutral-900/60 focus-visible:ring-primary': variant === 'outline',
              // Ghost: subtle white text
              'text-white hover:text-white/90 hover:bg-neutral-900/40 focus-visible:ring-primary': variant === 'ghost',
              'bg-error text-white hover:bg-red-600 focus-visible:ring-error': variant === 'danger',
              'btn-premium text-white focus-visible:ring-accent': variant === 'premium',
            },

            className
          )}
          ref={ref}
          disabled={disabled || loading}
          {...props}
        >
          {children}
        </Comp>
      )
    }

    return (
      <Comp
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',

          // Size variants
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-base': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },

          // Color variants - Creative Agency (dark theme friendly)
          {
            'bg-white text-black hover:bg-neutral-100 focus-visible:ring-secondary shadow-lg hover:shadow-2xl': variant === 'primary',
            'bg-secondary text-white hover:bg-secondary-dark focus-visible:ring-secondary shadow-lg hover:shadow-2xl': variant === 'secondary',
            'border-2 border-neutral-700 bg-transparent text-white hover:bg-neutral-900/60 hover:border-neutral-600 focus-visible:ring-secondary': variant === 'outline',
            'text-white hover:text-white/90 hover:bg-neutral-900/40 focus-visible:ring-secondary': variant === 'ghost',
            'bg-accent text-white hover:bg-accent-dark focus-visible:ring-accent shadow-lg hover:shadow-2xl': variant === 'danger',
            'btn-premium text-white focus-visible:ring-accent': variant === 'premium',
          },

          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export { Button }