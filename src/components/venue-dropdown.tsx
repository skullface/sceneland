import {
  DisclosureGroup,
  Disclosure,
  Button,
  DisclosurePanel,
  Heading,
  MenuTrigger,
  Popover,
} from 'react-aria-components'
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
    <>
      <style jsx>{`
        .dropdown-content > div:first-child::-webkit-scrollbar {
          width: 8px;
        }
        .dropdown-content > div:first-child::-webkit-scrollbar-track {
          background-color: #1f2937;
          border-radius: 4px;
        }
        .dropdown-content > div:first-child::-webkit-scrollbar-thumb {
          background-color: #4b5563;
          border-radius: 4px;
        }
        .dropdown-content > div:first-child::-webkit-scrollbar-thumb:hover {
          background-color: #6b7280;
        }
      `}</style>
      <MenuTrigger>
        <Button className='group z-50 w-auto cursor-pointer select-none rounded-md border border-gray-800 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow-[0_16px_24px_-16px_rgba(0,0,0,0.3),inset_0px_1px_0_rgba(255,255,255,0.25)] transition hover:bg-gray-800 focus:outline-none focus:ring focus:ring-blue-400 md:text-base'>
          Filter venues{' '}
          <span className='inline-block text-xs leading-none text-gray-400 transition-colors group-hover:text-gray-200'>
            ▼
          </span>
        </Button>
        <Popover
          className='flex h-[70vh] min-w-[280px] flex-col rounded-xl bg-gray-900 shadow-lg shadow-black/15 md:min-w-[400px]'
          placement='bottom'
        >
          {/* Scrollable content container */}
          <div
            className='dropdown-content relative mx-4 flex-1 overflow-y-auto overscroll-contain rounded-xl md:mx-0'
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth',
              scrollbarWidth: 'thin',
              scrollbarColor: '#4b5563 #1f2937',
            }}
          >
            {/* Top fade indicator */}
            <div className='pointer-events-none sticky top-0 z-20 h-2 bg-gradient-to-b from-gray-900 to-transparent' />

            <DisclosureGroup
              defaultExpandedKeys={sortedTags}
              allowsMultipleExpanded
              className='grid gap-0'
            >
              {sortedTags.map((tag, tagIndex) => (
                <Disclosure
                  key={tag}
                  id={tag}
                  className='border-b border-gray-800 last:border-b-0'
                >
                  <Heading>
                    <Button
                      slot='trigger'
                      className='group flex w-full flex-1 items-center justify-between px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 transition-colors hover:text-gray-200 focus:outline-none'
                    >
                      {formatTag(tag)}
                      <span className='text-xs transition-transform duration-100 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[expanded]:rotate-180'>
                        ▼
                      </span>
                    </Button>
                  </Heading>
                  <DisclosurePanel className='data-[entering]:animate-disclosure-down data-[exiting]:animate-disclosure-up overflow-hidden'>
                    <div className='grid gap-0'>
                      {groupedVenues[tag] &&
                        groupedVenues[tag]
                          .sort((a, b) => a.localeCompare(b))
                          .map((venue, venueIndex) => (
                            <label
                              className='flex cursor-pointer items-center justify-start gap-x-2 px-4 py-1.5 font-medium text-gray-100 focus-within:bg-gray-800 focus-within:text-white hover:bg-gray-800 hover:text-white md:py-2'
                              key={venue.replace(/[^\w]+/g, '-').toLowerCase()}
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault()
                                  onVenueToggle(venue)
                                }
                              }}
                            >
                              <input
                                type='checkbox'
                                checked={selectedVenues.includes(venue)}
                                onChange={() => onVenueToggle(venue)}
                                className='h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-600 accent-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0'
                                tabIndex={-1}
                              />
                              {venue}
                            </label>
                          ))}
                    </div>
                  </DisclosurePanel>
                </Disclosure>
              ))}
            </DisclosureGroup>

            {/* Bottom fade indicator */}
            <div className='pointer-events-none sticky bottom-0 z-20 h-2 bg-gradient-to-t from-gray-900 to-transparent' />
          </div>

          {/* Fixed bottom section with action buttons */}
          <div className='rounded-b-xl border-t border-gray-800 bg-gray-900 px-4 py-3'>
            <button
              className='w-full rounded-md border border-gray-700 p-2 text-sm text-gray-400 transition hover:border-gray-600 hover:bg-gray-800 hover:text-gray-50'
              onClick={() => {
                if (selectedVenues.length === venues.length) {
                  onDeselectAll()
                } else {
                  onSelectAll()
                }
              }}
            >
              {selectedVenues.length === 0
                ? 'Select all venues'
                : selectedVenues.length === venues.length
                  ? 'Deselect all venues'
                  : 'Select all venues'}
            </button>
          </div>
        </Popover>
      </MenuTrigger>
    </>
  )
}
