import requests
from bs4 import BeautifulSoup 
import json
from datetime import datetime
import re

# Load the page
session = requests.Session()
page = session.get('https://covellicentre.com/events/', headers={'User-Agent': 'Mozilla/5.0'})

# Grab the container elements in the DOM
soup = BeautifulSoup(page.content, 'html.parser')
calendar = soup.find('div', class_='featured-home-events')
shows = calendar.find_all('div', class_='event')

# An empty array as a place to save the output
all_shows_list = []

# Iterate through the events in the DOM
for show in shows:

  # Empty object for each show, to be populated below
  all_shows_data = {} 

  artist = show.find('h3')
  all_shows_data['artist'] = [artist.text.strip()]

  all_shows_data['link'] = show.find('a')['href']

  # Get the date and time DOM elements
  date_text = show.find('div', class_='date').text.strip()
  
  # Validate date format matches "Thursday, August 28th, 2025"
  date_pattern = r'^[A-Za-z]+,\s+[A-Za-z]+\s+\d+(?:st|nd|rd|th)?,\s+\d{4}$'
  if not re.match(date_pattern, date_text):
    continue  # Skip events that don't match the expected format
  
  # Parse the date format "Thursday, August 28th, 2025"
  # Remove the day name and ordinal suffix, then parse
  date_parts = date_text.split(', ')
  month_day_year = date_parts[1] + ', ' + date_parts[2]
  
  # Remove ordinal suffix (st, nd, rd, th) from day
  month_day_year = re.sub(r'(\d+)(st|nd|rd|th)', r'\1', month_day_year)
  
  try:
    date_obj = datetime.strptime(month_day_year, "%B %d, %Y")
    date = date_obj.strftime("%Y-%m-%d")
    all_shows_data['date'] = date + 'T00:00:01'
  except ValueError:
    continue  # Skip events with invalid date parsing
  
  # Add the venue to the object
  all_shows_data['venue'] = "Covelli Centre"
  
  # Populate the empty array `[]` with the object we just defined
  all_shows_list.append(all_shows_data)

# Make our final list more readable with JSON formatting
# This is technically a Python string, but we don't care about that anymore
all_shows_json = json.dumps(all_shows_list, indent=2) 
print(all_shows_json)
