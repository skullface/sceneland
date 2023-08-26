import React, { useState } from 'react'
import { GetStaticProps } from 'next'

import { ShowProps } from '~/utils/types'

import { allShows } from '~/data/allShows'

import { SiteMeta } from '~/components/meta'
import { VenueFilter } from '~/components/venue-filter'
import { ShowCard } from '~/components/show-card'

type ShowsByWeekProps = {
  [weekStartDate: string]: ShowProps[]
}

type GroupedShowsProps = {
  weekStartDate: Date
  shows: ShowProps[]
}

type PageProps = {
  shows: ShowProps[]
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  return {
    props: {
      shows: allShows,
    },
  }
}

export default function Page({ shows }: PageProps) {
  // Create an array of all unique venues
  const allVenues = Array.from(new Set(shows.map((show) => show.venue)))

  // Initialize state for selected venues
  const [selectedVenues, setSelectedVenues] = useState<string[]>(allVenues)

  // Handle venue toggling by changing state
  const handleVenueToggle = (venue: string) => {
    // If the `selectedVenues` array already includes the venue, remove it
    if (selectedVenues.includes(venue)) {
      setSelectedVenues(selectedVenues.filter((v) => v !== venue))
    } else {
      // If the venue is not in the `selectedVenues` array, add it
      setSelectedVenues([...selectedVenues, venue])
    }
  }

  // Select and deselect all button logic
  const handleSelectAll = () => {
    setSelectedVenues([...allVenues])
  }

  const handleDeselectAll = () => {
    setSelectedVenues([])
  }

  // Filter shows by selected venues
  const filteredShows = shows.filter((show) =>
    selectedVenues.includes(show.venue),
  )

  // Sort filtered shows chronologically by show date
  const sortedFilteredShows = filteredShows.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
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
    // Assert expected type of the accumulator
    if (!acc[weekStartDateAsString]) {
      acc[weekStartDateAsString] = [] as ShowProps[]
    }
    // Push the show into its corresponding week array
    acc[weekStartDateAsString]!.push(show)
    // Return the accumulator (that *accumulates* the grouped-by-week shows)
    return acc
  }, {} as ShowsByWeekProps)

  // Convert the grouped shows into an array of `{ weekStartDate, shows }` objects
  const groupedShows: GroupedShowsProps[] = Object.entries(showsByWeek).map(
    ([weekStart, weekShows]) => ({
      weekStartDate: new Date(weekStart),
      shows: weekShows,
    }),
  )

  return (
    <div className='flex min-h-screen flex-col'>
      <SiteMeta />

      <header className='sticky top-0 mx-auto flex w-full items-center gap-2 border-b border-b-black/10 bg-zinc-50 p-4 text-center text-sm shadow-xl shadow-black/[0.03] backdrop-blur dark:border-b-white/5 dark:bg-black/50 dark:shadow-black/25 max-md:flex-col md:justify-center md:gap-x-4 lg:p-8'>
        <h1 className='font-mono text-xl text-zinc-800 dark:text-zinc-200 md:text-2xl md:font-semibold md:uppercase md:tracking-tight'>
          216.show
        </h1>
        <VenueFilter
          venues={allVenues} // array of all unique venues names
          selectedVenues={selectedVenues} // array of selected/checked
          onVenueToggle={handleVenueToggle} // function to handle toggling
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          checked={false}
        />
      </header>

      <main className='container mx-auto flex flex-col gap-14 p-4 lg:p-8'>
        {groupedShows.length === 0 ? (
          <div className='flex flex-col gap-2 rounded border p-6 text-center dark:border-red-900 dark:bg-red-950/75'>
            <h2 className='text-3xl font-medium dark:text-zinc-50'>
              No shows available
            </h2>
            <p className='text-lg dark:text-red-600/75'>
              Please select at least one venue to view upcoming shows.
            </p>
          </div>
        ) : (
          groupedShows.map(({ weekStartDate, shows }) => (
            <section
              key={weekStartDate.toISOString()}
              className='flex flex-col gap-6'
            >
              <h2 className='flex w-full items-center gap-x-2 text-xl text-zinc-400 before:h-[1px] before:w-full before:bg-zinc-300 before:content-[""] after:h-[1px] after:w-full after:bg-zinc-300 after:content-[""] dark:text-zinc-500 before:dark:bg-zinc-800 after:dark:bg-zinc-800 md:text-3xl'>
                <span className='flex-shrink-0 font-mono text-base uppercase md:text-lg'>
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
              <ul className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {shows.map((show, i) => (
                  <ShowCard key={i} show={show} i={0} />
                ))}
              </ul>
            </section>
          ))
        )}
      </main>

      <footer className='container mx-auto mt-auto flex flex-col gap-2 p-4 text-center text-sm lg:p-8'>
        <p>
          All data is pulled from the venues’ individual websites and aggregated
          here. No ownership of information is claimed nor implied.
        </p>
        <p>Support your scene and take care of each other.</p>
      </footer>
    </div>
  )
}
