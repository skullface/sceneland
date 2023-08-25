import React from 'react'

interface Show {
  link: string
  sold_out?: boolean
  artist?: string[]
  venue: string
  date: string
}

interface ShowCardProps {
  show: Show
  i: number
}

export const ShowCard: React.FC<ShowCardProps> = ({ show, i }) => {
  return (
    <a
      key={i}
      href={show.link}
      className='group flex h-full flex-col gap-y-2 rounded border border-zinc-200 bg-white p-4 leading-snug shadow-sm transition hover:border-zinc-300 hover:shadow-black/10 focus:outline-none focus:ring focus:ring-lime-500/50 dark:border-zinc-800  dark:bg-zinc-900 dark:shadow-md hover:dark:border-zinc-700'
    >
      {show.sold_out && (
        <span className='self-start whitespace-nowrap rounded-full border border-red-700 bg-red-600 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white transition [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)] dark:border-red-900/75 dark:bg-red-950 dark:text-red-500 group-hover:dark:border-red-900'>
          Sold out
        </span>
      )}
      <h3 className='font-semibold text-zinc-800 dark:font-medium dark:text-zinc-300'>
        {show.artist.join(', ')}
      </h3>
      <span className='font-mono text-sm'>{show.venue}</span>{' '}
      <time
        className='mt-3 flex flex-1 items-end text-zinc-800 dark:text-zinc-300'
        dateTime={new Date(show.date).toISOString()}
      >
        {new Date(show.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </time>
    </a>
  )
}
