import requests
from bs4 import BeautifulSoup 
import json
from datetime import datetime

url_base = 'https://www.playhousesquare.org/multicategory/category/'
url_pages = ['comedy', 'concerts']

all_shows_list = []
 
for url_page in url_pages:
  url_concat = url_base + str(url_page)
  session = requests.Session()
  page = session.get(url_concat, headers={'User-Agent': 'Mozilla/5.0'})
  soup = BeautifulSoup(page.content, 'html.parser')
  calendar = soup.find('div', class_='m-eventList__wrapper')
  shows = calendar.find_all('div', class_='m-eventItem')

  def should_skip_artist(text):
    excluded_keywords = ['Musical', 'Christmas']
    return any(keyword in text for keyword in excluded_keywords)

  def get_month_number(month_str):
    if len(month_str) == 3:
      return datetime.strptime(month_str, '%b').month
    elif len(month_str) == 4:
      return datetime.strptime(month_str, '%B').month
    else:
      raise ValueError(f"Invalid month format: {month_str}")

  for show in shows:
    all_shows_data = {}

    artist = show.find('h3', class_='m-eventItem__title').text.strip()
    if should_skip_artist(artist):
      continue
    else:
      all_shows_data['artist'] = [artist]

      link = show.find_all('a')[0]
      all_shows_data['link'] = 'https://www.playhousesquare.org' + link.get('href')
  
      day = show.find('span', class_='m-date__day').text.strip()
      day = datetime.strptime(day, '%d').day
      
      month = show.find('span', class_='m-date__month').text.strip()
      month_number = get_month_number(month)
      
      year = show.find('span', class_='m-date__year')
      year = year.text.strip().replace(', ', '')
      year = datetime.strptime(year, '%Y').year

      date = f'{year:02d}-{month_number:02d}-{day:02d}'
      all_shows_data['date'] = date + 'T00:00:01'

      all_shows_data['venue'] = 'Playhouse Square'
      all_shows_list.append(all_shows_data)

all_shows_json = json.dumps(all_shows_list, indent=2)
print(all_shows_json)
