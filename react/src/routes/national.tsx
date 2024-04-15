import { useEffect, useState } from "react";
import { isEmpty } from "lodash-es";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import { grey } from "@mui/material/colors";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

// Imports for collapsible form
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Button from "@mui/material/Button";

import { getNationalBridges } from "../utils/nbi-api";
import { StaticHexbinChart } from "../components/StaticHexbinChart";
import { LocaleDescription } from "../components/LocaleDescription";
import { QueryForm } from "../components/QueryForm";
import { DetailedForm } from "../components/DetailedForm";

import {
  singleFilters,
  multiFilters,
  detailedQueryMaps,
  validRange,
  plotOptions,
} from "../components/Options";
import {
  constructURI,
  fixDateData,
  queryDictFromURI,
} from "../components/HelperFunctions";

const countryFilters = (({ material, type, service, service_under }) => ({
  material,
  type,
  service,
  service_under,
}))(multiFilters);

const detailedFilters = (({ ratings, deck_type, deck_surface }) => ({
  ratings,
  deck_type,
  deck_surface,
}))(multiFilters);

export const CountryBridges: React.FC = () => {
  const [bridges, setBridges] = useState<any>({});
  const [queryState, setQueryState] = useState<any>({
    plot_type: "percent_poor",
    material: [],
    type: [],
    service: [],
    service_under: [],
  });

  const [detailedQueryState, setDetailedQueryState] = useState<any>({
    ratings: [],
    deck_type: [],
    deck_surface: [],
    rangeFilters: {
      year_built: { min: "", max: "" },
      traffic: { min: "", max: "" },
      bridge_length: { min: "", max: "" },
      span_length: { min: "", max: "" },
    },
  });
  const [queryURI, setQueryURI] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [plotType, setPlotType] = useState(queryState.plot_type);
  const [waiting, setWaiting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const queryDicts = {
    plotOptions,
    multiFilters,
    detailedQueryMaps,
  };

  // Check if Filtered view has been passed in initial URL (will run once)
  useEffect(() => {
    const qs = window.location.search.substring(1);
    if (qs) {
      const [newQueryState, newDetailedQueryState] = queryDictFromURI(
        qs,
        multiFilters,
        queryState,
        detailedQueryState
      );
      setQueryState(newQueryState);
      setDetailedQueryState(newDetailedQueryState);
      setPlotType(newQueryState.plot_type);
      setQueryURI(qs);
    }
    setSubmitted(true);
  }, []);

  // run every time submitted is updated to true
  useEffect(() => {
    async function getBridgeData(newURI: any) {
      let bridgeData = await getNationalBridges(newURI);
      if (queryState.plot_type === "future_date_of_inspection") {
        bridgeData = fixDateData(bridgeData, "hexBin");
      }
      setBridges(bridgeData);
      setSubmitted(false);
      setWaiting(false);
    }
    if (submitted) {
      const newURI = constructURI(queryState, detailedQueryState, queryDicts);
      // fix URI if percent_poor is plot type
      if (queryState.plot_type === "percent_poor") {
        const displayURI = newURI.replace(
          "plot_type=rating",
          "plot_type=percent_poor"
        );
        window.history.pushState("object", "", "?".concat(displayURI));
      } else {
        // add to URL as query string
        window.history.pushState("object", "", "?".concat(newURI));
      }
      setQueryURI(newURI);
      getBridgeData(newURI);
    }
  }, [submitted]);

  const locality = "the U.S.";
  const colWidth = { single: 3, multi: 3 };

  return (
    <Box sx={{ pt: [2, 3], pb: [2, 3] }}>
      <Container maxWidth="lg">
        <Grid container spacing={[2, 3]}>
          <Grid item xs={12}>
            <Paper sx={{ padding: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h3" component="h1">
                    U.S. Bridges
                  </Typography>
                </Grid>
                <QueryForm
                  stateInfo={{
                    routeType: "country",
                    queryState,
                    detailedQueryState,
                    submitted,
                    plotType,
                    queryURI,
                    setQueryState,
                    setDetailedQueryState,
                    setWaiting,
                    setSubmitted,
                    setPlotType,
                    queryDicts,
                  }}
                  plotChoices={singleFilters.plot_type}
                  filters={countryFilters}
                  colWidth={colWidth}
                />
                <Grid item xs={12}>
                  <CardActions disableSpacing sx={{ padding: "0px" }}>
                    <Button
                      variant="outlined"
                      onClick={handleExpandClick}
                      fullWidth
                    >
                      Show detailed filters
                      {expanded ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </Button>
                  </CardActions>
                </Grid>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <Grid container spacing={3} sx={{ padding: "24px" }}>
                    <Grid item xs={12}>
                      <Divider variant="middle">Detailed Filters</Divider>
                      <Typography variant="h6">Note: </Typography>
                      <Typography paragraph>
                        You <b>must</b> click "Submit Detailed Query" to apply
                        the following filters.
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <DetailedForm
                        stateInfo={{
                          queryState,
                          detailedQueryState,
                          submitted,
                          queryURI,
                          setSubmitted,
                          setWaiting,
                          setDetailedQueryState,
                          validRange,
                          queryDicts,
                          setExpanded,
                        }}
                        colWidth={3}
                        filters={detailedFilters}
                      />
                    </Grid>
                  </Grid>
                </Collapse>
              </Grid>
            </Paper>
          </Grid>
          {submitted ? (
            <Grid item xs={12}>
              <Paper sx={{ padding: 2 }}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography
                      sx={{ textAlign: "center" }}
                      variant="h6"
                      color={grey[500]}
                    >
                      <i>Loading query...</i>
                    </Typography>
                    <LinearProgress />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ) : null}
          {waiting && !submitted ? (
            <Grid item xs={12}>
              <Paper sx={{ padding: 2 }}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography
                      style={{ textAlign: "center" }}
                      variant="h6"
                      color={grey[500]}
                    >
                      <i>Submit query to update plots.</i>
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ) : null}
          {!isEmpty(bridges) &&
          !bridges.hasOwnProperty("message") &&
          !waiting ? (
            <LocaleDescription
              summaryType={plotType}
              keyValues={{
                field: plotType,
                count: bridges.keyData.count,
                locality,
                filters: { ...queryState, ...detailedQueryState },
              }}
              waiting={waiting}
              submitted={submitted}
            />
          ) : null}
          {bridges &&
          !isEmpty(bridges) &&
          !bridges.hasOwnProperty("message") ? (
            <StaticHexbinChart
              bridgeData={bridges}
              plotType={plotType}
              submitted={submitted}
            />
          ) : null}
          {!submitted && bridges && bridges.hasOwnProperty("message") ? (
            <Grid item xs={12}>
              <Paper sx={{ padding: 2 }}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography
                      sx={{ textAlign: "center" }}
                      variant="h6"
                      color={grey[500]}
                    >
                      <i>{bridges.message}</i>
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ) : null}
        </Grid>
      </Container>
    </Box>
  );
};
