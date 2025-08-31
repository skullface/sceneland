import requests
from bs4 import BeautifulSoup 
import json
from datetime import datetime

url_base = 'https://www.foundryconcertclub.com/page/'
url_pages = [1, 2, 3]

def should_skip_event(event_title):
    """Filter out events with specific keywords in the title"""
    skip_keywords = [
        'Yoga',
        'Nerd Night',
        'Trivia',
        'Punk Night',
        'Dance Party',
        'Bingo',
        'Comedy',
        'Closed',
        'Movie'
    ]
    
    event_title_lower = event_title.lower()
    for keyword in skip_keywords:
        if keyword.lower() in event_title_lower:
            return True
    return False

all_shows_list = []
 
for url_page in url_pages:
  url_concat = url_base + str(url_page)
  session = requests.Session()
  page = session.get(url_concat, headers={'User-Agent': 'Mozilla/5.0'})
  soup = BeautifulSoup(page.content, 'html.parser')
  calendar = soup.find("div", class_="tw-plugin-upcoming-event-list")
  shows = calendar.find_all("div", class_="tw-section")

  for show in shows:
    # Get the event title first and check if we should skip it
    event_title = show.find("div", class_="tw-name").text.strip()
    if should_skip_event(event_title):
      continue
    
    # If we get here, the event is not filtered out, so process it
    all_shows_data = {} 
    all_shows_data['artist'] = [event_title]
      
    link = show.find("a")
    all_shows_data['link'] = link.get('href').split("?", 1)[0]
    
    sold_out = show.find("a", class_="tw_soldout")
    if sold_out:
      all_shows_data['sold_out'] = True

    date = show.find("span", class_="tw-event-date").text.strip()
    time = show.find('span', class_='tw-event-time').text.strip()
    
    time = show.find('span', class_='tw-event-time').text.strip()
    date = datetime.strptime(date, '%B %d, %Y')
    time = datetime.strptime(time, '%I:%M %p').time()
    all_shows_data['date'] = str(date).split(' ', 1)[0] + 'T' + str(time)

    all_shows_data['venue'] = "Foundry"
    all_shows_list.append(all_shows_data)

all_shows_json = json.dumps(all_shows_list, indent=2)
print(all_shows_json)
