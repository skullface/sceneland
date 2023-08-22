import glob
import json
import sh
import os

read_files = glob.glob('src/data/venues/*.json')
all_shows = []

for file in read_files:
  with open(file, 'rb') as infile:
    all_shows.append(json.load(infile))

shows_json = []
for json_file in all_shows:
  shows_json += json_file

shows_merged = open('src/data/allShows.js', 'w')
json.dump(shows_json, shows_merged, indent=2)
shows_merged.close()

sh.sed('-i.tmp', '1s/.*/' + 'export const allShows = [' + '/', 'src/data/allShows.js')

if os.path.isfile('src/data/allShows.js.tmp'):
  os.remove('src/data/allShows.js.tmp')
else:
  print('Nothing to delete 🫡')
