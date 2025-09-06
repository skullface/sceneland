import React from 'react'
import { ShowProps } from '~/utils/types'

type ShowCardProps = {
  show: ShowProps
  i: number
}

export const ShowCard: React.FC<ShowCardProps> = ({ show, i }) => {
  const formatArtistNames = (artist: string[] | undefined): string => {
    if (!artist || !Array.isArray(artist)) {
      return 'Unknown Artist'
    }

    return artist.join(', ')
  }

  return (
    show.artist && (
      <li key={i}>
        <a
          href={show.link}
          className='focus:text-gray-1000 group group flex h-full min-h-[180px] flex-col justify-between gap-y-4 rounded-md border border-gray-50 bg-gray-50/50 p-4 text-gray-700 decoration-gray-200 shadow-sm hover:border-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50'
        >
          <div className='flex flex-col gap-y-2'>
            <h3 className='group-hover:text-gray-1000 group-focus-within:text-gray-1000 text-md order-2 font-medium text-gray-900 '>
              {formatArtistNames(show.artist)}
            </h3>
            {show.sold_out && (
              <p className='order-3 mt-1 self-start whitespace-nowrap rounded-full border border-red-700 bg-red-600 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white  [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]'>
                Sold out
              </p>
            )}
          </div>
          <div className='flex flex-col gap-y-0.5 text-sm'>
            <time dateTime={new Date(show.date).toISOString()}>
              {new Date(show.date).toLocaleDateString('en-US', {
                timeZone: 'America/New_York',
                weekday: 'short',
              })}
              ,{' '}
              {new Date(show.date).toLocaleDateString('en-US', {
                timeZone: 'America/New_York',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <p className='order-1 flex flex-row items-center gap-x-2 font-mono uppercase'>
              {show.venue}
            </p>
          </div>
        </a>
      </li>
    )
  )
}
