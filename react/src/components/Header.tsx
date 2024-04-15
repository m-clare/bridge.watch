import { Box, Container, AppBar, Toolbar, Button, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { SideMenu } from "./SideMenu";
import background from "../assets/blue_wallpaper.webp";
import masthead from "../assets/masthead.webp";

const buttonStyle = {
  px: 1,
  mx: 1,
  border: 1,
  borderColor: "white",
  color: "#fff",
  textDecoration: "none",
  fontSize: "18px",
};
function Header() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        width: "100%",
      }}
    >
      <AppBar
        sx={{
          backgroundImage: `url(${background})`,
          backgroundSize: "150px auto",
          position: "relative",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters id="back-to-top-anchor">
            <SideMenu />
            <Box sx={{ flexGrow: 1 }}>
              <Container
                maxWidth="lg"
                sx={{
                  backgroundImage: `url(${masthead})`,
                  backgroundSize: "auto 100px",
                  backgroundRepeat: "no-repeat",
                  height: "100px",
                }}
              />
            </Box>
            <Box sx={{ display: { xs: "none", lg: "inline" } }}>
              <Button sx={buttonStyle} variant="contained">
                <RouterLink to="/map">Map</RouterLink>
              </Button>
              <Button sx={buttonStyle} variant="contained">
                <RouterLink to="/country">U.S. Overview</RouterLink>
              </Button>
              <Button sx={buttonStyle} variant="contained">
                <RouterLink to="/state">State Info</RouterLink>
              </Button>
              <Button sx={buttonStyle} variant="contained">
                <RouterLink to="/condition">Condition Info</RouterLink>
              </Button>
              <Button sx={buttonStyle} variant="contained">
                <Link
                  href="https://blog.bridge.watch"
                  style={{
                    color: "#fff",
                    textDecoration: "none",
                    fontSize: "18px",
                  }}
                >
                  Blog
                </Link>
              </Button>
              <Button sx={buttonStyle} variant="contained">
                <RouterLink to="/about">About</RouterLink>
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}

export default Header;
