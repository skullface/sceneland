from selenium import webdriver
from selenium.webdriver import FirefoxOptions
from selenium.common.exceptions import NoSuchElementException
from bs4 import BeautifulSoup 
import json
import time
from datetime import datetime

url = 'https://www.crobar1921.com/events'
options = FirefoxOptions()
options.add_argument('--headless')
browser = webdriver.Firefox(options=options)
browser.implicitly_wait(15)
browser.get(url)
time.sleep(1)

soup = BeautifulSoup(browser.page_source, 'html.parser')
calendar = soup.find('div', class_='main-content-wrapper')
shows = calendar.find_all('div', class_='element-group')

# An empty array as a place to save the output
all_shows_list = []

# Iterate through the events in the DOM
for show in shows:

  # Empty object for each show, to be populated below
  all_shows_data = {} 

  show_name = show.find('h2').text.strip()
  artists_text = show.find('p')
  
  # Extract text content and clean up HTML entities and formatting
  artists_raw = artists_text.get_text(separator='\n', strip=True)
  # Split by newlines and filter out empty strings, then join with commas
  artists = ', '.join([artist.strip() for artist in artists_raw.split('\n') if artist.strip()])
  
  all_shows_data['artist'] = show_name + ': ' + artists
  
  all_shows_data['link'] = show.find('a')['href']

  # Get the date and time DOM elements
  date_text = show.find('h6').text.strip()
  # Parse the date format: "SATURDAY AUGUST 23RD"
  
  # Convert to ISO format with default time 12:01 AM
  try:
    # Split the date text into parts
    parts = date_text.split()
    
    if len(parts) >= 3:
      # Skip the first part (day of week) and get month and day
      month_name = parts[1]  # AUGUST
      day_with_ordinal = parts[2]  # 23RD
      
      # Extract just the numeric day by removing ordinal indicators
      day = ''
      for char in day_with_ordinal:
        if char.isdigit():
          day += char
      
      # Get current year (assuming shows are in current or next year)
      current_year = datetime.now().year
      
      # Create datetime object with default time 00:00:01
      date_obj = datetime.strptime(f"{day} {month_name} {current_year}", "%d %B %Y")
      date_obj = date_obj.replace(hour=0, minute=0, second=1)
      
      # Check if the date is in the past, if so assume next year
      if date_obj < datetime.now():
        date_obj = datetime.strptime(f"{day} {month_name} {current_year + 1}", "%d %B %Y")
        date_obj = date_obj.replace(hour=0, minute=0, second=1)
      
      # Convert to ISO format
      date = date_obj.isoformat()
    else:
      date = date_text  # Fallback to original text if parsing fails
  except Exception as e:
    print(f"Error parsing date '{date_text}': {e}")
    date = date_text  # Fallback to original text if parsing fails
  
  all_shows_data['date'] = date

  # Add the venue to the object
  all_shows_data['venue'] = "Crobar"
  
  # Populate the empty array `[]` with the object we just defined
  all_shows_list.append(all_shows_data)

# Make our final list more readable with JSON formatting
# This is technically a Python string, but we don't care about that anymore
all_shows_json = json.dumps(all_shows_list, indent=2) 
print(all_shows_json)
