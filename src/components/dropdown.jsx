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
        className='dropdown-item flex gap-x-2 justify-start px-4 py-2 items-center text-zinc-100 dark:text-zinc-800 font-medium cursor-pointer first-of-type:pt-3 first-of-type:rounded-t-xl last-of-type:pb-3 last-of-type:rounded-b-xl dark:hover:text-zinc-950 dark:hover:bg-zinc-200 hover:bg-zinc-800 hover:text-white dark:focus:text-zinc-950 dark:focus:bg-zinc-200 focus:bg-zinc-800 focus:text-white  focus:outline-none'
        onSelect={(event) => event.preventDefault()}
      >
        {children}
        <span className='order-first text-center w-5 font-mono'>
          {props.checked ? '✓' : '×'}
        </span>
      </DropdownMenuPrimitive.CheckboxItem>
    )
  },
)
