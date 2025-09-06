import venueMetadata from '~/data/venue-metadata.json'

// Type definition for the new venue metadata structure
export interface VenueMetadata {
  [venueName: string]: Array<{
    geo: string
    capacity: string
  }>
}

// Export venueMetadata for use in other components
export { venueMetadata }

// Venue name mappings to group related venues together
export const VENUE_MAPPINGS: { [key: string]: string } = {
  'Beachland Ballroom': 'Beachland',
  'Beachland Tavern': 'Beachland',
  "Mahall’s Apartment": "Mahall’s",
  "The Roxy at Mahall’s": "Mahall’s",
  'Jacobs Pavilion at Nautica': 'Jacobs Pavilion',
  'Mercury Music Lounge': 'Mercury Lounge',
  'TempleLive Cleveland Masonic': 'Masonic Temple',
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
  // First try to find the venue name directly in metadata
  for (const [venue, tags] of Object.entries(venueMetadata)) {
    if (
      venue === venueName &&
      tags &&
      Array.isArray(tags) &&
      tags.length > 0 &&
      tags[0] &&
      typeof tags[0] === 'object' &&
      'geo' in tags[0]
    ) {
      return tags[0].geo as GeographicTag
    }
  }

  // If not found, try to map the venue name and look up the mapped version
  const mappedVenue = VENUE_MAPPINGS[venueName] || venueName
  if (mappedVenue !== venueName) {
    for (const [venue, tags] of Object.entries(venueMetadata)) {
      if (
        venue === mappedVenue &&
        tags &&
        Array.isArray(tags) &&
        tags.length > 0 &&
        tags[0] &&
        typeof tags[0] === 'object' &&
        'geo' in tags[0]
      ) {
        return tags[0].geo as GeographicTag
      }
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
      // venue is now already the mapped venue name, so we can look it up directly
      const tag = getVenueTag(venue)
      if (!acc[tag]) {
        acc[tag] = []
      }
      acc[tag].push(venue) // Store the mapped venue name for display
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
  // Note: venueName should be the mapped venue name
  for (const [venue, tags] of Object.entries(venueMetadata)) {
    if (
      venue === venueName &&
      tags &&
      Array.isArray(tags) &&
      tags.length > 0 &&
      tags[0] &&
      typeof tags[0] === 'object' &&
      'geo' in tags[0]
    ) {
      const tag = tags[0].geo
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
