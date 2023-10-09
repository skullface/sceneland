from selenium import webdriver
from selenium.webdriver import FirefoxOptions
from selenium.common.exceptions import NoSuchElementException
from bs4 import BeautifulSoup 
import json
import time
from datetime import datetime

url = 'https://www.agoracleveland.com/events'
options = FirefoxOptions()
options.add_argument('--headless')
browser = webdriver.Firefox(options=options)
browser.implicitly_wait(30)
browser.get(url)
try:
  load_more_button = browser.find_element('id', 'loadMoreEvents')
  load_more_button.click()
  time.sleep(1)
  load_more_button.click()
except NoSuchElementException:
  pass

soup = BeautifulSoup(browser.page_source, 'html.parser')
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
  time = show.find('span', class_='time').text.strip()
  time_text = time.replace(' ', '').replace('Doors', '')
  time_text = ''.join(time_text.split())

  day_of_week, date_part = date.split(',', maxsplit=1)
  date_part = date_part.strip()
  date_part_cleaned = ' '.join(date_part.split())
  month, day, year = date_part_cleaned.split()
  month_number = datetime.strptime(month, '%b').month
  full_date_text = f'{month} {day} {year}'

  parsed_date = datetime.strptime(full_date_text, '%b %d, %Y')
  parsed_time = datetime.strptime(time_text, '%I:%M%p').time()
  parsed_datetime = f'{parsed_date:%Y-%m-%d}T{parsed_time:%H:%M:%S}'
  all_shows_data['date'] = parsed_datetime

  all_shows_data['venue'] = 'Agora'
  all_shows_list.append(all_shows_data)

all_shows_json = json.dumps(all_shows_list, indent=2) 
print(all_shows_json)
