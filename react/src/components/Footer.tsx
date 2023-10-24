import { Box, Grid, Link, Divider, Container, Typography } from "@mui/material";

import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import BookIcon from "@mui/icons-material/Book";
import background from "../assets/blue_wallpaper.webp";

export default function Footer() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: 2,
        width: "100%",
        boxShadow: 3,
        bgcolor: "primary.main",
        color: "primary.contrastText",
        backgroundImage: `url(${background})`,
        backgroundSize: "150px auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container sx={{ padding: 2 }} spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ textShadow: "#000 1px 0 10px" }}>
              Bridge.watch
            </Typography>
            <Typography sx={{ textShadow: "#000 1px 0 10px" }} variant="body1">
              Bridge.watch provides interactive data visualization for
              open-access data records from the FHWA of bridges located in the
              United States.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography sx={{ textShadow: "#000 1px 0 10px" }} variant="h6">
              License
            </Typography>
            <Typography sx={{ textShadow: "#000 1px 0 10px" }} variant="body1">
              This work is licensed under a{" "}
              <Link
                sx={{ textShadow: "#000 1px 0 10px" }}
                variant="body1"
                underline="hover"
                color="inherit"
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
              >
                Creative Commons-Attribution-Non Commercial-Share Alike 4.0
                License
              </Link>
              . Contact the author for more information.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Grid container>
              <Grid item xs={12}>
                <Typography sx={{ textShadow: "#000 1px 0 10px" }} variant="h6">
                  Contact
                </Typography>
                <Typography
                  sx={{ textShadow: "#000 1px 0 10px" }}
                  variant="body1"
                >
                  Maryanne Wachter
                </Typography>
              </Grid>
              <Grid sx={{ pt: 1 }} container spacing={2}>
                <Grid item>
                  <Link href="mailto:m.wachter@utsv.net" target="_blank">
                    <EmailIcon
                      sx={{
                        color: "common.white",
                      }}
                    />
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    href="https://www.linkedin.com/in/m-wachter/"
                    target="_blank"
                  >
                    <LinkedInIcon sx={{ color: "common.white" }} />
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="https://twitter.com/eng_mclare" target="_blank">
                    <TwitterIcon sx={{ color: "common.white" }} />
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="https://github.com/m-clare" target="_blank">
                    <GitHubIcon sx={{ color: "common.white" }} />
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="https://mclare.blog" target="_blank">
                    <BookIcon sx={{ color: "common.white" }} />
                  </Link>
                </Grid>
              </Grid>
              <Grid item xs={12}></Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ borderColor: "common.white" }} />
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              textAlign: { xs: "center", md: "left" },
            }}
            style={{ paddingTop: 8 + "px" }}
          ></Grid>
          <Grid item xs={12} md={4} style={{ paddingTop: 8 + "px" }}>
            <p
              style={{
                fontSize: 0.8 + "rem",
                textAlign: "center",
                textShadow: "#000 1px 0 10px",
              }}
            >
              All rights reserved © UTSV, 2023
            </p>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
