import { useState, useEffect } from "react";
import {
  Paper,
  Grid,
  Link,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Card,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getFiltersAsString } from "./HelperFunctions";
import { styled } from "@mui/material/styles";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const textSummary = function (summaryType: any, count: any, locality: any) {
  if (summaryType === "rating" && locality === "the U.S.") {
    return (
      <Typography variant="body1">
        This map aggregates the locations of {count} bridges in {locality}
        with their overall "rating" based on the lowest value of superstructure,
        substructure, and deck condition as encoded in the
        <Link underline="hover" href="https://www.fhwa.dot.gov/bridge/nbi.cfm">
          <b> 2024 National Bridge Inventory</b>
        </Link>
        on a scale of 0 to 9. Bridges that are missing ratings are omitted from
        the plot. If "scaled hex area" is toggled, the hexagon size represents
        the number of bridges in the vicinity, while the color represents the
        median rating in the corresponding histogram. Additional filtering can
        be performed using the options above.
      </Typography>
    );
  } else if (summaryType === "year_built" && locality === "the U.S.") {
    return (
      <Typography variant="body1">
        This map aggregates the locations of {count} bridges in {locality} with
        their year built as encoded in the{" "}
        <Link underline="hover" href="https://www.fhwa.dot.gov/bridge/nbi.cfm">
          <b> 2024 National Bridge Inventory</b>
        </Link>
        . If "scaled hex area" is toggled, the hexagon size represents the
        number of bridges in the vicinity, while the color represents the median
        year built in the corresponding histogram. Additional filtering can be
        performed using the options above.{" "}
      </Typography>
    );
  } else if (summaryType === "percent_poor" && locality === "the U.S.") {
    return (
      <Typography variant="body1">
        This map aggregates the locations of {count} bridges in {locality} with
        the percent of poorly rated bridges within a given hexbin as encoded in
        the{" "}
        <Link underline="hover" href="https://www.fhwa.dot.gov/bridge/nbi.cfm">
          <b> 2024 National Bridge Inventory</b>
        </Link>
        . Poorly rated bridges have a numerical rating of 4 or lower. Bridges
        that are missing ratings are omitted from the plot. If "scaled hex area"
        is toggled, the hexagon size represents the number of bridges in the
        vicinity, while the color represents percentage of poorly rated bridges.
        Additional filtering can be performed using the options above.{" "}
      </Typography>
    );
  } else if (
    summaryType === "repair_cost_per_foot" &&
    locality === "the U.S."
  ) {
    return (
      <Typography variant="body1">
        {" "}
        This map aggregates the locations of {count} bridges in {locality} with
        the estimated repair cost in (in thousands of dollars) per foot of
        bridge using the length of structure improvement and total project cost
        fields from the{" "}
        <Link underline="hover" href="https://www.fhwa.dot.gov/bridge/nbi.cfm">
          <b> 2024 National Bridge Inventory</b>
        </Link>
        . This value is calculated based only on bridges that have been marked
        within the past 8 years as in need of repair with an estimated repair
        cost provided (there may be other bridges in need of repair, but no
        information has been provided for the estimated cost or length of
        repair). If "scaled hex area" is toggled, the hexagon size represents
        the number of bridges in the vicinity, while the color represents the
        median cost per foot estimate. Additional filtering can be performed
        using the options above. These values should be taken with a grain of
        salt due to their wide variance from state to state. Some states do not
        self report these values as other states do.
      </Typography>
    );
  } else if (
    (summaryType === "average_daily_traffic" ||
      summaryType === "truck_traffic") &&
    locality === "the U.S."
  ) {
    return (
      <Typography variant="body1">
        {" "}
        This map aggregates the locations of {count} bridges in {locality} with
        the estimated daily traffic (including trucks) or truck-only traffic
        from the{" "}
        <Link underline="hover" href="https://www.fhwa.dot.gov/bridge/nbi.cfm">
          <b> 2024 National Bridge Inventory</b>
        </Link>
        . If "scaled hex area" is toggled, the hexagon size represents the
        number of bridges in the vicinity, while the color represents the
        average number per bridge. Additional filtering can be performed using
        the options above. These values show some inconsistency in data
        collection, as a number of railroad and pedestrian/bike-only coded
        bridges indicate truck traffic.
      </Typography>
    );
  } else if (
    summaryType === "future_date_of_inspection" &&
    locality === "the U.S."
  ) {
    return (
      <Typography variant="body1">
        {" "}
        This map aggregates the locations of {count} bridges in {locality} with
        the anticipated date of next inspection based on the{" "}
        <Link underline="hover" href="https://www.fhwa.dot.gov/bridge/nbi.cfm">
          <b> 2024 National Bridge Inventory</b>
        </Link>
        . This value is calculated from the last date of inspection with the
        interval in months (typically 24); only inspections due in the next year
        are shown. If "scaled hex area" is toggled, the hexagon size represents
        the number of bridges in the vicinity, while the color represents the
        most common value (also known as the mode) with earlier dates having a
        darker hue. Additional filtering can be performed using the options
        above.
      </Typography>
    );
  } else if (summaryType === "rating") {
    return (
      <Typography variant="body1">
        This map aggregates the locations of {count} bridges in {locality} with
        their overall "rating" based on the lowest value of superstructure,
        substructure, and deck condition as encoded in the{" "}
        <Link underline="hover" href="https://www.fhwa.dot.gov/bridge/nbi.cfm">
          <b> 2024 National Bridge Inventory</b>
        </Link>{" "}
        on a scale of 0 to 9. Bridges that are missing ratings are omitted from
        the plot. The color represents the median rating in the corresponding
        histogram, which can also be viewed by hovering over a county.
        Additional filtering can be performed using the options dropdown menu.
      </Typography>
    );
  } else if (summaryType === "year_built") {
    return (
      <Typography variant="body1">
        This map aggregates the locations of {count} bridges in {locality} with
        their year built as encoded in the{" "}
        <Link underline="hover" href="https://www.fhwa.dot.gov/bridge/nbi.cfm">
          <b> 2024 National Bridge Inventory</b>
        </Link>
        . The color represents the median year built in the corresponding
        histogram. Additional filtering can be performed using the options
        dropdown menu.{" "}
      </Typography>
    );
  } else if (summaryType === "percent_poor") {
    return (
      <Typography variant="body1">
        This map aggregates the locations of {count} bridges in {locality} with
        the percent of poorly rated bridges within a county as encoded in the{" "}
        <Link underline="hover" href="https://www.fhwa.dot.gov/bridge/nbi.cfm">
          <b> 2024 National Bridge Inventory</b>
        </Link>
        . Poorly rated bridges have a numerical rating of 4 or lower. Bridges
        that are missing ratings are omitted from the plot. The color represents
        percentage of poorly rated bridges. Additional filtering can be
        performed using the options dropdown menu.
      </Typography>
    );
  } else if (summaryType === "repair_cost_per_foot") {
    return (
      <Typography>
        This map aggregates the locations of {count} bridges in {locality} with
        the estimated repair cost in (in thousands of dollars) per foot of
        bridge using the length of structure improvement and total project cost
        fields from the{" "}
        <Link underline="hover" href="https://www.fhwa.dot.gov/bridge/nbi.cfm">
          <b> 2024 National Bridge Inventory</b>
        </Link>
        . This value is calculated based only on bridges that have been marked
        within the past 8 years as in need of repair with an estimated repair
        cost provided (there may be other bridges in need of repair, but no
        information has been provided for the estimated cost or length of
        repair). The color represents the median cost per foot estimate.
        Additional filtering can be performed using the options dropdown menu.
        These values should be taken with a grain of salt due to their wide
        variance from state to state. Some states do not self report these
        values as other states do.
      </Typography>
    );
  } else if (
    summaryType === "average_daily_traffic" ||
    summaryType === "truck_traffic"
  ) {
    return (
      <Typography variant="body1">
        {" "}
        This map aggregates the locations of {count} bridges in {locality} with
        the estimated daily traffic (including trucks) or truck-only traffic
        from the{" "}
        <Link underline="hover" href="https://www.fhwa.dot.gov/bridge/nbi.cfm">
          <b> 2024 National Bridge Inventory</b>
        </Link>
        . The color represents the average value per bridge. Additional
        filtering can be performed using the options above. These values show
        some inconsistency in data collection, as a number of railroad and
        pedestrian/bike-only coded bridges indicate truck traffic.
      </Typography>
    );
  } else if (summaryType === "future_date_of_inspection") {
    return (
      <Typography variant="body1">
        {" "}
        This map aggregates the locations of {count} bridges in {locality} with
        the anticipated date of next inspection based on the{" "}
        <Link underline="hover" href="https://www.fhwa.dot.gov/bridge/nbi.cfm">
          <b> 2024 National Bridge Inventory</b>
        </Link>
        . This value is calculated from the last date of inspection with the
        interval in months (typically 24); only inspections due in the next year
        are shown. The color represents the most common value (also known as the
        mode) with earlier dates having a darker hue. Additional filtering can
        be performed using the options above.
      </Typography>
    );
  } else return <div></div>;
};

