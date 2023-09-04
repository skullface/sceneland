import requests
from bs4 import BeautifulSoup 
import json
from datetime import datetime, timedelta

session = requests.Session()
page = session.get('https://www.eventbrite.com/o/no-class-41123421913', headers={'User-Agent': 'Mozilla/5.0'})

soup = BeautifulSoup(page.content, "html.parser")
calendar = soup.find("div", {"data-testid": "organizer-profile__future-events"})
shows = calendar.find_all("article", class_="eds-event-card-content--grid")

all_shows_list = []

for show in shows:
  all_shows_data = {} 
  artist = show.find('div', class_='eds-is-hidden-accessible')
  all_shows_data['artist'] = [artist.text.strip()]
  
  link = show.find('a', class_='eds-event-card-content__action-link')
  all_shows_data['link'] = link.get('href').split('?', 1)[0]

  date = show.find('div', class_='eds-event-card-content__sub-title').text.strip()

  def transform_date(input_date):
    today = datetime.now()
    tomorrow = today + timedelta(1)
    input_date = input_date.replace(' at ', ', ')
    input_date = input_date.replace('Today', today.strftime('%a, %b %d'))
    input_date = input_date.replace('Tomorrow', tomorrow.strftime('%a, %b %d'))
    return input_date

  transformed_date = transform_date(date)
  date_parts = transformed_date.split(', ', 2)
  
  if len(date_parts) == 3:
    weekday, date, time = date_parts
    date_parts = date.split(' ', 1)
    if len(date_parts) == 2:
      month, day = date_parts
    else:
      month, day = '', date
  else:
    weekday, date, month, day, time = '', date_parts[0], '', '', ''
        
  current_date = datetime.now().date()
  year = current_date.year

  month_number = datetime.strptime(month, '%b').month

  if month_number < current_date.month:
    year = current_date.year + 1
  else:
    year = current_date.year

  date_only = month + day + str(year)
  final_date = datetime.strptime(date_only, '%b%d%Y')
  final_time = datetime.strptime(time, '%I:%M %p').time()
  all_shows_data['date'] = str(final_date).split(' ', 1)[0] + 'T' + str(final_time)
  
  all_shows_data['venue'] = 'No Class'

  all_shows_list.append(all_shows_data)

all_shows_json = json.dumps(all_shows_list, indent=2) 
print(all_shows_json)
