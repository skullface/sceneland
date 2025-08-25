import { useEffect, useState } from 'react'
import { GetStaticProps } from 'next'
import { ShowProps } from '~/utils/types'

import generateRssFeed from '~/utils/generate-feed'

import { getVenueFiles, getVenueData } from '~/utils/get-venues'
import venueMetadata from '~/data/venue-metadata.json'

import { SiteMeta } from '~/components/meta'
import { VenueFilter } from '~/components/venue-filter'
import { VenueSidebar } from '~/components/venue-sidebar'
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
  generateRssFeed()

  // Get all venue JSON files
  const venueFiles = getVenueFiles()

  // Load and combine all venue data
  const allShows = venueFiles.reduce<ShowProps[]>((acc, venueFile) => {
    const venueData = getVenueData(venueFile)
    return [...acc, ...venueData]
  }, [])

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

  // Helper function to check if a venue should be initially selected
  const shouldInitiallySelectVenue = (venueName: string): boolean => {
    // Check if the venue is tagged with youngstown or akron
    for (const [venue, tags] of Object.entries(venueMetadata)) {
      if (
        venue === venueName &&
        tags &&
        Array.isArray(tags) &&
        tags.length > 0
      ) {
        const tag = tags[0]
        if (tag === 'youngstown' || tag === 'akron') {
          return false // Don't select venues from these areas by default
        }
      }
    }
    return true // Select all other venues by default
  }

  // Initialize state for selected venues (excluding youngstown and akron)
  const [selectedVenues, setSelectedVenues] = useState<string[]>(
    allVenues.filter((venue) => shouldInitiallySelectVenue(venue)),
  )

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
  const filteredShows = shows.filter(
    (show) =>
      show.date !== '' &&
      selectedVenues.includes(venueMapping[show.venue] || show.venue),
  )

  // Ignore shows that have already happened
  const filteredCurrentShows = filteredShows.filter((show) => {
    const showDate = new Date(show.date)

    // Get the current date at 4am ET
    const currentDate = new Date()
    currentDate.setHours(4, 0, 0, 0)
    currentDate.toLocaleString('en-US', { timeZone: 'America/New_York' })

    // Convert the show date to US Eastern Time
    const showDateInET = new Date(
      showDate.toLocaleString('en-US', { timeZone: 'America/New_York' }),
    )

    return showDateInET >= currentDate
  })

  // Sort filtered shows chronologically by show date
  const sortedFilteredShows = filteredCurrentShows.sort(
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
      return groupedShows.map(({ weekStartDate, shows }) => {
        const today = new Date()
        const dayOfWeek = today.getDay()
        const weekStartToTodayDiff = Math.floor(
          (weekStartDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        )

        let groupPrefix = ''

        let groupLabel = weekStartDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })

        if (
          (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) &&
          weekStartToTodayDiff >= -7 &&
          weekStartToTodayDiff < 0
        ) {
          groupLabel = 'This weekend'
        } else if (weekStartToTodayDiff >= -6 && weekStartToTodayDiff < 0) {
          groupLabel = 'This week'
        } else if (weekStartToTodayDiff >= 0 && weekStartToTodayDiff < 6) {
          groupLabel = 'Next week'
        } else {
          groupPrefix = 'Week of'
        }

        return (
          <section key={weekStartDate.toISOString()} className='show-grouping'>
            <h2 className='md:sticky md:top-16'>
              {groupPrefix && (
                <span className='text-sm font-medium uppercase md:text-lg'>
                  {groupPrefix}&nbsp;
                </span>
              )}
              <span className='font-medium text-zinc-500 dark:text-zinc-400'>
                {groupLabel}
              </span>
            </h2>
            <ul>
              {shows.map((show, i) => (
                <ShowCard key={i} show={show} i={0} />
              ))}
            </ul>
          </section>
        )
      })
    }
  }

  const dateParts =
    process.env.NEXT_PUBLIC_LAST_UPDATED_AT?.split('-').map(Number) || []
  const year = dateParts[0] ?? 0
  const month = dateParts[1] ? dateParts[1] - 1 : 0
  const day = dateParts[2] ?? 0
  const dateObj = new Date(year, month, day)

  const isValidDate = (dateStr: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/
    return regex.test(dateStr)
  }

  return (
    <div className='body'>
      <SiteMeta />

      <header>
        <div
          className={`${
            animateOnScroll
              ? 'translate-y-[-6em] opacity-0'
              : 'mt-0.5 opacity-100 md:mt-1'
          }`}
        >
          <h1>Upcoming shows in Cleveland, OH</h1>
        </div>
      </header>

      {/* Mobile: Dropdown filter */}
      <div
        className={`dropdown-container block md:hidden ${
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

      {/* Desktop: Sidebar layout */}
      <div className='hidden md:flex'>
        <VenueSidebar
          venues={allVenues}
          selectedVenues={selectedVenues}
          onVenueToggle={handleVenueToggle}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
        />
        <main className='ml-6 flex-1'>{renderGroupedShows()}</main>
      </div>

      {/* Mobile: Main content */}
      <main className='main md:hidden'>{renderGroupedShows()}</main>

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
