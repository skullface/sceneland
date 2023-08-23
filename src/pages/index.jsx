import Head from 'next/head'
import { allShows } from 'src/data/allShows'
import { useEffect, useState } from 'react'

export const getStaticProps = async () => {
  return { 
    props: {
      shows: allShows
    }
  }
}

// UI to filter results by venue
export function VenueFilter({ venues, selectedVenues, onVenueToggle }) {
  // State to track if the component has mounted or not?
  const [isMounted, setIsMounted] = useState(false);
  
  // `useEffect` hook runs after the initial render (a.k.a. component mounts)
  // `isMounted` is false until the component mounts, then we change the state
  useEffect(() => {
    setIsMounted(true);
  }, []); // Empty array to ensures the hook runs only once (after mounting)

  return (
    <ul className='flex flex-wrap justify-between items-center md:justify-center my-4 leading-none max-md:gap-x-12 max-md:gap-y-6'>
      {venues.map(venue => (
        <li
          key={venue.replace(/[^\w]+/g, '-').toLowerCase()}
          className='group max-md:flex max-md:gap-1'
        >
          <input
            type='checkbox'
            id={
              isMounted? (
                venue.replace(/[^\w]+/g, '-').toLowerCase()
              ) : 'undefined'
            }
            className='peer md:hidden'
            checked={selectedVenues.includes(venue)}
            onChange={() => onVenueToggle(venue)}
          />
          <label
            className={`
              max-md:font-semibold max-md:text-zinc-800 dark:max-md:text-zinc-200
              select-none cursor-pointer md:transition md:ease-in-out md:py-2 md:px-3 md:text-sm md:font-medium md:font-mono
              md:group-first-of-type:rounded-l-lg md:group-first-of-type:pl-4 md:group-last-of-type:rounded-r-lg md:group-last-of-type:pr-4
              md:border md:border-l-0
              md:before:content-['×'] md:before:mr-1 md:before:text-red-500
              md:group-first-of-type:border-l md:group-last-of-type:border-r
              md:border-zinc-300 md:bg-zinc-50 md:text-zinc-500
              md:dark:border-zinc-800 md:dark:bg-black md:dark:text-zinc-600
              dark:md:peer-checked:bg-black dark:md:peer-checked:text-zinc-400 dark:md:peer-checked:border-zinc-800 dark:md:peer-checked:hover:text-zinc-600
              md:peer-checked:before:content-['✓'] md:peer-checked:before:text-green-500
              md:peer-checked:bg-zinc-50 md:peer-checked:text-zinc-800 md:peer-checked:border-zinc-300 md:peer-checked:hover:text-zinc-500
            `}
            htmlFor={
              isMounted? (
                venue.replace(/[^\w]+/g, '-').toLowerCase()
              ) : 'undefined'
            }
          >
            {isMounted && venue}
          </label>
        </li>
      ))}
    </ul>
);
}

}

export default function Home() {
  // Create an array of all unique venues
  const allVenues = Array.from(new Set(allShows.map(show => show.venue)));

  // Initialize state for selected venues
  const [selectedVenues, setSelectedVenues] = useState(allVenues);

  // Handle venue toggling by changing state
  const handleVenueToggle = venue => {
    // If the `selectedVenues` array already includes the venue, remove it
    if (selectedVenues.includes(venue)) {
      setSelectedVenues(selectedVenues.filter(v => v !== venue));
    } else {
      // If the venue is not in the `selectedVenues` array, add it  
      setSelectedVenues([...selectedVenues, venue]);
    }
  };
  
  // Filter shows by selected venues
  const filteredShows = allShows.filter(show => selectedVenues.includes(show.venue));
  
  // Sort filtered shows chronologically by show date
  const sortedFilteredShows = filteredShows.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <>
      <Head>
        <title>216.show: Music in Cleveland 🤘</title>
        <meta name='description' content='Concerts coming up at your fav local venues like the Beachland, Agora, Mahall’s, and more' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.png' />
      </Head>
      
      <div>
        <header className='text-center'>
          <h1 className='text-6xl tracking-tight font-semibold'>
            216.show
          </h1>
          <form>
            <h2 className='font-mono'>
              Select your fav Cleveland venues:
            </h2>
            <VenueFilter
              venues={allVenues} // pass the array of all unique venues names as a prop
              selectedVenues={selectedVenues} // pass the array of selected (checked) venues as a prop
              onVenueToggle={handleVenueToggle} // pass the function to handle toggling as a prop
            />
          </form>
        </header>
        
        <main>
          <section className='shows'>
            {sortedFilteredShows.map((show, i) => (
              show.artist && (
                <a
                  key={i}
                  href={show.link}
                  className='show group flex flex-col h-full'
                >
                  {show.sold_out && <span className='sold-out'>Sold out</span>}
                  <h2 className='artist'>
                    {JSON.stringify(show.artist).replace(/\[|\]|\"/g,'').replace(/\,/g, ', ')}
                    {' '}
                  </h2>
                  <span className='venue'>{show.venue}</span>
                  <time className='flex-1 flex items-end' dateTime={new Date(show.date)}>
                    {new Date(show.date).toLocaleDateString('en-US', {weekday: 'short', year: 'numeric', month: 'long', day: 'numeric'})}
                  </time>
                </a>
              )
            ))}
          </section>
        </main>
        
        <footer>
          <p>
            All data is pulled from the venues’ individual websites and aggregated here. No ownership of information is claimed nor implied.
          </p>
          <p>
            Support your scene and take care of each other.
          </p>
        </footer>
      </div>
    </>
  )
}
