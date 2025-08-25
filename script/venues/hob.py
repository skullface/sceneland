import requests
from bs4 import BeautifulSoup 
import json

session = requests.Session()
page = session.get('https://www.ticketmaster.com/house-of-blues-cleveland-tickets-cleveland/venue/41724', headers={'User-Agent': 'Mozilla/5.0'})

# Extract JSON-LD data from the page
soup = BeautifulSoup(page.content, 'html.parser')
json_ld_scripts = soup.find_all('script', type='application/ld+json')

all_shows_list = []

for script in json_ld_scripts:
    try:
        # Parse the JSON-LD data
        json_data = json.loads(script.string)
        
        # Handle both single objects and arrays
        if isinstance(json_data, list):
            events = json_data
        else:
            events = [json_data]
        
        for event in events:
            # Skip non-event items and special ticket items
            if not isinstance(event, dict) or '@type' not in event:
                continue
                
            event_type = event.get('@type', '')
            if event_type not in ['MusicEvent', 'TheaterEvent']:
                continue
                
            # Skip season ticket and priority list items
            name = event.get('name', '')
            if any(skip_term in name.lower() for skip_term in ['season ticket', 'priority list', 'wait list']):
                continue
            
            # Skip events with specific titles
            if any(skip_title in name for skip_title in ['Dance Party', '18+', '21+', 'Electric Feels', 'R&B ONLY LIVE', '80s Vs. 90s']):
                continue
            
            # Extract show data
            all_shows_data = {}
            
            # Parse artist name from event name
            artist_name = name
            if ' - ' in name:
                artist_name = name.split(' - ')[0]
            elif ' w/ ' in name:
                artist_name = name.split(' w/ ')[0]
            elif ' with ' in name:
                artist_name = name.split(' with ')[0]
            
            all_shows_data['artist'] = [artist_name]
            all_shows_data['link'] = event.get('url', '')
            all_shows_data['date'] = event.get('startDate', '')
            all_shows_data['venue'] = 'House of Blues'
            
            all_shows_list.append(all_shows_data)
            
    except (json.JSONDecodeError, KeyError) as e:
        # Skip invalid JSON or missing required fields
        continue

all_shows_json = json.dumps(all_shows_list, indent=2) 
print(all_shows_json)
