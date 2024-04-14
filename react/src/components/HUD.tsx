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
                    {value}
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
          marginLeft: 3,
          marginRight: 3,
          marginTop: 3,
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
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, fontVariant: "small-caps" }}
            >
              Status: {data.condition} Condition
            </Typography>
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
