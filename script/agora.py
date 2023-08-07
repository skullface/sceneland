from selenium import webdriver
from selenium.webdriver import FirefoxOptions
from bs4 import BeautifulSoup 
import json

url = "https://www.agoracleveland.com/events"
options = FirefoxOptions()
options.add_argument("--headless")
browser = webdriver.Firefox(options=options)
browser.implicitly_wait(30)
browser.get(url)
python_button = browser.find_element("id", "loadMoreEvents")
python_button.click()

soup = BeautifulSoup(browser.page_source, "html.parser")
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
