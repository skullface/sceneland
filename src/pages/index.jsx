import Head from 'next/head'
import { allShows } from 'src/data/allShows'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from 'src/components/dropdown'

export const getStaticProps = async () => {
  return {
    props: {
      shows: allShows,
    },
  }
}

// UI to filter results by venue
export function VenueFilter({ venues, selectedVenues, onVenueToggle }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='dropdown-button dark:shadow-[0_16px_24px_-16px_rgba(0,0,0,0.3),inset_0px_1px_0_rgba(0,0,0,0.25) group w-auto select-none rounded-md border border-zinc-800 bg-zinc-950 px-4 py-2 text-base font-medium text-zinc-50 shadow-[0_16px_24px_-16px_rgba(0,0,0,0.3),inset_0px_1px_0_rgba(255,255,255,0.25)] transition hover:bg-zinc-800 focus:outline-none focus:ring focus:ring-lime-500/75 dark:border-white dark:bg-zinc-100 dark:text-zinc-800 dark:hover:bg-white'>
        Select your fav Cleveland venues{' '}
        <span className='inline-block -rotate-90 transform leading-none text-zinc-400 transition-colors group-hover:text-zinc-200 dark:group-hover:text-zinc-500'>
          &lt;
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='dropdown-content flex min-w-[200px] flex-col rounded-xl bg-zinc-900 shadow-lg shadow-black/5 dark:bg-zinc-50 md:min-w-[360px]'>
        {venues.map((venue) => (
          <DropdownMenuCheckboxItem
            key={venue.replace(/[^\w]+/g, '-').toLowerCase()}
            checked={selectedVenues.includes(venue)}
            onCheckedChange={() => onVenueToggle(venue)}
          >
            {venue}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function Home() {
  // Create an array of all unique venues
  const allVenues = Array.from(new Set(allShows.map((show) => show.venue)))

  // Initialize state for selected venues
  const [selectedVenues, setSelectedVenues] = useState(allVenues)

  // Handle venue toggling by changing state
  const handleVenueToggle = (venue) => {
    // If the `selectedVenues` array already includes the venue, remove it
    if (selectedVenues.includes(venue)) {
      setSelectedVenues(selectedVenues.filter((v) => v !== venue))
    } else {
      // If the venue is not in the `selectedVenues` array, add it
      setSelectedVenues([...selectedVenues, venue])
    }
  }

  // Filter shows by selected venues
  const filteredShows = allShows.filter((show) =>
    selectedVenues.includes(show.venue),
  )

  // Sort filtered shows chronologically by show date
  const sortedFilteredShows = filteredShows.sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  )

  // Reduce the sorted, filtered shows
  const days = 7
  const monday = 1 // zero-indexed

  const showsByWeek = sortedFilteredShows.reduce((acc, show) => {
    // Get a show’s first day of the week (starting on Monday)
    const weekStartDate = new Date(show.date)
    weekStartDate.setHours(0, 0, 0, 0)

    // Calculate # of days to subtract to get to Monday
    const daysToSubtract = (weekStartDate.getDay() + (days - monday)) % days
    // Subtract that many days to always get Mondays
    weekStartDate.setDate(weekStartDate.getDate() - daysToSubtract)

    // Convert the first day of the week to ISO
    const weekStartDateAsString = weekStartDate.toISOString()
    // Make an empty array if the first day of the week hasn’t happened yet
    if (!acc[weekStartDateAsString]) {
      acc[weekStartDateAsString] = []
    }
    // Push the show into its corresponding week array
    acc[weekStartDateAsString].push(show)
    // Return the accumulator (that *accumulates* the grouped-by-week shows)
    return acc
  }, {})

  // Convert the grouped shows into an array of `{ weekStartDate, shows }` objects
  const groupedShows = Object.entries(showsByWeek).map(
    ([weekStart, weekShows]) => ({
      weekStartDate: new Date(weekStart),
      shows: weekShows,
    }),
  )

  return (
    <>
      <Head>
        <title>216.show: Music in Cleveland 🤘</title>
        <meta
          name='description'
          content='Concerts coming up at your fav local venues like the Beachland, Agora, Mahall’s, and more'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.png' />
      </Head>

      <header className='sticky top-0 mx-auto flex items-center gap-2 border-b border-b-black/10 bg-zinc-50 p-4 text-center text-sm shadow-xl shadow-black/[0.03] backdrop-blur dark:border-b-white/5 dark:bg-black/50 dark:shadow-black/25 max-md:flex-col md:justify-center md:gap-x-4 lg:p-8'>
        <h1 className='font-mono text-xl text-zinc-800 dark:text-zinc-200 md:text-2xl md:font-semibold md:uppercase md:tracking-tight'>
          216.show
        </h1>
        <VenueFilter
          venues={allVenues} // pass the array of all unique venues names as a prop
          selectedVenues={selectedVenues} // pass the array of selected (checked) venues as a prop
          onVenueToggle={handleVenueToggle} // pass the function to handle toggling as a prop
        />
      </header>

      <main className='container mx-auto flex flex-col gap-14 p-4 lg:p-8'>
        {groupedShows.map(({ weekStartDate, shows }) => (
          <section key={weekStartDate} className='flex flex-col gap-6'>
            <h2
              className={`flex w-full items-center gap-x-2 text-3xl text-zinc-400 before:h-[1px] before:w-full before:bg-zinc-300 before:content-[''] after:h-[1px] after:w-full after:bg-zinc-300 after:content-[''] dark:text-zinc-500 before:dark:bg-zinc-800 after:dark:bg-zinc-800`}
            >
              <span className='flex-shrink-0 font-mono text-lg uppercase'>
                Week of
              </span>{' '}
              <span className='flex-shrink-0 font-medium text-zinc-500 dark:text-zinc-400'>
                {weekStartDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </h2>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {shows.map(
                (show, i) =>
                  show.artist && (
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
                        {JSON.stringify(show.artist)
                          .replace(/\[|\]|\"/g, '')
                          .replace(/\,/g, ', ')}{' '}
                      </h3>
                      <span className='font-mono text-sm'>{show.venue}</span>{' '}
                      <time
                        className='mt-3 flex flex-1 items-end text-zinc-800 dark:text-zinc-300'
                        dateTime={new Date(show.date)}
                      >
                        {new Date(show.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    </a>
                  ),
              )}
            </div>
          </section>
        ))}
      </main>

      <footer className='container mx-auto flex flex-col gap-2 p-4 text-center text-sm lg:p-8'>
        <p>
          All data is pulled from the venues’ individual websites and aggregated
          here. No ownership of information is claimed nor implied.
        </p>
        <p>Support your scene and take care of each other.</p>
      </footer>
    </>
  )
}
