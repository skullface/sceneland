import requests
from bs4 import BeautifulSoup 
import json

# Load the page
session = requests.Session()
page = session.get('https://www.beachlandballroom.com/', headers={'User-Agent': 'Mozilla/5.0'})

# Grab the container elements in the DOM
soup = BeautifulSoup(page.content, "html.parser")
calendar = soup.find("div", class_="up")
shows = calendar.find_all("article", class_="list-view-item")

# An empty array as a place to save the output
all_shows_list = []

# Iterate through the events in the DOM
for show in shows:
  # Empty object for each show, to be populated below
  all_shows_data = {} 
  # Get the artist container element
  artists_span = show.find_all("span", class_="tw-artist")
  # Get the date container element
  date_span = show.find("span", class_="event-date")
  # Iterate through all artists
  for artist_span in artists_span:
    # Get headlining and supporting acts as plaintext
    all_shows_data['artist'] = artist_span.text.strip()
  # Get the date as plaintext
  all_shows_data['date'] = date_span.text.strip().replace("\n", " ")
  # Populate the empty array `[]` with the object we just defined
  all_shows_list.append(all_shows_data)

# Make our final list more readable with JSON formatting
# This is technically a Python string, but we don’t care about that anymore
all_shows_json = json.dumps(all_shows_list, indent=2) 
print(all_shows_json)
