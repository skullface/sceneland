from selenium import webdriver
from selenium.webdriver import FirefoxOptions
from selenium.common.exceptions import NoSuchElementException
from bs4 import BeautifulSoup 
import json
import time
from datetime import datetime
import re

url = 'https://www.wolsteincenter.com/events/category/events/'
options = FirefoxOptions()
options.add_argument('--headless')
browser = webdriver.Firefox(options=options)
browser.implicitly_wait(15)
browser.get(url)
time.sleep(1)

soup = BeautifulSoup(browser.page_source, 'html.parser')
calendar = soup.find('div', class_='tribe-events')
shows = calendar.find_all('article')

all_shows_list = []

for show in shows:
  all_shows_data = {}

  # Find the anchor element within the show
  link_element = show.find('a')
  all_shows_data['artist'] = link_element.text.strip()
  all_shows_data['link'] = link_element.get('href')

  date = show.find('time').text.strip()
  date_part = date.split(' @ ')[0]
  current_year = datetime.now().year
  
  # Clean up the date string and ensure proper format
  date_part = date_part.strip()
  
  # Check if the date already contains a year (4-digit number)
  year_match = re.search(r'\b(20\d{2})\b', date_part)
  
  if year_match:
    # Date already has a year, use it as is
    date_with_year = date_part
  else:
    # No year found, add current year
    date_with_year = f"{date_part}, {current_year}"
  
  try:
    parsed_date = datetime.strptime(date_with_year, '%B %d, %Y')
    all_shows_data['date'] = str(parsed_date).split(' ', 1)[0] + 'T00:00:01'
  except ValueError as e:
    try:
      if year_match:
        parsed_date = datetime.strptime(date_part, '%B %d %Y')
      else:
        parsed_date = datetime.strptime(f"{date_part} {current_year}", '%B %d %Y')
      all_shows_data['date'] = str(parsed_date).split(' ', 1)[0] + 'T00:00:01'
    except ValueError:
      print(f"Alternative format also failed. Skipping this event.")
      continue
  
  all_shows_data['venue'] = 'Wolstein Center'
  all_shows_list.append(all_shows_data)

all_shows_json = json.dumps(all_shows_list, indent=2) 
print(all_shows_json)
