import requests
from bs4 import BeautifulSoup 
import json
from datetime import datetime

session = requests.Session()
page = session.get('https://www.livenation.com/venue/KovZpZAEAtAA/blossom-music-center-events', headers={'User-Agent': 'Mozilla/5.0'})

soup = BeautifulSoup(page.content, 'html.parser')
calendar = soup.find('ul', class_='css-p47pw5')
shows = calendar.find_all('li', class_='css-re1cpl')

all_shows_list = []

for show in shows:
  all_shows_data = {} 
  artist = show.find('h3', class_='css-1ptng6s')
  link = show.find('a', class_='css-1yxfa6u')
  date = show.find('time')
  if artist.text.strip() == '2024 Season Tickets':
    ...
  else:
    all_shows_data['artist'] = [artist.text.strip().replace(' - ', ': ')]
  all_shows_data['link'] = link.get('href')
  if date.get('datetime') == '2024-12-31T00:00:01':
    all_shows_data['date'] = datetime.now().strftime('%Y-%m-%d') + 'T20:00:00'
  else:
    all_shows_data['date'] = date.get('datetime')
  all_shows_data['venue'] = 'Blossom'
  all_shows_list.append(all_shows_data)

all_shows_json = json.dumps(all_shows_list, indent=2) 
print(all_shows_json)
