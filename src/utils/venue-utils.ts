import venueMetadata from '~/data/venue-metadata.json'

// Venue name mappings to group related venues together
export const VENUE_MAPPINGS: { [key: string]: string } = {
  'Beachland Ballroom': 'Beachland',
  'Beachland Tavern': 'Beachland',
  "Mahall's Apartment": "Mahall's",
  "The Roxy at Mahall's": "Mahall's",
}

// Geographic tag order for consistent sorting
export const TAG_ORDER = [
  'downtown',
  'eastside',
  'westside',
  'akron',
  'youngstown',
  'other',
] as const

export type GeographicTag = typeof TAG_ORDER[number]

// Helper function to get geographic tag for a venue
export function getVenueTag(venueName: string): GeographicTag {
  const mappedVenue = VENUE_MAPPINGS[venueName] || venueName

  // First try to find the mapped venue name in metadata
  for (const [venue, tags] of Object.entries(venueMetadata)) {
    if (
      venue === mappedVenue &&
      tags &&
      Array.isArray(tags) &&
      tags.length > 0 &&
      tags[0]
    ) {
      return tags[0] as GeographicTag
    }
  }

  // If not found, try the original venue name
  for (const [venue, tags] of Object.entries(venueMetadata)) {
    if (
      venue === venueName &&
      tags &&
      Array.isArray(tags) &&
      tags.length > 0 &&
      tags[0]
    ) {
      return tags[0] as GeographicTag
    }
  }

  // Fallback to 'other' if no tag found
  return 'other'
}

// Helper function to format geographic tag for display
export function formatTag(tag: GeographicTag): string {
  const tagFormats: { [key in GeographicTag]: string } = {
    eastside: 'East Side',
    westside: 'West Side',
    downtown: 'Downtown',
    akron: 'Akron',
    youngstown: 'Youngstown',
    other: 'Other',
  }

  return tagFormats[tag]
}

// Helper function to group venues by geographic tags
export function groupVenuesByTag(venues: string[]) {
  const groupedVenues = venues.reduce(
    (acc, venue) => {
      const tag = getVenueTag(venue)
      if (!acc[tag]) {
        acc[tag] = []
      }
      acc[tag].push(venue)
      return acc
    },
    {} as { [tag in GeographicTag]: string[] },
  )

  // Sort tags in logical order and filter out empty groups
  const sortedTags = TAG_ORDER.filter((tag) => groupedVenues[tag])

  return { groupedVenues, sortedTags }
}

// Helper function to check if a venue should be initially selected
export function shouldInitiallySelectVenue(venueName: string): boolean {
  // Check if the venue is tagged with youngstown or akron
  for (const [venue, tags] of Object.entries(venueMetadata)) {
    if (
      venue === venueName &&
      tags &&
      Array.isArray(tags) &&
      tags.length > 0
    ) {
      const tag = tags[0]
      if (tag === 'youngstown' || tag === 'akron') {
        return false // Don't select venues from these areas by default
      }
    }
  }
  return true // Select all other venues by default
}

// Helper function to get mapped venue name
export function getMappedVenueName(venueName: string): string {
  return VENUE_MAPPINGS[venueName] || venueName
}
