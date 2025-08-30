import { useState, useMemo } from 'react'
import { ShowProps } from '~/utils/types'

interface SearchProps {
  shows: ShowProps[]
  onSearchResults: (results: ShowProps[]) => void
}

export function Search({ shows, onSearchResults }: SearchProps) {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Process search query with natural language understanding
  const processSearchQuery = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      return shows
    }

    const query = searchQuery.toLowerCase().trim()
    const words = query.split(/\s+/)

    return shows.filter((show) => {
      // Check if any word matches artist names (with fuzzy matching)
      const artistMatch = show.artist?.some((artist) => {
        const artistLower = artist.toLowerCase()
        return words.some((word) => {
          // Exact word match
          if (artistLower.includes(word)) return true

          // Partial word match (for cases like "devo" matching "devotional")
          if (word.length >= 3 && artistLower.includes(word)) return true

          // Check if word is contained within any part of artist name
          const artistWords = artistLower.split(/[\s\-&]+/)
          return artistWords.some(
            (artistWord) =>
              artistWord.includes(word) || word.includes(artistWord),
          )
        })
      })

      // Check if any word matches venue name
      const venueMatch = words.some((word) =>
        show.venue.toLowerCase().includes(word),
      )

      // Check for date patterns
      const dateMatch = words.some((word) => {
        // Check for month abbreviations (jan, feb, mar, etc.) and full names
        const monthAbbr = [
          'jan',
          'january',
          'feb',
          'february',
          'mar',
          'march',
          'apr',
          'april',
          'may',
          'jun',
          'june',
          'jul',
          'july',
          'aug',
          'august',
          'sep',
          'september',
          'oct',
          'october',
          'nov',
          'november',
          'dec',
          'december',
        ]
        const monthIndex = monthAbbr.findIndex((m) => m === word)

        if (monthIndex !== -1) {
          const showDate = new Date(show.date)
          // Map the month index to actual month (0-11)
          const actualMonth = Math.floor(monthIndex / 2)
          return showDate.getMonth() === actualMonth
        }

        // Check for day numbers (1-31)
        const dayNum = parseInt(word)
        if (!isNaN(dayNum) && dayNum >= 1 && dayNum <= 31) {
          const showDate = new Date(show.date)
          return showDate.getDate() === dayNum
        }

        // Check for year
        if (word === '2025' || word === '2026') {
          const showDate = new Date(show.date)
          return showDate.getFullYear().toString().includes(word)
        }

        return false
      })

      return artistMatch || venueMatch || dateMatch
    })
  }

  const handleSearch = async (searchQuery: string) => {
    setIsSearching(true)
    setQuery(searchQuery)

    // Simulate a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 100))

    const results = processSearchQuery(searchQuery)
    onSearchResults(results)
    setIsSearching(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (value.trim() === '') {
      onSearchResults(shows)
    } else {
      handleSearch(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(query)
    }
  }

  return (
    <div className='search-container mb-4'>
      <div className='relative'>
        <input
          type='text'
          placeholder='Search artists, venues, dates...'
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className='w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500'
        />
        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
          <svg
            className='h-5 w-5 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </div>
        {isSearching && (
          <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
            <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-blue-500'></div>
          </div>
        )}
      </div>

      {query && (
        <div className='mt-2 text-sm text-gray-600'>
          Search results will appear below
        </div>
      )}

      {/* Search suggestions */}
      {!query && (
        <div className='mt-2 text-xs text-gray-500'>
          <p className='mb-1'>Try searching for:</p>
          <div className='flex flex-wrap gap-1'>
            <button
              onClick={() => handleSearch('devo')}
              className='cursor-pointer rounded bg-gray-100 px-2 py-1 text-xs transition-colors hover:bg-gray-200'
            >
              devo
            </button>
            <button
              onClick={() => handleSearch('beachland aug 30')}
              className='cursor-pointer rounded bg-gray-100 px-2 py-1 text-xs transition-colors hover:bg-gray-200'
            >
              beachland aug 30
            </button>
            <button
              onClick={() => handleSearch('girl')}
              className='cursor-pointer rounded bg-gray-100 px-2 py-1 text-xs transition-colors hover:bg-gray-200'
            >
              girl
            </button>
            <button
              onClick={() => handleSearch('august')}
              className='cursor-pointer rounded bg-gray-100 px-2 py-1 text-xs transition-colors hover:bg-gray-200'
            >
              august
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
