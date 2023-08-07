import requests
from bs4 import BeautifulSoup 
import json

session = requests.Session()
page = session.get('https://grogshop.gs/index.php', headers={'User-Agent': 'Mozilla/5.0'})

soup = BeautifulSoup(page.content, "html.parser")
calendar = soup.find(id="tw-responsive")
shows = calendar.find_all("div", class_="tw-section")

all_shows_list = []

for show in shows:
  all_shows_data = {} 
  artist = show.find("div", class_="tw-name")
  support = show.find("div", class_="tw-opening-act")
  date = show.find("span", class_="tw-event-date")
  all_shows_data['artist'] = artist.text.strip()
  if support:
    all_shows_data['support'] = support.text.strip().replace('w/ ', '')
  all_shows_data['date'] = date.text.strip()
  all_shows_list.append(all_shows_data)

all_shows_json = json.dumps(all_shows_list, indent=2) 
print(all_shows_json)
