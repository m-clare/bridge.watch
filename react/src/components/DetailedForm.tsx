import { Grid, Button, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import {
  MultiDetailedFilter,
  YearRangeFilter,
  NumberRangeFilter,
} from "./FormComponents";
import {
  handleDetailedSubmitClick,
  handleDetailedClearClick,
} from "./HelperFunctions";

export const DetailedForm: React.FC<{
  stateInfo: any;
  colWidth: number;
  filters: any;
}> = ({ stateInfo, colWidth, filters }) => {
  const { ratings, deck_type, deck_surface } = filters;
  return (
    <Grid container spacing={2}>
      <Grid item container spacing={3}>
        <Grid item xs={12} md={colWidth}>
          <MultiDetailedFilter
            filter={ratings}
            stateInfo={stateInfo}
            required={false}
          />
        </Grid>
        <Grid item xs={12} md={colWidth}>
          <MultiDetailedFilter
            filter={deck_type}
            stateInfo={stateInfo}
            required={false}
          />
        </Grid>
        <Grid item xs={12} md={colWidth}>
          <MultiDetailedFilter
            filter={deck_surface}
            stateInfo={stateInfo}
            required={false}
          />
        </Grid>
      </Grid>
      <Grid item container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" component="h2" color={grey[500]}>
            <i> </i>
          </Typography>
        </Grid>
        <Grid item xs={12} md={colWidth}>
          <Typography variant="caption" component="h2" color={grey[500]}>
            <i>Year Built</i>
          </Typography>
          <YearRangeFilter stateInfo={stateInfo} />
        </Grid>
        <Grid item xs={12} md={colWidth}>
          <Typography variant="caption" component="h2" color={grey[500]}>
            <i>Traffic</i>
          </Typography>
          <NumberRangeFilter stateInfo={stateInfo} field={"traffic"} />
        </Grid>
        <Grid item xs={12} md={colWidth}>
          <Typography variant="caption" component="h2" color={grey[500]}>
            <i>Overall Bridge Length</i>
          </Typography>
          <NumberRangeFilter stateInfo={stateInfo} field={"bridge_length"} />
        </Grid>
        <Grid item xs={12} md={colWidth}>
          <Typography variant="caption" component="h2" color={grey[500]}>
            <i>Maximum Span Length</i>
          </Typography>
          <NumberRangeFilter stateInfo={stateInfo} field={"span_length"} />
        </Grid>
      </Grid>
      <Grid item container spacing={3}>
        <Grid item xs={12} md={colWidth}>
          <Button
            fullWidth
            disabled={stateInfo.submitted}
            variant="contained"
            color="primary"
            onClick={(e) => handleDetailedSubmitClick(e, stateInfo)}
          >
            Submit detailed query
          </Button>
        </Grid>
        <Grid item xs={12} md={colWidth}>
          <Button
            fullWidth
            disabled={stateInfo.submitted}
            variant="contained"
            color="primary"
            onClick={(e) => handleDetailedClearClick(e, stateInfo)}
          >
            Clear detailed filters
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};
