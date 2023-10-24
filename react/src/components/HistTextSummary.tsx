import { List, ListItem } from "@mui/material";
import { plotOptions, monthNames } from "./Options";

const display_info: { [key: string]: string } = {
  min: "minimum",
  max: "maximum",
  avg: "average",
  median: "median",
  mode: "mode",
  count: "count",
};

function getListItem(key: string, data: any, field: string) {
  if (field === "Inspection date") {
    return (
      <ListItem key={key}>
        {field} {display_info[key]}: {monthNames[data[key].getUTCMonth()]}-
        {data[key].getUTCFullYear()}
      </ListItem>
    );
  } else {
    return (
      <ListItem key={key}>
        {field} {display_info[key]}: {Math.round(data[key])}
      </ListItem>
    );
  }
}

export const HistTextSummary: React.FC<{
  selected: boolean;
  objData: any;
  initialKeyData: any;
  field: string;
}> = ({ selected, objData, initialKeyData, field }) => {
  let data: any;
  if (selected) {
    data = objData;
  } else {
    data = initialKeyData;
  }

  let { count, hexLocation, ...rest } = data;

  const fieldDisplay = plotOptions[field]["histogram"];
  return (
    <List dense>
      <ListItem>Number of Bridges: {data.count}</ListItem>
      {Object.keys(rest).map((d) => getListItem(d, data, fieldDisplay))}
      {selected && data.hexLocation ? (
        <ListItem>
          Center Coordinate: {data.hexLocation[1]}°N, {-data.hexLocation[0]}
          °W
        </ListItem>
      ) : null}
    </List>
  );
};
