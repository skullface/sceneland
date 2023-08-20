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
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []); 

  return (
    <ul className='flex flex-wrap items-center justify-center my-4 leading-none'>
      {venues.map((venue, i) => (
      {venues.map(venue => (
        <li
          key={venue.replace(/[^\w]+/g, '-').toLowerCase()}
          className='group min-h-[40px]'
        >
          <input
            type='checkbox'
            id={
              isMounted? (
                venue.replace(/[^\w]+/g, '-').toLowerCase()
              ) : 'undefined'
            }
            className='peer hidden'
            checked={selectedVenues.includes(venue)}
            onChange={() => onVenueToggle(venue)}
          />
          <label
            className='select-none cursor-pointer transition ease-in-out
            py-2 px-3 text-sm font-medium font-mono
            group-first-of-type:rounded-l-lg group-first-of-type:pl-4
            group-last-of-type:rounded-r-lg group-last-of-type:pr-4
            border border-l-0 
            group-first-of-type:border-l 
            group-last-of-type:border-r
            border-zinc-300 bg-zinc-50 text-zinc-300
            dark:border-zinc-800 dark:bg-black dark:text-zinc-800
            dark:peer-checked:bg-black dark:peer-checked:text-zinc-400 dark:peer-checked:border-zinc-800
            dark:peer-checked:hover:text-zinc-600
            peer-checked:bg-zinc-50 peer-checked:text-zinc-700 peer-checked:border-zinc-300 peer-checked:hover:text-zinc-400'
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

// Map through the data to display each show
export function ShowList({ shows }) {
  return (
    <section className='shows'>
      {shows.map((show, i) => (
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
      ))}
    </section>
  );
}

export default function Home() {
  // Map through the shows to find all venues
  let allVenues = [];
  allShows.map(venue => {
    if (allVenues.indexOf(venue.venue) === -1) {
      allVenues.push(venue.venue)
    }
  });
  
  // Set state for venue filter
  const [selectedVenues, setSelectedVenues] = useState(allVenues);

  // Change state by toggling
  const handleVenueToggle = venue => {
    if (selectedVenues.includes(venue)) {
      setSelectedVenues(selectedVenues.filter(v => v !== venue));
    } else {
      setSelectedVenues([...selectedVenues, venue]);
    }
  };
  
  // Sort shows chronologically
  const sortedShows = allShows.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Filter chrono-sorted shows by selected venues
  const filteredShows = sortedShows.filter(show => 
    selectedVenues.includes(show.venue)
  )

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
          <p className='font-mono'>
            Cleveland concerts coming up at a venue near you.
          </p>
          <VenueFilter
            venues={allVenues}
            selectedVenues={selectedVenues}
            onVenueToggle={handleVenueToggle}
          />
        </header>
        
        <main>
          <ShowList shows={filteredShows} />
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
