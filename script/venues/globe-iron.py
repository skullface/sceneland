import requests
import json
from datetime import datetime

# AEG Events API endpoint for Globe Iron (venue ID 339)
url = 'https://aegwebprod.blob.core.windows.net/json/events/339/events.json'

try:
    # Fetch events data from the API
    response = requests.get(url)
    response.raise_for_status()  # Raise an exception for bad status codes
    
    data = response.json()
    events = data.get('events', [])
    
    all_shows_list = []
    
    for event in events:
        # Skip if event is not active
        if not event.get('active', False):
            continue
            
        all_shows_data = {}
        
        # Extract artist information
        title_info = event.get('title', {})
        headliners = title_info.get('headlinersText', '')
        supporting = title_info.get('supportingText', '')
        
        if supporting:
            all_shows_data['artist'] = [f"{headliners}, {supporting}"]
        else:
            all_shows_data['artist'] = [headliners]
        
        # Extract ticket link
        ticketing = event.get('ticketing', {})
        if ticketing.get('ticketLinkExists'):
            all_shows_data['link'] = ticketing.get('url', '')
        else:
            all_shows_data['link'] = ''
        
        # Extract and format date
        event_date = event.get('eventDateTime')
        if event_date:
            # Parse the ISO date string and format it
            try:
                parsed_date = datetime.fromisoformat(event_date.replace('Z', '+00:00'))
                all_shows_data['date'] = parsed_date.strftime('%Y-%m-%dT%H:%M:%S')
            except ValueError:
                # Fallback to just the date part if time parsing fails
                all_shows_data['date'] = event_date.split('T')[0] + 'T00:00:01'
        else:
            all_shows_data['date'] = ''
        
        # Set venue name
        all_shows_data['venue'] = 'Globe Iron'
        
        all_shows_list.append(all_shows_data)
    
    # Output the results
    all_shows_json = json.dumps(all_shows_list, indent=2)
    print(all_shows_json)
    
except requests.RequestException as e:
    print(f"Error fetching data: {e}")
except json.JSONDecodeError as e:
    print(f"Error parsing JSON: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