const textMoreInfo = function (summaryType: string) {
  if (summaryType === "rating" || "percent_poor") {
    return (
      <CardContent style={{ padding: "24px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h3">
              Rating Guide:
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ pt: 2 }}>
            <Paper
              variant="outlined"
              sx={{ padding: "16px", minHeight: "320px" }}
            >
              <Typography variant="h6" component="h4">
                "Poor" Conditions
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="0 - Failed Condition"
                    secondary="Not In Service"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="1 - Imminent Failure Condition"
                    secondary="Not In Service"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="2 - Critical Condition" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="3 - Serious Condition" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="4 - Poor Condition" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} sx={{ paddingTop: "16px" }}>
            <Paper
              variant="outlined"
              sx={{ padding: "16px", minHeight: "320px" }}
            >
              <Typography variant="h6" component="h4">
                "Fair" Conditions
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="5 - Fair Condition" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="6 - Satisfactory Condition" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} sx={{ paddingTop: "16px" }}>
            <Paper
              variant="outlined"
              sx={{ padding: "16px", minHeight: "320px" }}
            >
              <Typography variant="h6" component="h4">
                "Good" Conditions
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="7 - Good Condition" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="8 - Very Good Condition" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="9 - Excellent Condition" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <p style={{ margin: "0px" }}>
              The lowest rating for a specific bridge component (superstructure,
              substructure, or deck) determines the overall rating of
              Good/Fair/Poor.
            </p>
            <Typography>For example, a bridge with:</Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="7 - Good - substructure" />
              </ListItem>
              <ListItem>
                <ListItemText primary="8 - Very Good - superstructure" />
              </ListItem>
              <ListItem>
                <ListItemText primary="8 - Very Good - deck" />
              </ListItem>
            </List>
            <Typography>
              would be assigned a lowest rating of 7 and overall assessment of
              "Good" condition.
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    );
  }
};

