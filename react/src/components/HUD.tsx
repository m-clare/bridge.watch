import { Box, Container, Paper, Typography, Divider } from "@mui/material";

const desiredFields = new Set([
  "lowest_rating",
  "route_carried",
  "year_built",
  "material",
  "type",
  "structure_length",
  "max_span_length",
  "deck_condition",
  "superstructure_condition",
  "substructure_condition",
]);

interface Mapping {
  [key: string]: {
    [key: string]: string;
  };
}

const hudMapping: Mapping = {
  lowest_rating: {
    "0": "0",
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    NULL: "N/A",
  },
  deck_condition: {
    "9": "9 - Excellent",
    "8": "8 - Very Good, no problems noted",
    "7": "7 - Good, some minor problems",
    "6": "6 - Satisfactory, structural elements show some minor deterioration",
    "5": "5 - Fair, all primary structural elements are sound, but may have minor section loss, cracking, spalling, or scour",
    "4": "4 - Poor, advanced section loss, deterioration, spalling, or scour",
    "3": "3 - Serious, loss of section, deterioration, spalling or scour have seriously affected primary structural components. Local failures are possible. Fatigue cracks in steel or shear cracks in concrete may be present.",
    "2": "2 - Critical, advanced deterioration of primary structural elements. Fatigue cracks in steel or shear cracks in concrete may be present or scour may have removed substructure support.  Unless closely monitored it may be necessary to close the bridge until corrective action is taken.",
    "1": "1 - Imminent Failure, major deterioration or section loss present in critical structural components or obvious vertical or horizontal movement affecting structure stability. Bridge is closed to traffic but corrective action may put back in light service.",
    "0": "0 - Failed Condition, out of service - beyond corrective action.",
  },
  superstructure_condition: {
    "9": "9 - Excellent",
    "8": "8 - Very Good, no problems noted",
    "7": "7 - Good, some minor problems",
    "6": "6 - Satisfactory, structural elements show some minor deterioration",
    "5": "5 - Fair, all primary structural elements are sound, but may have minor section loss, cracking, spalling, or scour",
    "4": "4 - Poor, advanced section loss, deterioration, spalling, or scour",
    "3": "3 - Serious, loss of section, deterioration, spalling or scour have seriously affected primary structural components. Local failures are possible. Fatigue cracks in steel or shear cracks in concrete may be present.",
    "2": "2 - Critical, advanced deterioration of primary structural elements. Fatigue cracks in steel or shear cracks in concrete may be present or scour may have removed substructure support.  Unless closely monitored it may be necessary to close the bridge until corrective action is taken.",
    "1": "1 - Imminent Failure, major deterioration or section loss present in critical structural components or obvious vertical or horizontal movement affecting structure stability. Bridge is closed to traffic but corrective action may put back in light service.",
    "0": "0 - Failed Condition, out of service - beyond corrective action.",
  },
  substructure_condition: {
    "9": "9 - Excellent",
    "8": "8 - Very Good, no problems noted",
    "7": "7 - Good, some minor problems",
    "6": "6 - Satisfactory, structural elements show some minor deterioration",
    "5": "5 - Fair, all primary structural elements are sound, but may have minor section loss, cracking, spalling, or scour",
    "4": "4 - Poor, advanced section loss, deterioration, spalling, or scour",
    "3": "3 - Serious, loss of section, deterioration, spalling or scour have seriously affected primary structural components. Local failures are possible. Fatigue cracks in steel or shear cracks in concrete may be present.",
    "2": "2 - Critical, advanced deterioration of primary structural elements. Fatigue cracks in steel or shear cracks in concrete may be present or scour may have removed substructure support.  Unless closely monitored it may be necessary to close the bridge until corrective action is taken.",
    "1": "1 - Imminent Failure, major deterioration or section loss present in critical structural components or obvious vertical or horizontal movement affecting structure stability. Bridge is closed to traffic but corrective action may put back in light service.",
    "0": "0 - Failed Condition, out of service - beyond corrective action.",
  },
  material: {
    0: "Other",
    1: "Concrete",
    2: "Concrete continuous",
    3: "Steel",
    4: "Steel continuous",
    5: "Prestressed or post-tensioned concrete",
    6: "Prestressed or post-tensioned concrete continuous",
    7: "Wood or timber",
    8: "Masonry",
    9: "Aluminum, Wrought Iron, or Cast Iron",
  },
  condition: {
    G: "Good",
    F: "Fair",
    P: "Poor",
  },
  type: {
    "01": "Slab",
    "02": "Stringer/Multi-beam or Girder",
    "03": "Girder and Floorbeam System",
    "04": "Tee Beam",
    "05": "Box Beam or Girders - Multiple",
    "06": "Box Beam or Girders - Single or Spread",
    "07": "Frame",
    "08": "Orthotropic",
    "09": "Truss - Deck",
    "10": "Truss - Thru",
    "11": "Arch - Deck",
    "12": "Arch - Thru",
    "13": "Suspension",
    "14": "Stayed Girder",
    "15": "Movable - Lift",
    "16": "Movable - Bascule",
    "17": "Movable - Swing",
    "21": "Segmental Box Girder",
    "22": "Channel Beam",
  },
};

export const HUD: React.FC<{ data: any }> = ({ data }) => {
  const formattedEntry = (item: any) => {
    return (
      <>
        {Object.entries(item).map(([key, value], i) => {
          const formattedKey = key.split("_").join(" ");
          if (desiredFields.has(key)) {
            return (
              <>
                <div>
                  <Typography
                    key={`${key}_${i}`}
                    display="inline"
                    fontWeight="700"
                    variant="button"
                  >
                    {formattedKey}:
                  </Typography>
                  <span>{` `}</span>
                  <Typography
                    key={`${value}_${i}`}
                    display="inline"
                    variant="body2"
                  >
                    {hudMapping?.[key]?.[value] ?? value}
                  </Typography>
                </div>
              </>
            );
          }
        })}
      </>
    );
  };
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          position: "absolute",
          marginLeft: 1,
          marginRight: 1,
          marginTop: 1,
        }}
      >
        <Paper
          sx={{
            opacity: 0.8,
            px: 2,
            py: 2,
            maxHeight: "80vh",
            maxWidth: { sm: "70vw", md: "30vw" },
            borderRadius: "16px",
          }}
        >
          <div>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, fontVariant: "small-caps" }}
            >
              {data.features}
            </Typography>
            {hudMapping.condition?.[data.condition] && (
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, fontVariant: "small-caps" }}
              >
                Status: {hudMapping.condition?.[data.condition]} Condition
              </Typography>
            )}
          </div>
          <Box
            sx={{
              maxHeight: "30vh",
              overflowY: "auto",
            }}
          >
            {Object.entries(data)
              .map(([k, v]) => ({ [k]: v }))
              .map((item: object) => {
                return <>{formattedEntry(item)}</>;
              })}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
