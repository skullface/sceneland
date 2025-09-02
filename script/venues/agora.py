import requests
from bs4 import BeautifulSoup 
import json
from datetime import datetime

# Load the page
session = requests.Session()
page = session.get('https://www.agoracleveland.com/events/all', headers={'User-Agent': 'Mozilla/5.0'})

# Grab the container elements in the DOM
soup = BeautifulSoup(page.content, 'html.parser')
calendar = soup.find(id='eventsList')
shows = calendar.find_all('div', class_='entry')

all_shows_list = []

for show in shows:
  all_shows_data = {} 
  headliners = show.find_all('h3', class_='carousel_item_title_small')
  openers = show.find_all('h4', class_='supporting')
  date_element = show.find('span', class_='date')
  for headliner in headliners:
    headliner.text.strip()
  for opener in openers:
    opener.text.strip()
  if opener.text.strip() == '':
    all_shows_data['artist'] = [headliner.text.strip()]
  else:
    all_shows_data['artist'] = [headliner.text.strip() + ', ' + opener.text.strip().replace(';', ',')]

  for link_element in show.findAll('a'):
    if link_element.parent == headliner:
      all_shows_data['link'] = link_element['href']
      
  date = show.find('span', class_='date').text.strip()

  day_of_week, date_part = date.split(',', maxsplit=1)
  date_part = date_part.strip()
  date_part_cleaned = ' '.join(date_part.split())
  month, day, year = date_part_cleaned.split()
  month_number = datetime.strptime(month, '%b').month
  full_date_text = f'{month} {day} {year}'

  parsed_date = datetime.strptime(full_date_text, '%b %d, %Y')
  parsed_datetime = f'{parsed_date:%Y-%m-%d}T18:00:00'
  all_shows_data['date'] = parsed_datetime

  all_shows_data['venue'] = 'Agora'
  all_shows_list.append(all_shows_data)

all_shows_json = json.dumps(all_shows_list, indent=2) 
print(all_shows_json)
