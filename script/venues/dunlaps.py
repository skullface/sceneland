import requests
from bs4 import BeautifulSoup 
import json
from datetime import datetime

# Load the page
session = requests.Session()
page = session.get('https://www.dunlapsbar.com/events', headers={'User-Agent': 'Mozilla/5.0'})

# Grab the container elements in the DOM
soup = BeautifulSoup(page.content, 'html.parser')
calendar = soup.find('section', class_='events-list')
shows = calendar.find_all('div', class_='event-list-item')

# An empty array as a place to save the output
all_shows_list = []

# Iterate through the events in the DOM
for show in shows:

  # Empty object for each show, to be populated below
  all_shows_data = {} 

  headliner = show.find('h3', class_='el-header')
  opener = show.find('div', class_='event-supporting-acts')
  
  # Initialize artists list with headliner
  artists = [headliner.text.strip()]
  
  # Add opening acts if they exist
  if opener:
      opener_text = opener.find_all('b')
      if opener_text:
          for opener_artist in opener_text:
              artists.append(opener_artist.text.strip())
  
  all_shows_data['artist'] = artists
  
  all_shows_data['link'] = 'https://www.dunlapsbar.com' + show.find('a', class_='btn')['href']

  # Get the date and time DOM elements
  date_text = show.find('h6', class_='event-date').text.strip()
  # Parse the date format: "Fri Sep 12 2025, 8:00 PM"
  date_obj = datetime.strptime(date_text, "%a %b %d %Y, %I:%M %p")
  # Convert to ISO format: "2025-09-12T16:00:00"
  date = date_obj.strftime("%Y-%m-%dT%H:%M:%S")
  all_shows_data['date'] = date

  # Add the venue to the object
  all_shows_data['venue'] = "Dunlap’s Corner Bar"
  
  # Populate the empty array `[]` with the object we just defined
  all_shows_list.append(all_shows_data)

# Make our final list more readable with JSON formatting
# This is technically a Python string, but we don't care about that anymore
all_shows_json = json.dumps(all_shows_list, indent=2) 
print(all_shows_json)
