// Plot / menu filter options

const structureTypeOptions = {
  Slab: "1",
  "Tee Beam": "4",
  "Box Beam or Girders": [2, 3, 5, 6],
  Frame: "7",
  Orthotropic: "8",
  Truss: [9, 10],
  Arch: [11, 12],
  Suspension: "13",
  "Stayed Girder": "14",
  "Movable (Lift, Bascule, or Swing)": [15, 16, 17],
  "Segmental Box Girder": "21",
  "Channel Beam": "22",
};

const materialOptions = {
  "Reinforced Concrete": [1, 2],
  Steel: [3, 4],
  "Prestressed Concrete": [5, 6],
  "Wood or Timber": "7",
  Masonry: "8",
  "Aluminum, Wrought Iron, or Cast Iron": "9",
  Other: "0",
};

const serviceTypeOptions = {
  Highway: "1",
  Railroad: "2",
  "Pedestrian-bicycle": "3",
  "Highway-railroad": "4",
  "Highway-pedestrian": "5",
  "Overpass structure at an interchange": "6",
  "Third level (interchange)": "7",
  "Fourth level (interchange)": "8",
  "Building or plaza": "9",
  Other: "0",
};

const serviceUnderTypeOptions = {
  "Highway with or without pedestrian": "1",
  Railroad: "2",
  "Pedestrian-bicycle": "3",
  "Highway-railroad": "4",
  Waterway: "5",
  "Highway-waterway": "6",
  "Railroad-waterway": "7",
  "Highway-waterway-railroad": "8",
  "Relief for waterway": "9",
  Other: "0",
};

const ratingOptions = {
  "Excellent Condition (9)": 9,
  "Very Good Condition (8)": 8,
  "Good Condition (7)": 7,
  "Satisfactory Condition  (6)": 6,
  "Fair Condition (5)": 5,
  "Poor Condition (4)": 4,
  "Serious Condition (3)": 3,
  "Critical Condition (2)": 2,
  "Imminent Failure Condition (1)": 1,
  "Failed Condition (0)": 0,
};

const deckTypeOptions = {
  "Concrete Cast-in-Place": 1,
  "Concrete Precast Panels": 2,
  "Open Grating": 3,
  "Closed Grating": 4,
  "Steel Plate (includes orthotropic)": 5,
  "Corrugated Steel": 6,
  Aluminum: 7,
  "Wood or Timber": 8,
  Other: 9,
};

const deckSurfaceOptions = {
  "Monolithic Concrete": 1,
  "Integral Concrete": 2,
  "Latex Concrete": 3,
  "Low Slump Concrete": 4,
  "Epoxy Overlay": 5,
  Bituminous: 6,
  "Wood or Timber": 7,
  Gravel: 8,
  Other: 9,
  None: 0,
};

export const stateOptions: { [key: string]: string } = {
  Alabama: "01",
  Alaska: "02",
  Arizona: "04",
  Arkansas: "05",
  California: "06",
  Colorado: "08",
  Connecticut: "09",
  Delaware: "10",
  "District of Columbia": "11",
  Florida: "12",
  Georgia: "13",
  Hawaii: "15",
  Idaho: "16",
  Illinois: "17",
  Indiana: "18",
  Iowa: "19",
  Kansas: "20",
  Kentucky: "21",
  Louisiana: "22",
  Maine: "23",
  Maryland: "24",
  Massachusetts: "25",
  Michigan: "26",
  Minnesota: "27",
  Mississippi: "28",
  Missouri: "29",
  Montana: "30",
  Nebraska: "31",
  Nevada: "32",
  "New Hampshire": "33",
  "New Jersey": "34",
  "New Mexico": "35",
  "New York": "36",
  "North Carolina": "37",
  "North Dakota": "38",
  Ohio: "39",
  Oklahoma: "40",
  Oregon: "41",
  Pennsylvania: "42",
  "Rhode Island": "44",
  "South Carolina": "45",
  "South Dakota": "46",
  Tennessee: "47",
  Texas: "48",
  Utah: "49",
  Vermont: "50",
  Virginia: "51",
  Washington: "53",
  "West Virginia": "54",
  Wisconsin: "55",
  Wyoming: "56",
  "Puerto Rico": "72",
  Guam: "66",
  "Virgin Islands": "78",
};

