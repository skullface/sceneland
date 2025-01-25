import requests
from bs4 import BeautifulSoup 
import json
from datetime import datetime

session = requests.Session()
page = session.get('https://www.noclasscle.com', headers={'User-Agent': 'Mozilla/5.0'})

soup = BeautifulSoup(page.content, 'html.parser')
calendar = soup.find('div', class_='eventlist--upcoming')
shows = calendar.find_all('article', class_='eventlist-event')

all_shows_list = []

for show in shows:
  all_shows_data = {} 
  artist = show.find('a', class_='eventlist-title-link')
  all_shows_data['artist'] = [artist.text.strip()]

  link = artist.get('href')
  all_shows_data['link'] = 'https://noclasscle.com' + link

  date = show.find('time')
  all_shows_data['date'] = date.get('datetime')

  all_shows_data['venue'] = 'No Class'
  all_shows_list.append(all_shows_data)

all_shows_json = json.dumps(all_shows_list, indent=2)
print(all_shows_json)
