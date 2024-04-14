import * as d3 from "d3";
import { hexbin } from "d3-hexbin";
import * as fs from "fs";

// Constant values for scaling, aspectRatio, etc.
// TODO: Should these become environment variables as they need to be shared with the frontend...
// Other option is to pass them as a state object along with other data
const width = 975;
const height = 610;
const scaleValue = 1300;
const radius = 10;

const projection = d3
  .geoAlbersUsa()
  .scale(scaleValue)
  .translate([width * 0.5, height * 0.5]);

const customHexbin = hexbin()
  .extent([
    [0, 0],
    [width, height],
  ])
  .radius(radius)
  .x((d) => d.xy[0])
  .y((d) => d.xy[1]);

const fieldsOfInterest = {
  LAT_016: "latitude",
  LONG_017: "longitude",
  YEAR_BUILT_027: "year_built",
  LOWEST_RATING: "rating",
};

const file = fs
  .readFileSync("../postgres/2023AllRecordsDelimitedAllStatesClean.csv")
  .toString();
const csv = d3.csvParse(file);
// remove other fields
const filteredCsv = csv
  .filter(
    (row) =>
      row.STRUCTURE_TYPE_043B !== "18" && row.STRUCTURE_TYPE_043B !== "19"
  )
  .map((row) => {
    const output = {};
    Object.keys(fieldsOfInterest).forEach((key) => {
      const value = fieldsOfInterest[key];
      if (value === "latitude" || value === "longitude") {
        output[value] = parseFloat(row[key]);
      } else {
        output[value] = parseInt(row[key]);
      }
    });
    return output;
  })
  .filter((row) => projection([row.longitude, row.latitude]) !== null);

const bins = customHexbin(
  filteredCsv.map((row) => ({
    xy: projection([row.longitude, row.latitude]),
    year_built: row.year_built,
    rating: row.rating,
  }))
)
  .map(
    (d) => (
      (d.year_built = d3.median(d, (d) => d.year_built)),
      (d.rating = d3.median(d, (d) => d.rating)),
      d
    )
  )
  .sort((a, b) => b.length - a.length);

function svgPathToCoordinates(pathData) {
  const coordinates = [];
  const pathCommands =
    pathData.match(
      /[a-df-z]?\s*-?\d+(\.\d+)?(?:[eE][+-]?\d+)?,?\s*-?\d+(\.\d+)?(?:[eE][+-]?\d+)?/g
    ) || [];

  let currentX = 0;
  let currentY = 0;

  let startingPoint = [];
  pathCommands.forEach((command) => {
    const cmd = command[0];
    const values = command
      .slice(1)
      .split(/[,\s]+/)
      .map(parseFloat);

    switch (cmd) {
      case "m":
        currentX = values[0];
        currentY = values[1];
        coordinates.push([currentX, currentY]);
        startingPoint = [currentX, currentY];
        break;
      case "l":
        currentX = currentX + values[0];
        currentY = currentY + values[1];
        coordinates.push([currentX, currentY]);
        break;
    }
  });

  coordinates.push(startingPoint);

  return coordinates;
}

const baseHex = svgPathToCoordinates(customHexbin.hexagon(radius));

const hexFeatures = bins.map((hex, i) => {
  const newCoordinates = baseHex.map((point) => [
    point[0] + hex.x,
    point[1] + hex.y,
  ]);
  const latLong = newCoordinates.map((point) => projection.invert(point));
  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [latLong],
    },
    properties: {
      count: hex.length,
      height: hex.length,
      yearBuilt: hex.year_built,
      rating: hex.rating,
      base_height: 0,
      color: "grey",
    },
    id: `h_${i}`,
  };
});

const featureCollection = {
  type: "FeatureCollection",
  name: "bridgeHexbin2023",
  crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
  features: hexFeatures,
};

fs.writeFileSync(
  "./bridges2023hexes.geojson",
  JSON.stringify(featureCollection)
);