export const plotOptions: { [key: string]: { [key: string]: string } } = {
  percent_poor: {
    query: "rating",
    display: "Percent in poor condition",
    histogram: "Rating",
  },
  rating: { query: "rating", display: "Overall rating", histogram: "Rating" },
  year_built: {
    query: "year_built",
    display: "Year built",
    histogram: "Year built",
  },
  repair_cost_per_foot: {
    query: "repair_cost_per_foot",
    display: "Estimated repair cost per foot of bridge (in $1000s)",
    histogram: "Repair $1000s / ft bridge",
  },
  average_daily_traffic: {
    query: "average_daily_traffic",
    display: "Average daily traffic (number of cars and trucks)",
    histogram: "# daily cars / bridge",
  },
  truck_traffic: {
    query: "truck_traffic",
    display: "Average daily traffic (number of trucks only)",
    histogram: "# daily trucks / bridge",
  },
  future_date_of_inspection: {
    query: "future_date_of_inspection",
    display: "Due for inspection in the next 12 months",
    histogram: "Inspection date",
  },
};

export const fieldOptions = {
  material: {
    query: "material",
    display: "Group by material",
  },
  type: {
    query: "type",
    display: "Group by bridge type",
  },
  service: {
    query: "service",
    display: "Group by type of service on bridge",
  },
};

export const detailedQueryMaps = {
  year_built: {
    min: "min_year_built",
    max: "max_year_built",
  },
  traffic: {
    min: "min_traffic",
    max: "max_traffic",
  },
  bridge_length: {
    min: "min_bridge_length",
    max: "max_bridge_length",
  },
  span_length: {
    min: "min_span_length",
    max: "max_span_length",
  },
};

export const validRange = {
  year_built: {
    min: 1697,
    max: 2024,
  },
  traffic: {
    min: 0,
    max: 1000000,
  },
  bridge_length: {
    min: 0,
    max: 1000000,
  },
  span_length: {
    min: 0,
    max: 1000000,
  },
};

export const helperText: { [key: string]: string } = {
  traffic: "# vehicles/day",
  bridge_length: "total length (ft)",
  span_length: "span length (ft)",
};
const otherOptions = {
  repair_cost_per_foot: {
    query: "repair_cost_per_foot",
    display: "Estimated repair cost per foot of bridge (in $1000s)",
    histogram: "Repair $1000s / ft bridge",
  },
};

export const singleFilters = {
  plot_type: {
    name: "plot_type",
    label: "Plot Type",
    options: plotOptions,
  },
  field: {
    name: "field",
    label: "Field",
    options: fieldOptions,
  },
};

export const stateSingleFilters = {
  stateOne: {
    name: "stateOne",
    label: "State One",
    options: stateOptions,
    query: "state",
  },
  stateTwo: {
    name: "stateTwo",
    label: "State Two",
    options: stateOptions,
    query: "state",
  },
};

export const multiFilters = {
  material: {
    name: "material",
    label: "Bridge Material",
    options: materialOptions,
  },
  type: { name: "type", label: "Bridge Type", options: structureTypeOptions },
  service: {
    name: "service",
    label: "Service On Bridge",
    options: serviceTypeOptions,
  },
  service_under: {
    name: "service_under",
    label: "Service Under Bridge",
    options: serviceUnderTypeOptions,
  },
  state: {
    name: "state",
    label: "State(s)",
    options: stateOptions,
  },
  ratings: {
    name: "ratings",
    label: "Ratings",
    options: ratingOptions,
  },
  deck_type: {
    name: "deck_type",
    label: "Deck Type",
    options: deckTypeOptions,
  },
  deck_surface: {
    name: "deck_surface",
    label: "Deck Surface",
    options: deckSurfaceOptions,
  },
};

export const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
