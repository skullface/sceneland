import fs from 'fs'
import RSS from 'rss'
import { ShowProps } from '~/utils/types'
import { getVenueFiles, getVenueData } from './get-venues'

export default async function generateRssFeed() {
  const site_url = 'https://216.show'

  const feedOptions = {
    title: '216.show | Upcoming shows in Cleveland, OH',
    description:
      'Aggregated concerts and events coming up at your fav local CLE venues.',
    site_url: site_url,
    feed_url: `${site_url}/rss.xml`,
  }

  const feed = new RSS(feedOptions)

  // Get all venue files and combine their data
  const venueFiles = getVenueFiles()
  const allShows = venueFiles.reduce<ShowProps[]>((acc, venueFile) => {
    const venueData = getVenueData(venueFile)
    return [...acc, ...venueData]
  }, [])

  allShows.forEach((show: ShowProps) => {
    show.artist &&
      feed.item({
        title: `${show.artist.join(', ')} at ${show.venue}`,
        description: `Get tickets to ${show.artist.join(', ')} at ${
          show.venue
        } on ${new Date(show.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}, ${new Date(show.date).toLocaleTimeString('en-US', {
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
        })}: ${show.link}`,
        url: show.link,
        date: show.date,
      })
  })

  fs.writeFileSync('./public/feed.xml', feed.xml({ indent: true }))
}
