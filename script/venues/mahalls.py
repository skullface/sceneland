import requests
import json

headers = {
  'Accept-Encoding': 'gzip, deflate, sdch',
  'Accept-Language': 'en-US,en;q=0.8',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Referer': 'http://www.wikipedia.org/',
  'Connection': 'keep-alive',
}

params = (
  ('all_events', 'true'),
)

response = requests.get('https://api.dice.fm/venue_profiles/9821', headers=headers, params=params)
data = response.json()

all_shows_list = []

# Find the "Upcoming events" section
for section in data.get('sections', []):
    if section.get('title') == 'Upcoming events':
        for item in section.get('items', []):
            if item.get('type') == 'event':
                event = item.get('event', {})
                
                # Skip events containing specific words
                event_name = event.get('name', '').lower()
                skip_words = ['emo night', 'dance party', 'house party', 'brunch', 'bingo', 'rave']
                if any(word in event_name for word in skip_words):
                    continue
                
                all_shows_data = {} 
                all_shows_data['artist'] = [event.get('name', '').replace(" at Mahall's", '').replace(' at Mahalls', '')]
                all_shows_data['link'] = f"https://dice.fm/event/{event.get('id', '')}"
                if event.get('status') == 'sold-out':
                    all_shows_data['sold_out'] = True
                all_shows_data['date'] = event.get('dates', {}).get('event_start_date', '')
                if event.get('venues', [{}])[0].get('name') == "Mahall's Apartment":
                    all_shows_data['venue'] = 'Mahall’s Apartment'
                elif event.get('venues', [{}])[0].get('name') == "The Roxy at Mahall's":
                    all_shows_data['venue'] = 'The Roxy at Mahall’s'
                else:
                    all_shows_data['venue'] = 'Mahall’s'
                all_shows_list.append(all_shows_data)
        break

all_shows_json = json.dumps(all_shows_list, indent=2) 
print(all_shows_json)
