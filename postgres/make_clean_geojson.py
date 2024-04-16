import json
import csv
import copy
import geopandas as gpd
import pandas as pd

# Get shape file for map boundaries
usa = gpd.read_file("./cb_2021_us_nation_5m/cb_2021_us_nation_5m.shp")
usa = usa.to_crs(epsg="4326")

# Load original CSV
df = pd.read_csv("2023AllRecordsDelimitedAllStatesClean.csv", ",", dtype="str")

columns_of_interest = [
    "FACILITY_CARRIED_007",
    "BRIDGE_CONDITION",
    "FEATURES_DESC_006A",
    "YEAR_BUILT_027",
    "STRUCTURE_KIND_043A",
    "STRUCTURE_TYPE_043B",
    "LOWEST_RATING",
    "STRUCTURE_LEN_MT_049",
    "MAX_SPAN_LEN_MT_048",
    "DECK_COND_058",
    "SUPERSTRUCTURE_COND_059",
    "SUBSTRUCTURE_COND_060",
    "LAT_016",
    "LONG_017",
]

column_mapping = {
    "FACILITY_CARRIED_007": "route_carried",
    "BRIDGE_CONDITION": "condition",
    "FEATURES_DESC_006A": "features",
    "YEAR_BUILT_027": "year_built",
    "STRUCTURE_KIND_043A": "material",
    "STRUCTURE_TYPE_043B": "type",
    "LOWEST_RATING": "lowest_rating",
    "STRUCTURE_LEN_MT_049": "structure_length",
    "MAX_SPAN_LEN_MT_048": "max_span_length",
    "DECK_COND_058": "deck_condition",
    "SUPERSTRUCTURE_COND_059": "superstructure_condition",
    "SUBSTRUCTURE_COND_060": "substructure_condition",
    "LAT_016": "latitude",
    "LONG_017": "longitude",
}

# remove culverts and tunnels
df = df.loc[
    (df["STRUCTURE_TYPE_043B"] != "19")
    & (df["STRUCTURE_TYPE_043B"] != "18")
    & (df["RECORD_TYPE_005A"] == "1")
]
df = df.astype(
    {
        "LAT_016": float,
        "LONG_017": float,
    }
)

# Create geopandas data frame
gdf = gpd.GeoDataFrame(
    df,
    geometry=gpd.points_from_xy(df.LONG_017, df.LAT_016),
    crs="EPSG:4326",
)

# geometry only exists after gdf
columns_of_interest.append("geometry")

gdf = gdf[columns_of_interest]

points_in_usa = gpd.tools.sjoin(gdf, usa, how="left")
points_in_usa = points_in_usa[points_in_usa.NAME == "United States"]


final_csv = points_in_usa[columns_of_interest]
final_csv.to_csv("2023AllFiltered.csv")
points_in_usa.rename(columns=column_mapping, inplace=True)
# points_in_usa.to_crs(epsg=3857, inplace=True)
points_in_usa.to_file("bridges_2023.geojson", driver="GeoJSON")
