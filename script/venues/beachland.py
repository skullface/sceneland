import requests
from bs4 import BeautifulSoup 
import json
from datetime import datetime

# Load the page
session = requests.Session()
page = session.get('https://www.beachlandballroom.com/', headers={'User-Agent': 'Mozilla/5.0'})

# Grab the container elements in the DOM
soup = BeautifulSoup(page.content, 'html.parser')
calendar = soup.find('div', class_='up')
shows = calendar.find_all('article', class_='list-view-item')

# An empty array as a place to save the output
all_shows_list = []

# Iterate through the events in the DOM
for show in shows:
  
  # Get the venue DOM element
  venue = show.find('span', class_='venue')
  # Check if the venue is "Beachland Ballroom" or "Beachland Tavern"
  venue_text = venue.text.strip()
  if venue_text == 'Beachland Ballroom' or venue_text == 'Beachland Tavern':

    # Empty object for each show, to be populated below
    all_shows_data = {} 
    # Get the DOM elements containing artists
    artist_elements = show.find_all('span', class_='tw-artist')
    artists_list = []
    # Loop through all the artists, add them to the object
    for artist in artist_elements:
      artists_list.append(artist.text.strip().replace(' - ', ': '))
      if not artist.text.strip() == 'This Way Out':
        all_shows_data['artist'] = artists_list

    # Get all links in the show container element
    for link_element in show.findAll('a'):
      # Ignore all links that aren't within an `<h1>`
      if link_element.parent.name == 'h1':
        # Add the link to the object
        all_shows_data['link'] = link_element['href']

    # Check if “sold out” element exists
    sold_out = show.find('span', class_='st_soldout')
    # If it does, add a `sold_out` boolean key as 'true' to the object
    if sold_out:
      all_shows_data['sold_out'] = True

    # Get the date and time DOM elements
    date = show.find('span', class_='event-date').text.strip().replace('\n', ' ')
    time = show.find('span', class_='tw-event-time').text.strip()

    # Split the date string into an array with named items
    weekday, month, day = date.split()
    # Convert the three-letter month name into its number (1-12)
    month_number = datetime.strptime(month, '%b').month

    # Get the current date and year
    current_date = datetime.now().date()
    year = current_date.year

    # If the event’s month is smaller than the current month, it’s next year
    if month_number < current_date.month:
      year = current_date.year + 1
    else:
      year = current_date.year

    # Add the appropriate year to the given date string
    date = date + ' ' + str(year)
    # Take the date and time strings and interpret them as datetime object
    date = datetime.strptime(date, '%A %b %d %Y')
    time = datetime.strptime(time, '%I:%M %p').time()
    # Combine them, replacing the space with a T for our ISO formatted date
    all_shows_data['date'] = str(date).split(' ', 1)[0] + 'T' + str(time)

    # Add the venue to the object
    all_shows_data['venue'] = venue_text

    # Populate the empty array `[]` with the object we just defined
    all_shows_list.append(all_shows_data)

# Make our final list more readable with JSON formatting
# This is technically a Python string, but we don’t care about that anymore
all_shows_json = json.dumps(all_shows_list, indent=2) 
print(all_shows_json)
