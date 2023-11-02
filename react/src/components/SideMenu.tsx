import { useState } from "react";

import { Link as RouterLink } from "react-router-dom";

import {
  Box,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const routes = [
  { key: "U.S. Overview", value: "/country" },
  { key: "State Info", value: "/state" },
  { key: "Condition Info", value: "/condition" },
  { key: "Map", value: "/map" },
];

const backgroundRoutes = [
  { key: "Bridge Types", value: "/bridge_types" },
  { key: "Bridge Materials", value: "/bridge_materials" },
];

type Anchor = "top" | "left" | "bottom" | "right";

export function SideMenu() {
  const [state, setState] = useState<{ [key: string]: boolean }>({
    left: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setState({ ...state, [anchor]: open });
    };

  const anchor = "left";
  return (
    <Box sx={{ display: { xs: "inline", lg: "none" } }}>
      <IconButton
        size="medium"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={toggleDrawer(anchor, true)}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor={anchor}
        open={state[anchor]}
        onClose={toggleDrawer(anchor, false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
          <List>
            {routes.map((route) => (
              <RouterLink key={route.key} to={route.value}>
                <ListItem
                  button
                  key={route.key}
                  onClick={toggleDrawer(anchor, false)}
                >
                  <ListItemText primary={route.key} />
                </ListItem>
              </RouterLink>
            ))}
            <Link
              href="https://blog.bridge.watch"
              underline="none"
              color="#000"
            >
              <ListItem
                button
                key={"Blog"}
                onClick={toggleDrawer(anchor, false)}
              >
                <ListItemText primary="Blog" />
              </ListItem>
            </Link>
            <RouterLink to="/about">
              <ListItem
                button
                key={"About"}
                onClick={toggleDrawer(anchor, false)}
              >
                <ListItemText primary="About" />
              </ListItem>
            </RouterLink>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
