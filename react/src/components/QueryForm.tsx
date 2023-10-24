import { Grid } from "@mui/material";
import { grey } from "@mui/material/colors";

// form only imports...
import Button from "@mui/material/Button";

import Typography from "@mui/material/Typography";
import {
  handleClearFiltersClick,
  handleClearAllFiltersClick,
} from "./HelperFunctions";
import { singleSelect, multiFilter } from "./FormComponents";

export const QueryForm: React.FC<{
  stateInfo: any;
  plotChoices: any;
  filters: any;
  colWidth: any;
}> = ({ stateInfo, plotChoices, filters, colWidth }) => {
  const multiFilters = Object.values(
    (({ material, type, service, service_under }) => ({
      material,
      type,
      service,
      service_under,
    }))(filters)
  );

  let stateValue = false;
  let stateFilter;
  if ("state" in filters) {
    stateValue = true;
    stateFilter = Object.values((({ state }) => ({ state }))(filters));
  }
  filters = Object.values(multiFilters);
  return (
    <>
      {stateValue ? (
        <>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" color={grey[500]}>
              <i>States</i>
            </Typography>
          </Grid>
          {stateFilter &&
            stateFilter.map((value: any, index: number) => (
              <Grid
                item
                xs={12}
                md={colWidth.multi}
                style={{ paddingTop: "8px" }}
                key={`stateFilter-${index}`}
              >
                {multiFilter(value, stateInfo, true)}
              </Grid>
            ))}
        </>
      ) : null}
      <Grid item xs={12}>
        <Typography variant="h6" component="h2" color={grey[500]}>
          <i>Display Options</i>
        </Typography>
      </Grid>
      <Grid item xs={12} md={colWidth.single} style={{ paddingTop: "8px" }}>
        {singleSelect(plotChoices, stateInfo)}
      </Grid>
      <Grid item container spacing={3} xs={12}>
        <Grid item xs={12}>
          <Typography variant="h6" component="h2" color="{grey[500]}">
            <i>Basic Filters</i>
          </Typography>
        </Grid>
        {filters.map((value: any, index: number) => (
          <Grid
            item
            xs={12}
            md={colWidth.multi}
            style={{ paddingTop: "8px" }}
            key={`filter-${index}`}
          >
            {multiFilter(value, stateInfo, false)}
          </Grid>
        ))}
      </Grid>
      <Grid item container spacing={3} xs={12}>
        <Grid item xs={12} md={colWidth.single}>
          <Button
            fullWidth
            disabled={stateInfo.submitted}
            variant="contained"
            color="primary"
            onClick={(e) => handleClearFiltersClick(e, stateInfo)}
          >
            Clear basic filters
          </Button>
        </Grid>
        <Grid item xs={12} md={colWidth.single}>
          <Button
            fullWidth
            disabled={stateInfo.submitted}
            variant="contained"
            color="primary"
            onClick={(e) => handleClearAllFiltersClick(e, stateInfo)}
          >
            Clear all filters
          </Button>
        </Grid>
      </Grid>
    </>
  );
};
