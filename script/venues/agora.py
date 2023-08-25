from selenium import webdriver
from selenium.webdriver import FirefoxOptions
from bs4 import BeautifulSoup 
import json
import time

url = "https://www.agoracleveland.com/events"
options = FirefoxOptions()
options.add_argument("--headless")
browser = webdriver.Firefox(options=options)
browser.implicitly_wait(30)
browser.get(url)
load_more_button = browser.find_element("id", "loadMoreEvents")
load_more_button.click()
time.sleep(1)
load_more_button.click()

soup = BeautifulSoup(browser.page_source, "html.parser")
calendar = soup.find(id="eventsList")
shows = calendar.find_all("div", class_="entry")

all_shows_list = []

for show in shows:
  all_shows_data = {} 
  headliners = show.find_all("h3", class_="carousel_item_title_small")
  openers = show.find_all("h4", class_="supporting")
  date_element = show.find("span", class_="date")
  for headliner in headliners:
    headliner.text.strip()
  for opener in openers:
    opener.text.strip()
  if opener.text.strip() == "":
    all_shows_data['artist'] = [headliner.text.strip()]
  else:
    all_shows_data['artist'] = [headliner.text.strip() + ", " + opener.text.strip().replace(";", ",")]
  for link_element in show.findAll("a"):
    if link_element.parent == headliner:
      all_shows_data['link'] = link_element["href"]
  all_shows_data['date'] = date_element.text.strip().replace("\n", " ").replace("Aug ", "2023-08-").replace("Sep ", "2023-09-").replace("Oct ", "2023-10-").replace("Nov ", "2023-11-").replace("Dec ", "2023-12-").replace("Jan ", "2024-01-").replace("Feb ", "2024-02-").replace("Mar ", "2024-03-").replace("Apr ", "2024-04-").replace("May ", "2024-05-").replace("Jun ", "2024-06-").replace("Jul ", "2024-07-").replace("Mon, ", "").replace("Tue, ", "").replace("Wed, ", "").replace("Thu, ", "").replace("Fri, ", "").replace("Sat, ", "").replace("Sun, ", "").replace("-1, 2023", "-01").replace("-2, 2023", "-02").replace("-3, 2023", "-03").replace("-4, 2023", "-04").replace("-5, 2023", "-05").replace("-6, 2023", "-06").replace("-7, 2023", "-07").replace("-8, 2023", "-08").replace("-9, 2023", "-09").replace("-1, 2024", "-01").replace("-2, 2024", "-02").replace("-3, 2024", "-03").replace("-4, 2024", "-04").replace("-5, 2024", "-05").replace("-6, 2024", "-06").replace("-7, 2024", "-07").replace("-8, 2024", "-08").replace("-9, 2024", "-09").replace(", 2023", "").replace(", 2024", "") + "T20:00:00"
  all_shows_data['venue'] = "Agora"
  all_shows_list.append(all_shows_data)

all_shows_json = json.dumps(all_shows_list, indent=2) 
print(all_shows_json)
