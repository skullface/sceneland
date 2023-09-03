import requests
from bs4 import BeautifulSoup 
import json
from datetime import datetime
from collections import OrderedDict

session = requests.Session()
page = session.get('https://grogshop.gs/index.php', headers={'User-Agent': 'Mozilla/5.0'})

soup = BeautifulSoup(page.content, 'html.parser')
calendar = soup.find(id='tw-responsive')
shows = calendar.find_all('div', class_='tw-section')

all_shows_list = []

for show in shows:
  all_shows_data = {} 
  
  headliner = show.find('div', class_='tw-name')
  opener = show.find('div', class_='tw-opening-act')
  headlinerz = headliner.text.strip().replace('w / ', ', ').replace('w/ ', ', ').replace(' / / ', ', ').replace(' // ', ', ').replace(' / ', ', ').replace(' - ', ': ').replace(' – ', ': ')
  artists_with_openers = [headlinerz + ', ' + opener.text.strip().replace('w/ ', '').replace(' / ', ', ')]

  # Create an ordered dictionary to store unique artist names
  unique_artists_dict = OrderedDict()

  # Process each entry in the list
  for entry in artists_with_openers:
      artists = entry.split(', ')  # Split by comma and space
      for artist in artists:
          artist = artist.strip()  # Remove leading/trailing spaces
          if artist:  # Skip empty entries
              unique_artists_dict[artist] = None  # Using dict keys to maintain order

  # Convert the ordered dictionary keys back to a list
  artists_with_openers_clean = list(unique_artists_dict.keys())

  if opener.text.strip() == '':
    all_shows_data['artist'] = [headlinerz]
  else:
    all_shows_data['artist'] = artists_with_openers_clean

  for link_element in show.findAll('a'):
    if link_element.parent == headliner:
      all_shows_data['link'] = link_element['href']

  sold_out = show.find('a', class_='tw_soldout')
  if sold_out:
    all_shows_data['sold_out'] = True

  date = show.find('span', class_='tw-event-date').text.strip()
  time = show.find('span', class_='tw-event-time').text.strip()
  weekday, month, day = date.split()
  month_number = datetime.strptime(month, '%b').month

  current_date = datetime.now().date()
  year = current_date.year

  if month_number < current_date.month:
    year = current_date.year + 1
  else:
    year = current_date.year

  date = date + ' ' + str(year)
  date = datetime.strptime(date, '%a, %b %d %Y')
  time = datetime.strptime(time, '%I:%M %p').time()
  all_shows_data['date'] = str(date).split(' ', 1)[0] + 'T' + str(time)

  all_shows_data['venue'] = 'Grog Shop'
  all_shows_list.append(all_shows_data)

all_shows_json = json.dumps(all_shows_list, indent=2)
print(all_shows_json)
