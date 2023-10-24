import { Paper, Grid, Typography } from "@mui/material";

import { PanelBarChart } from "./PanelBarChart";
import { HistTextSummary } from "./HistTextSummary";

import useMediaQuery from "@mui/material/useMediaQuery";

export const VerticalPropertyPanel: React.FC<{
  objSelected: boolean;
  objData: any;
  initialHistData: any;
  initialKeyData: any;
  field: string;
}> = ({ objSelected, objData, initialHistData, initialKeyData, field }) => {
  let locality;
  if (objSelected) {
    locality = "Selected Hex";
  } else {
    locality = "National";
  }

  const widthCheck = useMediaQuery("(min-width:1200px)");

  let barHeight;
  if (widthCheck) {
    barHeight = 600;
  } else {
    barHeight = 300;
  }

  return (
    <Paper
      sx={{ padding: [2, 3], minHeight: { xs: 0, md: 600 }, width: "100%" }}
    >
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5" component="h2">
            {locality} Histogram
          </Typography>
          <PanelBarChart
            selected={objSelected}
            objData={objData.objHistogram}
            initialHistData={initialHistData}
            barHeight={barHeight}
            field={field}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" component="h2">
            {locality} Properties
          </Typography>
          <HistTextSummary
            selected={objSelected}
            objData={objData.objKeyValues}
            initialKeyData={initialKeyData}
            field={field}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};
