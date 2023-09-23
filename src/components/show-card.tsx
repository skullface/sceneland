import React from 'react'
import { ShowProps } from '~/utils/types'

type ShowCardProps = {
  show: ShowProps
  i: number
}

export const ShowCard: React.FC<ShowCardProps> = ({ show, i }) => {
  return (
    show.artist && (
      <li key={i}>
        <a
          href={show.link}
          className='group flex h-full min-h-[180px] flex-col gap-y-4 rounded border border-zinc-200 bg-white p-4 leading-snug shadow-sm transition hover:border-zinc-300 hover:shadow-black/10 focus:outline-none focus:ring focus:ring-lime-500/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-md hover:dark:border-zinc-700'
        >
          <div className='flex flex-col gap-y-2'>
            <h3 className='order-2 font-semibold text-zinc-800 dark:font-medium dark:text-zinc-300'>
              {show.artist.join(', ')}
            </h3>
            {show.sold_out && (
              <p className='order-3 mt-1 self-start whitespace-nowrap rounded-full border border-red-700 bg-red-600 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white transition [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)] dark:border-red-900/75 dark:bg-red-950 dark:text-red-500 group-hover:dark:border-red-900'>
                Sold out
              </p>
            )}
            <p className='order-1 font-mono text-sm'>{show.venue}</p>{' '}
          </div>
          <time
            dateTime={new Date(show.date).toISOString()}
            className='mt-3 flex flex-1 items-end justify-between gap-x-2 text-zinc-800 dark:text-zinc-500'
          >
            <span>
              <span className='dark:text-zinc-300'>
                {new Date(show.date).toLocaleDateString('en-US', {
                  timeZone: 'America/New_York',
                  weekday: 'short',
                })}
              </span>
              ,{' '}
              <span className='dark:text-zinc-300'>
                {new Date(show.date).toLocaleDateString('en-US', {
                  timeZone: 'America/New_York',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </span>
            <span className='font-mono text-sm'>
              {new Date(show.date).toLocaleTimeString('en-US', {
                timeZone: 'America/New_York',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            </span>
          </time>
        </a>
      </li>
    )
  )
}
