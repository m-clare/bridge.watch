import * as React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CircleIcon from "@mui/icons-material/Circle";
import Card from "@mui/material/Card";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const ratingMap = [
  { rating: "0", description: "Failed", color: "#a50026" },
  { rating: "1", description: "Imminent Failure", color: "#be1827" },
  { rating: "2", description: "Critical", color: "#d73027" },
  { rating: "3", description: "Serious", color: "#f46d43" },
  { rating: "4", description: "Poor", color: "#fdae61" },
  { rating: "5", description: "Fair", color: "#fee090" },
  { rating: "6", description: "Satisfactory", color: "#ffffbf" },
  { rating: "7", description: "Good", color: "#e0f3f8" },
  { rating: "8", description: "Very Good", color: "#74add1" },
  { rating: "9", description: "Excellent", color: "#313695" },
];
function MapLegend() {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Box sx={{ position: "absolute", right: 48, top: 144 }}>
        <Card
          sx={{
            padding: 0.75,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "4px",
            width: "180px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="overline"
              sx={{ paddingLeft: "4px", fontWeight: 700 }}
            >
              Rating Condition
            </Typography>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </div>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            {ratingMap.map((rating) => {
              return (
                <div key={rating.rating} style={{ position: "relative" }}>
                  <CircleIcon
                    sx={{
                      color: rating.color,
                      display: "inline-block",
                      verticalAlign: "middle",
                      fontSize: 12,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ paddingLeft: 1, fontWeight: 700 }}
                  >
                    {rating.rating} - {rating.description}
                  </Typography>
                </div>
              );
            })}
          </Collapse>
        </Card>
      </Box>
    </>
  );
}

export default MapLegend;
