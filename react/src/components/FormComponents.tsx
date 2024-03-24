import { Box } from "@mui/material";
import React from "react";

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
  const [minValue, setMinValue] = React.useState<null | string>(
    stateInfo?.detailedQueryState?.rangeFilters?.year_built?.min ?? null
  );
  const [maxValue, setMaxValue] = React.useState<null | string>(
    stateInfo?.detailedQueryState?.rangeFilters?.year_built?.max ?? null
  );
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
        disabled={submitted}
        value={minValue}
        onChange={(e) => {
          setMinValue(e.target.value);
        }}
        onBlur={(e) => {
          handleRangeChange(e, "year_built", stateInfo, "min");
        }}
        label="Minimum"
        helperText=" "
      />
      <TextField
        id="year-max"
        disabled={submitted}
        value={maxValue}
        onChange={(e) => {
          setMaxValue(e.target.value);
        }}
        onBlur={(e) => handleRangeChange(e, "year_built", stateInfo, "max")}
        label="Maximum"
        helperText=" "
      />
    </Box>
  );
};

export const NumberRangeFilter: React.FC<{ stateInfo: any; field: string }> = ({
  stateInfo,
  field,
}) => {
  const [minValue, setMinValue] = React.useState<null | string>(
    stateInfo?.detailedQueryState?.rangeFilters?.[field]?.min ?? null
  );
  const [maxValue, setMaxValue] = React.useState<null | string>(
    stateInfo?.detailedQueryState?.rangeFilters?.[field]?.max ?? null
  );
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
        disabled={submitted}
        value={minValue}
        onChange={(e) => {
          setMinValue(e.target.value);
        }}
        onBlur={(e) => handleRangeChange(e, field, stateInfo, "min")}
        label="Minimum"
        helperText={helperText[field]}
      />
      <TextField
        id={field + "-max"}
        disabled={submitted}
        value={maxValue}
        onChange={(e) => {
          setMaxValue(e.target.value);
        }}
        onBlur={(e) => handleRangeChange(e, field, stateInfo, "max")}
        label="Maximum"
        helperText={helperText[field]}
      />
    </Box>
  );
};
