import requests
from bs4 import BeautifulSoup 
import json
from datetime import datetime, timedelta

session = requests.Session()
page = session.get('https://www.masoniccleveland.com/concerts', headers={'User-Agent': 'Mozilla/5.0'})

soup = BeautifulSoup(page.content, 'html.parser')
calendar = soup.find(id='main-content')
shows = calendar.find_all('article', class_='event-listing')

all_shows_list = []

for show in shows:
  all_shows_data = {} 
  artist = show.find('h3')
  sold_out = show.find('a', class_='tw_soldout')
  date = show.find('div', class_='event-listing__date').find('p', recursive=False)
  if 'AIW ' in artist.text.strip():
    ...
  elif ' Boxing' in artist.text.strip():
    ...
  else:
    all_shows_data['artist'] = [artist.text.strip().replace(' w/ ', ', ')]
  link = show.find('a', class_='btn')
  linkHref = link.get('href')
  all_shows_data['link'] = linkHref
  if sold_out:
    all_shows_data['sold_out'] = True
  date_delete_before = '-ohio-'
  date_delete_after = '/event'
  date = linkHref[linkHref.find(date_delete_before):].replace('-ohio-', '').split('/', 1)[0]
  if len(date) == 1:
    date = ''
  if '2023' in date:
    date = '2023-' + date.replace('-2023', '') + 'T20:00:00'
  if '2024' in date:
    date = '2024-' + date.replace('-2024', '') + 'T20:00:00'
  all_shows_data['date'] = date
  all_shows_data['venue'] = 'Masonic Temple'
  all_shows_list.append(all_shows_data)

all_shows_json = json.dumps(all_shows_list, indent=2) 
print(all_shows_json)
