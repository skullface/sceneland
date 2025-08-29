import { groupVenuesByTag, formatTag } from '~/utils/venue-utils'

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
