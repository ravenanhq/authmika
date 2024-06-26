import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Popover from "@mui/material/Popover";
import { signOut } from "next-auth/react";
import { config } from "../../../config";
import { Container, Divider, Link, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import { getSession } from "next-auth/react";

const drawerWidth = 240;

interface INavItem {
  label: string;
  route: string;
}

export default function DrawerAppBar() {
  const pathName = usePathname() || "";
  const [activePage, setActivePage] = useState<string>(pathName);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const showHeader = ![
    "/login",
    "/two-factor",
    "/create-password",
    "/forgot-password",
    "/reset-password",
    "/user-activation",
  ].includes(pathName);
  const [navItems, setNavItems] = useState<INavItem[]>([
    { label: "Dashboard", route: "/dashboard" },
    { label: "Users", route: "/users" },
    { label: "Applications", route: "/applications" },
    { label: "Groups", route: "/groups" },
    { label: "Roles", route: "/roles" },
  ]);

  useEffect(() => {
    getUserSession();
  }, []);

  const getUserSession = async () => {
    const session = await getSession();
    if (session && session.user) {
      if (session.user.role.toLowerCase() == "client") {
        setNavItems([{ label: "Dashboard", route: "/dashboard" }]);
      }
    }
  };

  const logOut = () => {
    signOut({ redirect: true, callbackUrl: config.signoutCallback });
  };
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSetActivePage = (page: string) => {
    setActivePage(page);
  };

  const open = Boolean(anchorEl);

  const drawer = (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Authmika
      </Typography>
      <Divider />
      <List>
        {navItems.map((item, index) => (
          <Link
            key={item.route}
            href={item.route}
            underline="none"
            sx={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <ListItemButton
              selected={activeIndex === index}
              onClick={() => handleSetActivePage(item.route)}
              sx={{
                "&:hover": {
                  backgroundColor: "#cfd1cd",
                },
                textDecoration: "none",
                backgroundColor:
                  activePage === item.route ? "#cfd1cd" : "inherit",
                cursor: "pointer",
              }}
            >
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
            backgroundColor: "#265073",
          }}
        >
          <Container maxWidth="xl">
            <Toolbar style={{ padding: "0px" }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: "none" } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                <Link
                  href="/dashboard"
                  underline="none"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  Authmika
                </Link>
              </Typography>
              <Box sx={{ flexGrow: 0.1 }} />
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                {navItems.map((item, index) => (
                  <Link
                    key={item.route}
                    href={item.route}
                    underline="none"
                    sx={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <ListItemButton
                      selected={activeIndex === index}
                      onClick={() => handleSetActivePage(item.route)}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f1eded26",
                        },
                        textDecoration: "none",
                        backgroundColor:
                          activePage === item.route ? "#f1eded26" : "inherit",
                        cursor: "pointer",
                      }}
                    >
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  </Link>
                ))}
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
                      sx={{
                        textDecoration: "none",
                        color: "inherit",
                        cursor: "pointer",
                        "&:hover": { color: "red" },
                      }}
                    >
                      Logout
                    </Link>
                  </Box>
                </Popover>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        <nav>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        </nav>
      </Box>
    )
  );
}
