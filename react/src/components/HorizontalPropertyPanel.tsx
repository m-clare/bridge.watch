import { Grid, Typography } from "@mui/material";
import { PanelBarChart } from "./PanelBarChart";
import { HistTextSummary } from "./HistTextSummary";

import useMediaQuery from "@mui/material/useMediaQuery";

export const HorizontalPropertyPanel: React.FC<{
  objSelected: boolean;
  objData: any;
  initialHistData: any;
  initialKeyData: any;
  field: string;
}> = ({ objSelected, objData, initialHistData, initialKeyData, field }) => {
  let locality;
  if (objSelected) {
    locality = objData.countyName;
  } else {
    locality = "Selected State(s)";
  }

  const widthCheck = useMediaQuery("(min-width:900px)");

  let barHeight;
  if (widthCheck) {
    barHeight = 400;
  } else {
    barHeight = 300;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5" component="h2">
          {locality}
        </Typography>
      </Grid>
      <Grid item sx={{ paddingTop: 0 }} xs={12} md={6}>
        <Typography variant="h6" component="h3">
          Histogram
        </Typography>
        <PanelBarChart
          selected={objSelected}
          objData={objData.objHistogram}
          initialHistData={initialHistData}
          barHeight={barHeight}
          field={field}
        />
      </Grid>
      <Grid item sx={{ paddingTop: 0 }} xs={12} md={6}>
        <Typography variant="h6" component="h3">
          Key Properties
        </Typography>
        <HistTextSummary
          selected={objSelected}
          objData={objData.objKeyValues}
          initialKeyData={initialKeyData}
          field={field}
        />
      </Grid>
    </Grid>
  );
};
