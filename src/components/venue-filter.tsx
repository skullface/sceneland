import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import venueMetadata from '~/data/venue-metadata.json'

type VenueFilterProps = {
  venues: string[]
  selectedVenues: string[]
  onVenueToggle: (venue: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
  checked: boolean
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

export function VenueFilter({
  venues,
  selectedVenues,
  onVenueToggle,
  onSelectAll,
  onDeselectAll,
}: VenueFilterProps) {
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
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className='dropdown-button group z-50 w-auto select-none rounded-md border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-50 shadow-[0_16px_24px_-16px_rgba(0,0,0,0.3),inset_0px_1px_0_rgba(255,255,255,0.25)] transition hover:bg-zinc-800 focus:outline-none focus:ring focus:ring-lime-500/75 md:text-base dark:border-white dark:bg-zinc-100 dark:text-zinc-800 dark:hover:bg-white'>
        Filter venues{' '}
        <span className='inline-block text-xs leading-none text-zinc-400 transition-colors group-hover:text-zinc-200 dark:group-hover:text-zinc-500'>
          ▼
        </span>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className='dropdown-content flex min-w-[280px] flex-col rounded-xl bg-zinc-900 shadow-lg shadow-black/5 md:min-w-[400px] dark:bg-zinc-50'>
          {sortedTags.map((tag, tagIndex) => (
            <div key={tag}>
              {/* Geographic tag header */}
              <div className='border-b border-zinc-800 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:border-zinc-200 dark:text-zinc-500'>
                {formatTag(tag)}
              </div>

              {/* Venues in this geographic group */}
              {groupedVenues[tag] &&
                groupedVenues[tag]
                  .sort((a, b) => a.localeCompare(b))
                  .map((venue, venueIndex) => (
                    <DropdownMenu.CheckboxItem
                      className='dropdown-item flex cursor-pointer items-center justify-start gap-x-2 px-4 py-1.5 font-medium text-zinc-100 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white focus:outline-none md:py-2 dark:text-zinc-800 dark:hover:bg-zinc-200 dark:hover:text-zinc-950 dark:focus:bg-zinc-200 dark:focus:text-zinc-950'
                      key={venue.replace(/[^\w]+/g, '-').toLowerCase()}
                      checked={selectedVenues.includes(venue)}
                      onSelect={(event) => {
                        event.preventDefault() // Prevent menu from closing after selection
                        onVenueToggle(venue)
                      }}
                    >
                      {venue}
                      <span className='order-first w-5 text-center'>
                        {selectedVenues.includes(venue) ? '✓' : '×'}
                      </span>
                    </DropdownMenu.CheckboxItem>
                  ))}

              {/* Add separator between groups (except after the last group) */}
              {tagIndex < sortedTags.length - 1 && (
                <div className='mx-4 my-1 h-px bg-zinc-800 dark:bg-zinc-200' />
              )}
            </div>
          ))}

          <div className='mb-5 mt-3 grid grid-cols-2 gap-3 px-5'>
            <button
              className='rounded-md border border-zinc-700 p-1.5 text-sm text-zinc-400 transition hover:border-zinc-600 hover:bg-zinc-800 hover:text-zinc-50 dark:border-zinc-200 dark:text-zinc-500 dark:hover:border-zinc-300 dark:hover:bg-zinc-100 dark:hover:text-zinc-800'
              onClick={onDeselectAll}
            >
              Clear all
            </button>
            <button
              className='rounded-md border border-zinc-700 p-1.5 text-sm text-zinc-400 transition hover:border-zinc-600 hover:bg-zinc-800 hover:text-zinc-50 dark:border-zinc-200 dark:text-zinc-500 dark:hover:border-zinc-300 dark:hover:bg-zinc-100 dark:hover:text-zinc-800'
              onClick={onSelectAll}
            >
              Select all
            </button>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
