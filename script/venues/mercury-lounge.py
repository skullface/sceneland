import requests
from bs4 import BeautifulSoup 
import json
from datetime import datetime

url_base = 'https://www.mercurymusiclakewood.com/page/'
url_pages = [1, 2, 3, 4]

def should_skip_event(event_title):
    """Filter out events with specific keywords in the title"""
    skip_keywords = [
        'trivia',
        'jam',
        'karaoke',
        'brunch',
        'bingo',
        'comedy',
        'closed',
        'movie'
    ]
    
    event_title_lower = event_title.lower()
    for keyword in skip_keywords:
        if keyword.lower() in event_title_lower:
            return True
    return False

all_shows_list = []

for url_page in url_pages:
  url_concat = url_base + str(url_page)
  session = requests.Session()
  page = session.get(url_concat, headers={'User-Agent': 'Mozilla/5.0'})
  soup = BeautifulSoup(page.content, 'html.parser')
  calendar = soup.find('div', class_='tw-plugin-upcoming-event-list')
  shows = calendar.find_all('div', class_='tw-section')

  for show in shows:
    all_shows_data = {} 
    artist = show.find('div', class_='tw-name').find('a')
    artist_name = artist.text.strip()
    
    # Filter out events with "Trivia" or "Comedy" in the artist name
    if any(word in artist_name.lower() for word in ['trivia', 'jam', 'karaoke', 'brunch', 'comedy']):
      continue
      
    all_shows_data['artist'] = [artist_name]

    all_shows_data['link'] = artist.get('href')

    date = show.find('span', class_='tw-event-date')
    date_text = date.text.strip()  # e.g., "Dec 13, " or "Dec 13, 2025"
    
    # Clean up the date text - remove trailing commas, periods, and extra whitespace
    date_text = date_text.rstrip(',.!?').strip()
    
    current_year = datetime.now().year
    
    # Try to parse with year first, then without year
    try:
      date_obj = datetime.strptime(date_text, "%b %d, %Y")
    except ValueError:
      # If no year, assume current year
      date_obj = datetime.strptime(date_text, "%b %d")
      date_obj = date_obj.replace(year=current_year)
    
    date = date_obj.strftime("%Y-%m-%d")
    all_shows_data['date'] = date + 'T00:00:01'

    all_shows_data['venue'] = 'Mercury Music Lounge'
    all_shows_list.append(all_shows_data)

all_shows_json = json.dumps(all_shows_list, indent=2) 
print(all_shows_json)
