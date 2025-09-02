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
            className='rounded-md border border-gray-200'
          >
            <Heading>
              <Button
                slot='trigger'
                className='group flex w-full flex-1 items-center justify-between rounded p-1 px-2 text-left text-sm font-semibold uppercase tracking-wider text-gray-500 transition-colors hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
              >
                {formatTag(tag)}
                <span className='text-xs transition-transform duration-100 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[expanded]:rotate-180'>
                  ▼
                </span>
              </Button>
            </Heading>
            <DisclosurePanel className='data-[entering]:animate-disclosure-down data-[exiting]:animate-disclosure-up grid'>
              <ul className='grid list-none'>
                {groupedVenues[tag] &&
                  groupedVenues[tag]
                    .sort((a, b) => a.localeCompare(b))
                    .map((venue) => (
                      <li key={venue.replace(/[^\w]+/g, '-').toLowerCase()}>
                        <label
                          className='group flex cursor-pointer items-center gap-2 rounded px-2 py-0.5 first:mt-1 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-1'
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
                            className='size-4 rounded border-gray-300 text-blue-600 accent-blue-600 focus:outline-none'
                            tabIndex={-1}
                          />
                          <span className='text-sm font-medium text-gray-700 group-hover:text-gray-900'>
                            {venue}
                          </span>
                        </label>
                      </li>
                    ))}
              </ul>
              <button
                className='m-2 mt-3 flex-1 rounded border border-gray-300 bg-gray-100 px-2 py-1 text-xs text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50'
                onClick={() => handleToggleAllInSection(tag)}
              >
                {getToggleButtonText(tag)}
              </button>
            </DisclosurePanel>
          </Disclosure>
        ))}
      </DisclosureGroup>

      <button
        className='rounded border border-gray-300 bg-gray-100 p-2 text-sm text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50'
        onClick={handleToggleAll}
      >
        {getGlobalToggleButtonText()}
      </button>
    </aside>
  )
}
