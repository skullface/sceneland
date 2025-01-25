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
  if 'AIW ' in artist.text.strip():
    ...
  elif ' Boxing' in artist.text.strip():
    ...
  else:
    all_shows_data['artist'] = [artist.text.strip().replace(' w/ ', ', ')]

  link = show.find('a', class_='btn')
  linkHref = link.get('href')
  all_shows_data['link'] = linkHref

  sold_out = show.find('a', class_='tw_soldout')
  if sold_out:
    all_shows_data['sold_out'] = True

  date = show.find('div', class_='event-listing__date').find('p', recursive=False)
  time = show.find('p', class_='event-time')
  time_text = time.text.strip()
  time_text = time_text.replace(' ', '')
  time_text = ''.join(time_text.split())
  
  def extract_time(input_string):
    sections = input_string.split('/')
    for section in sections:
      section = section.strip()
      if section.startswith("Show:"):
        return section[len("Show:"):].strip()
        
  time_string = extract_time(time_text)
  time_string = datetime.strptime(time_string, '%I:%M%p').time()
 
  date_delete_before = '-ohio-'
  date_delete_after = '/event'
  date = linkHref[linkHref.find(date_delete_before):].replace('-ohio-', '').split('/', 1)[0]
  if len(date) == 1:
    date = ''
  if '2023' in date:
    date = '2023-' + date.replace('-2023', '') + 'T' + str(time_string)
  if '2024' in date:
    date = '2024-' + date.replace('-2024', '') + 'T' + str(time_string)
  all_shows_data['date'] = date

  all_shows_data['venue'] = 'Masonic Temple'
  all_shows_list.append(all_shows_data)

all_shows_json = json.dumps(all_shows_list, indent=2) 
print(all_shows_json)
