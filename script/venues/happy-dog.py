from selenium import webdriver
from selenium.webdriver import FirefoxOptions
from selenium.common.exceptions import NoSuchElementException
from bs4 import BeautifulSoup 
import json
import time
from dateutil.parser import parse
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta, MO, TU, WE, TH, FR, SA, SU
import re

url = 'https://www.eventbrite.com/o/the-happy-dog-20098107793'
options = FirefoxOptions()
options.add_argument('--headless')
browser = webdriver.Firefox(options=options)
browser.implicitly_wait(15)
browser.get(url)
try:
  load_more_button = browser.find_element('xpath', '/html/body/div[1]/div/div[2]/div/div/div/div[1]/div/main/section/div[3]/section/div/div[1]/div/div[3]/button')
  time.sleep(2)
  load_more_button.click()
  time.sleep(2)
  load_more_button.click()
  time.sleep(2)
except NoSuchElementException:
  pass

soup = BeautifulSoup(browser.page_source, 'html.parser')
calendar = soup.find('div', {'data-testid': 'organizer-profile__future-events'})
shows = calendar.find_all('div', class_='Container_root__16e3w')

all_shows_list = []
dupe_urls = set()

for show in shows:
  all_shows_data = {} 
  artist = show.find('h2', class_='Typography_root__4bejd')
  if artist.text.strip() != 'Monday Night Trivia!':
    all_shows_data['artist'] = [artist.text.strip().replace(' / ', ', ').replace(' - ', ': ')]

    link = show.find('a', class_='event-card-link')
    all_shows_data['link'] = link.get('href').split('?', 1)[0]

    if link in dupe_urls:
      continue
    dupe_urls.add(link)

    date = show.find('p', class_='Typography_body-md__4bejd').text.strip()
    
    def parse_date(date_str):
      today = datetime.now()

      # Handle relative dates like "Today" and "Tomorrow"
      if 'Today' in date_str:
        date_str = date_str.replace('Today', today.strftime('%b %d'))
      elif 'Tomorrow' in date_str:
        tomorrow = today + timedelta(days=1)
        date_str = date_str.replace('Tomorrow', tomorrow.strftime('%b %d'))
      else:
        # Handling weekdays using dateutil's relativedelta
        weekdays = {
          'Monday': MO,
          'Tuesday': TU,
          'Wednesday': WE,
          'Thursday': TH,
          'Friday': FR,
          'Saturday': SA,
          'Sunday': SU
        }
        for day, day_obj in weekdays.items():
          if day in date_str:
            next_day = today + relativedelta(weekday=day_obj(+1))
            date_str = date_str.replace(day, next_day.strftime('%b %d'))
            break

      # Extracting the time component
      time_str = re.search(r'(\d+:\d+\s*[APMapm]*)', date_str)
      if time_str:
        time_str = time_str.group()
      else:
        # Default time if not found
        time_str = '00:00 AM'

      # Handling different date formats and combining date part and time part
      if ',' in date_str:
        # Format: "Tue, Mar 26 • 9:00 PM"
        date_part = date_str.split('•')[0].strip()
      else:
        # Format: "Friday • 6:30 PM"
        current_year = today.year
        date_part = date_str.split('•')[0].strip() + f" {current_year}"

      combined_str = f"{date_part} {time_str}"
      date_obj = parse(combined_str)

      # Returning the formatted date
      return date_obj.strftime('%Y-%m-%dT%H:%M:%S')

    formatted_date = parse_date(date)
    all_shows_data['date'] = formatted_date

    all_shows_data['venue'] = 'Happy Dog'
    all_shows_list.append(all_shows_data)

all_shows_json = json.dumps(all_shows_list, indent=2) 
print(all_shows_json)
