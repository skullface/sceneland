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
          className='group flex h-full min-h-[180px] flex-col justify-between gap-y-4 rounded border border-zinc-200 bg-white p-4 leading-snug  decoration-zinc-200 shadow-sm transition hover:!border-zinc-300 hover:underline hover:shadow-md hover:!shadow-black/5 focus:outline-none focus:ring focus:ring-lime-500/50 dark:border-zinc-800 dark:bg-zinc-900 dark:decoration-zinc-600 dark:shadow-md hover:dark:!border-zinc-700'
        >
          <div className='flex flex-col gap-y-2'>
            <h3 className='order-2 text-lg font-medium text-zinc-800 dark:text-zinc-300'>
              {show.artist.join(', ')}
            </h3>
            {show.sold_out && (
              <p className='order-3 mt-1 self-start whitespace-nowrap rounded-full border border-red-700 bg-red-600 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white transition [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)] dark:border-red-900/75 dark:bg-red-950 dark:text-red-500 group-hover:dark:border-red-900'>
                Sold out
              </p>
            )}
          </div>
          <div className='text-md flex flex-col gap-y-0.5 text-zinc-500 dark:text-zinc-400'>
            <time dateTime={new Date(show.date).toISOString()}>
              {new Date(show.date).toLocaleDateString('en-US', {
                timeZone: 'America/New_York',
                weekday: 'long',
              })}
              ,{' '}
              {new Date(show.date).toLocaleDateString('en-US', {
                timeZone: 'America/New_York',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <p className='order-1 flex flex-row items-center gap-x-2'>
              {show.venue}
              <img
                src={`/images/venues/${show.venue.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`}
                alt=''
                className='h-4 w-4 rounded-full border border-zinc-400 dark:border-zinc-600'
              />
            </p>
          </div>
        </a>
      </li>
    )
  )
}
