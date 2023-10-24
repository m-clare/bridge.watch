import { Box } from "@mui/material";

// form only imports...
import {
  Chip,
  OutlinedInput,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  TextField,
} from "@mui/material";
import { helperText } from "./Options";
import {
  handleChange,
  handleClose,
  handleDetailedChange,
  handleSingleChange,
  handleRangeChange,
} from "./HelperFunctions";

export function singleSelect(plotChoices, stateInfo) {
  const { queryState } = stateInfo;
  return (
    <FormControl fullWidth>
      <InputLabel>{plotChoices.label}</InputLabel>
      <Select
        value={queryState[plotChoices.name]}
        label={plotChoices.label}
        disabled={stateInfo.submitted}
        onChange={(e) => handleSingleChange(e, plotChoices.name, stateInfo)}
      >
        {Object.keys(plotChoices.options).map((shortName, index) => {
          return (
            <MenuItem key={shortName} value={shortName}>
              {plotChoices.options[shortName].display}
            </MenuItem>
          );
        })}
        ;
      </Select>
    </FormControl>
  );
}

export function stateSingleSelect(
  stateChoices,
  queryState,
  submitted,
  handleSingleChange
) {
  return (
    <FormControl fullWidth>
      <InputLabel>{stateChoices.label}</InputLabel>
      <Select
        value={queryState[stateChoices.name]}
        label={stateChoices.label}
        disabled={submitted}
        onChange={(e) => handleSingleChange(e, stateChoices.name)}
      >
        {Object.keys(stateChoices.options).map((name, index) => {
          return (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          );
        })}
        ;
      </Select>
    </FormControl>
  );
}

export function multiFilter(filter, stateInfo, required) {
  const { queryState, submitted } = stateInfo;

  return (
    <FormControl required={required} fullWidth>
      <InputLabel>{filter.label}</InputLabel>
      <Select
        value={queryState[filter.name]}
        label={filter.name}
        onChange={(e) => handleChange(e, filter.name, stateInfo)}
        onClose={(e) => handleClose(e, stateInfo)}
        multiple
        disabled={submitted}
        input={<OutlinedInput id="select-multiple-chip" label={filter.label} />}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
      >
        {Object.keys(filter.options).map((name, index) => {
          return (
            <MenuItem dense value={name} key={`${name}-${index}`}>
              {name}
            </MenuItem>
          );
        })}
        ;
      </Select>
    </FormControl>
  );
}

export const MultiDetailedFilter: React.FC<{
  filter: any;
  stateInfo: any;
  required: boolean;
}> = ({ filter, stateInfo, required }) => {
  const { detailedQueryState, submitted } = stateInfo;
  return (
    <FormControl required={required} fullWidth>
      <InputLabel>{filter.label}</InputLabel>
      <Select
        value={detailedQueryState[filter.name]}
        label={filter.name}
        onChange={(e) => handleDetailedChange(e, filter.name, stateInfo)}
        multiple
        disabled={submitted}
        input={<OutlinedInput id="select-multiple-chip" label={filter.label} />}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value: any) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
      >
        {Object.keys(filter.options).map((name, index) => {
          return (
            <MenuItem dense value={name} key={`${name}-${index}`}>
              {name}
            </MenuItem>
          );
        })}
        ;
      </Select>
    </FormControl>
  );
};

export const YearRangeFilter: React.FC<{ stateInfo: any }> = ({
  stateInfo,
}) => {
  const { detailedQueryState, submitted } = stateInfo;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        "& > :not(style)": { m: 1 },
      }}
    >
      <TextField
        id="year-min"
        value={detailedQueryState.rangeFilters.year_built.min}
        disabled={submitted}
        onBlur={(e) => handleRangeChange(e, "year_built", stateInfo, "min")}
        label="Minimum"
        type="number"
        helperText=" "
        inputProps={{
          inputMode: "numeric",
          min: 1697,
          max: 2022,
          pattern: "[1,2][0-9]{3}",
        }}
      />
      <TextField
        id="year-max"
        value={detailedQueryState.rangeFilters.year_built.max}
        disabled={submitted}
        onBlur={(e) => handleRangeChange(e, "year_built", stateInfo, "max")}
        label="Maximum"
        type="number"
        helperText=" "
        inputProps={{
          inputMode: "numeric",
          min: 1697,
          max: 2022,
          pattern: "[1,2][0-9]{3}",
        }}
      />
    </Box>
  );
};

export const NumberRangeFilter: React.FC<{ stateInfo: any; field: string }> = ({
  stateInfo,
  field,
}) => {
  const { detailedQueryState, submitted } = stateInfo;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        "& > :not(style)": { m: 1 },
      }}
    >
      <TextField
        id={field + "-min"}
        value={detailedQueryState.rangeFilters[field].min}
        disabled={submitted}
        onBlur={(e) => handleRangeChange(e, field, stateInfo, "min")}
        label="Minimum"
        type="number"
        helperText={helperText[field]}
        inputProps={{
          inputMode: "numeric",
          pattern: "[0-9]*",
        }}
      />
      <TextField
        id={field + "-max"}
        value={detailedQueryState.rangeFilters[field].max}
        disabled={submitted}
        onBlur={(e) => handleRangeChange(e, field, stateInfo, "max")}
        label="Maximum"
        type="number"
        helperText={helperText[field]}
        inputProps={{
          inputMode: "numeric",
          pattern: "[0-9]*",
        }}
      />
    </Box>
  );
};
