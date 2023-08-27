# 🎸 [216.show](https://216.show)

Aggregates concerts from local Cleveland venues in one website.

## How it works

### Get show data (🐍 Python)

- Extract and normalize data from local venues’ websites [with Python](https://github.com/skullface/sceneland/tree/main/script/venues)
- Export that data [per venue as JSON](https://github.com/skullface/sceneland/tree/main/src/data/venues)
- [Merge](https://github.com/skullface/sceneland/blob/main/script/merge.py) JSON files together as [a `.js` array of objects](https://github.com/skullface/sceneland/blob/main/src/data/allShows.js)

### Present show data (⚛️ React via Next.js)

- Use the `.js` data file to [display events](https://github.com/skullface/sceneland/blob/main/src/components/show-card.tsx) in [chronological order](https://github.com/skullface/sceneland/blob/main/src/pages/index.tsx#L72-L75)
- [Group events by week](https://github.com/skullface/sceneland/blob/main/src/pages/index.tsx#L77-L110) for improved readability/scannability
- [Filter](hhttps://github.com/skullface/sceneland/blob/main/src/pages/index.tsx#L33-L70) events by venue, [selectable by user](https://github.com/skullface/sceneland/blob/main/src/components/venue-filter.tsx) (via [Radix](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#checkboxitem))
- Serve the page [statically](https://github.com/skullface/sceneland/blob/main/.github/workflows/build-and-deploy.yml) with [GitHub Pages](https://github.com/skullface/sceneland/tree/gh-pages) when data file is updated

### Update daily

- At 5:00am ET, [refresh data](https://github.com/skullface/sceneland/blob/main/.github/workflows/fetch-data.yml) by re-fetching, re-merging, and re-deploying

## Fork this repo for your own city

### Local requirements

- Install [Python](https://www.python.org/downloads/)
- Install Python dependencies with `pip install -r requirements.txt`
  - The dependencies you need will change based on your own Python scripts, but consider “requests”, “BeautifulSoup”, and “json” as required :)
- Install [Node.js](https://nodejs.org/en)
- Install Node dependencies with `npm i`

### Data

- Create [Python scripts](https://github.com/skullface/sceneland/tree/main/script/venues) for your own venues’ websites using [BeautifulSoup](https://beautiful-soup-4.readthedocs.io/en/latest/)
- [Re-map related venues](https://github.com/skullface/sceneland/blob/main/src/pages/index.tsx#L33-L39) if necessary

### Repo settings

- **Actions**: Give Actions “Read and write permissions”
- **Pages**: Enable GitHub Pages to deploy from `gh-pages` branch
