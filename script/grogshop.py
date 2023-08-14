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
  headliner = show.find("div", class_="tw-name")
  opener = show.find("div", class_="tw-opening-act")
  date = show.find("span", class_="tw-event-date")
  if opener.text.strip() == "":
    all_shows_data['artist'] = [headliner.text.strip().replace("w / ", ", ").replace("w/ ", ", ").replace(" / / ", ", ").replace(" // ", ", ").replace(" / ", ", ")]
  else:
    all_shows_data['artist'] = [headliner.text.strip().replace("w / ", ", ").replace("w/ ", ", ").replace(" / ", ", ").replace(" // ", ", ") + ", " + opener.text.strip().replace("w/ ", "").replace(" / ", ", ")]
  all_shows_data['date'] = date.text.strip().replace("Aug ", "2023-08-").replace("Sep ", "2023-09-").replace("Oct ", "2023-10-").replace("Nov ", "2023-11-").replace("Dec ", "2023-12-").replace("Jan ", "2024-01-").replace("Feb ", "2024-02-").replace("Mar ", "2024-03-").replace("Apr ", "2024-04-").replace("May ", "2024-05-").replace("Jun ", "2024-06-").replace("Jul ", "2024-07-").replace("Mon, ", "").replace("Tue, ", "").replace("Wed, ", "").replace("Thu, ", "").replace("Fri, ", "").replace("Sat, ", "").replace("Sun, ", "")
  all_shows_data['venue'] = "Grog Shop"
  all_shows_list.append(all_shows_data)

all_shows_json = json.dumps(all_shows_list, indent=2) 
print(all_shows_json)
