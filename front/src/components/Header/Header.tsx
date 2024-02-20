import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Popover from "@mui/material/Popover";
import { signOut } from "next-auth/react";
import { config } from "../../../config";
import { Divider, Link, Typography } from "@mui/material";
import { usePathname } from "next/navigation";


const drawerWidth = 240;
const navItems = [ { label: "Dashboard", route: "/dashboard" },{ label: "Users", route: "/users" }, { label: "Applications", route: "/applications" }];

export default function DrawerAppBar() {
  const pathName = usePathname();
  const showHeader = ![
    "/login"
  ].includes(pathName);

  const logOut = () => {
    signOut({ redirect: true, callbackUrl: config.signoutCallback });
  };
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const drawer = (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Authmika
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <Link key={item.route} href={item.route}  sx={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
            <ListItemButton component="a" disablePadding>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </Link>
        ))}
      </List>
    </Box>
  );

  return (
    showHeader && (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#434a9f'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Authmika
          </Typography>
          <Box sx={{ flexGrow: 0.1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
          {navItems.map((item) => (
            <Link key={item.route} href={item.route} passHref>
            <Button sx={{ color: "#fff" }}>
              {item.label}
            </Button>
            </Link>
          ))}
          <Box />
        </Box>
          <Box sx={{ marginLeft: "auto" }}>
            <IconButton color="inherit" onClick={handleClick}>
              <AccountCircleIcon />
            </IconButton>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Box sx={{ p: 2 }}>
                <Link
                  href="/profile"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "blue" },
                  }}
                >
                  Profile
                </Link>
              </Box>
              <Divider />
              <Box sx={{ p: 2 }}>
                <Link
                  onClick={() => logOut()}
                  sx={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', '&:hover': { color: 'red' } }}
                >
                  Logout
                </Link>
              </Box>
            </Popover>
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>)
  );
}
