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
    return new Date(a.props.children[1].props.dateTime) - new Date(b.props.children[1].props.dateTime)
  }

  return (
    <>
      <Head>
        <title>216.shows: Music in Cleveland 🤘</title>
        <meta name='description' content='Concerts coming up at your fav local venues like the Beachland, Agora, Mahall’s, and more' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.png' />
      </Head>
      
      <div>
        <header>
          <h1>216.shows: Music in Cleveland 🤘</h1>
          <p>Concerts coming up at your fav local venues like the Beachland, Agora, Mahall’s, and more.</p>
        </header>
        
        <main>
          {shows.map((show, i) => (
            <article key={i}>
              <h2>{show.artist}</h2>
              <time dateTime={new Date(show.date)}>
                {new Date(show.date).toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}
              </time>
              <p>{show.venue}</p>
            </article>
          )).sort(compareChronological)}
        </main>
        
        <footer>
          <p>
            All data is pulled from the venues’ individual websites and aggregated here. No ownership of information is claimed nor implied.
          </p>
          <p>
            Support your scene. Take care of each other.
          </p>
        </footer>
      </div>
    </>
  )
}
