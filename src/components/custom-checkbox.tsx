import { forwardRef } from 'react'

interface CustomCheckboxProps {
  checked: boolean
  onChange: () => void
  disabled?: boolean
  className?: string
  id?: string
}

export const CustomCheckbox = forwardRef<HTMLInputElement, CustomCheckboxProps>(
  ({ checked, onChange, disabled = false, className = '', id }, ref) => {
    return (
      <div className={`relative inline-flex ${className}`}>
        <input
          ref={ref}
          type='checkbox'
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          id={id}
          className='sr-only'
          tabIndex={0}
        />
        <div
          className={`
            flex
            size-4 items-center justify-center rounded-sm border border-gray-50
            ${
              disabled
                ? 'border-gray-2-0 cursor-not-allowed bg-gray-100'
                : checked
                  ? 'bg-gray-1000 border-gray-1000'
                  : 'bg-gray-0/50 cursor-pointer border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }
            ${!disabled && 'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-1'}
          `}
          onClick={!disabled ? onChange : undefined}
          onKeyDown={(e) => {
            if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault()
              onChange()
            }
          }}
          tabIndex={disabled ? -1 : 0}
          role='checkbox'
          aria-checked={checked}
          aria-disabled={disabled}
        >
          {checked && (
            <svg
              className='text-gray-0 size-3'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
          )}
        </div>
      </div>
    )
  },
)

CustomCheckbox.displayName = 'CustomCheckbox'
