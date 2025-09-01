# 🎸 [216.show](https://216.show)

Aggregates concerts from local Cleveland venues in one website.

## How it works

### Get show data (🐍 Python)

- Extract and normalize data from local venues’ websites [with Python](https://github.com/skullface/sceneland/tree/main/script/venues)
- Export that data [per venue as JSON](https://github.com/skullface/sceneland/tree/main/src/data/venues)

### Present show data (⚛️ React via Next.js)

- Use the JSON files to [display events](https://github.com/skullface/sceneland/blob/main/src/components/show-card.tsx) in chronological order
- [Group events by week](https://github.com/skullface/sceneland/blob/main/src/pages/index.tsx#L92-L139) for improved readability/scannability
- [Filter](https://github.com/skullface/sceneland/blob/main/src/pages/index.tsx#L51-L90) events by venue, [selectable by user](https://github.com/skullface/sceneland/blob/main/src/components/venue-filter.tsx) (via [Radix](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#checkboxitem))
- [Search](https://github.com/skullface/sceneland/blob/main/src/components/search.tsx) events by artist, venue, or month with natural language processing
- Serve the page via [Vercel](https://vercel.com) when JSON files are updated
- [Generate](https://github.com/skullface/sceneland/blob/main/src/utils/generate-feed.ts) an [RSS feed](https://216.show/feed.xml) with all shows as feed items

### Update daily

- At 5:00am ET, [refresh data](https://github.com/skullface/sceneland/blob/main/.github/workflows/fetch-data.yml) by re-fetching (and re-deploying on commit)

## Search functionality

The app includes a powerful search feature with natural language processing capabilities:

### Examples

- **"beachland aug 30"** - Finds all events at Beachland venues and events on August 30
- **"devo"** - Returns "DEVOtional 2025" events (fuzzy matching)
- **"girl"** - Finds events with "Surfer Girl" and "Angelgirl EVA"
- **"august"** - Shows all events in August
- **"beachland"** - Lists all events at Beachland venues

### Features

- **Real-time search** - Results update as you type
- **Multi-field matching** - Searches across artist names, venue names, and dates
- **Fuzzy matching** - Finds partial matches (e.g., "devo" matches "devotional")
- **Date parsing** - Understands month names, abbreviations, and day numbers
- **Venue matching** - Searches venue names for partial matches
- **Clickable suggestions** - Quick search examples for users to try

## Fork this repo for your own city

### Local requirements

- Install [Python](https://www.python.org/downloads/)
- Install Python dependencies with `pip install -r requirements.txt`
  - The dependencies you need will change based on your own Python scripts, but consider “requests”, “BeautifulSoup”, and “json” as required :)
- Install [Node.js](https://nodejs.org/en)
- Install Node dependencies with `npm i`

### Data

- Create [Python scripts](https://github.com/skullface/sceneland/tree/main/script/venues) for your own venues’ websites using [BeautifulSoup](https://beautiful-soup-4.readthedocs.io/en/latest/)
- [Re-map related venues](https://github.com/skullface/sceneland/blob/main/src/pages/index.tsx#L51-L57) if necessary
- Update your [timezone](https://github.com/search?q=repo%3Askullface%2Fsceneland%20New_York&type=code) as necessary

