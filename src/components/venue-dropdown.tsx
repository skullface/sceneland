import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Accordion from '@radix-ui/react-accordion'
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
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className='group z-50 w-auto cursor-pointer select-none rounded-md border border-gray-800 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow-[0_16px_24px_-16px_rgba(0,0,0,0.3),inset_0px_1px_0_rgba(255,255,255,0.25)] transition hover:bg-gray-800 focus:outline-none focus:ring focus:ring-blue-400 md:text-base'>
          Filter venues{' '}
          <span className='inline-block text-xs leading-none text-gray-400 transition-colors group-hover:text-gray-200'>
            ▼
          </span>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className='flex max-h-[66vh] min-w-[280px] flex-col rounded-xl bg-gray-900 shadow-lg shadow-black/15 md:max-h-[70vh] md:min-w-[400px]'
            sideOffset={8}
            align='center'
            side='bottom'
          >
            {/* Scrollable content container */}
            <div
              className='dropdown-content relative mx-4 max-h-[60vh] max-w-[calc(100vw-2rem)] flex-1 overflow-y-auto overscroll-contain rounded-xl md:mx-0 md:max-h-none md:max-w-none'
              style={{
                WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'smooth',
                scrollbarWidth: 'thin',
                scrollbarColor: '#4b5563 #1f2937',
              }}
            >
              {/* Top fade indicator */}
              <div className='pointer-events-none sticky top-0 z-20 h-2 bg-gradient-to-b from-gray-900 to-transparent' />

              <Accordion.Root
                type='multiple'
                defaultValue={sortedTags}
                className='grid gap-0'
              >
                {sortedTags.map((tag, tagIndex) => (
                  <Accordion.Item
                    key={tag}
                    value={tag}
                    className='border-b border-gray-800 last:border-b-0'
                  >
                    <Accordion.Header className='group flex'>
                      <Accordion.Trigger className='flex flex-1 items-center justify-between px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 transition-colors hover:text-gray-200 focus:outline-none'>
                        {formatTag(tag)}
                        <span className='text-xs transition-transform duration-100 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180'>
                          ▼
                        </span>
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className='data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden'>
                      <div className='grid gap-0'>
                        {groupedVenues[tag] &&
                          groupedVenues[tag]
                            .sort((a, b) => a.localeCompare(b))
                            .map((venue, venueIndex) => (
                              <DropdownMenu.CheckboxItem
                                className='flex cursor-pointer items-center justify-start gap-x-2 px-4 py-1.5 font-medium text-gray-100 hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white focus:outline-none md:py-2'
                                key={venue
                                  .replace(/[^\w]+/g, '-')
                                  .toLowerCase()}
                                checked={selectedVenues.includes(venue)}
                                onSelect={(event) => {
                                  event.preventDefault() // Prevent menu from closing after selection
                                  onVenueToggle(venue)
                                }}
                              >
                                {venue}
                                <span
                                  className={`order-first w-5 text-center ${
                                    selectedVenues.includes(venue)
                                      ? 'text-green-600'
                                      : 'text-gray-400'
                                  }`}
                                >
                                  {selectedVenues.includes(venue) ? '✓' : '×'}
                                </span>
                              </DropdownMenu.CheckboxItem>
                            ))}
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                ))}
              </Accordion.Root>

              {/* Bottom fade indicator */}
              <div className='pointer-events-none sticky bottom-0 z-20 h-2 bg-gradient-to-t from-gray-900 to-transparent' />
            </div>

            {/* Fixed bottom section with action buttons */}
            <div className='sticky bottom-0 rounded-b-xl border-t border-gray-800 bg-gray-900 px-4 py-3'>
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
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  )
}
