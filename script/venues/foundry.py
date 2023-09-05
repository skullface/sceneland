import requests
from bs4 import BeautifulSoup 
import json
from datetime import datetime

url_base = 'https://www.foundryconcertclub.com/page/'
url_pages = [1, 2, 3]

all_shows_list = []
 
for url_page in url_pages:
  url_concat = url_base + str(url_page)
  session = requests.Session()
  page = session.get(url_concat, headers={'User-Agent': 'Mozilla/5.0'})
  soup = BeautifulSoup(page.content, 'html.parser')
  calendar = soup.find("div", class_="tw-plugin-upcoming-event-list")
  shows = calendar.find_all("div", class_="tw-section")

  all_shows_list = []

  def should_skip_artist(artist_text):
    excluded_keywords = ['Last Call Trivia', 'Taco Tuesday', 'Burger', 'Pop-Up', 'Dance Party']
    return any(keyword in artist_text for keyword in excluded_keywords)

  for show in shows:
    all_shows_data = {} 
    
    artist = show.find("div", class_="tw-name").text.strip()
    if should_skip_artist(artist):
      continue
    else:
      all_shows_data['artist'] = [artist]
      
    link = show.find("a")
    all_shows_data['link'] = link.get('href').split("?", 1)[0]
    
    sold_out = show.find("a", class_="tw_soldout")
    if sold_out:
      all_shows_data['sold_out'] = true

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
