from selenium import webdriver
from bs4 import BeautifulSoup 
import json

url = "https://www.agoracleveland.com/events"
driver = webdriver.Firefox()
driver.implicitly_wait(30)
driver.get(url)
python_button = driver.find_element_by_id("loadMoreEvents")
python_button.click()

soup = BeautifulSoup(driver.page_source)
calendar = soup.find(id="eventsList")
shows = calendar.find_all("div", class_="entry")

all_shows_list = []

for show in shows:
  all_shows_data = {} 
  artist_elements = show.find_all("h3", class_="carousel_item_title_small")
  support_elements = show.find_all("h4", class_="supporting")
  date_element = show.find("span", class_="date")
  for artist_element in artist_elements:
    all_shows_data['artist'] = artist_element.text.strip()
  if support_elements:
    for support_element in support_elements:
      all_shows_data['support'] = support_element.text.strip()
  all_shows_data['date'] = date_element.text.strip().replace("\n", " ")
  all_shows_list.append(all_shows_data)

all_shows_json = json.dumps(all_shows_list, indent=2) 
print(all_shows_json)
