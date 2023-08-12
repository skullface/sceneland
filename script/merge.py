import glob
import json

read_files = glob.glob("src/*.json")
shows_all = []

for f in read_files:
  with open(f, "rb") as infile:
    shows_all.append(json.load(infile))

shows_json = []
for json_file in shows_all:
  shows_json += json_file

shows_merged = open('shows.json', 'w')
json.dump({ "shows": shows_json }, shows_merged, indent=2)
shows_merged.close()
