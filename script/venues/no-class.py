import requests
from bs4 import BeautifulSoup 
import json

def should_exclude_event(artist_name):
    """Check if event should be excluded based on artist name or event title"""
    exclude_words = [
        'Happy Hour',
        'Party',
        'Sapphic Night',
        'Yoga',
        'Rave',
        'Drag',
        'Jazz Rats',
        'Support Group',
        'Karaoke',
        'Closed',
        'Birthday',
        'Bday',
        'Comedy',
        'Trivia'
    ]
    
    artist_lower = artist_name.lower()
    for word in exclude_words:
        if word.lower() in artist_lower:
            return True
    return False

session = requests.Session()
page = session.get('https://www.noclasscle.com', headers={'User-Agent': 'Mozilla/5.0'})

soup = BeautifulSoup(page.content, 'html.parser')
calendar = soup.find('div', class_='eventlist--upcoming')
shows = calendar.find_all('article', class_='eventlist-event')

all_shows_list = []

for show in shows:
  all_shows_data = {} 
  artist = show.find('a', class_='eventlist-title-link')
  artist_name = artist.text.strip()
  
  # Skip events that should be excluded
  if should_exclude_event(artist_name):
      continue
      
  all_shows_data['artist'] = [artist_name]

  link = artist.get('href')
  all_shows_data['link'] = 'https://noclasscle.com' + link

  date = show.find('time')
  all_shows_data['date'] = date.get('datetime') + 'T00:00:01'

  all_shows_data['venue'] = 'No Class'
  all_shows_list.append(all_shows_data)

all_shows_json = json.dumps(all_shows_list, indent=2)
print(all_shows_json)
