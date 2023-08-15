import Head from 'next/head'
import shows from 'src/data/shows.json';
 
export const getStaticProps = async () => {
  return { 
    props: {
      shows: shows.shows
    }
  }
}

export default function Home({ shows }) {
  function compareChronological(a, b) {
    return new Date(a.props.children[2].props.dateTime) - new Date(b.props.children[2].props.dateTime)
  }

  return (
    <>
      <Head>
        <title>216.show: Music in Cleveland 🤘</title>
        <meta name='description' content='Concerts coming up at your fav local venues like the Beachland, Agora, Mahall’s, and more' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.png' />
      </Head>
      
      <div>
        <header>
          <h1>216.show<span className='hidden md:inline'>: Music in Cleveland</span></h1>
          <p>Concerts coming up at the Beachland, Agora, Mahall’s, and more.</p>
        </header>
        
        <main>
          <section className='shows'>
            {shows.map((show, i) => (
              <a
                key={i}
                href={show.link}
                className='show group'
              >
                {show.sold_out && <span className='sold-out'>Sold out</span>}
                <h2 className='artist'>
                  {JSON.stringify(show.artist).replace(/\[|\]|\"/g,'').replace(/\,/g, ', ')}
                  {' '}
                </h2>
                <time dateTime={new Date(show.date)}>
                  {new Date(show.date).toLocaleDateString('en-US', {weekday: 'short', year: 'numeric', month: 'long', day: 'numeric'})}
                </time>
                <span className='venue'>{show.venue}</span>
              </a>
            )).sort(compareChronological)}
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
