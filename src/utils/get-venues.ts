import fs from 'fs'
import path from 'path'

export function getVenueFiles(): string[] {
  const venuesDirectory = path.join(process.cwd(), 'src/data/venues')
  const venueFiles = fs.readdirSync(venuesDirectory)
  
  // Filter out empty files and files that don't end with .json
  return venueFiles.filter(file => {
    if (!file.endsWith('.json')) return false
    
    const filePath = path.join(venuesDirectory, file)
    const stats = fs.statSync(filePath)
    
    if (stats.size === 0) {
      console.warn(`Skipping empty venue file: ${file}`)
      return false
    }
    
    return true
  })
}

import { ShowProps } from './types'

export function getVenueData(venueFile: string): ShowProps[] {
  const filePath = path.join(process.cwd(), 'src/data/venues', venueFile)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  
  try {
    if (!fileContents.trim()) {
      console.warn(`Warning: Empty venue file ${venueFile}`)
      return []
    }
    return JSON.parse(fileContents)
  } catch (error) {
    console.error(`Error parsing venue file ${venueFile}:`, error)
    return []
  }
}
