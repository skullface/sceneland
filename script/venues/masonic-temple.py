import requests
from bs4 import BeautifulSoup 
import json
from datetime import datetime

session = requests.Session()
page = session.get('https://www.templelive.com/cleveland', headers={'User-Agent': 'Mozilla/5.0'})

soup = BeautifulSoup(page.content, 'html.parser')
calendar = soup.find('div', class_='event-list')
shows = calendar.find_all('div', class_='tw-section')

all_shows_list = []

for show in shows:
  all_shows_data = {} 
  artist = show.find('div', class_='tw-name')
  all_shows_data['artist'] = [artist.text.strip().replace(' w/ ', ', ')]

  link = show.find('a')
  linkHref = link.get('href')
  all_shows_data['link'] = linkHref

  sold_out = show.find('a', class_='tw_soldout')
  if sold_out:
    all_shows_data['sold_out'] = True

  date = show.find('span', class_='tw-event-date')
  date_text = date.text.strip()
  date_part = date_text.split()[1]
  date_str = datetime.strptime(f"{date_part}/2025", "%m/%d/%Y")
  date = date_str.strftime("%Y-%m-%d")
  all_shows_data['date'] = date + 'T00:00:01'

  all_shows_data['venue'] = 'TempleLive Cleveland Masonic'
  all_shows_list.append(all_shows_data)

all_shows_json = json.dumps(all_shows_list, indent=2) 
print(all_shows_json)
