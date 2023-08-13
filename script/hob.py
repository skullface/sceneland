import requests
from bs4 import BeautifulSoup 
import json

session = requests.Session()
page = session.get('https://www.livenation.com/venue/KovZpZAEAA1A/house-of-blues-cleveland-events', headers={'User-Agent': 'Mozilla/5.0'})

soup = BeautifulSoup(page.content, "html.parser")
calendar = soup.find("ul", class_="css-p47pw5")
shows = calendar.find_all("li", class_="css-re1cpl")

all_shows_list = []

for show in shows:
  all_shows_data = {} 
  artist = show.find("h3", class_="css-1ptng6s")
  date = show.find("div", class_="css-qjpp58")
  all_shows_data['artist'] = artist.text.strip().replace(" - ", ": ")
  all_shows_data['date'] = date.text.strip().replace("Aug ", "2023-08-").replace("Sep ", "2023-09-").replace("Oct ", "2023-10-").replace("Nov ", "2023-11-").replace("Dec ", "2023-12-").replace("Jan ", "2024-01-").replace("Feb ", "2024-02-").replace("Mar ", "2024-03-").replace("Apr ", "2024-04-").replace("May ", "2024-05-").replace("Jun ", "2024-06-").replace("Jul ", "2024-07-").replace("Mon ", "").replace("Tue ", "").replace("Wed ", "").replace("Thu ", "").replace("Fri ", "").replace("Sat ", "").replace("Sun ", "").replace(", 2023", "")
  all_shows_data['venue'] = "House of Blues"
  all_shows_list.append(all_shows_data)

all_shows_json = json.dumps(all_shows_list, indent=2) 
print(all_shows_json)
