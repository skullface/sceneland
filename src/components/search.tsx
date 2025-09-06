import { useState, useMemo } from 'react'
import { ShowProps, SearchResults } from '~/utils/types'

interface SearchProps {
  shows: ShowProps[]
  onSearchResults: (results: SearchResults) => void
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
      // Check if any word matches artist names (with intelligent partial matching)
      const artistMatch = show.artist?.some((artist) => {
        const artistLower = artist.toLowerCase()
        return words.some((word) => {
          // Split artist name into words for precise matching
          const artistWords = artistLower
            .split(/[\s\-&,]+/)
            .filter((w) => w.length > 0)

          // Check for exact word matches (case-insensitive)
          const exactMatch = artistWords.some(
            (artistWord) =>
              artistWord === word ||
              artistWord.startsWith(word + '-') ||
              artistWord.endsWith('-' + word) ||
              artistWord.startsWith(word + ' ') ||
              artistWord.endsWith(' ' + word),
          )

          if (exactMatch) return true

          // Allow meaningful partial matches (like "girl" in "Angelgirl")
          // but only if the word is at least 3 characters and appears at word boundaries
          if (word.length >= 3) {
            // Check if the word appears at the beginning or end of any artist word
            // or if it's a meaningful substring that's not just random characters
            return artistWords.some((artistWord) => {
              // Match at word boundaries or as a meaningful substring
              return (
                artistWord.startsWith(word) ||
                artistWord.endsWith(word) ||
                (artistWord.length > word.length + 2 &&
                  artistWord.includes(word))
              )
            })
          }

          return false
        })
      })

      // Check if any word matches venue name (with intelligent partial matching)
      const venueMatch = words.some((word) => {
        const venueLower = show.venue.toLowerCase()
        const venueWords = venueLower
          .split(/[\s\-&]+/)
          .filter((w) => w.length > 0)

        // Check for exact word matches first
        const exactMatch = venueWords.some(
          (venueWord) =>
            venueWord === word ||
            venueWord.startsWith(word + '-') ||
            venueWord.endsWith('-' + word) ||
            venueWord.startsWith(word + ' ') ||
            venueWord.endsWith(' ' + word),
        )

        if (exactMatch) return true

        // Allow meaningful partial matches for venues too
        if (word.length >= 3) {
          return venueWords.some((venueWord) => {
            return (
              venueWord.startsWith(word) ||
              venueWord.endsWith(word) ||
              (venueWord.length > word.length + 2 && venueWord.includes(word))
            )
          })
        }

        return false
      })

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
    onSearchResults({ shows: results, query: searchQuery })
    setIsSearching(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (value.trim() === '') {
      onSearchResults({ shows: shows, query: '' })
    } else {
      handleSearch(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(query)
    }
  }

  const handleClear = () => {
    setQuery('')
    onSearchResults({ shows: shows, query: '' })
  }

  return (
    <div className='search-container mb-4'>
      <div className='relative'>
        <input
          type='text'
          placeholder='Search…'
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className='text-md w-full rounded-lg border border-gray-100 bg-gray-50 px-4 py-2 pl-10 pr-10 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500'
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
        {query && (
          <button
            onClick={handleClear}
            className='focus:outline-hidden absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600'
            type='button'
            aria-label='Clear search'
          >
            <svg
              className='h-5 w-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
