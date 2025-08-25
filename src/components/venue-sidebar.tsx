import venueMetadata from '~/data/venue-metadata.json'

type VenueSidebarProps = {
  venues: string[]
  selectedVenues: string[]
  onVenueToggle: (venue: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
}

// Helper function to get geographic tag for a venue
function getVenueTag(venueName: string): string {
  // Handle venue name mappings from the main page
  const venueMapping: { [key: string]: string } = {
    'Beachland Ballroom': 'Beachland',
    'Beachland Tavern': 'Beachland',
    "Mahall's Apartment": "Mahall's",
    "The Roxy at Mahall's": "Mahall's",
  }

  const mappedVenue = venueMapping[venueName] || venueName

  // First try to find the mapped venue name in metadata
  for (const [venue, tags] of Object.entries(venueMetadata)) {
    if (
      venue === mappedVenue &&
      tags &&
      Array.isArray(tags) &&
      tags.length > 0 &&
      tags[0]
    ) {
      return tags[0]
    }
  }

  // If not found, try the original venue name
  for (const [venue, tags] of Object.entries(venueMetadata)) {
    if (
      venue === venueName &&
      tags &&
      Array.isArray(tags) &&
      tags.length > 0 &&
      tags[0]
    ) {
      return tags[0]
    }
  }

  // Fallback to 'other' if no tag found
  return 'other'
}

// Helper function to format geographic tag for display
function formatTag(tag: string): string {
  const tagFormats: { [key: string]: string } = {
    eastside: 'East Side',
    westside: 'West Side',
    downtown: 'Downtown',
    akron: 'Akron',
    youngstown: 'Youngstown',
    other: 'Other',
  }

  return tagFormats[tag] || tag.charAt(0).toUpperCase() + tag.slice(1)
}

export function VenueSidebar({
  venues,
  selectedVenues,
  onVenueToggle,
  onSelectAll,
  onDeselectAll,
}: VenueSidebarProps) {
  // Group venues by their geographic tags
  const groupedVenues = venues.reduce(
    (acc, venue) => {
      const tag = getVenueTag(venue)
      if (!acc[tag]) {
        acc[tag] = []
      }
      acc[tag].push(venue)
      return acc
    },
    {} as { [tag: string]: string[] },
  )

  // Sort tags in a logical order
  const tagOrder = [
    'downtown',
    'eastside',
    'westside',
    'akron',
    'youngstown',
    'other',
  ]
  const sortedTags = tagOrder.filter((tag) => groupedVenues[tag])

  return (
    <aside className='sticky top-0 h-screen w-80 overflow-y-auto border-r border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900'>
      <div className='mb-6'>
        <h2 className='mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100'>
          Filter Venues
        </h2>

        <div className='mb-4 flex gap-2'>
          <button
            className='flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-700'
            onClick={onSelectAll}
          >
            Select all
          </button>
          <button
            className='flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-700'
            onClick={onDeselectAll}
          >
            Clear all
          </button>
        </div>
      </div>

      <div className='space-y-6'>
        {sortedTags.map((tag) => (
          <div key={tag}>
            {/* Geographic tag header */}
            <div className='mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400'>
              {formatTag(tag)}
            </div>

            {/* Venues in this geographic group */}
            <div className='space-y-2'>
              {groupedVenues[tag] &&
                groupedVenues[tag]
                  .sort((a, b) => a.localeCompare(b))
                  .map((venue) => (
                    <label
                      key={venue.replace(/[^\w]+/g, '-').toLowerCase()}
                      className='group flex cursor-pointer items-center gap-3'
                    >
                      <input
                        type='checkbox'
                        checked={selectedVenues.includes(venue)}
                        onChange={() => onVenueToggle(venue)}
                        className='h-4 w-4 rounded border-zinc-300 text-lime-600 focus:ring-lime-500 dark:border-zinc-600 dark:bg-zinc-800'
                      />
                      <span className='text-sm font-medium text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-zinc-100'>
                        {venue}
                      </span>
                    </label>
                  ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
