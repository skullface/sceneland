from selenium import webdriver
from selenium.webdriver import FirefoxOptions
from bs4 import BeautifulSoup 
import json
import time
from datetime import datetime, timedelta

url = 'https://www.rocketmortgagefieldhouse.com/events'
options = FirefoxOptions()
options.add_argument('--headless')
browser = webdriver.Firefox(options=options)
browser.implicitly_wait(15)
browser.get(url)
load_more_button = browser.find_element('id', 'loadMoreEvents')
load_more_button.click()
time.sleep(1)
load_more_button.click()
time.sleep(1)
load_more_button.click()
time.sleep(1)

soup = BeautifulSoup(browser.page_source, 'html.parser')
calendar = soup.find('div', class_='eventList__wrapper')
shows = calendar.find_all('div', class_='info_wrapper')

all_shows_list = []

def should_skip_artist(text):
  excluded_keywords = ['AEW', 'Christmas', 'Ringling', 'Cavaliers', 'Monsters vs.', 'Cavs', 'Moondog']
  return any(keyword in text for keyword in excluded_keywords)

for show in shows:
  all_shows_data = {}

  headliner = show.find('h3', class_='title').text.strip().replace(' - ', ': ')
  opener = show.find('h4', class_='tagline')

  artists = [headliner]
  if opener:
    opener = opener.text.strip().replace('With ', '').replace('Special Guest ', '').replace('with special guest ', '')
    artists.append(opener)

  if any(should_skip_artist(artist) for artist in artists):
    continue
  else:
    all_shows_data['artist'] = artists
    link = show.find_all('a')[0]
    all_shows_data['link'] = link.get('href')

    date = show.find('div', class_='date').get('aria-label')
    if ' to ' in date:
      continue
    else:
      date = datetime.strptime(date, '%B %d %Y')

      all_shows_data['date'] = date.strftime('%Y-%m-%d') 

      all_shows_data['venue'] = 'Rocket Mortgage FieldHouse'
      all_shows_list.append(all_shows_data)

all_shows_json = json.dumps(all_shows_list, indent=2)
print(all_shows_json)
