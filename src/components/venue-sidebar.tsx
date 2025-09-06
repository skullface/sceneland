import { groupVenuesByTag, formatTag } from '~/utils/venue-utils'
import {
  DisclosureGroup,
  Disclosure,
  Button,
  DisclosurePanel,
  Heading,
} from 'react-aria-components'

type VenueSidebarProps = {
  venues: string[]
  selectedVenues: string[]
  onVenueToggle: (venue: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
}

export function VenueSidebar({
  venues,
  selectedVenues,
  onVenueToggle,
  onSelectAll,
  onDeselectAll,
}: VenueSidebarProps) {
  const { groupedVenues, sortedTags } = groupVenuesByTag(venues)

  const handleSelectAllInSection = (tag: string) => {
    const venuesInSection =
      groupedVenues[tag as keyof typeof groupedVenues] || []
    venuesInSection.forEach((venue: string) => {
      if (!selectedVenues.includes(venue)) {
        onVenueToggle(venue)
      }
    })
  }

  const handleClearAllInSection = (tag: string) => {
    const venuesInSection =
      groupedVenues[tag as keyof typeof groupedVenues] || []
    venuesInSection.forEach((venue: string) => {
      if (selectedVenues.includes(venue)) {
        onVenueToggle(venue)
      }
    })
  }

  const handleToggleAllInSection = (tag: string) => {
    const venuesInSection =
      groupedVenues[tag as keyof typeof groupedVenues] || []
    const selectedInSection = venuesInSection.filter((venue: string) =>
      selectedVenues.includes(venue),
    )

    // If all venues in section are selected, deselect all
    // Otherwise, select all unselected venues
    if (selectedInSection.length === venuesInSection.length) {
      handleClearAllInSection(tag)
    } else {
      handleSelectAllInSection(tag)
    }
  }

  const getToggleButtonText = (tag: string) => {
    const venuesInSection =
      groupedVenues[tag as keyof typeof groupedVenues] || []
    const selectedInSection = venuesInSection.filter((venue: string) =>
      selectedVenues.includes(venue),
    )

    if (selectedInSection.length === 0) {
      return 'Select all'
    } else if (selectedInSection.length === venuesInSection.length) {
      return 'Deselect all'
    } else {
      return `Select remaining (${venuesInSection.length - selectedInSection.length})`
    }
  }

  const handleToggleAll = () => {
    if (selectedVenues.length === venues.length) {
      onDeselectAll()
    } else {
      onSelectAll()
    }
  }

  const getGlobalToggleButtonText = () => {
    if (selectedVenues.length === 0) {
      return 'Select all venues'
    } else if (selectedVenues.length === venues.length) {
      return 'Deselect all venues'
    } else {
      return 'Select all venues'
    }
  }

  return (
    <aside className='flex flex-col gap-4'>
      <h2 className='text-lg font-semibold text-gray-900'>Filter Venues</h2>

      <DisclosureGroup
        allowsMultipleExpanded
        defaultExpandedKeys={['downtown']}
        className='grid gap-2'
      >
        {sortedTags.map((tag) => (
          <Disclosure
            key={tag}
            id={tag}
            className='rounded-lg border border-gray-100 bg-gray-50/50 focus-within:border-gray-200'
          >
            <Heading>
              <Button
                slot='trigger'
                className='not-open:rounded-lg hover:text-gray-1000 group flex w-full flex-1 cursor-pointer items-center justify-between bg-gray-50 p-1.5 px-2.5 text-left font-mono text-sm font-medium uppercase text-gray-600 transition-colors focus:outline-none'
              >
                {formatTag(tag)}
                <span className='text-xs transition-transform duration-100 ease-[cubic-bezier(0.87,_0,_0.13,_1)] open:rotate-180 group-data-[expanded]:rotate-180'>
                  ▼
                </span>
              </Button>
            </Heading>
            <DisclosurePanel className='data-[entering]:animate-disclosure-down data-[exiting]:animate-disclosure-up grid'>
              <ul className='-mt-1 grid list-none rounded-b-lg border-b border-gray-100/50 bg-gray-50 pb-2'>
                {groupedVenues[tag] &&
                  groupedVenues[tag]
                    .sort((a, b) => a.localeCompare(b))
                    .map((venue) => (
                      <li key={venue.replace(/[^\w]+/g, '-').toLowerCase()}>
                        <button
                          type='button'
                          className='group flex w-full cursor-pointer items-center gap-2 rounded-sm px-3 py-0.5 first:mt-1 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                          onClick={() => onVenueToggle(venue)}
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
                            className='size-4 rounded-sm border-gray-300 text-blue-600 accent-blue-600 focus:outline-none'
                            tabIndex={-1}
                          />
                          <span className='group-hover:text-gray-1000 text-sm font-normal text-gray-900'>
                            {venue}
                          </span>
                        </button>
                      </li>
                    ))}
              </ul>
              <button
                className='hover:text-gray-1000 text-shadow-xs inset-shadow-xs inset-shadow-white/[0.075] text-shadow-gray-50 focus:inset-shadow-gray-50/50 focus:text-gray-1000 m-3 flex-1 cursor-pointer rounded-sm border border-gray-100/50 bg-gray-50 px-2 py-1.5 text-xs font-medium text-gray-700 shadow-md shadow-black/[0.02] transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/80'
                onClick={() => handleToggleAllInSection(tag)}
              >
                {getToggleButtonText(tag)}
              </button>
            </DisclosurePanel>
          </Disclosure>
        ))}
      </DisclosureGroup>

      <button
        className='hover:text-gray-1000 text-shadow-xs inset-shadow-xs inset-shadow-white/[0.03] text-shadow-gray-50 focus:inset-shadow-gray-50/50 focus:text-gray-1000 flex-1 cursor-pointer rounded-md border border-gray-100/25 bg-gray-50/50 p-2.5 text-sm font-medium text-gray-700 shadow-md shadow-black/[0.03] transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/80'
        onClick={handleToggleAll}
      >
        {getGlobalToggleButtonText()}
      </button>
    </aside>
  )
}
