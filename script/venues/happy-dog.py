import requests
from bs4 import BeautifulSoup 
import json
from datetime import datetime

session = requests.Session()
page = session.get('https://app.opendate.io/v/happy-dog-1767', headers={'User-Agent': 'Mozilla/5.0'})

soup = BeautifulSoup(page.content, 'html.parser')
calendar = soup.find('div', class_='form-row')
shows = calendar.find_all('div', class_='card-body')

all_shows_list = []

for show in shows:
  all_shows_data = {} 
  artist = show.find('a')
  all_shows_data['artist'] = [artist.text.strip().replace(' / ', ', ')]

  all_shows_data['link'] = artist.get('href')

  date = show.find_all('p')[1] 
  date_text = date.text.strip()  # "January 24, 2025"
  date_obj = datetime.strptime(date_text, "%B %d, %Y")
  date = date_obj.strftime("%Y-%m-%d")
  all_shows_data['date'] = date + 'T00:00:01'

  all_shows_data['venue'] = 'Happy Dog'
  all_shows_list.append(all_shows_data)

all_shows_json = json.dumps(all_shows_list, indent=2) 
print(all_shows_json)
