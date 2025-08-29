import { groupVenuesByTag, formatTag } from '~/utils/venue-utils'
import * as Accordion from '@radix-ui/react-accordion'

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
    <aside className='sticky top-0 flex h-screen w-80 flex-col gap-4 overflow-y-auto border-r border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900'>
      <h2 className='text-lg font-semibold text-zinc-900 dark:text-zinc-100'>
        Filter Venues
      </h2>

      <Accordion.Root
        type='multiple'
        defaultValue={['downtown']}
        className='grid gap-2'
      >
        {sortedTags.map((tag) => (
          <Accordion.Item
            key={tag}
            value={tag}
            className='dark:border-zinc rounded-md border border-zinc-200 px-3 pt-3'
          >
            <Accordion.Header className='group flex'>
              <Accordion.Trigger className='flex flex-1 items-center justify-between text-left text-sm font-semibold uppercase tracking-wider text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'>
                {formatTag(tag)}
                <span className='text-xs transition-transform duration-100 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180'>
                  ▼
                </span>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className='data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down mt-3 grid gap-3 overflow-hidden'>
              <div className='grid gap-2'>
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
              <button
                className='mb-4 flex-1 rounded border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-700'
                onClick={() => handleToggleAllInSection(tag)}
              >
                {getToggleButtonText(tag)}
              </button>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>

      <button
        className='rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-700'
        onClick={handleToggleAll}
      >
        {getGlobalToggleButtonText()}
      </button>
    </aside>
  )
}
