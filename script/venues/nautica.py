from selenium import webdriver
from selenium.webdriver import FirefoxOptions
from selenium.common.exceptions import NoSuchElementException
from bs4 import BeautifulSoup 
import json
import time
from datetime import datetime

url = 'https://www.jacobspavilion.com/calendar/'
options = FirefoxOptions()
options.add_argument('--headless')
browser = webdriver.Firefox(options=options)
browser.implicitly_wait(15)
browser.get(url)
time.sleep(1)

soup = BeautifulSoup(browser.page_source, 'html.parser')
calendar = soup.find('div', class_='c-axs-events')
shows = calendar.find_all('a', class_='c-axs-event-card__header13373')

all_shows_list = []

for show in shows:
  all_shows_data = {}

  headliner = show.find('div', class_='c-axs-event-card__title')
  opener = show.find('div', class_='c-axs-event-card__supporting-text')
  if not opener:
    all_shows_data['artist'] = [headliner.text.strip()]
  else:
    all_shows_data['artist'] = [headliner.text.strip() + ', ' + opener.text.strip().replace('with special guest ', '')]

  all_shows_data['link'] = 'https://www.jacobspavilion.com' + show['href']

  date = show.find('span', class_='date').text.strip()

  date = datetime.strptime(date, '%b %d, %Y')
  all_shows_data['date'] = str(date).split(' ', 1)[0] + 'T00:00:01'
  
  all_shows_data['venue'] = 'Jacobs Pavilion at Nautica'

  all_shows_list.append(all_shows_data)

all_shows_json = json.dumps(all_shows_list, indent=2) 
print(all_shows_json)
