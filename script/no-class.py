import requests
from bs4 import BeautifulSoup 
import json

session = requests.Session()
page = session.get('https://www.eventbrite.com/o/no-class-41123421913', headers={'User-Agent': 'Mozilla/5.0'})

soup = BeautifulSoup(page.content, "html.parser")
calendar = soup.find("div", class_="organizer-profile__event-renderer__grid")
shows = calendar.find_all("div", class_="eds-event-card-content__content")

all_shows_list = []

for show in shows:
  all_shows_data = {} 
  artist = show.find("div", class_="eds-is-hidden-accessible")
  date = show.find("div", class_="eds-event-card-content__sub-title")
  all_shows_data['artist'] = [artist.text.strip()]
  dateFormatted = date.text.strip().replace("Aug ", "2023-08-").replace("Sep ", "2023-09-").replace("Oct ", "2023-10-").replace("Nov ", "2023-11-").replace("Dec ", "2023-12-").replace("Jan ", "2024-01-").replace("Feb ", "2024-02-").replace("Mar ", "2024-03-").replace("Apr ", "2024-04-").replace("May ", "2024-05-").replace("Jun ", "2024-06-").replace("Jul ", "2024-07-").replace("Mon, ", "").replace("Tue, ", "").replace("Wed, ", "").replace("Thu, ", "").replace("Fri, ", "").replace("Sat, ", "").replace("Sun, ", "").split(", ", 1)[0] + "T20:00:00"
  all_shows_data['date'] = dateFormatted.replace("-1T", "-01T").replace("-2T", "-02T").replace("-3T", "-03T").replace("-4T", "-04T").replace("-5T", "-05T").replace("-6T", "-06T").replace("-7T", "-07T").replace("-8T", "-08T").replace("-9T", "-09T")
  all_shows_list.append(all_shows_data)

all_shows_json = json.dumps(all_shows_list, indent=2) 
print(all_shows_json)
