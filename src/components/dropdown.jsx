/* eslint-disable react/display-name */
import React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

export const DropdownMenuContent = React.forwardRef(
  ({ children, ...props }, forwardedRef) => {
    return (
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content {...props} ref={forwardedRef}>
          {children}
          <DropdownMenuPrimitive.Arrow />
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    )
  },
)

export const DropdownMenuCheckboxItem = React.forwardRef(
  ({ children, ...props }, forwardedRef) => {
    return (
      <DropdownMenuPrimitive.CheckboxItem
        {...props}
        ref={forwardedRef}
        className='dropdown-item flex cursor-pointer items-center justify-start gap-x-2 px-4 py-2 font-medium text-zinc-100 first-of-type:rounded-t-xl first-of-type:pt-3 last-of-type:rounded-b-xl last-of-type:pb-3 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white focus:outline-none dark:text-zinc-800 dark:hover:bg-zinc-200 dark:hover:text-zinc-950 dark:focus:bg-zinc-200  dark:focus:text-zinc-950'
        onSelect={(event) => event.preventDefault()}
      >
        {children}
        <span className='order-first w-5 text-center font-mono'>
          {props.checked ? '✓' : '×'}
        </span>
      </DropdownMenuPrimitive.CheckboxItem>
    )
  },
)
