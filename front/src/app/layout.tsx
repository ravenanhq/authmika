"use client";
import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Head from "next/head";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { usePathname } from "next/navigation";
import { NavbarProvider } from "../../contexts/NavbarContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const showHeader =
    pathName !== null &&
    !["/login", "/two-factor", "/create-password","/forgot-password","/reset-password","/user-activation"].includes(pathName);
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:1023px)");
  return (
    <html>
      <Head>
        <title>Authmika</title>
        <meta name="description" content="Description of my page" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <body
        suppressHydrationWarning={true}
        className={inter.className}
        style={{ backgroundColor: "white" }}
      >
        <NavbarProvider>
          {isMobile ? (
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: !showHeader ? 0 : 3,
                marginTop: !showHeader ? "0" : "30px",
              }}
            >
              <Header />
              <div style={{ paddingTop: !showHeader ? "0" : theme.spacing(2) }}>
                {" "}
                {/* Use theme spacing for consistent spacing */}
                {children}
              </div>
            </Box>
          ) : (
            <Box sx={{ display: "flex" }}>
              <CssBaseline />
              <Header />
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  p: !showHeader ? 0 : 3,
                  marginTop: !showHeader ? "0" : "30px",
                }}
              >
                <div
                  style={{ paddingTop: !showHeader ? "0" : theme.spacing(2) }}
                >
                  {" "}
                  {/* Use theme spacing for consistent spacing */}
                  {children}
                </div>
              </Box>
            </Box>
          )}
        </NavbarProvider>
      </body>
    </html>
  );
}