const moreInfo = ["rating", "percent_poor"];

const summaryTitle: { [key: string]: string } = {
  percent_poor: "Percent of Bridges in Poor Condition",
  rating: "Overall Rating",
  year_built: "Year Built",
  repair_cost_per_foot: "Repair Cost Per Foot of Bridge",
  average_daily_traffic: "Average Daily Traffic (Cars & Trucks)",
  truck_traffic: "Average Daily Truck Traffic",
  future_date_of_inspection: "Upcoming Inspection Required",
};

export const LocaleDescription: React.FC<{
  summaryType: string;
  keyValues: any;
  waiting: boolean;
  submitted: boolean;
}> = ({ summaryType, keyValues, waiting, submitted }) => {
  const [expanded, setExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const field = keyValues.field;
  const count = keyValues.count;
  const locality = keyValues.locality;
  const hasMoreInfo = moreInfo.includes(field);

  useEffect(() => {
    if (!waiting) {
      const { plot_type, ...filters } = keyValues.filters;
      setActiveFilters(filters);
    }
  }, [summaryType, keyValues]);

  return (
    <Grid item container>
      {!submitted ? (
        <Card>
          <Grid item xs={12}>
            <CardContent style={{ padding: "24px" }}>
              <Typography variant="h4" component="h2">
                {summaryTitle[field]}
              </Typography>
              {getFiltersAsString(activeFilters).map((d) => (
                <Typography
                  variant="h6"
                  component="h3"
                  key={d}
                  style={{ fontWeight: 400 }}
                >
                  {d}
                </Typography>
              ))}
              {textSummary(summaryType, count, locality)}
            </CardContent>
            {hasMoreInfo ? (
              <>
                <CardActions disableSpacing>
                  <Button variant="text" onClick={handleExpandClick} fullWidth>
                    More information
                  </Button>
                  <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="more information"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  {textMoreInfo(summaryType)}
                </Collapse>
              </>
            ) : null}
          </Grid>
        </Card>
      ) : null}
    </Grid>
  );
};
