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
import { CustomCheckbox } from './custom-checkbox'

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
      <Button className='bg-gray-1000 border-gray-1000 hover:text-gray-0 group z-50 w-auto cursor-pointer select-none rounded-md border px-4 py-2 text-sm font-medium text-gray-50 shadow-[0_16px_24px_-16px_rgba(0,0,0,0.3),inset_0px_1px_0_rgba(255,255,255,0.25)] hover:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-blue-400 md:text-base'>
        Filter venues{' '}
        <span className='inline-block text-xs leading-none text-gray-400 group-hover:text-gray-200'>
          ▼
        </span>
      </Button>
      <Popover
        className='bg-gray-0 flex h-[70vh] min-w-[280px] flex-col rounded-xl shadow-lg shadow-black/15 focus:outline-none'
        placement='bottom'
      >
        {/* Scrollable content container */}
        <div
          className='dropdown-content relative flex-1 overflow-y-auto overscroll-contain rounded-t-xl p-2'
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'thin',
            scrollbarColor: '#666666 rgba(0,0,0,0)', // gray-400, gray-900
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
                className='border-b border-gray-50 pb-4 last:border-b-0 last-of-type:pb-0'
              >
                {({ isExpanded }) => (
                  <>
                    <Heading>
                      <Button
                        slot='trigger'
                        className='group relative z-20 flex w-full flex-1 items-center justify-between rounded-sm p-2 text-left font-mono text-sm uppercase tracking-wide text-gray-500 transition-colors'
                      >
                        {formatTag(tag)}
                        <span
                          className={`text-xs ${isExpanded ? 'rotate-180' : ''}`}
                        >
                          ▼
                        </span>
                      </Button>
                    </Heading>
                    <DisclosurePanel className='data-[entering]:animate-disclosure-down data-[exiting]:animate-disclosure-up overflow-hidden'>
                      <ul className='-mt-1 grid gap-0'>
                        {groupedVenues[tag] &&
                          groupedVenues[tag]
                            .sort((a, b) => a.localeCompare(b))
                            .map((venue) => (
                              <li
                                key={venue
                                  .replace(/[^\w]+/g, '-')
                                  .toLowerCase()}
                                className='px-2'
                              >
                                <button
                                  type='button'
                                  className='focus:text-gray-1000 group flex w-full cursor-pointer items-center gap-2 rounded-sm py-0.5 text-gray-700 first:mt-1 focus:outline-none'
                                  onClick={() => onVenueToggle(venue)}
                                >
                                  <CustomCheckbox
                                    checked={selectedVenues.includes(venue)}
                                    onChange={() => onVenueToggle(venue)}
                                  />
                                  <span className='group-hover:text-gray-1000 text-sm font-medium'>
                                    {venue}
                                  </span>
                                </button>
                              </li>
                            ))}
                      </ul>
                    </DisclosurePanel>
                  </>
                )}
              </Disclosure>
            ))}
          </DisclosureGroup>

          {/* Bottom fade indicator */}
          <div className='from-gray-0 pointer-events-none sticky -bottom-2 z-20 h-4 bg-gradient-to-t to-transparent' />
        </div>

        {/* Fixed bottom section with action buttons */}
        <div className='bg-gray-0 rounded-b-xl border-t border-gray-50 p-3'>
          <button
            className='hover:text-gray-1000 text-shadow-xs inset-shadow-xs inset-shadow-white/[0.075] text-shadow-gray-50 focus:inset-shadow-gray-50/50 focus:text-gray-1000 w-full flex-1 cursor-pointer rounded-sm border border-gray-100/50 bg-gray-50 px-2 py-1.5 text-xs font-medium text-gray-700 shadow-md shadow-black/[0.02] transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/80'
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
