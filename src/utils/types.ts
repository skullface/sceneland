export type ShowProps = {
  link: string
  sold_out?: boolean
  artist?: string[]
  venue: string
  date: string
}

export type SearchResults = {
  shows: ShowProps[]
  query: string
}
