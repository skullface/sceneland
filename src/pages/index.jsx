import Head from 'next/head'
import { allShows } from 'src/data/allShows'
import { useState } from 'react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from 'src/components/dropdown'

export const getStaticProps = async () => {
  return { 
    props: {
      shows: allShows
    }
  }
}

// UI to filter results by venue
export function VenueFilter({ venues, selectedVenues, onVenueToggle }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='dropdown-button'>
        Select your fav Cleveland venues <span>&darr;</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='dropdown-content'>
        {venues.map(venue => (
          <DropdownMenuCheckboxItem
            key={venue.replace(/[^\w]+/g, '-').toLowerCase()}
            checked={selectedVenues.includes(venue)}
            onCheckedChange={() => onVenueToggle(venue)}
          >
            {venue}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
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
