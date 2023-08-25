import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from 'src/components/dropdown'

interface VenueFilterProps {
  venues: string[]
  selectedVenues: string[]
  onVenueToggle: (venue: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
}

export function VenueFilter({
  venues,
  selectedVenues,
  onVenueToggle,
  onSelectAll,
  onDeselectAll,
}: VenueFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='dropdown-button dark:shadow-[0_16px_24px_-16px_rgba(0,0,0,0.3),inset_0px_1px_0_rgba(0,0,0,0.25) group w-auto select-none rounded-md border border-zinc-800 bg-zinc-950 px-4 py-2 text-base font-medium text-zinc-50 shadow-[0_16px_24px_-16px_rgba(0,0,0,0.3),inset_0px_1px_0_rgba(255,255,255,0.25)] transition hover:bg-zinc-800 focus:outline-none focus:ring focus:ring-lime-500/75 dark:border-white dark:bg-zinc-100 dark:text-zinc-800 dark:hover:bg-white'>
        Select your fav Cleveland venues{' '}
        <span className='inline-block -rotate-90 transform leading-none text-zinc-400 transition-colors group-hover:text-zinc-200 dark:group-hover:text-zinc-500'>
          &lt;
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='dropdown-content flex min-w-[200px] flex-col rounded-xl bg-zinc-900 shadow-lg shadow-black/5 dark:bg-zinc-50 md:min-w-[360px]'>
        {venues
          .sort((a, b) => a.localeCompare(b))
          .map((venue) => (
            <DropdownMenuCheckboxItem
              key={venue.replace(/[^\w]+/g, '-').toLowerCase()}
              checked={selectedVenues.includes(venue)}
              onSelect={() => onVenueToggle(venue)}
            >
              {venue}
            </DropdownMenuCheckboxItem>
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}