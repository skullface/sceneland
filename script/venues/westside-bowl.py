from selenium import webdriver
from selenium.webdriver import FirefoxOptions
from selenium.common.exceptions import NoSuchElementException
from bs4 import BeautifulSoup 
import json
import time
from datetime import datetime
import re

url = 'https://westsidebowl.com/tickets/'
options = FirefoxOptions()
options.add_argument('--headless')
browser = webdriver.Firefox(options=options)
browser.implicitly_wait(15)
browser.get(url)
time.sleep(1)

soup = BeautifulSoup(browser.page_source, 'html.parser')
calendar = soup.find('section', class_='wfea')
shows = calendar.find_all('article')

all_shows_list = []
current_year = datetime.now().year

for show in shows:
  all_shows_data = {}

  link_element = show.find('h3').find('a')
  all_shows_data['artist'] = [link_element.text.strip().replace('/', ', ')]
  all_shows_data['link'] = link_element.get('href')
  
  # Extract date from the calendar date structure
  date_element = show.find('div', class_='eaw-calendar-date')
  if date_element:
    month_element = date_element.find('div', class_='eaw-calendar-date-month')
    day_element = date_element.find('div', class_='eaw-calendar-date-day')
    
    if month_element and day_element:
      month_str = month_element.text.strip()
      day_str = day_element.text.strip()
      
      # Convert month abbreviation to number
      month_map = {
        'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
        'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
      }
      
      if month_str in month_map and day_str.isdigit():
        month_num = month_map[month_str]
        day_num = int(day_str)
        
        # Create date string in the required format
        date_str = f"{current_year:04d}-{month_num:02d}-{day_num:02d}T00:00:01"
        all_shows_data['date'] = date_str
  
  all_shows_data['venue'] = 'Westside Bowl'
  all_shows_list.append(all_shows_data)

all_shows_json = json.dumps(all_shows_list, indent=2) 
print(all_shows_json)
