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
    <MenuTrigger>
      <Button className='group z-50 w-auto cursor-pointer select-none rounded-md border border-gray-800 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow-[0_16px_24px_-16px_rgba(0,0,0,0.3),inset_0px_1px_0_rgba(255,255,255,0.25)] transition hover:bg-gray-800 focus:outline-none focus:ring focus:ring-blue-400 md:text-base'>
        Filter venues{' '}
        <span className='inline-block text-xs leading-none text-gray-400 transition-colors group-hover:text-gray-200'>
          ▼
        </span>
      </Button>
      <Popover
        className='flex h-[70vh] min-w-[280px] flex-col rounded-xl bg-gray-900 shadow-lg shadow-black/15 focus:outline-none'
        placement='bottom'
      >
        {/* Scrollable content container */}
        <div
          className='dropdown-content relative flex-1 overflow-y-auto overscroll-contain rounded-t-xl p-2'
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'thin',
            scrollbarColor: '#4b5563 rgba(0,0,0,0)', // gray-400, gray-900
          }}
        >
          <DisclosureGroup
            defaultExpandedKeys={sortedTags}
            allowsMultipleExpanded
            className='grid gap-2'
          >
            {sortedTags.map((tag, tagIndex) => (
              <Disclosure
                key={tag}
                id={tag}
                className='border-b border-gray-800 pb-2 last:border-b-0'
              >
                <Heading>
                  <Button
                    slot='trigger'
                    className='group relative z-20 flex w-full flex-1 items-center justify-between rounded p-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 transition-colors hover:text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    {formatTag(tag)}
                    <span className='text-xs transition-transform duration-100 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[expanded]:rotate-180'>
                      ▼
                    </span>
                  </Button>
                </Heading>
                <DisclosurePanel className='data-[entering]:animate-disclosure-down data-[exiting]:animate-disclosure-up overflow-hidden'>
                  <ul className='grid gap-0'>
                    {groupedVenues[tag] &&
                      groupedVenues[tag]
                        .sort((a, b) => a.localeCompare(b))
                        .map((venue, venueIndex) => (
                          <li
                            key={venue.replace(/[^\w]+/g, '-').toLowerCase()}
                            className='px-2'
                          >
                            <label
                              className='-mx-2 flex cursor-pointer items-center justify-start gap-x-2 rounded px-2 py-0.5 font-medium text-gray-300 focus-within:bg-gray-700 focus-within:text-gray-50 focus-within:outline-none hover:bg-gray-800 hover:text-gray-50'
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault()
                                  onVenueToggle(venue)
                                }
                              }}
                            >
                              <div className='relative'>
                                <input
                                  type='checkbox'
                                  checked={selectedVenues.includes(venue)}
                                  onChange={() => onVenueToggle(venue)}
                                  className='sr-only'
                                  tabIndex={-1}
                                />
                                <div
                                  className={`flex size-4 items-center justify-center rounded border border-gray-600 bg-gray-800 ${
                                    selectedVenues.includes(venue)
                                      ? 'border-blue-600 bg-blue-600'
                                      : ''
                                  }`}
                                >
                                  {selectedVenues.includes(venue) && (
                                    <svg
                                      className='size-3 text-gray-50'
                                      fill='currentColor'
                                      viewBox='0 0 20 20'
                                    >
                                      <path
                                        fillRule='evenodd'
                                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                        clipRule='evenodd'
                                      />
                                    </svg>
                                  )}
                                </div>
                              </div>
                              {venue}
                            </label>
                          </li>
                        ))}
                  </ul>
                </DisclosurePanel>
              </Disclosure>
            ))}
          </DisclosureGroup>

          {/* Bottom fade indicator */}
          <div className='pointer-events-none sticky -bottom-2 z-20 h-4 bg-gradient-to-t from-gray-900 to-transparent dark:from-gray-50' />
        </div>

        {/* Fixed bottom section with action buttons */}
        <div className='rounded-b-xl border-t border-gray-800 bg-gray-900 p-3'>
          <button
            className='w-full rounded-md border border-gray-700 p-2 text-sm text-gray-400 transition hover:border-gray-600 hover:bg-gray-800 hover:text-gray-50 focus:border-blue-500 focus:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0'
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
  )
}
