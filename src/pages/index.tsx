import { useState, useEffect, useMemo } from 'react'
import { GetStaticProps } from 'next'
import { ShowProps, SearchResults } from '~/utils/types'

import generateRssFeed from '~/utils/generate-feed'

import { getVenueFiles, getVenueData } from '~/utils/get-venues'
import {
  shouldInitiallySelectVenue,
  getMappedVenueName,
  venueMetadata,
  VENUE_MAPPINGS,
} from '~/utils/venue-utils'

import { SiteMeta } from '~/components/meta'
import { VenueDropdown } from '~/components/venue-dropdown'
import { VenueSidebar } from '~/components/venue-sidebar'
import { ShowCard } from '~/components/show-card'
import { Search } from '~/components/search'

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
      const scrollThreshold = window.innerWidth < 480 ? 10 : 15
      setAnimateOnScroll(window.scrollY > scrollThreshold)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Create an array of all unique venues from shows (use mapped names)
  const venuesFromShows = Array.from(
    new Set(shows.map((show) => getMappedVenueName(show.venue))),
  )

  // Get all venues from metadata to ensure all geographic groups are represented
  // Include mapped venue names and non-mapped venue names
  const allVenues = Array.from(
    new Set([
      ...venuesFromShows,
      ...Object.keys(venueMetadata).filter(
        (venue) => !Object.keys(VENUE_MAPPINGS).includes(venue),
      ),
    ]),
  )

  // Initialize state for selected venues (excluding youngstown and akron)
  const [selectedVenues, setSelectedVenues] = useState<string[]>(
    allVenues.filter((venue) => shouldInitiallySelectVenue(venue)),
  )

  // State for search results
  const [searchResults, setSearchResults] = useState<SearchResults>({
    shows: [],
    query: '',
  })
  const [isSearchActive, setIsSearchActive] = useState(false)

  const handleVenueToggle = (venue: string) => {
    // venue is now already the mapped venue name
    setSelectedVenues((prevSelectedVenues) =>
      prevSelectedVenues.includes(venue)
        ? prevSelectedVenues.filter((v) => v !== venue)
        : [...prevSelectedVenues, venue],
    )
  }

  // Select and deselect all button logic
  const handleSelectAll = () => {
    setSelectedVenues([...allVenues])
  }

  const handleDeselectAll = () => {
    setSelectedVenues([])
  }

  // Handle search results
  const handleSearchResults = (results: SearchResults) => {
    setSearchResults(results)
    setIsSearchActive(results.query.trim() !== '')
  }

  // Filter shows by selected venues
  const filteredShows = shows.filter(
    (show) =>
      show.date !== '' &&
      selectedVenues.includes(getMappedVenueName(show.venue)),
  )

  // Use search results if search is active, otherwise use filtered shows
  const showsToProcess = isSearchActive ? searchResults.shows : filteredShows

  // Ignore shows that have already happened
  const filteredCurrentShows = showsToProcess.filter((show) => {
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
    // Get a show's first day of the week (starting on Monday)
    const weekStartDate = new Date(show.date)
    weekStartDate.setHours(0, 0, 0, 0)

    // Calculate # of days to subtract to get to Monday
    const daysToSubtract = (weekStartDate.getDay() + (days - monday)) % days
    // Subtract that many days to always get Mondays
    weekStartDate.setDate(weekStartDate.getDate() - daysToSubtract)

    // Convert the first day of the week to ISO
    const weekStartDateAsString = weekStartDate.toISOString()
    // Make an empty array if the first day of the week hasn't happened yet
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
        <div className='container mx-auto flex flex-col gap-1 rounded-sm border border-red-200 bg-red-50 p-6 text-center text-red-600 max-md:w-[90%] md:gap-2 dark:border-red-900 dark:bg-red-950 dark:text-red-300'>
          <h2 className='text-2xl font-medium md:text-3xl'>
            No shows available
          </h2>
          <p className='text-base leading-snug md:text-lg'>
            Please select a venue to view upcoming events.
          </p>
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

        if (weekStartToTodayDiff >= -7 && weekStartToTodayDiff < 0) {
          groupLabel = 'This week'
        } else if (weekStartToTodayDiff >= 0 && weekStartToTodayDiff < 6) {
          groupLabel = 'Next week'
        } else {
          groupPrefix = 'Week of'
        }

        return (
          <section key={weekStartDate.toISOString()} className='flex flex-col'>
            <h2 className='sticky top-16 flex w-full items-center justify-center gap-0 text-base text-gray-400 md:top-[14px] md:my-6 md:text-2xl'>
              {groupPrefix && (
                <span className='text-sm font-medium uppercase md:text-lg'>
                  {groupPrefix}&nbsp;
                </span>
              )}
              <span className='font-medium text-gray-500'>{groupLabel}</span>
            </h2>
            <ul className='container grid grid-cols-1 gap-4 max-lg:p-4 lg:grid-cols-2 lg:gap-8 xl:grid-cols-3'>
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
    <div className='flex min-h-screen flex-col'>
      <SiteMeta />

      {/* Mobile: Dropdown filter */}
      <header className='sticky top-0 mx-auto mb-6 h-[100px] w-full items-end justify-center gap-2 border-b border-b-black/10 bg-gray-50 p-4 pb-11 text-center text-sm shadow-xl shadow-black/[0.03] backdrop-blur md:hidden'>
        <div
          className={`relative w-full text-sm font-medium text-gray-600 transition duration-300 ease-in-out
            ${
              animateOnScroll
                ? 'translate-y-[-6em] opacity-0'
                : 'mt-0.5 opacity-100 md:mt-1'
            }`}
        >
          <h1>Upcoming live music in Cleveland, OH</h1>
        </div>
      </header>

      {/* Mobile: Search */}
      <div className='mb-4 px-4 md:hidden'>
        <Search shows={shows} onSearchResults={handleSearchResults} />
      </div>

      <div
        className={`fixed top-5 z-[1] mx-auto block w-full text-center transition duration-300 md:hidden ${
          animateOnScroll
            ? 'translate-y-0'
            : 'translate-y-[1.25em] md:translate-y-[2em]'
        }`}
      >
        <VenueDropdown
          venues={allVenues} // array of all unique venues names
          selectedVenues={selectedVenues} // array of selected/checked
          onVenueToggle={handleVenueToggle} // function to handle toggling
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
        />
      </div>

      {/* Desktop: Sidebar layout */}
      <div className='hidden md:flex'>
        <div
          className='sticky top-0 flex h-screen w-80 flex-col gap-4 overflow-y-auto border-r border-gray-50 bg-gray-50/50 p-6'
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'thin',
            scrollbarColor: '#666666 rgba(0,0,0,0)',
          }}
        >
          <Search shows={shows} onSearchResults={handleSearchResults} />
          <VenueSidebar
            venues={allVenues}
            selectedVenues={selectedVenues}
            onVenueToggle={handleVenueToggle}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
          />
          <footer className='container mx-auto mt-auto flex flex-col gap-2 text-center text-xs text-gray-400'>
            <p>
              All data is pulled from the venues’ individual websites and
              aggregated here. No ownership of information is claimed nor
              implied.
            </p>
          </footer>
        </div>
        <div className='flex-1'>
          <header className='sticky top-0 mx-auto h-[60px] w-full items-end justify-center gap-2 border-b border-gray-50 bg-gray-50/25 p-4 text-center text-sm shadow-xl shadow-black/[0.02] backdrop-blur'>
            <div
              className={`
                relative w-full text-sm font-medium text-gray-600 transition duration-300 ease-in-out ${
                  animateOnScroll
                    ? 'translate-y-[-6em] opacity-0'
                    : 'mt-0.5 opacity-100 md:mt-1'
                }`}
            >
              <h1>Upcoming live music in Cleveland, OH</h1>
            </div>
          </header>
          <main className='mx-6 py-6'>
            {isSearchActive && (
              <div className='mb-6 rounded-md border border-blue-200 bg-blue-50 p-4 text-blue-600 dark:border-blue-900 dark:bg-blue-950'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='text-lg font-medium'>Search results</h3>
                    <p className='text-sm'>
                      Found{' '}
                      <b>
                        {searchResults.shows.length} event
                        {searchResults.shows.length !== 1 ? 's' : ''}
                      </b>{' '}
                      for <b>{searchResults.query}</b>
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsSearchActive(false)
                      setSearchResults({ shows: [], query: '' })
                    }}
                    className='text-sm text-blue-600 underline hover:text-blue-800'
                  >
                    Clear search
                  </button>
                </div>
              </div>
            )}
            {renderGroupedShows()}
          </main>
        </div>
      </div>

      {/* Mobile: Main content */}
      <main className='mx-auto flex flex-col gap-14 md:hidden'>
        {isSearchActive && (
          <div className='mx-4 mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-medium text-blue-900'>
                  Search results
                </h3>
                <p className='text-sm text-blue-700'>
                  Found{' '}
                  <b>
                    {searchResults.shows.length} event
                    {searchResults.shows.length !== 1 ? 's' : ''}
                  </b>{' '}
                  for <b>{searchResults.query}</b>
                </p>
              </div>
              <button
                onClick={() => {
                  setIsSearchActive(false)
                  setSearchResults({ shows: [], query: '' })
                }}
                className='text-sm text-blue-600 underline hover:text-blue-800'
              >
                Clear search
              </button>
            </div>
          </div>
        )}
        {renderGroupedShows()}
      </main>

      <footer className='my-6 p-8 text-center text-xs md:hidden'>
        <p>
          All data is pulled from the venues&apos; individual websites and
          aggregated here. No ownership of information is claimed nor implied.
        </p>
      </footer>
    </div>
  )
}
