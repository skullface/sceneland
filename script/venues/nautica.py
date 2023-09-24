import requests
from bs4 import BeautifulSoup 
import json

session = requests.Session()
page = session.get('https://nauticawaterfrontdistrict.com/events/?venue=jacobs-pavilion-at-nautica', headers={'User-Agent': 'Mozilla/5.0'})

soup = BeautifulSoup(page.content, 'html.parser')
calendar = soup.find('ul', class_='card-list')

if calendar:
  shows = calendar.find_all('li', class_='card-list__item')

  all_shows_list = []

  for show in shows:
    all_shows_data = {} 
    headliner = show.find('h5')
    opener = show.find('h5').find_next_sibling('p')
    if not opener:
      all_shows_data['artist'] = [headliner.text.strip()]
    else:
      all_shows_data['artist'] = [headliner.text.strip() + opener.text.strip().replace('with ', ', ').replace(', and ', ', ')]
    for link_element in show.findAll('a'):
      all_shows_data['link'] = link_element['href']
    date = show.find('span', class_='event-start')
    all_shows_data['date'] = date.get('content')
    all_shows_data['venue'] = 'Jacobs Pavilion at Nautica'
    all_shows_list.append(all_shows_data)

  all_shows_json = json.dumps(all_shows_list, indent=2) 
  print(all_shows_json)
else:
  all_shows_json = '[]'
  print(all_shows_json)
