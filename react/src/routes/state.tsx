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

import { getStateBridges } from "../utils/nbi-api";
import { ChoroplethMap } from "../components/ChoroplethMap";
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

const stateFilters = (({ state, material, type, service, service_under }) => ({
  state,
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

export default function StateBridges() {
  const [stateBridges, setStateBridges] = useState({});
  const [queryState, setQueryState] = useState({
    plot_type: "percent_poor",
    material: [],
    type: [],
    service: [],
    service_under: [],
    state: ["California"],
  });
  const [detailedQueryState, setDetailedQueryState] = useState({
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
  const [queryURI, setQueryURI] = useState("plot_type=percent_poor");
  const [submitted, setSubmitted] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [plotType, setPlotType] = useState(queryState.plot_type);
  const [showPlot, setShowPlot] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const queryDicts = {
    plotOptions,
    multiFilters,
    detailedQueryMaps,
  };

  // Check if filtered view has been passed in initial URL (will run once)
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
    async function getBridgeData(newURI) {
      let bridgeData = await getStateBridges(newURI);
      if (queryState.plot_type === "future_date_of_inspection") {
        bridgeData = fixDateData(bridgeData, "hexBin");
      }
      setStateBridges(bridgeData);
      setSubmitted(false);
      setWaiting(false);
      setShowPlot(true);
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

  let localityString;
  if (queryState.state.length > 1) {
    localityString = [
      queryState.state.slice(0, -1).join(", "),
      queryState.state.slice(-1)[0],
    ].join(queryState.state.length < 2 ? "" : "  and ");
  } else {
    localityString = queryState.state;
  }

  const colWidth = { single: 12, multi: 12 };

  return (
    <Box sx={{ paddingTop: "124px" }}>
      <Container maxWidth="lg">
        <Grid container spacing={[2, 3]}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ padding: 3, minHeight: { xs: 0, md: 920 } }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h4" component="h1">
                    Bridges By State Selection
                  </Typography>
                </Grid>
                <QueryForm
                  stateInfo={{
                    routeType: "state",
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
                    setShowPlot,
                    queryDicts,
                  }}
                  plotChoices={singleFilters.plot_type}
                  filters={stateFilters}
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
                        colWidth={12}
                        filters={detailedFilters}
                      />
                    </Grid>
                  </Grid>
                </Collapse>
                <Grid item xs={12}>
                  {submitted ? (
                    <Paper sx={{ padding: 2 }} variant="outlined">
                      <Typography
                        sx={{ textAlign: "center" }}
                        variant="h6"
                        color={grey[500]}
                      >
                        <i>Loading query...</i>
                      </Typography>
                      <LinearProgress />
                    </Paper>
                  ) : null}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ padding: 3, minHeight: { xs: 0, md: 920 } }}>
              <Grid container spacing={3}>
                {waiting && !submitted ? (
                  <Grid item xs={12}>
                    <Typography
                      sx={{ textAlign: "center" }}
                      variant="h6"
                      color={grey[500]}
                    >
                      <i>Submit query to update plots.</i>
                    </Typography>
                  </Grid>
                ) : null}
                {!isEmpty(stateBridges) &&
                !stateBridges.hasOwnProperty("message") &&
                showPlot ? (
                  <ChoroplethMap
                    bridgeCountyData={stateBridges}
                    displayStates={queryState.state}
                    plotType={plotType}
                    submitted={submitted}
                  />
                ) : null}
                {!submitted && stateBridges.hasOwnProperty("message") ? (
                  <Grid item xs={12}>
                    <Typography
                      sx={{ textAlign: "center" }}
                      variant="h6"
                      color={grey[500]}
                    >
                      <i>{stateBridges.message}</i>
                    </Typography>
                  </Grid>
                ) : null}
              </Grid>
            </Paper>
          </Grid>
          {!isEmpty(stateBridges) &&
          !stateBridges.hasOwnProperty("message") &&
          showPlot &&
          queryState.state.length !== 0 &&
          !waiting ? (
            <LocaleDescription
              summaryType={plotType}
              keyValues={{
                field: plotType,
                count: stateBridges.keyData.count,
                locality: localityString,
                filters: { ...queryState, ...detailedQueryState },
              }}
              waiting={waiting}
              submitted={submitted}
            />
          ) : null}
        </Grid>
      </Container>
    </Box>
  );
}
