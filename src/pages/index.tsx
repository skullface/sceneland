import { useEffect, useState } from 'react'
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
  // Animate header elements on scroll
  const [animateOnScroll, setAnimateOnScroll] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = window.innerWidth < 480 ? 25 : 30
      setAnimateOnScroll(window.scrollY > scrollThreshold)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Overwrite specific venue names to group them together
  const venueMapping: { [key: string]: string } = {
    'Beachland Ballroom': 'Beachland',
    'Beachland Tavern': 'Beachland',
    'Mahall’s Apartment': 'Mahall’s',
    'The Roxy at Mahall’s': 'Mahall’s',
  }

  // Create an array of all unique venues
  const allVenues = Array.from(
    new Set(shows.map((show) => venueMapping[show.venue] || show.venue)),
  )

  // Initialize state for selected venues
  const [selectedVenues, setSelectedVenues] = useState<string[]>(allVenues)

  const handleVenueToggle = (venue: string) => {
    const mappedVenue = venueMapping[venue] || venue
    setSelectedVenues((prevSelectedVenues) =>
      prevSelectedVenues.includes(mappedVenue)
        ? prevSelectedVenues.filter((v) => v !== mappedVenue)
        : [...prevSelectedVenues, mappedVenue],
    )
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
    selectedVenues.includes(venueMapping[show.venue] || show.venue),
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

  const renderGroupedShows = () => {
    if (groupedShows.length === 0) {
      return (
        <div className='empty-state'>
          <h2>No shows available</h2>
          <p>Please select at least one venue to view upcoming shows.</p>
        </div>
      )
    } else {
      return groupedShows.map(({ weekStartDate, shows }) => (
        <section key={weekStartDate.toISOString()} className='show-grouping'>
          <h2>
            <span className='flex-shrink-0 font-mono text-xs uppercase md:text-lg'>
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
          <ul>
            {shows.map((show, i) => (
              <ShowCard key={i} show={show} i={0} />
            ))}
          </ul>
        </section>
      ))
    }
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <SiteMeta />

      <header>
        <h1
          className={`${
            animateOnScroll
              ? 'translate-y-[-6em] opacity-0'
              : 'mt-0.5 opacity-100 md:mt-1'
          }`}
        >
          Shows upcoming in CLE, updated daily
        </h1>
      </header>

      <div
        className={`dropdown-container ${
          animateOnScroll
            ? 'translate-y-0'
            : 'translate-y-[1.25em] md:translate-y-[2em]'
        }`}
      >
        <VenueFilter
          venues={allVenues} // array of all unique venues names
          selectedVenues={selectedVenues} // array of selected/checked
          onVenueToggle={handleVenueToggle} // function to handle toggling
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          checked={false}
        />
      </div>

      <main className='mx-auto flex flex-col gap-14'>
        {renderGroupedShows()}
      </main>

      <footer>
        <p>
          All data is pulled from the venues’ individual websites and aggregated
          here. No ownership of information is claimed nor implied.
        </p>
        <p>Support your scene and take care of each other.</p>
      </footer>
    </div>
  )
}
