import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { groupVenuesByTag, formatTag } from '~/utils/venue-utils'

type VenueDropdownProps = {
  venues: string[]
  selectedVenues: string[]
  onVenueToggle: (venue: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
}

export function VenueDropdown({
  venues,
  selectedVenues,
  onVenueToggle,
  onSelectAll,
  onDeselectAll,
}: VenueDropdownProps) {
  const { groupedVenues, sortedTags } = groupVenuesByTag(venues)

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className='dropdown-button group z-50 w-auto select-none rounded-md border border-gray-800 bg-gray-950 px-4 py-2 text-sm font-medium text-gray-50 shadow-[0_16px_24px_-16px_rgba(0,0,0,0.3),inset_0px_1px_0_rgba(255,255,255,0.25)] transition hover:bg-gray-800 focus:outline-none focus:ring focus:ring-lime-500/75 md:text-base'>
        Filter venues{' '}
        <span className='inline-block text-xs leading-none text-gray-400 transition-colors group-hover:text-gray-200'>
          ▼
        </span>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className='dropdown-content flex min-w-[280px] flex-col rounded-xl bg-gray-900 shadow-lg shadow-black/5 md:min-w-[400px]'>
          {sortedTags.map((tag, tagIndex) => (
            <div key={tag}>
              {/* Geographic tag header */}
              <div className='border-b border-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400'>
                {formatTag(tag)}
              </div>

              {/* Venues in this geographic group */}
              {groupedVenues[tag] &&
                groupedVenues[tag]
                  .sort((a, b) => a.localeCompare(b))
                  .map((venue, venueIndex) => (
                    <DropdownMenu.CheckboxItem
                      className='dropdown-item flex cursor-pointer items-center justify-start gap-x-2 px-4 py-1.5 font-medium text-gray-100 hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white focus:outline-none md:py-2'
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
                <div className='mx-4 my-1 h-px bg-gray-800' />
              )}
            </div>
          ))}

          <div className='mb-5 mt-3 grid grid-cols-2 gap-3 px-5'>
            <button
              className='rounded-md border border-gray-700 p-1.5 text-sm text-gray-400 transition hover:border-gray-600 hover:bg-gray-800 hover:text-gray-50'
              onClick={onDeselectAll}
            >
              Clear all
            </button>
            <button
              className='rounded-md border border-gray-700 p-1.5 text-sm text-gray-400 transition hover:border-gray-600 hover:bg-gray-800 hover:text-gray-50'
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
