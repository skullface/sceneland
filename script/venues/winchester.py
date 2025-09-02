import requests
from bs4 import BeautifulSoup 
import json
from datetime import datetime

# url base https://thewinchestermusictavern.com/page/1 
url_base = 'https://thewinchestermusictavern.com/page/'

url_pages = [1, 2, 3]

# Words to filter out from event titles/artists
filter_words = ['Brunch', 'Turntable Tuesdays', 'Trivia', 'Clothing Swap', 'Comedy']

def should_filter_event(artist_text):
    """Check if event should be filtered out based on filter words"""
    artist_lower = artist_text.lower()
    for word in filter_words:
        if word.lower() in artist_lower:
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
    all_shows_data = {} 
    
    artist = show.find('div', class_='tw-name')
    artist_text = artist.text.strip().replace(' W/ ', ', ')
    
    # Skip events that contain filter words
    if should_filter_event(artist_text):
        continue
        
    all_shows_data['artist'] = [artist_text]

    for link_element in show.findAll('a'):
        all_shows_data['link'] = link_element['href'.split('?', 1)[0]]

    sold_out = show.find('a', class_='tw_soldout')
    if sold_out:
        all_shows_data['sold_out'] = True
    
    
    date = show.find('span', class_='tw-event-date').text.strip()

    # Split the date string into an array with named items
    month, day = date.split()
    # Convert the three-letter month name into its number (1-12)
    month_number = datetime.strptime(month, '%b').month
    
    # Get the current date and year
    current_date = datetime.now().date()
    year = current_date.year
    
    # If the event’s month is smaller than the current month, it’s next year
    if month_number < current_date.month:
      year = current_date.year + 1
    else:
      year = current_date.year

    # Add the appropriate year to the given date string
    date = date + ' ' + str(year)
    
    #print(date)
    time = show.find('span', class_='tw-event-time').text.strip()
    date = datetime.strptime(date, '%b %d, %Y').date()
    
    time = datetime.strptime(time, '%I:%M %p').time()
    all_shows_data['date'] = str(date).split(' ', 1)[0] + 'T' + str(time)
    
    # 2024-12-08T18:30:0

    all_shows_data['venue'] = "Winchester Tavern"
    all_shows_list.append(all_shows_data)

all_shows_json = json.dumps(all_shows_list, indent=2)
print(all_shows_json)
