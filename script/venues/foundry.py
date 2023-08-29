import requests
from bs4 import BeautifulSoup 
import json

session = requests.Session()
page = session.get('https://www.foundryconcertclub.com', headers={'User-Agent': 'Mozilla/5.0'})

soup = BeautifulSoup(page.content, "html.parser")
calendar = soup.find("div", class_="tw-plugin-upcoming-event-list")
shows = calendar.find_all("div", class_="tw-section")

all_shows_list = []

for show in shows:
  all_shows_data = {} 
  artist = show.find("div", class_="tw-name")
  sold_out = show.find("a", class_="tw_soldout")
  link = show.find("a")
  date = show.find("span", class_="tw-event-date")
  if artist.text.strip() == "Last Call Trivia":
    ...
  elif artist.text.strip() == "Taco Tuesday":
    ...
  elif "Pop-Up" in artist.text.strip():
    ...
  elif "Dance Party" in artist.text.strip():
    ...
  else:
    all_shows_data['artist'] = [artist.text.strip()]
  all_shows_data['link'] = link.get('href').split("?", 1)[0]
  if sold_out:
    all_shows_data['sold_out'] = True
  dateFormatted = date.text.strip().replace(", 2023", "").replace("August ", "2023-08-").replace("September ", "2023-09-").replace("October ", "2023-10-").replace("November ", "2023-11-").replace("December ", "2023-12-").replace("January ", "2024-01-").replace("February ", "2024-02-").replace("March ", "2024-03-").replace("April ", "2024-04-").replace("May ", "2024-05-").replace("June ", "2024-06-").replace("July ", "2024-07-") + "T20:00:00"
  all_shows_data['date'] = dateFormatted.replace("-1T", "-01T").replace("-2T", "-02T").replace("-3T", "-03T").replace("-4T", "-04T").replace("-5T", "-05T").replace("-6T", "-06T").replace("-7T", "-07T").replace("-8T", "-08T").replace("-9T", "-09T")
  all_shows_data['venue'] = "The Foundry"
  all_shows_list.append(all_shows_data)

all_shows_json = json.dumps(all_shows_list, indent=2)
print(all_shows_json)
