import json
import csv
import copy


entries = []
base_entry = {'type': 'Feature',
              'geometry': {
                  'type': 'Point',
                  'coordinates': [],
              },
              'properties': {}
              }
featureCollection = {'type': 'FeatureCollection',
                     }

condition_map = {'G': 'good', 'F': 'fair', 'P': 'poor', 'NULL': 'N/A', 'N': 'N/A'}
with open('2022AllRecordsDelimitedAllStatesCleanFiltered.csv', newline='') as csvfile:
    has_header = csv.Sniffer().has_header(csvfile.read(2048))
    csvfile.seek(0)
    reader = csv.reader(csvfile, delimiter=',')
    if has_header:
        next(reader)  # Skip header row.
    for row in reader:
        entry = copy.deepcopy(base_entry)
        entry['geometry']['coordinates'] = [float(row[3]), float(row[2])]
        entry['properties']['route_carried'] = row[1]
        entry['properties']['condition'] = condition_map[row[-2]]
        entry['properties']['features'] = row[0]
        entry['properties']['year_built'] = row[4]
        entry['properties']['material'] = row[7]
        entry['properties']['type'] = row[8]
        entry['properties']['lowest_rating'] = row[-1]
        entry['properties']['structure_length'] = row[-8]
        entry['properties']['max_span_length'] = row[-9]
        entry['properties']['deck_condition'] = row[-7]
        entry['properties']['superstructure_condition'] = row[-6]
        entry['properties']['substructure_condition'] = row[-5]
        entries.append(entry)

featureCollection['features'] = entries
with open('bridges2022.geojson', 'w') as fh:
    json.dump(featureCollection, fh)
